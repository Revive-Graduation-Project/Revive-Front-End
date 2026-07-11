import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertTriangle, FiLoader, FiUploadCloud } from 'react-icons/fi';
import { useImportMenu } from '../../hooks/dashboard/useMenuUploads';

const LoadingState = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <FiLoader size={48} className="animate-spin text-blue-500 mb-4" />
    <p className="text-gray-600 font-medium">{title}</p>
    {subtitle && <p className="text-sm text-gray-400 mt-2">{subtitle}</p>}
  </div>
);

const CsvValidationModal = ({ 
  isOpen, 
  onClose, 
  validationResult, 
  isValidating,
  onImportSuccess
}) => {
  if (!isOpen) return null;

  const validMeals = validationResult?.validMeals || [];
  const invalidMeals = validationResult?.invalidMeals || [];
  const hasValidMeals = validMeals.length > 0;
  const hasInvalidMeals = invalidMeals.length > 0;

  const { mutate: importMenu, isPending: isImporting } = useImportMenu();

  const handleConfirmImport = () => {
    importMenu(validMeals, {
      onSuccess: () => {
        if (onImportSuccess) onImportSuccess(validMeals.length);
      },
      onSettled: () => {
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                  {isValidating ? (
                    <FiLoader size={20} className="animate-spin" />
                  ) : (
                    <FiCheckCircle size={20} />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 m-0">Validate & Preview</h2>
              </div>
              <button
                onClick={onClose}
                disabled={isValidating}
                aria-label="Close"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/30">
              {isValidating ? (
                <LoadingState 
                  title="Analyzing CSV file..." 
                  subtitle="Checking for duplicates and missing data" 
                />
              ) : isImporting ? (
                <LoadingState 
                  title={`Processing ${validMeals.length} meals — this may take a minute...`} 
                />
              ) : (
                <div className="space-y-8">
                  {/* Ready to Import Section */}
                  <div className="bg-white border border-green-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-green-50/50 p-4 border-b border-green-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-700">
                        <FiCheckCircle size={18} />
                        <h3 className="font-bold m-0">Ready to Import</h3>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {validMeals.length} Meals
                      </span>
                    </div>
                    
                    {hasValidMeals ? (
                      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50/80 text-gray-500 font-medium sticky top-0 backdrop-blur-sm z-10 shadow-sm">
                            <tr>
                              <th className="px-4 py-3 font-medium">Meal Name</th>
                              <th className="px-4 py-3 font-medium">Category</th>
                              <th className="px-4 py-3 font-medium">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {validMeals.map((meal, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900">{meal.mealName}</td>
                                <td className="px-4 py-3 text-gray-500">{meal.category}</td>
                                <td className="px-4 py-3 text-gray-500">{meal.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No valid meals found to import.
                      </div>
                    )}
                  </div>

                  {/* Will Be Skipped Section */}
                  {hasInvalidMeals && (
                    <div className="bg-white border border-amber-100 rounded-2xl shadow-sm overflow-hidden">
                      <div className="bg-amber-50/50 p-4 border-b border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-700">
                          <FiAlertTriangle size={18} />
                          <h3 className="font-bold m-0">Will be skipped</h3>
                        </div>
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          {invalidMeals.length} Issues
                        </span>
                      </div>
                      
                      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50/80 text-gray-500 font-medium sticky top-0 backdrop-blur-sm z-10 shadow-sm">
                            <tr>
                              <th className="px-4 py-3 font-medium">Row</th>
                              <th className="px-4 py-3 font-medium">Meal Name</th>
                              <th className="px-4 py-3 font-medium">Reason</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {invalidMeals.map((issue, idx) => (
                              <tr key={idx} className="hover:bg-amber-50/10 transition-colors">
                                <td className="px-4 py-3 text-gray-500">{issue.rowIndex || '-'}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{issue.mealName || <span className="text-gray-400 italic">Empty</span>}</td>
                                <td className="px-4 py-3 text-amber-600">{issue.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isValidating || isImporting}
                className="px-6 py-2.5 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Close
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={!hasValidMeals || isValidating || isImporting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiUploadCloud size={18} />
                Confirm Import
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CsvValidationModal;
