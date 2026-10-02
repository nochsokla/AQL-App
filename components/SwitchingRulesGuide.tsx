/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  AlertOctagon,
  Scale,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { SWITCHING_RULES } from '../data/aqlData';

export const SwitchingRulesGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Overview Intro */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Quality Engineering Reference</span>
          <span aria-hidden="true">·</span>
          <span>ISO 2859-1 Clause 9</span>
          <span aria-hidden="true">·</span>
          <span>ANSI/ASQ Z1.4 Section 9</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          AQL Standards, Switching Rules & Defect Taxonomy
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Acceptance Quality Limit (AQL) is the worst tolerable process average percentage of defective units in a
          continual series of lots. Follow dynamic switching rules to balance inspection costs with consumer protection.
        </p>
      </div>

      {/* Switching Rules State Machine Flowchart */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 transition-colors">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. The ISO 2859-1 Switching System (State Machine)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical sampling plans must transition dynamically based on supplier quality history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Normal */}
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-lg border border-sky-200 dark:border-sky-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900 dark:text-sky-300 text-sm">Normal Inspection</span>
                <span className="text-[10px] bg-sky-200 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-1.5 py-0.5 rounded font-mono">Default</span>
              </div>
              <p className="text-sky-800 dark:text-sky-300/90 mt-2 leading-relaxed">
                Starting point for all new suppliers and lots. Protects producer against rejection of acceptable lots
                while screening non-conforming quality.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sky-200 dark:border-sky-800/80 text-[11px] text-sky-700 dark:text-sky-300">
              <strong>Switch to Tightened:</strong> If 2 of 5 consecutive lots are rejected.
            </div>
          </div>

          {/* Tightened */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 dark:text-amber-300 text-sm">Tightened Inspection</span>
                <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded font-mono">Alert</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300/90 mt-2 leading-relaxed">
                Enforces lower acceptance thresholds (Ac is reduced) without increasing sample size, sharply increasing
                the probability of lot rejection.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-700 dark:text-amber-300">
              <strong>Return to Normal:</strong> When 5 consecutive lots are accepted on first pass.
            </div>
          </div>

          {/* Reduced */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Reduced Inspection</span>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-mono">Cost Saver</span>
              </div>
              <p className="text-emerald-800 dark:text-emerald-300/90 mt-2 leading-relaxed">
                Reduces sample size to ~40% of normal. Allowed only when supplier demonstrates sustained high quality
                over time.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800/80 text-[11px] text-emerald-700 dark:text-emerald-300">
              <strong>Revert to Normal:</strong> Instantly if even 1 lot fails or production becomes erratic.
            </div>
          </div>

          {/* Discontinuation */}
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 dark:text-rose-300 text-sm">Discontinue Inspection</span>
                <span className="text-[10px] bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-1.5 py-0.5 rounded font-mono">Stop Ship</span>
              </div>
              <p className="text-rose-800 dark:text-rose-300/90 mt-2 leading-relaxed">
                If 10 consecutive lots remain under tightened inspection without qualifying for normal, all shipments
                must be suspended.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200 dark:border-rose-800/80 text-[11px] text-rose-700 dark:text-rose-300">
              <strong>Action:</strong> Factory audit & root cause corrective action required before resuming.
            </div>
          </div>
        </div>

        {/* Tabular summary of switching rules */}
        <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-800 mt-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Current State</th>
                <th className="py-2.5 px-3">Target State</th>
                <th className="py-2.5 px-3">Trigger Condition</th>
                <th className="py-2.5 px-3">Operational Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SWITCHING_RULES.map((rule, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{rule.from}</td>
                  <td className="py-2.5 px-3 font-semibold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span>{rule.to}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{rule.condition}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{rule.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Defect Classification Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 transition-colors">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Defect Severity Classification (Critical, Major, Minor)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Defects found during inspection must be classified by consumer impact and safety hazard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Critical */}
          <div className="border border-rose-200 dark:border-rose-900/60 rounded-lg p-5 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span>
              <span className="text-sm font-bold text-rose-950 dark:text-rose-200">Critical Defects (AQL 0.0)</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Any condition that is hazardous, dangerous, or causes product recall or legal non-compliance.
            </p>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-rose-200 dark:border-rose-900/60 space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="font-semibold text-rose-900 dark:text-rose-300 text-[11px] uppercase tracking-wider">Common Examples:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Broken needle / sharp metal wire in garments</li>
                <li>Electrical shock hazard or missing earth ground</li>
                <li>Missing mandated choking hazard warning label</li>
                <li>Sterile barrier compromise in medical devices</li>
              </ul>
            </div>
            <div className="text-[11px] font-semibold text-rose-800 dark:text-rose-400">
              Tolerance: <strong>Ac = 0 (Zero Tolerance)</strong>
            </div>
          </div>

          {/* Major */}
          <div className="border border-amber-200 dark:border-amber-900/60 rounded-lg p-5 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span>
              <span className="text-sm font-bold text-amber-950 dark:text-amber-200">Major Defects (AQL 1.0 – 2.5)</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Defects likely to result in product return, functional failure, or rendering the product unsaleable.
            </p>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-amber-200 dark:border-amber-900/60 space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="font-semibold text-amber-900 dark:text-amber-300 text-[11px] uppercase tracking-wider">Common Examples:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Key functionality inoperable (won't turn on, stuck zipper)</li>
                <li>Dimensions out of tolerance (garment chest off by 3cm)</li>
                <li>Severe open seam or structural wobbling</li>
                <li>Incorrect barcode printed (unscannable SKU)</li>
              </ul>
            </div>
            <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-400">
              Standard Benchmark: <strong>AQL 2.5 (or 1.0 for electronics)</strong>
            </div>
          </div>

          {/* Minor */}
          <div className="border border-sky-200 dark:border-sky-900/60 rounded-lg p-5 bg-sky-50/30 dark:bg-sky-950/20 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-600"></span>
              <span className="text-sm font-bold text-sky-950 dark:text-sky-200">Minor Defects (AQL 2.5 – 4.0)</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              A departure from standard workmanship that does not impair the usability or function of the item.
            </p>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-sky-200 dark:border-sky-900/60 space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="font-semibold text-sky-900 dark:text-sky-300 text-[11px] uppercase tracking-wider">Common Examples:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Uncut loose thread ends on non-critical seam</li>
                <li>Minor hairline surface scratch on back panel</li>
                <li>Slight carton print ink smudge or creased outer box</li>
                <li>Slight color tone variation inside allowable Delta E</li>
              </ul>
            </div>
            <div className="text-[11px] font-semibold text-sky-800 dark:text-sky-400">
              Standard Benchmark: <strong>AQL 4.0 (Consumer goods)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: How to Interpret Arrows and Sample Sizes */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          3. Understanding the Arrow Rules (↓ and ↑)
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          In ANSI/ASQ Z1.4 tables, you will frequently see downwards arrows (<strong>↓</strong>) or upwards arrows (<strong>↑</strong>):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Downwards Arrow (↓)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Indicates that the combination of small sample size and strict AQL cannot provide statistical confidence.
              You must follow the arrow <strong>down</strong> to the first plan with an Ac/Re number, and{' '}
              <strong>adopt that plan's sample size</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Upwards Arrow (↑)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Indicates that inspecting a huge sample size for a loose AQL is redundant. Follow the arrow{' '}
              <strong>up</strong> to the first valid plan above, using that plan's sample size and Ac/Re limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
