import React from 'react';
import { FiX, FiInfo } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function CsvInstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <FiInfo size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">CSV Format Guide</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto">
            <p className="text-gray-600 mb-8 text-[15px] leading-relaxed">
              To import your menu successfully, your spreadsheet (CSV, XLSX) must follow one of the two formats below. 
              The system automatically detects which format you're using.
            </p>

            <div className="flex flex-col gap-8">
              {/* Format A */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold px-2.5 py-1 rounded-md tracking-wide uppercase">Format A</span>
                  <h3 className="text-lg font-bold text-gray-900 m-0">One ingredient per row</h3>
                </div>
                <p className="text-[14px] text-gray-500">Best when exporting from existing inventory systems. Repeat the meal details for each ingredient.</p>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3">meal_name</th>
                        <th className="px-4 py-3">category</th>
                        <th className="px-4 py-3">price</th>
                        <th className="px-4 py-3">description</th>
                        <th className="px-4 py-3 bg-green-50/50 text-[#22C55E]">ingredient</th>
                        <th className="px-4 py-3 bg-green-50/50 text-[#22C55E]">quantity</th>
                        <th className="px-4 py-3 bg-green-50/50 text-[#22C55E]">unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      <tr>
                        <td className="px-4 py-3 font-medium">Grilled Chicken</td>
                        <td className="px-4 py-3">Main</td>
                        <td className="px-4 py-3">89</td>
                        <td className="px-4 py-3 text-gray-400">...</td>
                        <td className="px-4 py-3 font-medium bg-green-50/20">Chicken Breast</td>
                        <td className="px-4 py-3 bg-green-50/20">200</td>
                        <td className="px-4 py-3 bg-green-50/20">g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Grilled Chicken</td>
                        <td className="px-4 py-3">Main</td>
                        <td className="px-4 py-3">89</td>
                        <td className="px-4 py-3 text-gray-400">...</td>
                        <td className="px-4 py-3 font-medium bg-green-50/20">Olive Oil</td>
                        <td className="px-4 py-3 bg-green-50/20">10</td>
                        <td className="px-4 py-3 bg-green-50/20">ml</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Format B */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-2.5 py-1 rounded-md tracking-wide uppercase">Format B</span>
                  <h3 className="text-lg font-bold text-gray-900 m-0">All ingredients in one cell</h3>
                </div>
                <p className="text-[14px] text-gray-500">Best for manual data entry. Separate ingredients with a semicolon (<code className="bg-gray-100 px-1 rounded text-[#F97316] font-bold">;</code>) and use a colon (<code className="bg-gray-100 px-1 rounded text-[#F97316] font-bold">:</code>) for quantities.</p>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3">meal_name</th>
                        <th className="px-4 py-3">category</th>
                        <th className="px-4 py-3">price</th>
                        <th className="px-4 py-3">description</th>
                        <th className="px-4 py-3 bg-orange-50/50 text-[#F97316]">ingredients</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      <tr>
                        <td className="px-4 py-3 font-medium">Grilled Chicken</td>
                        <td className="px-4 py-3">Main</td>
                        <td className="px-4 py-3">89</td>
                        <td className="px-4 py-3 text-gray-400">...</td>
                        <td className="px-4 py-3 font-mono text-xs bg-orange-50/20">Chicken Breast:200g; Olive Oil:10ml</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rules */}
              <div className="mt-4 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Important Rules</h4>
                <ul className="space-y-3 text-[14px] text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316] mt-0.5">•</span>
                    <span><strong className="font-semibold text-gray-900">meal_name</strong> is required and must be unique. Empty rows will be skipped.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316] mt-0.5">•</span>
                    <span><strong className="font-semibold text-gray-900">price</strong> must be a number (e.g., <code className="bg-white px-1.5 py-0.5 border border-gray-200 rounded text-xs">89</code> or <code className="bg-white px-1.5 py-0.5 border border-gray-200 rounded text-xs">89.5</code>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316] mt-0.5">•</span>
                    <span>Each meal must have <strong className="font-semibold text-gray-900">at least one ingredient</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#F97316] mt-0.5">•</span>
                    <span>This importer is <strong className="font-semibold text-gray-900">additive only</strong>. Duplicate meals that already exist in your system will be safely skipped.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
             <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
             >
                Got it
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
