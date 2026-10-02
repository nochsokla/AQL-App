/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  InspectionLevel,
  InspectionStrictness,
  CalculationResult,
  InspectionMetadata,
  DefectItem,
} from './types';
import {
  getCodeLetter,
  resolveSamplingPlan,
  CODE_LETTER_SAMPLE_SIZES,
  INDUSTRY_PRESETS,
} from './data/aqlData';
import { TopNav } from './components/TopNav';
import { AqlCalculator } from './components/AqlCalculator';
import { AqlTableMatrix } from './components/AqlTableMatrix';
import { InspectionTemplate } from './components/InspectionTemplate';
import { SwitchingRulesGuide } from './components/SwitchingRulesGuide';
import { GeminiChatbot } from './components/GeminiChatbot';
import { exportInspectionTemplateCSV } from './utils/exportUtils';
import { useApp } from './context/AppContext';
import {
  loadInspectionDraft,
  saveInspectionDraft,
  clearInspectionDraft,
  StoredSignatures,
} from './utils/storageUtils';
import { Check, ShieldCheck, Info, WifiOff, AlertTriangle, RotateCcw } from 'lucide-react';

const DEFAULT_METADATA: InspectionMetadata = {
  poNumber: 'PO-2026-8842',
  styleNumber: 'STY-4491-NVY',
  productName: 'Premium Cotton Casual Twill Overshirt',
  supplier: 'Apex Horizon Sourcing Ltd.',
  factoryLocation: 'Vietnam Facility #04, Binh Duong',
  inspectorName: 'J. Henderson (Lead Quality Auditor)',
  inspectionDate: new Date().toISOString().split('T')[0],
  inspectionStage: 'Final Random Inspection (FRI)',
  notes: 'Carton drop test passed. Barcode Grade A verified with handheld scanner. Workmanship within AQL 2.5/4.0 limits.',
};

const DEFAULT_DEFECTS: DefectItem[] = [
  {
    id: 'def-1',
    category: 'Workmanship',
    description: 'Skipped stitching on hem cuff (> 3 stitches)',
    severity: 'major',
    count: 2,
  },
  {
    id: 'def-2',
    category: 'Appearance',
    description: 'Uncut loose thread ends exceeding 15mm length',
    severity: 'minor',
    count: 5,
  },
  {
    id: 'def-3',
    category: 'Packaging',
    description: 'Carton label slightly creased on corner',
    severity: 'minor',
    count: 1,
  },
];

