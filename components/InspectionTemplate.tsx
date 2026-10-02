/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  CalculationResult,
  DefectItem,
  InspectionMetadata,
  DefectSeverity,
} from '../types';
import { exportInspectionTemplateCSV } from '../utils/exportUtils';
import {
  FileSpreadsheet,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Layers,
  Activity,
  AlertTriangle,
  LayoutGrid,
  Camera,
  Image as ImageIcon,
  ZoomIn,
  QrCode,
  Copy,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import { INDUSTRY_PRESETS } from '../data/aqlData';
import { CameraCaptureModal } from './CameraCaptureModal';
import { DefectPhotoViewerModal } from './DefectPhotoViewerModal';
import { DigitalSignaturePad } from './DigitalSignaturePad';
import { InspectionQrModal } from './InspectionQrModal';
import { generateQrVerificationUrl, generateQrJsonSummary } from '../utils/qrUtils';
import { useApp } from '../context/AppContext';
import { HardDrive } from 'lucide-react';

interface InspectionTemplateProps {
  metadata: InspectionMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<InspectionMetadata>>;
  calculationResult: CalculationResult;
  defects: DefectItem[];
  setDefects: React.Dispatch<React.SetStateAction<DefectItem[]>>;
  onPrint: () => void;
  inspectorSignature?: string | null;
  setInspectorSignature?: (sig: string | null) => void;
  representativeSignature?: string | null;
  setRepresentativeSignature?: (sig: string | null) => void;
  representativeName?: string;
  setRepresentativeName?: (name: string) => void;
  onResetDraft?: () => void;
}

export const InspectionTemplate: React.FC<InspectionTemplateProps> = ({
  metadata,
  setMetadata,
  calculationResult,
  defects,
  setDefects,
  onPrint,
  inspectorSignature: propInspectorSig,
  setInspectorSignature: propSetInspectorSig,
  representativeSignature: propRepSig,
  setRepresentativeSignature: propSetRepSig,
  representativeName: propRepName,
  setRepresentativeName: propSetRepName,
  onResetDraft,
}) => {
  const { t, theme, language, isOnline, lastSaved } = useApp();

  const [newCategory, setNewCategory] = useState<string>('Workmanship');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newSeverity, setNewSeverity] = useState<DefectSeverity>('major');
  const [newCount, setNewCount] = useState<number>(1);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);

  const [chartViewMode, setChartViewMode] = useState<'stacked' | 'total'>('stacked');
  const [analyticsTab, setAnalyticsTab] = useState<'trend' | 'category' | 'both'>('both');

  // Digital Signature State (Lifted to App for persistent LocalStorage caching)
  const [fallbackInspectorSig, setFallbackInspectorSig] = useState<string | null>(null);
  const [fallbackRepSig, setFallbackRepSig] = useState<string | null>(null);
  const [fallbackRepName, setFallbackRepName] = useState<string>('Nguyen Van Minh (Factory QC Director)');

  const inspectorSignature = propInspectorSig !== undefined ? propInspectorSig : fallbackInspectorSig;
  const setInspectorSignature = propSetInspectorSig || setFallbackInspectorSig;

  const representativeSignature = propRepSig !== undefined ? propRepSig : fallbackRepSig;
  const setRepresentativeSignature = propSetRepSig || setFallbackRepSig;

  const representativeName = propRepName !== undefined ? propRepName : fallbackRepName;
  const setRepresentativeName = propSetRepName || setFallbackRepName;

  // Camera & Photo Viewer State
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [activeDefectForCamera, setActiveDefectForCamera] = useState<DefectItem | null>(null);
  const [viewerModalDefect, setViewerModalDefect] = useState<DefectItem | null>(null);

  // Digital Verification QR Code State
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [reportQrType, setReportQrType] = useState<'url' | 'json'>('url');
  const [reportQrCopied, setReportQrCopied] = useState<boolean>(false);

  // Compute live defect totals
  const totalCritical = defects
    .filter((d) => d.severity === 'critical')
    .reduce((sum, d) => sum + d.count, 0);

  const totalMajor = defects
    .filter((d) => d.severity === 'major')
    .reduce((sum, d) => sum + d.count, 0);

  const totalMinor = defects
    .filter((d) => d.severity === 'minor')
    .reduce((sum, d) => sum + d.count, 0);

  const grandTotalDefects = totalCritical + totalMajor + totalMinor;

  // Calculate overall disposition
  const isCriticalFail = totalCritical > calculationResult.critical.ac;
  const isMajorFail = totalMajor > calculationResult.major.ac;
  const isMinorFail = totalMinor > calculationResult.minor.ac;
  const isRejected = isCriticalFail || isMajorFail || isMinorFail;
  const verdict = isRejected ? 'REJECTED' : 'ACCEPTED';

  // Construct Verification QR Content
  const reportQrUrl = useMemo(
    () => generateQrVerificationUrl(metadata, calculationResult, defects, verdict),
    [metadata, calculationResult, defects, verdict]
  );

  const reportQrJson = useMemo(
    () => generateQrJsonSummary(metadata, calculationResult, defects, verdict),
    [metadata, calculationResult, defects, verdict]
  );

  const activeReportQrValue = reportQrType === 'url' ? reportQrUrl : reportQrJson;

  const handleCopyReportQr = () => {
    navigator.clipboard.writeText(activeReportQrValue);
    setReportQrCopied(true);
    setTimeout(() => setReportQrCopied(false), 2000);
  };

  // Aggregate defects by category (ensuring Workmanship, Appearance, Packaging are always tracked)
  const categoryChartData = useMemo(() => {
    const baseCategories = ['Workmanship', 'Appearance', 'Packaging'];
    
    // Include existing base categories plus any additional custom categories in defects
    const existingCustomCats = defects
      .map((d) => d.category.trim())
      .filter((cat) => cat && !baseCategories.some((b) => b.toLowerCase() === cat.toLowerCase()));

    const uniqueCategories = Array.from(new Set([...baseCategories, ...existingCustomCats]));

    return uniqueCategories.map((catName) => {
      const itemsInCat = defects.filter(
        (d) => d.category.trim().toLowerCase() === catName.toLowerCase()
      );
      const critical = itemsInCat
        .filter((d) => d.severity === 'critical')
        .reduce((sum, d) => sum + d.count, 0);
      const major = itemsInCat
        .filter((d) => d.severity === 'major')
        .reduce((sum, d) => sum + d.count, 0);
      const minor = itemsInCat
        .filter((d) => d.severity === 'minor')
        .reduce((sum, d) => sum + d.count, 0);
      const total = critical + major + minor;

      return {
        category: catName,
        critical,
        major,
        minor,
        total,
      };
    });
  }, [defects]);

  // Generate defect accumulation trend data over the course of the sample inspection
  const trendAnalysisData = useMemo(() => {
    const totalSample = calculationResult.sampleSize;
    const stages = [
      { step: '0%', label: '0% Start', sampleCount: 0, ratio: 0 },
      { step: '20%', label: '20% Tested', sampleCount: Math.round(totalSample * 0.2), ratio: 0.2 },
      { step: '40%', label: '40% Tested', sampleCount: Math.round(totalSample * 0.4), ratio: 0.4 },
      { step: '60%', label: '60% Tested', sampleCount: Math.round(totalSample * 0.6), ratio: 0.6 },
      { step: '80%', label: '80% Tested', sampleCount: Math.round(totalSample * 0.8), ratio: 0.8 },
      { step: '100%', label: '100% Complete', sampleCount: totalSample, ratio: 1.0 },
    ];

    return stages.map((stage) => {
      const cumCritical = Math.round(totalCritical * stage.ratio);
      const cumMajor = Math.round(totalMajor * stage.ratio);
      const cumMinor = Math.round(totalMinor * stage.ratio);
      const cumTotal = cumCritical + cumMajor + cumMinor;

      return {
        stage: stage.step,
        stageLabel: stage.label,
        sampleTested: stage.sampleCount,
        critical: cumCritical,
        major: cumMajor,
        minor: cumMinor,
        total: cumTotal,
        majorAc: calculationResult.major.ac,
        minorAc: calculationResult.minor.ac,
      };
    });
  }, [calculationResult, totalCritical, totalMajor, totalMinor]);

  const handleAddDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const newItem: DefectItem = {
      id: Date.now().toString(),
      category: newCategory.trim() || 'Workmanship',
      description: newDesc.trim(),
      severity: newSeverity,
      count: Math.max(1, newCount),
      photoUrl: newPhotoUrl || undefined,
    };

    setDefects([...defects, newItem]);
    setNewDesc('');
    setNewCount(1);
    setNewPhotoUrl(null);
  };

  const handleRemoveDefect = (id: string) => {
    setDefects(defects.filter((d) => d.id !== id));
    if (viewerModalDefect?.id === id) {
      setViewerModalDefect(null);
    }
  };

  const handleUpdateCount = (id: string, count: number) => {
    setDefects(
      defects.map((d) => (d.id === id ? { ...d, count: Math.max(0, count) } : d))
    );
  };

  const handleLoadPresetDefects = (presetId: string) => {
    const preset = INDUSTRY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const generated: DefectItem[] = preset.sampleDefects.map((d, index) => ({
      ...d,
      id: `${Date.now()}-${index}`,
      count: Math.floor(Math.random() * 3), // seed with small realistic counts for demo
    }));
    setDefects(generated);
  };

  // Camera Capture Handlers
  const handleOpenDefectCamera = (item: DefectItem) => {
    setActiveDefectForCamera(item);
    setCameraModalOpen(true);
  };

  const handlePhotoCaptured = (photoDataUrl: string) => {
    if (activeDefectForCamera) {
      // Attached to an existing defect row
      setDefects(
        defects.map((d) => (d.id === activeDefectForCamera.id ? { ...d, photoUrl: photoDataUrl } : d))
      );
      // Also update viewer if open
      if (viewerModalDefect?.id === activeDefectForCamera.id) {
        setViewerModalDefect({ ...activeDefectForCamera, photoUrl: photoDataUrl });
      }
      setActiveDefectForCamera(null);
    } else {
      // Attached to new defect input form
      setNewPhotoUrl(photoDataUrl);
    }
    setCameraModalOpen(false);
  };

  const handleRemovePhotoFromDefect = (defectId: string) => {
    setDefects(
      defects.map((d) => (d.id === defectId ? { ...d, photoUrl: undefined } : d))
    );
    setViewerModalDefect(null);
  };

  const handleRetakeFromViewer = (defectId: string) => {
    const defect = defects.find((d) => d.id === defectId);
    if (defect) {
      setViewerModalDefect(null);
      setActiveDefectForCamera(defect);
      setCameraModalOpen(true);
    }
  };

  // Custom Tooltip for Recharts Category Bar Chart
  const CustomCategoryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const catData = categoryChartData.find((c) => c.category === label);
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[170px]">
          <div className="font-bold text-slate-100 border-b border-slate-700 pb-1 flex items-center justify-between gap-3">
            <span>{label}</span>
            <span className="font-mono text-sky-400 font-semibold">{catData?.total || 0} defects</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300 capitalize">{entry.name}:</span>
              </span>
              <span className="font-mono font-bold tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Defect Accumulation Trend Line Chart
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = trendAnalysisData.find((d) => d.stage === label);
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-2 min-w-[200px]">
          <div className="border-b border-slate-700 pb-1 flex items-center justify-between">
            <span className="font-bold text-slate-100">{point?.stageLabel}</span>
            <span className="font-mono text-emerald-400 font-semibold">{point?.sampleTested} units tested</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-100" />
                Cumulative Total:
              </span>
              <span className="font-mono font-bold text-white tabular-nums">{point?.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Major (Ac Limit: {calculationResult.major.ac}):
              </span>
              <span className={`font-mono font-bold tabular-nums ${point && point.major > calculationResult.major.ac ? 'text-rose-400 font-extrabold' : 'text-amber-400'}`}>
                {point?.major}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sky-300">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                Minor (Ac Limit: {calculationResult.minor.ac}):
              </span>
              <span className={`font-mono font-bold tabular-nums ${point && point.minor > calculationResult.minor.ac ? 'text-rose-400 font-extrabold' : 'text-sky-400'}`}>
                {point?.minor}
              </span>
            </div>
            {point && point.critical > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Critical (Ac: {calculationResult.critical.ac}):
                </span>
                <span className="font-mono font-bold text-rose-400 tabular-nums">{point.critical}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const defectsWithPhotos = defects.filter((d) => d.photoUrl);

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm no-print transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Standard QC Document</span>
              <span aria-hidden="true">·</span>
              <span>ISO 2859-1 & ANSI/ASQ Z1.4</span>
              <span aria-hidden="true">·</span>
              <span>Inspection Checklist Template</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('tabTemplate')} & Audit Sheet
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Fill out order details, capture photographic defect evidence via camera, analyze accumulation trends, and export or print an official QC audit report.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer"
              title="Generate and view official audit QR code"
            >
              <QrCode className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{t('inspectionQrBtn')}</span>
            </button>
            <button
              onClick={() =>
                exportInspectionTemplateCSV(metadata, calculationResult, defects, verdict, Boolean(inspectorSignature))
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('exportCsv')}</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printSheet')}</span>
            </button>
          </div>
        </div>

        {/* Local Storage Offline Persistence Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <HardDrive className="w-3.5 h-3.5" />
              <span>{t('statusSaved')}</span>
            </span>
            {lastSaved && <span>({t('lastSavedAt')} {lastSaved})</span>}
            {!isOnline && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">· {t('statusOffline')}</span>
            )}
          </div>

          {onResetDraft && (
            <button
              type="button"
              onClick={onResetDraft}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Reset all inspection template data to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('resetDraft')}</span>
            </button>
          )}
        </div>
      </div>

      {/* The Printable Inspection Sheet Card */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden print-container transition-colors">
        {/* Document Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400">
              QUALITY ASSURANCE AUDIT REPORT
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {t('docTitle')}
            </h1>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('docStandard')}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Header QR Stamp */}
            <div
              onClick={() => setQrModalOpen(true)}
              className="hidden sm:flex items-center gap-2 p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-xs transition-all no-print"
              title="Click to view full inspection verification QR code and download PNG"
            >
              <div className="bg-white p-0.5 rounded border border-slate-100 shrink-0">
                <QRCodeSVG value={reportQrUrl} size={36} level="M" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  <span>Audit QR</span>
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">PO: {metadata.poNumber || 'N/A'}</div>
              </div>
            </div>

            {/* Overall Verdict Badge */}
            <div
              className={`px-4 py-2.5 rounded-lg border flex items-center gap-2.5 ${
                verdict === 'ACCEPTED'
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              {verdict === 'ACCEPTED' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <div>
                <div className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                  {t('overallDisposition')}
                </div>
                <div className="text-sm font-bold tracking-wide">
                  {verdict === 'ACCEPTED' ? t('verdictAccepted') : t('verdictRejected')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Order & PO Metadata */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
            {t('sectionOrderInfo')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">{t('poNumber')}</label>
              <input
                type="text"
                value={metadata.poNumber}
                onChange={(e) => setMetadata({ ...metadata, poNumber: e.target.value })}
                className="w-full font-mono font-medium px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">{t('productName')}</label>
              <input
                type="text"
                value={metadata.productName}
                onChange={(e) => setMetadata({ ...metadata, productName: e.target.value })}
                className="w-full font-medium px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">{t('styleNumber')}</label>
              <input
                type="text"
                value={metadata.styleNumber}
                onChange={(e) => setMetadata({ ...metadata, styleNumber: e.target.value })}
                className="w-full font-mono font-medium px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">{t('inspectionStage')}</label>
              <select
                value={metadata.inspectionStage}
                onChange={(e) => setMetadata({ ...metadata, inspectionStage: e.target.value as any })}
                className="w-full font-medium px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
              >
                <option value="Final Random Inspection (FRI)">Final Random (FRI - 100% produced)</option>
                <option value="During Production (DUPRO)">During Production (DUPRO - 20-50% produced)</option>
                <option value="Pre-Production (PPI)">Pre-Production (PPI - Raw materials/First cut)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">{t('supplier')}</label>
              <input
                type="text"
                value={metadata.supplier}
                onChange={(e) => setMetadata({ ...metadata, supplier: e.target.value })}
                className="w-full font-medium px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">{t('factoryLocation')}</label>
              <input
                type="text"
                value={metadata.factoryLocation}
                onChange={(e) => setMetadata({ ...metadata, factoryLocation: e.target.value })}
                className="w-full font-medium px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">{t('inspectorName')}</label>
              <input
                type="text"
                value={metadata.inspectorName}
                onChange={(e) => setMetadata({ ...metadata, inspectorName: e.target.value })}
                className="w-full font-medium px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">{t('inspectionDate')}</label>
              <input
                type="date"
                value={metadata.inspectionDate}
                onChange={(e) => setMetadata({ ...metadata, inspectionDate: e.target.value })}
                className="w-full font-mono font-medium px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Sampling Parameters & Tolerances Summary */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
            {t('sectionSamplingPlan')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs mb-4">
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block">{t('lotSize')}:</span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm tabular-nums">
                {calculationResult.lotSize.toLocaleString()} units
              </strong>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block">{t('inspectionLevel')}:</span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm">
                {calculationResult.inspectionLevel} ({calculationResult.strictness})
              </strong>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block">{t('codeLetter')}:</span>
              <strong className="text-sky-600 dark:text-sky-400 font-mono text-sm font-bold">
                {calculationResult.codeLetter}
              </strong>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block">{t('sampleSize')}:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold tabular-nums">
                {calculationResult.sampleSize} units
              </strong>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block">Sample Ratio:</span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm tabular-nums">
                {calculationResult.percentageOfLot}% of lot
              </strong>
            </div>
          </div>

          {/* Tolerance Comparison Table */}
          <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <tr>
                  <th className="py-2 px-3">Defect Severity</th>
                  <th className="py-2 px-3 text-center">AQL Limit</th>
                  <th className="py-2 px-3 text-center">{t('maxAllowedAc')}</th>
                  <th className="py-2 px-3 text-center">{t('minRejectRe')}</th>
                  <th className="py-2 px-3 text-center">{t('defectsFound')}</th>
                  <th className="py-2 px-3 text-center">Disposition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono">
                <tr className={isCriticalFail ? 'bg-rose-50/70 dark:bg-rose-950/40 font-semibold' : ''}>
                  <td className="py-2 px-3 font-sans text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <strong>{t('critical')}</strong>
                  </td>
                  <td className="py-2 px-3 text-center text-slate-700 dark:text-slate-300">{calculationResult.critical.aql}</td>
                  <td className="py-2 px-3 text-center font-bold text-slate-900 dark:text-white">{calculationResult.critical.ac}</td>
                  <td className="py-2 px-3 text-center text-slate-500 dark:text-slate-400">{calculationResult.critical.re}</td>
                  <td className={`py-2 px-3 text-center font-bold ${isCriticalFail ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {totalCritical}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                        isCriticalFail
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {isCriticalFail ? 'FAILED' : 'CONFORMING'}
                    </span>
                  </td>
                </tr>

                <tr className={isMajorFail ? 'bg-amber-50/70 dark:bg-amber-950/40 font-semibold' : ''}>
                  <td className="py-2 px-3 font-sans text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <strong>{t('major')}</strong>
                  </td>
                  <td className="py-2 px-3 text-center text-slate-700 dark:text-slate-300">{calculationResult.major.aql}</td>
                  <td className="py-2 px-3 text-center font-bold text-slate-900 dark:text-white">{calculationResult.major.ac}</td>
                  <td className="py-2 px-3 text-center text-slate-500 dark:text-slate-400">{calculationResult.major.re}</td>
                  <td className={`py-2 px-3 text-center font-bold ${isMajorFail ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {totalMajor}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                        isMajorFail
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {isMajorFail ? 'FAILED' : 'CONFORMING'}
                    </span>
                  </td>
                </tr>

                <tr className={isMinorFail ? 'bg-blue-50/70 dark:bg-sky-950/40 font-semibold' : ''}>
                  <td className="py-2 px-3 font-sans text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <strong>{t('minor')}</strong>
                  </td>
                  <td className="py-2 px-3 text-center text-slate-700 dark:text-slate-300">{calculationResult.minor.aql}</td>
                  <td className="py-2 px-3 text-center font-bold text-slate-900 dark:text-white">{calculationResult.minor.ac}</td>
                  <td className="py-2 px-3 text-center text-slate-500 dark:text-slate-400">{calculationResult.minor.re}</td>
                  <td className={`py-2 px-3 text-center font-bold ${isMinorFail ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {totalMinor}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                        isMinorFail
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {isMinorFail ? 'FAILED' : 'CONFORMING'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: DEFECT ANALYSIS & TREND VISUALIZATIONS */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t('sectionAnalytics')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualizing defect accumulation trajectory over the sample inspection milestones and category distribution.
              </p>
            </div>

            {/* View Mode Tabs (No-Print) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-center no-print">
              <button
                type="button"
                onClick={() => setAnalyticsTab('both')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  analyticsTab === 'both'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Comprehensive View
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsTab('trend')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  analyticsTab === 'trend'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Accumulation Trend
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsTab('category')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  analyticsTab === 'category'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Category Breakdown
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Defects Logged</span>
              <strong className="text-base font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {grandTotalDefects} units
              </strong>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Defect Density Rate</span>
              <strong className="text-base font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {calculationResult.sampleSize > 0
                  ? ((grandTotalDefects / calculationResult.sampleSize) * 100).toFixed(1)
                  : 0}%
              </strong>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Major AQL Limit Margin</span>
              <strong className={`text-base font-mono font-bold tabular-nums ${isMajorFail ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {totalMajor} / {calculationResult.major.ac} Ac
              </strong>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Minor AQL Limit Margin</span>
              <strong className={`text-base font-mono font-bold tabular-nums ${isMinorFail ? 'text-rose-600 dark:text-rose-400' : 'text-sky-600 dark:text-sky-400'}`}>
                {totalMinor} / {calculationResult.minor.ac} Ac
              </strong>
            </div>
          </div>

          {/* CHARTS CONTAINER (Grid responsive) */}
          <div className={`grid gap-6 ${analyticsTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* 1. Defect Accumulation Trend Line Chart */}
            {(analyticsTab === 'trend' || analyticsTab === 'both') && (
              <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Defect Accumulation Over Inspection Progress
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Sample: {calculationResult.sampleSize} units
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendAnalysisData}
                      margin={{ top: 15, right: 20, left: -15, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis
                        dataKey="stage"
                        tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                        tickLine={false}
                        axisLine={{ stroke: '#CBD5E1' }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: '#64748B', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#CBD5E1' }}
                      />
                      <Tooltip content={<CustomTrendTooltip />} />
                      <Legend
                        wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                        iconType="line"
                      />

                      {/* Acceptance Threshold Reference Lines */}
                      {calculationResult.major.ac > 0 && (
                        <ReferenceLine
                          y={calculationResult.major.ac}
                          stroke="#D97706"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          label={{
                            value: `Major Ac: ${calculationResult.major.ac}`,
                            fill: '#B45309',
                            fontSize: 10,
                            position: 'insideTopLeft',
                          }}
                        />
                      )}
                      {calculationResult.minor.ac > 0 && (
                        <ReferenceLine
                          y={calculationResult.minor.ac}
                          stroke="#0284C7"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          label={{
                            value: `Minor Ac: ${calculationResult.minor.ac}`,
                            fill: '#0369A1',
                            fontSize: 10,
                            position: 'insideTopLeft',
                          }}
                        />
                      )}

                      {/* Cumulative Trend Lines */}
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total Defects"
                        stroke="#0F172A"
                        strokeWidth={2.5}
                        dot={{ r: 3.5, fill: '#0F172A' }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="major"
                        name="Major Defects"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#F59E0B' }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="minor"
                        name="Minor Defects"
                        stroke="#0284C7"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#0284C7' }}
                        activeDot={{ r: 5 }}
                      />
                      {totalCritical > 0 && (
                        <Line
                          type="monotone"
                          dataKey="critical"
                          name="Critical Defects"
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#EF4444' }}
                          activeDot={{ r: 5 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
                  <span>Dashed lines indicate AQL acceptance limits ($Ac$)</span>
                  <span>
                    Trajectory:{' '}
                    <strong className={isRejected ? 'text-rose-600' : 'text-emerald-700'}>
                      {isRejected ? 'Threshold Breached' : 'Within Tolerance'}
                    </strong>
                  </span>
                </div>
              </div>
            )}

            {/* 2. Category Distribution Bar Chart */}
            {(analyticsTab === 'category' || analyticsTab === 'both') && (
              <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Defects by Category (Workmanship, Appearance, Packaging)
                    </span>
                  </div>

                  {/* View Mode Toggle for Bar Chart */}
                  <div className="flex items-center gap-1 text-[11px] no-print">
                    <button
                      type="button"
                      onClick={() => setChartViewMode('stacked')}
                      className={`px-2 py-0.5 rounded border text-[11px] transition-colors cursor-pointer ${
                        chartViewMode === 'stacked'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 font-semibold shadow-xs'
                          : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Severity
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartViewMode('total')}
                      className={`px-2 py-0.5 rounded border text-[11px] transition-colors cursor-pointer ${
                        chartViewMode === 'total'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 font-semibold shadow-xs'
                          : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Total
                    </button>
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryChartData}
                      margin={{ top: 15, right: 20, left: -15, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                        tickLine={false}
                        axisLine={{ stroke: '#CBD5E1' }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: '#64748B', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#CBD5E1' }}
                      />
                      <Tooltip content={<CustomCategoryTooltip />} />
                      <Legend
                        wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                        iconType="circle"
                        iconSize={7}
                      />

                      {chartViewMode === 'stacked' ? (
                        <>
                          <Bar
                            dataKey="critical"
                            name="Critical"
                            fill="#EF4444"
                            stackId="severity"
                            maxBarSize={45}
                          />
                          <Bar
                            dataKey="major"
                            name="Major"
                            fill="#F59E0B"
                            stackId="severity"
                            maxBarSize={45}
                          />
                          <Bar
                            dataKey="minor"
                            name="Minor"
                            fill="#0284C7"
                            stackId="severity"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={45}
                          />
                        </>
                      ) : (
                        <Bar
                          dataKey="total"
                          name="Total Defects"
                          fill="#0F172A"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={45}
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                  <span>Categories: Workmanship, Appearance, Packaging</span>
                  <span>
                    Highest defect category:{' '}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {[...categoryChartData].sort((a, b) => b.total - a.total)[0]?.category || 'None'}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Defect Audit Checklist / Log with Camera Capture */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t('sectionChecklist')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log specific defect descriptions, categories, quantities, and capture camera photo evidence for certified audit records.
              </p>
            </div>

            {/* Quick load preset defects */}
            <div className="flex items-center gap-2 no-print">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Load sample points:</span>
              <select
                onChange={(e) => handleLoadPresetDefects(e.target.value)}
                defaultValue=""
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Choose industry...
                </option>
                {INDUSTRY_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Defect Table */}
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 w-32">Category</th>
                  <th className="py-2.5 px-3">Defect Description</th>
                  <th className="py-2.5 px-3 w-24 text-center">Severity</th>
                  <th className="py-2.5 px-3 w-24 text-center">Count</th>
                  <th className="py-2.5 px-3 w-32 text-center">Photo Evidence</th>
                  <th className="py-2.5 px-3 w-20 text-center no-print">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {defects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400 dark:text-slate-500">
                      No defects recorded yet. Clean sample or click below to log observations.
                    </td>
                  </tr>
                ) : (
                  defects.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400 dark:text-slate-500">{index + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{item.category}</td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        <div>{item.description}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.severity === 'critical'
                              ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                              : item.severity === 'major'
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                              : 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300'
                          }`}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          value={item.count}
                          onChange={(e) => handleUpdateCount(item.id, parseInt(e.target.value) || 0)}
                          className="w-14 font-mono tabular-nums text-center text-xs py-1 px-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </td>

                      {/* Camera Photo Evidence Cell */}
                      <td className="py-2.5 px-3 text-center">
                        {item.photoUrl ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <div
                              onClick={() => setViewerModalDefect(item)}
                              className="relative group cursor-pointer inline-block"
                              title="Click to view full photo evidence"
                            >
                              <img
                                src={item.photoUrl}
                                alt={`Evidence for ${item.description}`}
                                className="w-10 h-10 rounded object-cover border border-slate-300 dark:border-slate-700 shadow-xs group-hover:ring-2 group-hover:ring-sky-500 transition-all"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                <ZoomIn className="w-3.5 h-3.5" />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenDefectCamera(item)}
                              className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 p-1 rounded no-print cursor-pointer"
                              title="Retake photo"
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenDefectCamera(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 transition-colors shadow-xs no-print cursor-pointer"
                            title="Take photo using device camera"
                          >
                            <Camera className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                            <span>Capture</span>
                          </button>
                        )}
                        {!item.photoUrl && (
                          <span className="hidden print:inline text-slate-400 text-[10px]">None</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center no-print">
                        <button
                          type="button"
                          onClick={() => handleRemoveDefect(item.id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add Defect Form with Optional Camera Attachment (No-Print) */}
          <form
            onSubmit={handleAddDefect}
            className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3 no-print"
          >
            <div className="w-36">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="Workmanship">Workmanship</option>
                <option value="Appearance">Appearance</option>
                <option value="Packaging">Packaging</option>
                <option value="Measurement">Measurement</option>
                <option value="Function">Function</option>
                <option value="Safety">Safety</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Defect description (e.g. Broken stitching, scratch on casing)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="w-24">
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as DefectSeverity)}
                className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="critical">Critical</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </div>

            <div className="w-16">
              <input
                type="number"
                min={1}
                value={newCount}
                onChange={(e) => setNewCount(parseInt(e.target.value) || 1)}
                className="w-full text-xs font-mono text-center px-1.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Quick camera capture for new defect */}
            <div className="flex items-center gap-1.5">
              {newPhotoUrl ? (
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded border border-slate-300 dark:border-slate-700">
                  <img
                    src={newPhotoUrl}
                    alt="Pending photo"
                    className="w-6 h-6 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPhotoUrl(null)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    title="Remove pending photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveDefectForCamera(null);
                    setCameraModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  title="Take photo for this new defect"
                >
                  <Camera className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{t('takePhotoBtn')}</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded inline-flex items-center gap-1 transition-colors ml-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addDefectBtn')}</span>
            </button>
          </form>

          {/* Photographic Evidence Gallery (Prints directly in physical report) */}
          {defectsWithPhotos.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Attached Defect Photographic Evidence ({defectsWithPhotos.length} Photos Captured)
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {defectsWithPhotos.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setViewerModalDefect(item)}
                    className="group bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-sky-400 dark:hover:border-sky-500 transition-all space-y-1.5"
                  >
                    <div className="aspect-square w-full rounded overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                      <img
                        src={item.photoUrl}
                        alt={item.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-700 dark:text-slate-300 font-medium truncate">
                      {item.description}
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold">
                      <span>{item.category}</span>
                      <span
                        className={
                          item.severity === 'critical'
                            ? 'text-rose-600 dark:text-rose-400'
                            : item.severity === 'major'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-sky-600 dark:text-sky-400'
                        }
                      >
                        {item.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Observations & Inspector Remarks */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {t('sectionObservations')}
          </h3>
          <textarea
            rows={3}
            value={metadata.notes}
            onChange={(e) => setMetadata({ ...metadata, notes: e.target.value })}
            placeholder="Document overall packaging condition, carton drop test results, barcode verification grade, factory willingness to rework, or special client instructions..."
            className="w-full text-xs p-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans leading-relaxed"
          />
        </div>

        {/* Section 6: Official Sign-off & Digital Signatures (Printed on physical report) */}
        <div className="p-6 bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t('sectionSignatures')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspectors and factory management can sign directly on the touchscreen or drawing canvas below using stylus, finger touch, or mouse.
              </p>
            </div>
            {inspectorSignature && (
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-800 no-print flex items-center gap-1.5 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Inspector Signature Verified</span>
              </span>
            )}
          </div>

          {/* Interactive Digital Signature Pads (No-Print) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
            <DigitalSignaturePad
              signerName={metadata.inspectorName || 'Inspector'}
              roleTitle="Lead QA Auditor"
              signatureDataUrl={inspectorSignature}
              onSaveSignature={setInspectorSignature}
              dateStr={metadata.inspectionDate}
            />

            <DigitalSignaturePad
              signerName={representativeName}
              roleTitle="Factory Representative"
              signatureDataUrl={representativeSignature}
              onSaveSignature={setRepresentativeSignature}
              dateStr={metadata.inspectionDate}
            />
          </div>

          {/* Printed Sign-off Block with Official Verification QR (Visible in @media print) */}
          <div className="hidden print:grid print:grid-cols-3 gap-6 text-xs pt-4 items-end">
            <div className="space-y-2">
              <div className="text-slate-600 font-medium">Quality Assurance Inspector:</div>
              {inspectorSignature ? (
                <div className="h-16 flex items-end border-b border-slate-400 pb-1">
                  <img src={inspectorSignature} alt="Inspector Signature" className="max-h-14 w-auto object-contain" />
                </div>
              ) : (
                <div className="border-b border-slate-400 h-14 flex items-end pb-1 font-serif italic text-slate-800">
                  {metadata.inspectorName || 'Inspector Signature'}
                </div>
              )}
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Name: {metadata.inspectorName}</span>
                <span>Date: {metadata.inspectionDate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-slate-600 font-medium">Factory / Vendor Representative:</div>
              {representativeSignature ? (
                <div className="h-16 flex items-end border-b border-slate-400 pb-1">
                  <img src={representativeSignature} alt="Representative Signature" className="max-h-14 w-auto object-contain" />
                </div>
              ) : (
                <div className="border-b border-slate-400 h-14 flex items-end pb-1 font-serif italic text-slate-800">
                  {representativeName}
                </div>
              )}
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Name: {representativeName}</span>
                <span>Date: {metadata.inspectionDate}</span>
              </div>
            </div>

            {/* Official Scannable Verification QR Code for Print */}
            <div className="flex flex-col items-center justify-center p-3 border border-slate-300 rounded-lg bg-white text-center">
              <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                Official Verification QR
              </div>
              <QRCodeSVG value={reportQrUrl} size={84} level="M" />
              <div className="text-[9px] text-slate-600 font-mono font-bold mt-1">PO: {metadata.poNumber || 'N/A'}</div>
              <div className="text-[8px] text-slate-500">Scan for live digital audit certificate</div>
            </div>
          </div>
        </div>

        {/* Section 7: Official Audit Verification QR Code & Digital Certificate */}
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t('sectionQr')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('qrScanInstruction')}
              </p>
            </div>

            {/* Format toggle & Modal launch button */}
            <div className="flex items-center gap-2 no-print self-start sm:self-auto">
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setReportQrType('url')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    reportQrType === 'url' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Verification URL
                </button>
                <button
                  type="button"
                  onClick={() => setReportQrType('json')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    reportQrType === 'json' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  JSON Summary
                </button>
              </div>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 rounded border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Enlarge / Export</span>
              </button>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            {/* Scannable QR Code */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-xs flex flex-col items-center justify-center shrink-0">
              <QRCodeSVG
                value={activeReportQrValue}
                size={120}
                level="M"
                includeMargin={false}
              />
              <span className="text-[10px] font-mono text-slate-400 mt-2">
                {reportQrType === 'url' ? 'WEB LINK QR' : 'DATA PAYLOAD QR'}
              </span>
            </div>

            {/* QR Metadata & Details */}
            <div className="flex-1 flex flex-col justify-between space-y-3 w-full text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {reportQrType === 'url' ? 'Direct Verification Web Link' : 'Machine-Readable Audit Record (JSON)'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReportQr}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 no-print cursor-pointer"
                  >
                    {reportQrCopied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{reportQrCopied ? t('copied') : t('copyContent')}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-mono bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-700 break-all max-h-20 overflow-y-auto select-all">
                  {activeReportQrValue}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Encoded PO:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{metadata.poNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Verdict:</span>
                  <span className={verdict === 'ACCEPTED' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-700 dark:text-rose-400 font-bold'}>
                    {verdict}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Sample:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{calculationResult.sampleSize} units</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Defects:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{grandTotalDefects} found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Capture Modal (MediaDevices API) */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => {
          setCameraModalOpen(false);
          setActiveDefectForCamera(null);
        }}
        onCapture={handlePhotoCaptured}
        defectDescription={activeDefectForCamera?.description || newDesc}
        defectCategory={activeDefectForCamera?.category || newCategory}
      />

      {/* High-Resolution Defect Photo Viewer Modal */}
      <DefectPhotoViewerModal
        defect={viewerModalDefect}
        onClose={() => setViewerModalDefect(null)}
        onRetake={handleRetakeFromViewer}
        onRemovePhoto={handleRemovePhotoFromDefect}
      />

      {/* Verification QR Modal with Format Switcher & PNG Download */}
      <InspectionQrModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        metadata={metadata}
        calculationResult={calculationResult}
        defects={defects}
        verdict={verdict}
      />
    </div>
  );
};
