/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  InspectionLevel,
  InspectionStrictness,
  CalculationResult,
  IndustryPreset,
} from '../types';
import {
  INDUSTRY_PRESETS,
  getCodeLetter,
  resolveSamplingPlan,
  CODE_LETTER_SAMPLE_SIZES,
  STANDARD_AQL_LEVELS,
} from '../data/aqlData';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AqlCalculatorProps {
  lotSize: number;
  setLotSize: (val: number) => void;
  inspectionLevel: InspectionLevel;
  setInspectionLevel: (level: InspectionLevel) => void;
  strictness: InspectionStrictness;
  setStrictness: (s: InspectionStrictness) => void;
  criticalAql: number;
  setCriticalAql: (val: number) => void;
  majorAql: number;
  setMajorAql: (val: number) => void;
  minorAql: number;
  setMinorAql: (val: number) => void;
  calculationResult: CalculationResult;
  onNavigateToTemplate: () => void;
  onNavigateToTables: () => void;
}

export const AqlCalculator: React.FC<AqlCalculatorProps> = ({
  lotSize,
  setLotSize,
  inspectionLevel,
  setInspectionLevel,
  strictness,
  setStrictness,
  criticalAql,
  setCriticalAql,
  majorAql,
  setMajorAql,
  minorAql,
  setMinorAql,
  calculationResult,
  onNavigateToTemplate,
  onNavigateToTables,
}) => {
  const { t } = useApp();
  // Simulator inputs for observed defects
  const [criticalFound, setCriticalFound] = useState<number>(0);
  const [majorFound, setMajorFound] = useState<number>(0);
  const [minorFound, setMinorFound] = useState<number>(0);
  const [selectedPreset, setSelectedPreset] = useState<string>('apparel');

  // Evaluate simulator verdict
  const isCriticalFailed = criticalFound > calculationResult.critical.ac;
  const isMajorFailed = majorFound > calculationResult.major.ac;
  const isMinorFailed = minorFound > calculationResult.minor.ac;
  const isRejected = isCriticalFailed || isMajorFailed || isMinorFailed;

  const handleApplyPreset = (presetId: string) => {
    const preset = INDUSTRY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPreset(presetId);
    setLotSize(preset.defaultLotSize);
    setInspectionLevel(preset.inspectionLevel);
    setCriticalAql(preset.criticalAql);
    setMajorAql(preset.majorAql);
    setMinorAql(preset.minorAql);
    setStrictness('normal');
  };

  const quickLotSizes = [500, 1200, 3200, 5000, 10000, 50000];

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero Intro */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>ANSI/ASQ Z1.4</span>
              <span aria-hidden="true">·</span>
              <span>ISO 2859-1</span>
              <span aria-hidden="true">·</span>
              <span>MIL-STD-105E Standard</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('tabCalculator')} & Sampling Matrix
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Determine the exact sample size and maximum permissible defects (Ac/Re) for pre-shipment inspections.
              Select parameters below or apply industry-standard presets.
            </p>
          </div>

          {/* Industry Preset Selector */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Industry Preset:</span>
            <select
              value={selectedPreset}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="text-xs font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              {INDUSTRY_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} (AQL {preset.criticalAql}/{preset.majorAql}/{preset.minorAql})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Parameters & Calculated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inspection Parameters (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">1. Inspection Parameters</h2>
            <button
              onClick={() => {
                setLotSize(3200);
                setInspectionLevel('GII');
                setStrictness('normal');
                setCriticalAql(0);
                setMajorAql(2.5);
                setMinorAql(4.0);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Parameter 1: Total Lot Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="lot-size-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('lotSize')} (Units)
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Total units manufactured</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="lot-size-input"
                type="number"
                min={2}
                max={5000000}
                value={lotSize}
                onChange={(e) => setLotSize(Math.max(2, parseInt(e.target.value) || 2))}
                className="w-full text-base font-mono tabular-nums px-3.5 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {/* Quick buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1">Quick select:</span>
              {quickLotSizes.map((quickVal) => (
                <button
                  key={quickVal}
                  type="button"
                  onClick={() => setLotSize(quickVal)}
                  className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded border transition-colors cursor-pointer ${
                    lotSize === quickVal
                      ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {quickVal.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter 2: Inspection Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('inspectionLevel')} (ANSI/ASQ Table 1)
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">General II is the worldwide standard</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'GI', name: 'General I', desc: 'Reduced cost / less sample' },
                { id: 'GII', name: 'General II (Default)', desc: 'Standard production audit' },
                { id: 'GIII', name: 'General III', desc: 'High stringency / critical' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setInspectionLevel(lvl.id as InspectionLevel)}
                  className={`p-2.5 text-left rounded-md border text-xs transition-all cursor-pointer ${
                    inspectionLevel === lvl.id
                      ? 'border-sky-600 dark:border-sky-500 bg-sky-50/70 dark:bg-sky-950/60 text-slate-900 dark:text-white ring-1 ring-sky-600 dark:ring-sky-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold">{lvl.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lvl.desc}</div>
                </button>
              ))}
            </div>

            {/* Special Inspection Levels Expandable / Selectable */}
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Special levels (Destructive/small test):</span>
              {(['S-1', 'S-2', 'S-3', 'S-4'] as InspectionLevel[]).map((specialLvl) => (
                <button
                  key={specialLvl}
                  type="button"
                  onClick={() => setInspectionLevel(specialLvl)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                    inspectionLevel === specialLvl
                      ? 'bg-sky-100 dark:bg-sky-900 border-sky-500 text-sky-900 dark:text-sky-200 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {specialLvl}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter 3: Inspection Strictness */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('strictness')}</label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Switching state per ISO 2859-1</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', name: t('normal'), note: 'Standard routine inspection' },
                { id: 'tightened', name: t('tightened'), note: 'When 2 of 5 lots rejected' },
                { id: 'reduced', name: t('reduced'), note: 'After 10 consecutive passes' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStrictness(item.id as InspectionStrictness)}
                  className={`p-2.5 text-left rounded-md border text-xs transition-colors cursor-pointer ${
                    strictness === item.id
                      ? 'border-sky-600 dark:border-sky-500 bg-sky-50/70 dark:bg-sky-950/60 text-slate-900 dark:text-white ring-1 ring-sky-600 dark:ring-sky-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold capitalize">{item.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameter 4: AQL Thresholds (Critical, Major, Minor) */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Acceptable Quality Limit (AQL) Thresholds
            </label>

            <div className="grid grid-cols-3 gap-3">
              {/* Critical */}
              <div className="bg-rose-50/50 dark:bg-rose-950/30 p-3 rounded-md border border-rose-100 dark:border-rose-900/60">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">{t('critical')}</span>
                <span className="text-[11px] text-rose-600 dark:text-rose-400 block mb-2">Safety, hazard, illegal</span>
                <select
                  value={criticalAql}
                  onChange={(e) => setCriticalAql(parseFloat(e.target.value))}
                  className="w-full text-xs font-mono tabular-nums bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded px-2 py-1 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-400 cursor-pointer"
                >
                  <option value={0}>0.0 (Zero tolerance)</option>
                  <option value={0.065}>0.065</option>
                  <option value={0.1}>0.10</option>
                  <option value={0.15}>0.15</option>
                  <option value={0.25}>0.25</option>
                </select>
              </div>

              {/* Major */}
              <div className="bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-100 dark:border-amber-900/60">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">{t('major')}</span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 block mb-2">Functional defect, return</span>
                <select
                  value={majorAql}
                  onChange={(e) => setMajorAql(parseFloat(e.target.value))}
                  className="w-full text-xs font-mono tabular-nums bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded px-2 py-1 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {STANDARD_AQL_LEVELS.map((val) => (
                    <option key={val} value={parseFloat(val)}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minor */}
              <div className="bg-blue-50/50 dark:bg-sky-950/30 p-3 rounded-md border border-blue-100 dark:border-sky-900/60">
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300 block">{t('minor')}</span>
                <span className="text-[11px] text-sky-600 dark:text-sky-400 block mb-2">Cosmetic, slight blemish</span>
                <select
                  value={minorAql}
                  onChange={(e) => setMinorAql(parseFloat(e.target.value))}
                  className="w-full text-xs font-mono tabular-nums bg-white dark:bg-slate-800 border border-blue-200 dark:border-sky-800 rounded px-2 py-1 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
                >
                  {STANDARD_AQL_LEVELS.map((val) => (
                    <option key={val} value={parseFloat(val)}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Sampling Plan & Decision Simulator (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Calculated Output Card */}
          <div className="bg-slate-900 text-white rounded-lg p-6 shadow-md border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
                  Calculated Sampling Plan
                </span>
                <div className="text-lg font-bold text-white mt-0.5">
                  ANSI/ASQ Z1.4 Result
                </div>
              </div>
              <button
                onClick={onNavigateToTables}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                title="View in full standard matrix"
              >
                <span>View Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Key Figures */}
            <div className="grid grid-cols-2 gap-4 py-5 border-b border-slate-800">
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                <div className="text-xs text-slate-400">Sample Code Letter</div>
                <div className="text-3xl font-mono font-bold text-sky-400 mt-1">
                  {calculationResult.codeLetter}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Batch: {lotSize.toLocaleString()} units
                </div>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                <div className="text-xs text-slate-400">Required Sample Size</div>
                <div className="text-3xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">
                  {calculationResult.sampleSize}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 tabular-nums">
                  {calculationResult.percentageOfLot}% of total batch
                </div>
              </div>
            </div>

            {/* Criteria Acceptance Limits Grid */}
            <div className="pt-4 space-y-2.5">
              <div className="text-xs font-semibold text-slate-300">
                Acceptance Thresholds (Ac / Re):
              </div>

              {/* Critical */}
              <div className="flex items-center justify-between text-xs bg-slate-800/50 p-2.5 rounded border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="font-medium text-slate-200">Critical (AQL {calculationResult.critical.aql})</span>
                </div>
                <div className="font-mono tabular-nums text-slate-100 font-semibold">
                  Ac: {calculationResult.critical.ac} · Re: {calculationResult.critical.re}
                </div>
              </div>

              {/* Major */}
              <div className="flex items-center justify-between text-xs bg-slate-800/50 p-2.5 rounded border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-slate-200">Major (AQL {calculationResult.major.aql})</span>
                  {calculationResult.major.arrow && (
                    <span className="text-[10px] text-sky-400 font-mono">
                      (Arrow {calculationResult.major.arrow})
                    </span>
                  )}
                </div>
                <div className="font-mono tabular-nums text-slate-100 font-semibold">
                  Ac: {calculationResult.major.ac} · Re: {calculationResult.major.re}
                </div>
              </div>

              {/* Minor */}
              <div className="flex items-center justify-between text-xs bg-slate-800/50 p-2.5 rounded border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span className="font-medium text-slate-200">Minor (AQL {calculationResult.minor.aql})</span>
                  {calculationResult.minor.arrow && (
                    <span className="text-[10px] text-sky-400 font-mono">
                      (Arrow {calculationResult.minor.arrow})
                    </span>
                  )}
                </div>
                <div className="font-mono tabular-nums text-slate-100 font-semibold">
                  Ac: {calculationResult.minor.ac} · Re: {calculationResult.minor.re}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Ac = Max Acceptable</span>
              <span>Re = Min to Reject</span>
            </div>
          </div>

          {/* Interactive Defect Acceptance Simulator */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Live Lot Decision Simulator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Test sample findings to verify lot disposition
                </p>
              </div>
              <button
                onClick={() => {
                  setCriticalFound(0);
                  setMajorFound(0);
                  setMinorFound(0);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Inputs for found defects */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-rose-700 dark:text-rose-400 block mb-1">
                  Critical Found
                </label>
                <input
                  type="number"
                  min={0}
                  value={criticalFound}
                  onChange={(e) => setCriticalFound(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-sm font-mono tabular-nums px-2.5 py-1.5 rounded border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Max Ac: {calculationResult.critical.ac}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                  Major Found
                </label>
                <input
                  type="number"
                  min={0}
                  value={majorFound}
                  onChange={(e) => setMajorFound(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-sm font-mono tabular-nums px-2.5 py-1.5 rounded border border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Max Ac: {calculationResult.major.ac}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-sky-700 dark:text-sky-400 block mb-1">
                  Minor Found
                </label>
                <input
                  type="number"
                  min={0}
                  value={minorFound}
                  onChange={(e) => setMinorFound(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-sm font-mono tabular-nums px-2.5 py-1.5 rounded border border-blue-200 dark:border-sky-800 bg-blue-50/30 dark:bg-sky-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Max Ac: {calculationResult.minor.ac}</div>
              </div>
            </div>

            {/* Verdict Box */}
            <div
              className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${
                isRejected
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              {isRejected ? (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="text-sm font-bold">
                  {isRejected ? 'LOT REJECTED (NON-CONFORMING)' : 'LOT ACCEPTED (CONFORMING)'}
                </div>
                <div className="text-xs">
                  {isRejected ? (
                    <span>
                      Defects exceeded acceptable threshold:
                      {isCriticalFailed && ` Critical (${criticalFound} > ${calculationResult.critical.ac}); `}
                      {isMajorFailed && ` Major (${majorFound} > ${calculationResult.major.ac}); `}
                      {isMinorFailed && ` Minor (${minorFound} > ${calculationResult.minor.ac});`}
                    </span>
                  ) : (
                    <span>
                      All defect counts are within ANSI/ASQ Z1.4 acceptable limits. The lot meets shipping criteria.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToTemplate}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Build Complete Inspection Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
