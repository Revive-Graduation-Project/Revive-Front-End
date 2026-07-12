import { useState, useMemo } from "react";
import DashboardHeader from "./DashboardHeader";
import {
  useImportJobs,
  useActiveImportJob,
  useImportJobPolling,
  useCancelImportJob,
  useValidateMenu,
  useImportMenu,
} from "../../hooks/dashboard/useMenuUploads";
import { toast } from "../../utils/toastUtils";
import { FiUploadCloud, FiFileText, FiBookOpen, FiLoader, FiXCircle, FiCheckCircle, FiAlertTriangle, FiClock } from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import CsvInstructionsModal from "./CsvInstructionsModal";
import CsvValidationModal from "./CsvValidationModal";
import { useMenuItems } from "../../hooks/dashboard/useMenuItems";

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    COMPLETED: { cls: "bg-green-100 text-green-700", icon: <FiCheckCircle className="inline mr-1" />, label: "Completed" },
    FAILED:    { cls: "bg-red-100 text-red-700",   icon: <FiAlertTriangle className="inline mr-1" />, label: "Failed" },
    CANCELED:  { cls: "bg-gray-100 text-gray-500", icon: <FiXCircle className="inline mr-1" />, label: "Canceled" },
    PROCESSING:{ cls: "bg-orange-100 text-orange-600", icon: <FiLoader className="inline mr-1 animate-spin" />, label: "Processing" },
    PENDING:   { cls: "bg-blue-100 text-blue-600",  icon: <FiClock className="inline mr-1" />, label: "Pending" },
  };
  const c = cfg[status] || cfg.PENDING;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${c.cls}`}>
      {c.icon}{c.label}
    </span>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ processed, total }) {
  if (!total) return <span className="text-gray-400 text-[12px]">—</span>;
  const pct = Math.min(100, Math.round((processed / total) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-500 font-medium">{processed}/{total}</span>
    </div>
  );
}

// ── Polling wrapper — mounts only when we have a live jobId ──────────────────
function LiveJobRow({ job, onCancel }) {
  const { data: liveJob } = useImportJobPolling(
    job.id,
    job.status === "PROCESSING" || job.status === "PENDING"
  );
  const display = liveJob || job;
  return (
    <tr className="border-b border-gray-100 last:border-none">
      <td className="px-4 py-3 text-[13px] font-medium text-gray-700 max-w-[180px] truncate">{display.filename || "menu.csv"}</td>
      <td className="px-4 py-3 text-[12px] text-gray-500">
        {display.createdAt ? new Date(display.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
      </td>
      <td className="px-4 py-3 text-[12px] text-gray-500">
        {display.createdAt ? new Date(display.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—"}
      </td>
      <td className="px-4 py-3"><StatusBadge status={display.status} /></td>
      <td className="px-4 py-3"><ProgressBar processed={display.processedRecords} total={display.totalRecords} /></td>
      <td className="px-4 py-3">
        {(display.status === "PROCESSING" || display.status === "PENDING") && (
          <button
            onClick={() => onCancel(display.id)}
            className="text-[12px] font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer bg-transparent border border-red-300 hover:border-red-500 rounded-lg px-3 py-1"
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}

function MenuManagementView() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const { todayDate, monthName, dayDisplay, calendarDays } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return {
      todayDate: now.getDate(),
      monthName: now.toLocaleString("en", { month: "long" }),
      dayDisplay: String(now.getDate()).padStart(2, "0"),
      calendarDays: cells,
    };
  }, []);

  const { data: jobs, isLoading: isJobsLoading, error, refetch } = useImportJobs();
  const { data: activeJob } = useActiveImportJob();
  const { mutate: cancelJob } = useCancelImportJob();
  const { mutate: validateMenu, isPending: isValidating } = useValidateMenu();
  const { data: menuItems } = useMenuItems();

  // When the active job check resolves, lock dropzone if needed
  const isLocked = !!activeJob && (activeJob.status === "PROCESSING" || activeJob.status === "PENDING");

  // Polling the active job progress (for dropzone overlay)
  const { data: liveActiveJob } = useImportJobPolling(activeJob?.id, isLocked);
  const displayActiveJob = liveActiveJob || activeJob;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const validateAndSetFile = (file) => {
    if (!file || isLocked) return;
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) { toast.error("File size exceeds 10MB limit."); return; }
    const allowedExtensions = ["csv", "xlsx", "xls"];
    const extension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) { toast.error("Invalid file type. Only CSV and Excel files are allowed."); return; }
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile || isLocked) return;
    setIsValidationModalOpen(true);
    setValidationResult(null);
    validateMenu(
      { file: selectedFile, existingMealNames: menuItems?.map((m) => m.name) || [] },
      {
        onSuccess: (res) => setValidationResult(res),
        onError: (err) => {
          setIsValidationModalOpen(false);
          toast.error("Validation failed: " + (err?.response?.data?.message || err.message));
        },
      }
    );
  };

  const handleImportSuccess = () => {
    setSelectedFile(null);
    refetch();
  };

  if (isJobsLoading) {
    return (
      <div>
        <DashboardHeader title="Menu Management" />
        <DashboardPageSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <DashboardHeader title="Menu Management" />
        <ErrorState message="Failed to load upload history." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Menu Management" />

      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-[1200px] mx-auto flex flex-col gap-10">

        {/* Top Header */}
        <div className="text-center flex flex-col items-center">
          <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-2">Upload Menu File</h2>
          <p className="text-[13px] text-gray-500 max-w-[500px] leading-relaxed">
            Update your live menu instantly by uploading your latest menu spreadsheet.
          </p>
          {/* Aggressive CSV Format Guide Button */}
          <button
            onClick={() => setIsInstructionsModalOpen(true)}
            className="mt-4 px-5 py-2 rounded-full bg-[#F97316] hover:bg-[#ea580c] text-white font-bold text-[13px] flex items-center gap-2 shadow-md shadow-orange-400/40 hover:shadow-lg transition-all cursor-pointer"
          >
            <FiBookOpen size={15} />
            CSV Format Guide
          </button>
        </div>

        {/* Drop Zone */}
        <div className="w-full max-w-[800px] mx-auto relative">
          {/* Locked overlay when import is running */}
          {isLocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-4xl bg-white/90 backdrop-blur-sm border-[3px] border-dashed border-orange-400">
              <FiLoader size={36} className="text-orange-500 animate-spin" />
              <p className="text-[16px] font-bold text-[#1a1a1a]">
                {displayActiveJob
                  ? `Processing ${displayActiveJob.processedRecords} / ${displayActiveJob.totalRecords} meals`
                  : "Import in progress..."}
              </p>
              <p className="text-[12px] text-gray-400">You can navigate away and come back</p>
              {displayActiveJob && (
                <button
                  onClick={() => cancelJob(displayActiveJob.id)}
                  className="mt-1 text-[13px] font-semibold text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 rounded-xl px-4 py-1.5 transition-colors cursor-pointer"
                >
                  Cancel Import
                </button>
              )}
            </div>
          )}

          <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <label
              htmlFor="menu-file-upload"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-4 h-[220px] rounded-4xl transition-all duration-200 border-[3px] border-dashed
                ${isLocked ? "opacity-40 pointer-events-none" : "cursor-pointer"}
                ${dragActive ? "border-[#22C55E] bg-green-50 scale-[1.02]" : "border-[#22C55E] hover:bg-green-50/30 bg-white"}`}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                    <FiFileText size={24} className="text-[#22C55E]" />
                  </div>
                  <p className="text-[16px] font-bold text-[#22C55E] m-0">{selectedFile.name}</p>
                  <p className="text-[12px] text-gray-400 m-0">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FiUploadCloud size={32} className="text-[#F97316]" strokeWidth={2.5} />
                  <p className="text-[28px] font-bold text-[#22C55E] m-0">Drop file here</p>
                </div>
              )}
              <input id="menu-file-upload" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleChange} disabled={isLocked} />
            </label>
          </form>
          <div className="flex justify-end mt-2 pr-4">
            <p className="text-[12px] text-gray-500 m-0">Supported: xlsx, csv (Max 10MB)</p>
          </div>
          {selectedFile && !isLocked && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={isValidating}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#F97316] text-white border-none font-bold text-[15px] cursor-pointer shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isValidating ? "Validating..." : "Validate & Preview"}
            </button>
          )}
        </div>

        {/* Recent Uploads Table */}
        <div className="mt-4">
          <h3 className="text-[18px] font-medium text-[#1a1a1a] mb-4">Recent Uploads</h3>
          <div className="border border-[#A8B89E] rounded-4xl p-6 sm:p-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="flex-1 w-full overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["File", "Date", "Time", "Status", "Progress", "Actions"].map(h => (
                      <th key={h} className="px-4 pb-3 pt-1 text-left text-[12px] font-bold text-gray-400 tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!jobs || jobs.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-gray-400 text-[13px] py-8">No uploads yet — drop a file above!</td></tr>
                  ) : (
                    jobs.map(job => (
                      <LiveJobRow key={job.id} job={job} onCancel={cancelJob} />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Calendar Widget */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-[140px] shrink-0">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-bold text-[#1a1a1a]">{monthName}</span>
                <span className="text-[16px] font-bold text-[#1a1a1a]">{dayDisplay}</span>
              </div>
              <div className="grid grid-cols-7 gap-y-1.5 gap-x-0.5 text-[8px] font-medium text-center">
                {["SU","MO","TU","WE","TH","FR","SA"].map(d => (
                  <span key={d} className="text-gray-400">{d}</span>
                ))}
                {calendarDays.map((day, i) => (
                  <span key={i} className={`
                    ${day === todayDate
                      ? "bg-[#22C55E] text-white rounded-full font-bold w-[14px] h-[14px] flex items-center justify-center mx-auto"
                      : "text-gray-500"}
                  `}>{day ?? ""}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CsvInstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
      />
      <CsvValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        validationResult={validationResult}
        isValidating={isValidating}
        onImportSuccess={handleImportSuccess}
        filename={selectedFile?.name}
      />
    </div>
  );
}

export default MenuManagementView;
