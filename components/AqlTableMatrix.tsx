/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CodeLetter,
  InspectionLevel,
  InspectionStrictness,
} from '../types';
import {
  LOT_SIZE_RANGES,
  MASTER_NORMAL_TABLE,
  MASTER_TIGHTENED_TABLE,
  MASTER_REDUCED_TABLE,
  STANDARD_AQL_LEVELS,
  CODE_LETTER_SAMPLE_SIZES,
} from '../data/aqlData';
import { exportMasterAqlTableCSV } from '../utils/exportUtils';
import { Download, Info, Check, ArrowDown, ArrowUp } from 'lucide-react';

interface AqlTableMatrixProps {
  currentLotSize: number;
  currentCodeLetter: CodeLetter;
  currentLevel: InspectionLevel;
  currentStrictness: InspectionStrictness;
  criticalAql: number;
  majorAql: number;
  minorAql: number;
  onSelectCodeLetter?: (code: CodeLetter) => void;
}

export const AqlTableMatrix: React.FC<AqlTableMatrixProps> = ({
  currentLotSize,
  currentCodeLetter,
  currentLevel,
  currentStrictness,
  criticalAql,
  majorAql,
  minorAql,
  onSelectCodeLetter,
}) => {
  const [activeTableTab, setActiveTableTab] = useState<'codeLetters' | 'normal' | 'tightened' | 'reduced' | 'double'>(
    'normal'
  );
  const [hoveredCell, setHoveredCell] = useState<{
    code: CodeLetter;
    size: number;
    aql: string;
    ac: number;
    re: number;
    arrow?: string;
  } | null>(null);

  const getTableData = () => {
    switch (activeTableTab) {
      case 'tightened':
        return MASTER_TIGHTENED_TABLE;
      case 'reduced':
        return MASTER_REDUCED_TABLE;
      case 'normal':
      default:
        return MASTER_NORMAL_TABLE;
    }
  };

  const tableData = getTableData();

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>ANSI/ASQ Z1.4-2008</span>
              <span aria-hidden="true">·</span>
              <span>ISO 2859-1:1999</span>
              <span aria-hidden="true">·</span>
              <span>Sampling Procedures for Inspection by Attributes</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Standard AQL Sampling Inspection Tables
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              The official attribute sampling reference tables. The highlighted row indicates your current configuration (
              <span className="font-semibold text-sky-700 dark:text-sky-400">Lot: {currentLotSize.toLocaleString()} units</span> ·{' '}
              <span className="font-semibold text-sky-700 dark:text-sky-400">Code: {currentCodeLetter}</span> ·{' '}
              <span className="font-semibold text-sky-700 dark:text-sky-400">Sample: {CODE_LETTER_SAMPLE_SIZES[currentCodeLetter]}</span>).
            </p>
          </div>

          <button
            onClick={exportMasterAqlTableCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 transition-colors self-start md:self-auto shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Table (CSV)</span>
          </button>
        </div>

        {/* Sub-tabs selector */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'codeLetters', label: 'Table 1: Code Letters' },
            { id: 'normal', label: 'Table 2-A: Single Normal (Standard)' },
            { id: 'tightened', label: 'Table 2-B: Tightened' },
            { id: 'reduced', label: 'Table 2-C: Reduced' },
            { id: 'double', label: 'Table 3: Double Sampling' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTableTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeTableTab === tab.id
                  ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE 1: SAMPLE SIZE CODE LETTERS */}
      {activeTableTab === 'codeLetters' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Table 1: Sample Size Code Letters (ANSI/ASQ Z1.4 / ISO 2859-1)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Determines the sample size code letter from the lot or batch size and inspection level.
              </p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Active Level: <strong className="text-sky-700 dark:text-sky-400">{currentLevel}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  <th rowSpan={2} className="py-2.5 px-4 border-r border-slate-200 dark:border-slate-700">
                    Lot / Batch Size Range
                  </th>
                  <th colSpan={4} className="py-1.5 px-2 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-200/60 dark:bg-slate-700/60">
                    Special Inspection Levels
                  </th>
                  <th colSpan={3} className="py-1.5 px-2 text-center bg-slate-200/90 dark:bg-slate-700/90">
                    General Inspection Levels
                  </th>
                </tr>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  <th className={`py-1.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 ${currentLevel === 'S-1' ? 'bg-sky-100 dark:bg-sky-900/60 font-bold text-sky-900 dark:text-sky-200' : ''}`}>S-1</th>
                  <th className={`py-1.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 ${currentLevel === 'S-2' ? 'bg-sky-100 dark:bg-sky-900/60 font-bold text-sky-900 dark:text-sky-200' : ''}`}>S-2</th>
                  <th className={`py-1.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 ${currentLevel === 'S-3' ? 'bg-sky-100 dark:bg-sky-900/60 font-bold text-sky-900 dark:text-sky-200' : ''}`}>S-3</th>
                  <th className={`py-1.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 ${currentLevel === 'S-4' ? 'bg-sky-100 dark:bg-sky-900/60 font-bold text-sky-900 dark:text-sky-200' : ''}`}>S-4</th>
                  <th className={`py-1.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 ${currentLevel === 'GI' ? 'bg-sky-100 dark:bg-sky-900/60 font-bold text-sky-900 dark:text-sky-200' : ''}`}>Level I</th>
                  <th className={`py-1.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 ${currentLevel === 'GII' ? 'bg-sky-100 dark:bg-sky-900/60 font-bold text-sky-900 dark:text-sky-200' : ''}`}>Level II (Default)</th>
                  <th className={`py-1.5 px-3 text-center ${currentLevel === 'GIII' ? 'bg-sky-100 dark:bg-sky-900/60 font-bold text-sky-900 dark:text-sky-200' : ''}`}>Level III</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {LOT_SIZE_RANGES.map((row) => {
                  const isCurrentRange =
                    (row.max === null && currentLotSize >= row.min) ||
                    (row.max !== null && currentLotSize >= row.min && currentLotSize <= row.max);

                  return (
                    <tr
                      key={row.label}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrentRange ? 'bg-sky-50/70 dark:bg-sky-950/50 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 font-sans text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span>{row.label}</span>
                        {isCurrentRange && (
                          <span className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold uppercase px-1.5 py-0.5 bg-sky-100 dark:bg-sky-900/80 rounded">
                            Active Lot
                          </span>
                        )}
                      </td>
                      <td className={`py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 ${currentLevel === 'S-1' && isCurrentRange ? 'bg-sky-200/70 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {row.levels['S-1']}
                      </td>
                      <td className={`py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 ${currentLevel === 'S-2' && isCurrentRange ? 'bg-sky-200/70 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {row.levels['S-2']}
                      </td>
                      <td className={`py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 ${currentLevel === 'S-3' && isCurrentRange ? 'bg-sky-200/70 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {row.levels['S-3']}
                      </td>
                      <td className={`py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 ${currentLevel === 'S-4' && isCurrentRange ? 'bg-sky-200/70 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {row.levels['S-4']}
                      </td>
                      <td className={`py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 ${currentLevel === 'GI' && isCurrentRange ? 'bg-sky-200/70 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {row.levels.GI}
                      </td>
                      <td className={`py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 ${currentLevel === 'GII' && isCurrentRange ? 'bg-sky-200/70 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {row.levels.GII}
                      </td>
                      <td className={`py-2.5 px-3 text-center ${currentLevel === 'GIII' && isCurrentRange ? 'bg-sky-200/70 dark:bg-sky-800/60 text-sky-900 dark:text-sky-100 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {row.levels.GIII}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLE 2-A / 2-B / 2-C: MASTER SINGLE SAMPLING PLANS */}
      {(activeTableTab === 'normal' || activeTableTab === 'tightened' || activeTableTab === 'reduced') && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeTableTab === 'normal' && 'Table 2-A: Single Sampling Plans for Normal Inspection (Master Table)'}
                {activeTableTab === 'tightened' && 'Table 2-B: Single Sampling Plans for Tightened Inspection'}
                {activeTableTab === 'reduced' && 'Table 2-C: Single Sampling Plans for Reduced Inspection'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Each cell displays: <span className="font-semibold text-slate-700 dark:text-slate-300">Ac</span> (Acceptance Number) /{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">Re</span> (Rejection Number).
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ArrowDown className="w-3 h-3 text-sky-600 dark:text-sky-400" /> Use plan below
              </span>
              <span className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Use plan above
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 text-left bg-slate-100 dark:bg-slate-800 sticky left-0 z-20">
                    Code
                  </th>
                  <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 text-right bg-slate-100 dark:bg-slate-800 sticky left-14 z-20">
                    Sample ($n$)
                  </th>
                  <th colSpan={STANDARD_AQL_LEVELS.length} className="py-1 px-2 border-b border-slate-200 dark:border-slate-700 bg-slate-200/80 dark:bg-slate-700/80">
                    Acceptable Quality Limit (AQL)
                  </th>
                </tr>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono">
                  {STANDARD_AQL_LEVELS.map((aql) => {
                    const isMajor = parseFloat(aql) === majorAql;
                    const isMinor = parseFloat(aql) === minorAql;
                    return (
                      <th
                        key={aql}
                        className={`py-1.5 px-2.5 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap ${
                          isMajor
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold'
                            : isMinor
                            ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200 font-bold'
                            : ''
                        }`}
                      >
                        {aql}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {tableData.map((row) => {
                  const isCurrentRow = row.codeLetter === currentCodeLetter;

                  return (
                    <tr
                      key={row.codeLetter}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrentRow ? 'bg-sky-50/60 dark:bg-sky-950/50 font-semibold' : ''
                      }`}
                    >
                      <td
                        className={`py-2 px-3 text-left font-bold border-r border-slate-200 dark:border-slate-700 sticky left-0 z-10 ${
                          isCurrentRow ? 'bg-sky-100 dark:bg-sky-900/80 text-sky-900 dark:text-sky-100' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {row.codeLetter}
                      </td>
                      <td
                        className={`py-2 px-3 text-right tabular-nums border-r border-slate-200 dark:border-slate-700 sticky left-14 z-10 ${
                          isCurrentRow ? 'bg-sky-100 dark:bg-sky-900/80 text-sky-900 dark:text-sky-100 font-bold' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {row.sampleSize}
                      </td>

                      {STANDARD_AQL_LEVELS.map((aql) => {
                        const plan = row.plans[aql];
                        const isMajor = parseFloat(aql) === majorAql;
                        const isMinor = parseFloat(aql) === minorAql;
                        const isTargetCell = isCurrentRow && (isMajor || isMinor);

                        if (!plan) {
                          return (
                            <td key={aql} className="py-2 px-2 text-slate-300 border-r border-slate-200">
                              -
                            </td>
                          );
                        }

                        if (plan.arrow === 'down') {
                          return (
                            <td
                              key={aql}
                              className={`py-2 px-2 border-r border-slate-200 text-sky-700 font-bold text-center ${
                                isTargetCell ? 'bg-sky-200 ring-2 ring-sky-500' : ''
                              }`}
                              title={`Use first plan below arrow: Code ${plan.pointerTarget}`}
                            >
                              <span className="inline-flex items-center gap-0.5 text-[11px]">
                                ↓ <span className="text-[10px] text-slate-500 font-normal">{plan.pointerTarget}</span>
                              </span>
                            </td>
                          );
                        }

                        if (plan.arrow === 'up') {
                          return (
                            <td
                              key={aql}
                              className={`py-2 px-2 border-r border-slate-200 text-amber-700 font-bold text-center ${
                                isTargetCell ? 'bg-amber-200 ring-2 ring-amber-500' : ''
                              }`}
                              title={`Use first plan above arrow: Code ${plan.pointerTarget}`}
                            >
                              <span className="inline-flex items-center gap-0.5 text-[11px]">
                                ↑ <span className="text-[10px] text-slate-500 font-normal">{plan.pointerTarget}</span>
                              </span>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={aql}
                            className={`py-2 px-2.5 border-r border-slate-200 tabular-nums ${
                              isTargetCell
                                ? isMajor
                                  ? 'bg-amber-200 text-amber-950 font-bold ring-2 ring-amber-500'
                                  : 'bg-sky-200 text-sky-950 font-bold ring-2 ring-sky-500'
                                : isMajor
                                ? 'bg-amber-50/60'
                                : isMinor
                                ? 'bg-sky-50/60'
                                : 'text-slate-800'
                            }`}
                            onMouseEnter={() =>
                              setHoveredCell({
                                code: row.codeLetter,
                                size: row.sampleSize,
                                aql,
                                ac: plan.ac,
                                re: plan.re,
                              })
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <span className="font-semibold">{plan.ac}</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-slate-600">{plan.re}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Guidance */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white">Rule of Arrows:</strong> When an arrow (↓ or ↑) is encountered, use the first sampling plan in
              the direction pointed. The sample size to be used is given by that plan.
            </div>
            {hoveredCell && (
              <div className="font-mono text-xs bg-white dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-slate-200">
                Code {hoveredCell.code} (n={hoveredCell.size}) @ AQL {hoveredCell.aql}:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">Ac={hoveredCell.ac}</strong>, <strong className="text-rose-600 dark:text-rose-400">Re={hoveredCell.re}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TABLE 3: DOUBLE SAMPLING PLAN GUIDE */}
      {activeTableTab === 'double' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 transition-colors">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Double Sampling Plans (ANSI/ASQ Z1.4 Table III-A)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Double sampling allows a lot to be accepted on a smaller first sample if defect count is very low, or
              definitely rejected if defect count is very high. If the count falls in between, a second sample of equal
              size is drawn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/80">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Stage 1: Sample 1</div>
              <div className="text-sm font-semibold text-emerald-950 dark:text-emerald-200 mt-1">Accept immediately</div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2">
                If defects found in first sample are less than or equal to Ac1, accept the entire lot immediately. No second sample
                needed.
              </p>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-800/80">
              <div className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">Stage 1: Sample 1</div>
              <div className="text-sm font-semibold text-rose-950 dark:text-rose-200 mt-1">Reject immediately</div>
              <p className="text-xs text-rose-700 dark:text-rose-400 mt-2">
                If defects found in first sample are greater than or equal to Re1, reject the lot immediately without drawing more
                units.
              </p>
            </div>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-lg border border-sky-200 dark:border-sky-800/80">
              <div className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">Stage 2: Sample 2</div>
              <div className="text-sm font-semibold text-sky-950 dark:text-sky-200 mt-1">Conditional Draw</div>
              <p className="text-xs text-sky-700 dark:text-sky-400 mt-2">
                If defects fall between Ac1 and Re1, inspect Sample 2. Accept if cumulative defects from both samples
                are less than or equal to Ac2; otherwise reject.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
