/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { CalculationResult, DefectItem, InspectionMetadata } from '../types';
import { generateQrVerificationUrl, generateQrJsonSummary } from '../utils/qrUtils';

interface InspectionQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: InspectionMetadata;
  calculationResult: CalculationResult;
  defects: DefectItem[];
  verdict: 'ACCEPTED' | 'REJECTED' | 'PENDING';
}

export const InspectionQrModal: React.FC<InspectionQrModalProps> = ({
  isOpen,
  onClose,
  metadata,
  calculationResult,
  defects,
  verdict,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [qrType, setQrType] = useState<'url' | 'json'>('url');
  const canvasHolderRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Construct verification URL and JSON payload via qrUtils
  const verificationUrl = generateQrVerificationUrl(metadata, calculationResult, defects, verdict);
  const jsonSummary = generateQrJsonSummary(metadata, calculationResult, defects, verdict);

  const activeQrValue = qrType === 'url' ? verificationUrl : jsonSummary;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeQrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!canvasHolderRef.current) return;
    const canvas = canvasHolderRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `AQL_QR_${metadata.poNumber || 'Certificate'}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-sm font-bold">Audit Verification QR Code</div>
              <div className="text-[10px] text-slate-400">PO: {metadata.poNumber || 'N/A'}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-center bg-slate-50 dark:bg-slate-900/50">
          {/* Format Selector */}
          <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg max-w-xs mx-auto text-xs">
            <button
              type="button"
              onClick={() => setQrType('url')}
              className={`flex-1 py-1 px-2.5 rounded font-medium transition-colors cursor-pointer ${
                qrType === 'url' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Verification Web URL
            </button>
            <button
              type="button"
              onClick={() => setQrType('json')}
              className={`flex-1 py-1 px-2.5 rounded font-medium transition-colors cursor-pointer ${
                qrType === 'json' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              JSON Summary Data
            </button>
          </div>

          {/* QR Code Container (Always white background so camera scanning is 100% reliable) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm inline-block mx-auto relative group">
            <QRCodeSVG
              value={activeQrValue}
              size={190}
              level="M"
              includeMargin={false}
              className="mx-auto"
            />

            {/* Hidden canvas for PNG export */}
            <div ref={canvasHolderRef} className="hidden">
              <QRCodeCanvas
                value={activeQrValue}
                size={512}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Verification Status Pill */}
          <div className="flex items-center justify-center gap-2 text-xs">
            <span
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 text-[11px] ${
                verdict === 'ACCEPTED'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verdict: {verdict}</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              {calculationResult.sampleSize} units inspected
            </span>
          </div>

          {/* Preview of Encoded Content */}
          <div className="text-left bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-1">
              <span>{qrType === 'url' ? 'Encoded Verification Link' : 'Encoded Audit Payload'}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1 font-sans cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all max-h-24 overflow-y-auto pt-1 leading-relaxed select-all">
              {activeQrValue}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
