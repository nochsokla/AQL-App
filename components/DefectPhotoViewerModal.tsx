/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Camera, Download } from 'lucide-react';
import { DefectItem } from '../types';

interface DefectPhotoViewerModalProps {
  defect: DefectItem | null;
  onClose: () => void;
  onRetake: (defectId: string) => void;
  onRemovePhoto: (defectId: string) => void;
}

export const DefectPhotoViewerModal: React.FC<DefectPhotoViewerModalProps> = ({
  defect,
  onClose,
  onRetake,
  onRemovePhoto,
}) => {
  if (!defect || !defect.photoUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = defect.photoUrl!;
    link.download = `Defect_${defect.category}_${defect.id}.jpg`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100">{defect.description}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  defect.severity === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : defect.severity === 'major'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}
              >
                {defect.severity}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Category: {defect.category} · Quantity Found: {defect.count} units
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Container */}
        <div className="p-4 bg-slate-950 flex items-center justify-center overflow-auto max-h-[60vh]">
          <img
            src={defect.photoUrl}
            alt={defect.description}
            className="max-h-[55vh] w-auto object-contain rounded border border-slate-800 shadow-md"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Image</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRemovePhoto(defect.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo</span>
            </button>
            <button
              type="button"
              onClick={() => onRetake(defect.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Retake Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