const App: React.FC = () => {
  const { theme, language, t, isOnline, lastSaved, setLastSaved } = useApp();
  const [activeTab, setActiveTab] = useState<'calculator' | 'tables' | 'template' | 'guide'>('calculator');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load existing draft from LocalStorage on mount
  const initialDraft = useMemo(() => loadInspectionDraft(), []);

  // Core Sampling Configuration State (Restored from offline cache if available)
  const [lotSize, setLotSize] = useState<number>(initialDraft.params?.lotSize ?? 3200);
  const [inspectionLevel, setInspectionLevel] = useState<InspectionLevel>(initialDraft.params?.inspectionLevel ?? 'GII');
  const [strictness, setStrictness] = useState<InspectionStrictness>(initialDraft.params?.strictness ?? 'normal');
  const [criticalAql, setCriticalAql] = useState<number>(initialDraft.params?.criticalAql ?? 0);
  const [majorAql, setMajorAql] = useState<number>(initialDraft.params?.majorAql ?? 2.5);
  const [minorAql, setMinorAql] = useState<number>(initialDraft.params?.minorAql ?? 4.0);

  // Inspection Metadata State
  const [metadata, setMetadata] = useState<InspectionMetadata>(initialDraft.metadata ?? DEFAULT_METADATA);

  // Defect Checklist State
  const [defects, setDefects] = useState<DefectItem[]>(initialDraft.defects ?? DEFAULT_DEFECTS);

  // Signatures State
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(
    initialDraft.signatures?.inspectorSignature ?? null
  );
  const [representativeSignature, setRepresentativeSignature] = useState<string | null>(
    initialDraft.signatures?.representativeSignature ?? null
  );
  const [representativeName, setRepresentativeName] = useState<string>(
    initialDraft.signatures?.representativeName ?? 'Nguyen Van Minh (Factory QC Director)'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Synchronize initial last saved timestamp
  useEffect(() => {
    if (initialDraft.lastSaved) {
      setLastSaved(initialDraft.lastSaved);
    }
  }, [initialDraft, setLastSaved]);

  // Autosave to LocalStorage whenever inspection data or parameters change
  useEffect(() => {
    const res = saveInspectionDraft(
      metadata,
      {
        lotSize,
        inspectionLevel,
        strictness,
        criticalAql,
        majorAql,
        minorAql,
      },
      defects,
      {
        inspectorSignature,
        representativeSignature,
        representativeName,
      }
    );

    if (res.success) {
      setLastSaved(res.timestamp);
    }
  }, [
    metadata,
    lotSize,
    inspectionLevel,
    strictness,
    criticalAql,
    majorAql,
    minorAql,
    defects,
    inspectorSignature,
    representativeSignature,
    representativeName,
    setLastSaved,
  ]);

  // Check for QR Code verification params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const po = params.get('po');
    const isVerifiedHash = window.location.hash.includes('verified');

    if (po || isVerifiedHash) {
      setActiveTab('template');
      const sku = params.get('sku');
      const auditor = params.get('auditor');
      const date = params.get('date');
      const supplier = params.get('supplier');
      const verdict = params.get('verdict') || params.get('status') || 'ACCEPTED';

      setMetadata((prev) => ({
        ...prev,
        poNumber: po || prev.poNumber,
        styleNumber: sku || prev.styleNumber,
        inspectorName: auditor || prev.inspectorName,
        inspectionDate: date || prev.inspectionDate,
        supplier: supplier || prev.supplier,
      }));

      const lot = params.get('lot');
      if (lot && !isNaN(Number(lot))) {
        setLotSize(Number(lot));
      }

      showToast(`Scanned QR Audit Certificate: PO #${po || 'VERIFIED'} — Status: ${verdict}`);
    }
  }, []);

  // Reset Draft to clean initial template
  const handleResetDraft = () => {
    if (window.confirm(t('resetConfirm'))) {
      clearInspectionDraft();
      setMetadata(DEFAULT_METADATA);
      setLotSize(3200);
      setInspectionLevel('GII');
      setStrictness('normal');
      setCriticalAql(0);
      setMajorAql(2.5);
      setMinorAql(4.0);
      setDefects(DEFAULT_DEFECTS);
      setInspectorSignature(null);
      setRepresentativeSignature(null);
      setRepresentativeName('Nguyen Van Minh (Factory QC Director)');
      setLastSaved(null);
      showToast('All inspection draft data reset to default.');
    }
  };

  // Compute live calculation result based on current parameters
  const calculationResult: CalculationResult = useMemo(() => {
    const codeLetter = getCodeLetter(lotSize, inspectionLevel);
    const standardSampleSize = CODE_LETTER_SAMPLE_SIZES[codeLetter];

    const critPlan = resolveSamplingPlan(codeLetter, criticalAql, strictness);
    const majPlan = resolveSamplingPlan(codeLetter, majorAql, strictness);
    const minPlan = resolveSamplingPlan(codeLetter, minorAql, strictness);

    // If arrow points to another sample size, use the maximum sample size required among major and minor
    const effectiveSampleSize = Math.max(
      standardSampleSize,
      majPlan.effectiveSampleSize,
      minPlan.effectiveSampleSize
    );

    const safeLot = Math.max(1, lotSize);
    const percentage = Number(((effectiveSampleSize / safeLot) * 100).toFixed(1));

    return {
      lotSize,
      inspectionLevel,
      strictness,
      codeLetter,
      sampleSize: effectiveSampleSize,
      percentageOfLot: percentage,
      critical: {
        aql: criticalAql,
        ac: critPlan.ac,
        re: critPlan.re,
        effectiveSampleSize: critPlan.effectiveSampleSize,
        effectiveCodeLetter: critPlan.effectiveCodeLetter,
        arrow: critPlan.arrow,
      },
      major: {
        aql: majorAql,
        ac: majPlan.ac,
        re: majPlan.re,
        effectiveSampleSize: majPlan.effectiveSampleSize,
        effectiveCodeLetter: majPlan.effectiveCodeLetter,
        arrow: majPlan.arrow,
      },
      minor: {
        aql: minorAql,
        ac: minPlan.ac,
        re: minPlan.re,
        effectiveSampleSize: minPlan.effectiveSampleSize,
        effectiveCodeLetter: minPlan.effectiveCodeLetter,
        arrow: minPlan.arrow,
      },
    };
  }, [lotSize, inspectionLevel, strictness, criticalAql, majorAql, minorAql]);

  // Overall verdict for export and report
  const isCriticalFail =
    defects.filter((d) => d.severity === 'critical').reduce((s, d) => s + d.count, 0) >
    calculationResult.critical.ac;
  const isMajorFail =
    defects.filter((d) => d.severity === 'major').reduce((s, d) => s + d.count, 0) >
    calculationResult.major.ac;
  const isMinorFail =
    defects.filter((d) => d.severity === 'minor').reduce((s, d) => s + d.count, 0) >
    calculationResult.minor.ac;
  const overallVerdict = isCriticalFail || isMajorFail || isMinorFail ? 'REJECTED' : 'ACCEPTED';

  const handleExportCSV = () => {
    exportInspectionTemplateCSV(metadata, calculationResult, defects, overallVerdict, Boolean(inspectorSignature));
    showToast('Inspection Template CSV successfully exported.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-fade-in no-print">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Banner (when network drops at remote factory) */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs py-2 px-4 shadow-sm flex items-center justify-between no-print z-50">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-semibold">{t('statusOffline')}:</span>
            <span>{t('offlineBannerNotice')}</span>
          </div>
        </div>
      )}

      {/* Top Bar Contract (3 zones) */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
        onResetDraft={handleResetDraft}
      />

      {/* Persistent Breadcrumb / Sampling Context Pill */}
      <div className="bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-xs py-2 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Current Plan:</span>
            <span>Batch {lotSize.toLocaleString()} units</span>
            <span aria-hidden="true">·</span>
            <span>Level {inspectionLevel} ({strictness})</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">Code {calculationResult.codeLetter}</span>
            <span aria-hidden="true">·</span>
            <span>Sample <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{calculationResult.sampleSize}</strong> units</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span>
              Critical Ac: <strong className="text-slate-800 dark:text-slate-200">{calculationResult.critical.ac}</strong>
            </span>
            <span>
              Major Ac: <strong className="text-slate-800 dark:text-slate-200">{calculationResult.major.ac}</strong>
            </span>
            <span>
              Minor Ac: <strong className="text-slate-800 dark:text-slate-200">{calculationResult.minor.ac}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' && (
          <AqlCalculator
            lotSize={lotSize}
            setLotSize={setLotSize}
            inspectionLevel={inspectionLevel}
            setInspectionLevel={setInspectionLevel}
            strictness={strictness}
            setStrictness={setStrictness}
            criticalAql={criticalAql}
            setCriticalAql={setCriticalAql}
            majorAql={majorAql}
            setMajorAql={setMajorAql}
            minorAql={minorAql}
            setMinorAql={setMinorAql}
            calculationResult={calculationResult}
            onNavigateToTemplate={() => setActiveTab('template')}
            onNavigateToTables={() => setActiveTab('tables')}
          />
        )}

        {activeTab === 'tables' && (
          <AqlTableMatrix
            currentLotSize={lotSize}
            currentCodeLetter={calculationResult.codeLetter}
            currentLevel={inspectionLevel}
            currentStrictness={strictness}
            criticalAql={criticalAql}
            majorAql={majorAql}
            minorAql={minorAql}
          />
        )}

        {activeTab === 'template' && (
          <InspectionTemplate
            metadata={metadata}
            setMetadata={setMetadata}
            calculationResult={calculationResult}
            defects={defects}
            setDefects={setDefects}
            onPrint={handlePrint}
            inspectorSignature={inspectorSignature}
            setInspectorSignature={setInspectorSignature}
            representativeSignature={representativeSignature}
            setRepresentativeSignature={setRepresentativeSignature}
            representativeName={representativeName}
            setRepresentativeName={setRepresentativeName}
            onResetDraft={handleResetDraft}
          />
        )}

        {activeTab === 'guide' && <SwitchingRulesGuide />}
      </main>

      {/* Floating Gemini AI Chatbot */}
      <GeminiChatbot
        calculationResult={calculationResult}
        metadata={metadata}
        defects={defects}
      />

      {/* Footer (Quiet, standard, anti-slop) */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>AQL Inspection Table & Sampling Plan Matrix</span>
            <span aria-hidden="true">·</span>
            <span>ANSI/ASQ Z1.4-2008 & ISO 2859-1:1999 Standard Compliant</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>Attributes Sampling System</span>
            <span>Single & Double Plans</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
