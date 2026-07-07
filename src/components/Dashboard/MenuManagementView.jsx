import { useState, useMemo } from "react";
import DashboardHeader from "./DashboardHeader";
import { useMenuUploads, useUploadMenu } from "../../hooks/dashboard/useMenuUploads";
import { useToast } from "../../store/toastStore";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";

function MenuManagementView() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { addToast } = useToast();

  // Dynamic calendar — `new Date()` is inside the memo so the snapshot
  // is taken once on mount and is never stale with respect to the closure.
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

  const { data: uploads, isLoading, error, refetch } = useMenuUploads();
  const { mutate: uploadFile, isPending: isUploading, isSuccess: isUploaded } = useUploadMenu();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      addToast("File size exceeds 10MB limit.", "error");
      return;
    }

    const allowedExtensions = ['csv', 'xlsx', 'xls'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      addToast("Invalid file type. Only CSV and Excel files are allowed.", "error");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    const fileToUpload = selectedFile;
    setSelectedFile(null); // Clear immediately for non-blocking background upload UX
    uploadFile(fileToUpload);
  };

  if (isLoading) {
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
        {/* Use refetch so the page state (dragActive, selectedFile) is preserved */}
        <ErrorState message="Failed to load upload history." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Menu Management" />

      {/* ── Single centered column layout matching the design ── */}
      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-[1200px] mx-auto flex flex-col gap-10">

        {/* Top Header Texts */}
        <div className="text-center flex flex-col items-center">
          <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-2">Upload Menu File</h2>
          <p className="text-[13px] text-gray-500 max-w-[500px] leading-relaxed">
            Update your live menu instantly by uploading your latest menu spreadsheet. Our system automatically parses item names, descriptions, pricing, and dietary tags to keep your storefront fresh.
          </p>
        </div>

        {/* Drop Zone Area */}
        <div className="w-full max-w-[800px] mx-auto">
          <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <label
              htmlFor="menu-file-upload"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-4 h-[220px] rounded-4xl cursor-pointer transition-all duration-200 border-[3px] border-dashed ${dragActive
                  ? "border-[#22C55E] bg-green-50 scale-[1.02]"
                  : "border-[#22C55E] hover:bg-green-50/30 bg-white"
                }`}
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
              <input id="menu-file-upload" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleChange} />
            </label>
          </form>
          <div className="flex justify-end mt-2 pr-4">
            <p className="text-[12px] text-gray-500 m-0">Supported : xlsx,csv (Max 10MB)</p>
          </div>

          {selectedFile && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || isUploaded}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#F97316] text-white border-none font-bold text-[15px] cursor-pointer shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : isUploaded ? "Imported! ✓" : "Process Import"}
            </button>
          )}
        </div>

        {/* Recent Uploads Section */}
        <div className="mt-4">
          <h3 className="text-[18px] font-medium text-[#1a1a1a] mb-4">Recent Uploads</h3>

          <div className="border border-[#A8B89E] rounded-4xl p-6 sm:p-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start" style={{ backgroundColor: 'transparent' }}>

            {/* Table Area */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-[#D5D5D5] pb-3 mb-4">
                <span className="text-[15px] font-medium text-gray-500 pl-4">File name</span>
                <span className="text-[15px] font-medium text-gray-500 text-center">Date</span>
                <span className="text-[15px] font-medium text-gray-500 text-center">Time</span>
              </div>

              <div className="flex flex-col gap-4">
                {!uploads || uploads.length === 0 ? (
                  <p className="text-[13px] text-gray-400 text-center py-6">No uploads yet — drop a file above!</p>
                ) : (
                  uploads.map((upload) => (
                    <div key={upload.id} className="grid grid-cols-[2fr_1fr_1fr] items-center py-1">
                      <span className="text-[13px] font-medium text-gray-500 pl-4 truncate">{upload.filename}</span>
                      <span className="text-[13px] font-medium text-gray-500 text-center">{upload.date}</span>
                      <span className="text-[13px] font-medium text-gray-500 text-center">{upload.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-[140px] shrink-0">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-bold text-[#1a1a1a]">{monthName}</span>
                <span className="text-[16px] font-bold text-[#1a1a1a]">{dayDisplay}</span>
              </div>
              <div className="grid grid-cols-7 gap-y-1.5 gap-x-0.5 text-[8px] font-medium text-center">
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map(d => (
                  <span key={d} className="text-gray-400">{d}</span>
                ))}
                {calendarDays.map((day, i) => (
                  <span
                    key={i}
                    className={`
                      ${day === null ? "" : ""}
                      ${day === todayDate
                        ? "bg-[#22C55E] text-white rounded-full font-bold w-[14px] h-[14px] flex items-center justify-center mx-auto"
                        : "text-gray-500"}
                    `}
                  >
                    {day ?? ""}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default MenuManagementView;
