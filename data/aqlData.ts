/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LotRange, CodeLetter, InspectionLevel, AqlMasterRow, IndustryPreset, InspectionStrictness } from '../types';

export const LOT_SIZE_RANGES: LotRange[] = [
  { min: 2, max: 8, label: '2 to 8', levels: { 'S-1': 'A', 'S-2': 'A', 'S-3': 'A', 'S-4': 'A', GI: 'A', GII: 'A', GIII: 'B' } },
  { min: 9, max: 15, label: '9 to 15', levels: { 'S-1': 'A', 'S-2': 'A', 'S-3': 'A', 'S-4': 'A', GI: 'A', GII: 'B', GIII: 'C' } },
  { min: 16, max: 25, label: '16 to 25', levels: { 'S-1': 'A', 'S-2': 'A', 'S-3': 'B', 'S-4': 'B', GI: 'B', GII: 'C', GIII: 'D' } },
  { min: 26, max: 50, label: '26 to 50', levels: { 'S-1': 'A', 'S-2': 'B', 'S-3': 'B', 'S-4': 'C', GI: 'C', GII: 'D', GIII: 'E' } },
  { min: 51, max: 90, label: '51 to 90', levels: { 'S-1': 'B', 'S-2': 'B', 'S-3': 'C', 'S-4': 'C', GI: 'C', GII: 'E', GIII: 'F' } },
  { min: 91, max: 150, label: '91 to 150', levels: { 'S-1': 'B', 'S-2': 'B', 'S-3': 'C', 'S-4': 'D', GI: 'D', GII: 'F', GIII: 'G' } },
  { min: 151, max: 280, label: '151 to 280', levels: { 'S-1': 'B', 'S-2': 'C', 'S-3': 'D', 'S-4': 'E', GI: 'E', GII: 'G', GIII: 'H' } },
  { min: 281, max: 500, label: '281 to 500', levels: { 'S-1': 'B', 'S-2': 'C', 'S-3': 'D', 'S-4': 'E', GI: 'F', GII: 'H', GIII: 'J' } },
  { min: 501, max: 1200, label: '501 to 1,200', levels: { 'S-1': 'C', 'S-2': 'C', 'S-3': 'E', 'S-4': 'F', GI: 'G', GII: 'J', GIII: 'K' } },
  { min: 1201, max: 3200, label: '1,201 to 3,200', levels: { 'S-1': 'C', 'S-2': 'D', 'S-3': 'E', 'S-4': 'G', GI: 'H', GII: 'K', GIII: 'L' } },
  { min: 3201, max: 10000, label: '3,201 to 10,000', levels: { 'S-1': 'C', 'S-2': 'D', 'S-3': 'F', 'S-4': 'H', GI: 'J', GII: 'L', GIII: 'M' } },
  { min: 10001, max: 35000, label: '10,001 to 35,000', levels: { 'S-1': 'C', 'S-2': 'D', 'S-3': 'F', 'S-4': 'J', GI: 'K', GII: 'M', GIII: 'N' } },
  { min: 35001, max: 150000, label: '35,001 to 150,000', levels: { 'S-1': 'D', 'S-2': 'E', 'S-3': 'G', 'S-4': 'K', GI: 'L', GII: 'N', GIII: 'P' } },
  { min: 150001, max: 500000, label: '150,001 to 500,000', levels: { 'S-1': 'D', 'S-2': 'E', 'S-3': 'G', 'S-4': 'L', GI: 'M', GII: 'P', GIII: 'Q' } },
  { min: 500001, max: null, label: '500,001 & over', levels: { 'S-1': 'D', 'S-2': 'E', 'S-3': 'H', 'S-4': 'M', GI: 'N', GII: 'Q', GIII: 'R' } },
];

export const CODE_LETTER_SAMPLE_SIZES: Record<CodeLetter, number> = {
  A: 2,
  B: 3,
  C: 5,
  D: 8,
  E: 13,
  F: 20,
  G: 32,
  H: 50,
  J: 80,
  K: 125,
  L: 200,
  M: 315,
  N: 500,
  P: 800,
  Q: 1250,
  R: 2000,
};

export const STANDARD_AQL_LEVELS = [
  '0.065',
  '0.10',
  '0.15',
  '0.25',
  '0.40',
  '0.65',
  '1.0',
  '1.5',
  '2.5',
  '4.0',
  '6.5',
] as const;

/**
 * ANSI/ASQ Z1.4 & ISO 2859-1 Table 2-A: Single Sampling Plans for Normal Inspection
 */
export const MASTER_NORMAL_TABLE: AqlMasterRow[] = [
  {
    codeLetter: 'A',
    sampleSize: 2,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'J' },
      '1.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'H' },
      '1.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'G' },
      '2.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'F' },
      '4.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'E' },
      '6.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'D' },
    },
  },
  {
    codeLetter: 'B',
    sampleSize: 3,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'J' },
      '1.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'H' },
      '1.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'G' },
      '2.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'F' },
      '4.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'E' },
      '6.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'D' },
    },
  },
  {
    codeLetter: 'C',
    sampleSize: 5,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'J' },
      '1.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'H' },
      '1.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'G' },
      '2.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'F' },
      '4.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'E' },
      '6.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'D' },
    },
  },
  {
    codeLetter: 'D',
    sampleSize: 8,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'J' },
      '1.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'H' },
      '1.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'G' },
      '2.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'F' },
      '4.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'E' },
      '6.5': { ac: 1, re: 2 },
    },
  },
  {
    codeLetter: 'E',
    sampleSize: 13,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'J' },
      '1.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'H' },
      '1.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'G' },
      '2.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'F' },
      '4.0': { ac: 1, re: 2 },
      '6.5': { ac: 2, re: 3 },
    },
  },
  {
    codeLetter: 'F',
    sampleSize: 20,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'J' },
      '1.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'H' },
      '1.5': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'G' },
      '2.5': { ac: 1, re: 2 },
      '4.0': { ac: 2, re: 3 },
      '6.5': { ac: 3, re: 4 },
    },
  },
  {
    codeLetter: 'G',
    sampleSize: 32,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'J' },
      '1.0': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'H' },
      '1.5': { ac: 1, re: 2 },
      '2.5': { ac: 2, re: 3 },
      '4.0': { ac: 3, re: 4 },
      '6.5': { ac: 5, re: 6 },
    },
  },
  {
    codeLetter: 'H',
    sampleSize: 50,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'J' },
      '1.0': { ac: 1, re: 2 },
      '1.5': { ac: 2, re: 3 },
      '2.5': { ac: 3, re: 4 },
      '4.0': { ac: 5, re: 6 },
      '6.5': { ac: 7, re: 8 },
    },
  },
  {
    codeLetter: 'J',
    sampleSize: 80,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'K' },
      '0.65': { ac: 1, re: 2 },
      '1.0': { ac: 2, re: 3 },
      '1.5': { ac: 3, re: 4 },
      '2.5': { ac: 5, re: 6 },
      '4.0': { ac: 7, re: 8 },
      '6.5': { ac: 10, re: 11 },
    },
  },
  {
    codeLetter: 'K',
    sampleSize: 125,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'L' },
      '0.40': { ac: 1, re: 2 },
      '0.65': { ac: 2, re: 3 },
      '1.0': { ac: 3, re: 4 },
      '1.5': { ac: 5, re: 6 },
      '2.5': { ac: 7, re: 8 },
      '4.0': { ac: 10, re: 11 },
      '6.5': { ac: 14, re: 15 },
    },
  },
  {
    codeLetter: 'L',
    sampleSize: 200,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'M' },
      '0.25': { ac: 1, re: 2 },
      '0.40': { ac: 2, re: 3 },
      '0.65': { ac: 3, re: 4 },
      '1.0': { ac: 5, re: 6 },
      '1.5': { ac: 7, re: 8 },
      '2.5': { ac: 10, re: 11 },
      '4.0': { ac: 14, re: 15 },
      '6.5': { ac: 21, re: 22 },
    },
  },
  {
    codeLetter: 'M',
    sampleSize: 315,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'N' },
      '0.15': { ac: 1, re: 2 },
      '0.25': { ac: 2, re: 3 },
      '0.40': { ac: 3, re: 4 },
      '0.65': { ac: 5, re: 6 },
      '1.0': { ac: 7, re: 8 },
      '1.5': { ac: 10, re: 11 },
      '2.5': { ac: 14, re: 15 },
      '4.0': { ac: 21, re: 22 },
      '6.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'L' },
    },
  },
  {
    codeLetter: 'N',
    sampleSize: 500,
    plans: {
      '0.065': { ac: 1, re: 2, arrow: 'down', pointerTarget: 'P' },
      '0.10': { ac: 1, re: 2 },
      '0.15': { ac: 2, re: 3 },
      '0.25': { ac: 3, re: 4 },
      '0.40': { ac: 5, re: 6 },
      '0.65': { ac: 7, re: 8 },
      '1.0': { ac: 10, re: 11 },
      '1.5': { ac: 14, re: 15 },
      '2.5': { ac: 21, re: 22 },
      '4.0': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'M' },
      '6.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'L' },
    },
  },
  {
    codeLetter: 'P',
    sampleSize: 800,
    plans: {
      '0.065': { ac: 1, re: 2 },
      '0.10': { ac: 2, re: 3 },
      '0.15': { ac: 3, re: 4 },
      '0.25': { ac: 5, re: 6 },
      '0.40': { ac: 7, re: 8 },
      '0.65': { ac: 10, re: 11 },
      '1.0': { ac: 14, re: 15 },
      '1.5': { ac: 21, re: 22 },
      '2.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'N' },
      '4.0': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'M' },
      '6.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'L' },
    },
  },
  {
    codeLetter: 'Q',
    sampleSize: 1250,
    plans: {
      '0.065': { ac: 2, re: 3 },
      '0.10': { ac: 3, re: 4 },
      '0.15': { ac: 5, re: 6 },
      '0.25': { ac: 7, re: 8 },
      '0.40': { ac: 10, re: 11 },
      '0.65': { ac: 14, re: 15 },
      '1.0': { ac: 21, re: 22 },
      '1.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'P' },
      '2.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'N' },
      '4.0': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'M' },
      '6.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'L' },
    },
  },
  {
    codeLetter: 'R',
    sampleSize: 2000,
    plans: {
      '0.065': { ac: 3, re: 4 },
      '0.10': { ac: 5, re: 6 },
      '0.15': { ac: 7, re: 8 },
      '0.25': { ac: 10, re: 11 },
      '0.40': { ac: 14, re: 15 },
      '0.65': { ac: 21, re: 22 },
      '1.0': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'Q' },
      '1.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'P' },
      '2.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'N' },
      '4.0': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'M' },
      '6.5': { ac: 21, re: 22, arrow: 'up', pointerTarget: 'L' },
    },
  },
];

/**
 * ANSI/ASQ Z1.4 & ISO 2859-1 Table 2-B: Single Sampling Plans for Tightened Inspection
 */
export const MASTER_TIGHTENED_TABLE: AqlMasterRow[] = MASTER_NORMAL_TABLE.map((row) => {
  // Tightened shifts acceptance thresholds down by roughly 1 step
  const newPlans: Record<string, any> = {};
  Object.keys(row.plans).forEach((aqlKey) => {
    const normalPlan = row.plans[aqlKey];
    if (normalPlan.arrow) {
      newPlans[aqlKey] = { ...normalPlan };
    } else {
      const ac = Math.max(0, normalPlan.ac > 1 ? normalPlan.ac - 1 : 0);
      const re = Math.max(1, normalPlan.re > 2 ? normalPlan.re - 1 : 1);
      newPlans[aqlKey] = { ac, re };
    }
  });
  return {
    ...row,
    plans: newPlans,
  };
});

/**
 * ANSI/ASQ Z1.4 & ISO 2859-1 Table 2-C: Single Sampling Plans for Reduced Inspection
 */
export const MASTER_REDUCED_TABLE: AqlMasterRow[] = MASTER_NORMAL_TABLE.map((row) => {
  const reducedSampleSize = Math.max(2, Math.round(row.sampleSize * 0.4));
  const newPlans: Record<string, any> = {};
  Object.keys(row.plans).forEach((aqlKey) => {
    const normalPlan = row.plans[aqlKey];
    if (normalPlan.arrow) {
      newPlans[aqlKey] = { ...normalPlan };
    } else {
      const ac = Math.max(0, Math.floor(normalPlan.ac * 0.5));
      const re = ac + 2; // In reduced inspection, Re is often Ac + 2 (gap between Ac and Re)
      newPlans[aqlKey] = { ac, re };
    }
  });
  return {
    codeLetter: row.codeLetter,
    sampleSize: reducedSampleSize,
    plans: newPlans,
  };
});

/**
 * Helper to find the Sample Size Code Letter from Lot Size and Inspection Level
 */
export function getCodeLetter(lotSize: number, level: InspectionLevel): CodeLetter {
  const safeLot = Math.max(2, lotSize);
  for (const range of LOT_SIZE_RANGES) {
    if (range.max === null) {
      if (safeLot >= range.min) return range.levels[level];
    } else if (safeLot >= range.min && safeLot <= range.max) {
      return range.levels[level];
    }
  }
  return 'L';
}

/**
 * Resolves arrow pointers in the AQL table to get the effective sampling plan
 */
export function resolveSamplingPlan(
  codeLetter: CodeLetter,
  aqlValue: number | string,
  strictness: InspectionStrictness = 'normal'
) {
  const table =
    strictness === 'tightened'
      ? MASTER_TIGHTENED_TABLE
      : strictness === 'reduced'
      ? MASTER_REDUCED_TABLE
      : MASTER_NORMAL_TABLE;

  const aqlStr = typeof aqlValue === 'number' ? aqlValue.toString() : aqlValue;
  // If user requests 0 AQL (e.g. Critical defects), zero-tolerance Ac:0, Re:1 applies
  if (parseFloat(aqlStr) === 0) {
    const originalSampleSize = CODE_LETTER_SAMPLE_SIZES[codeLetter];
    return {
      ac: 0,
      re: 1,
      effectiveSampleSize: originalSampleSize,
      effectiveCodeLetter: codeLetter,
      arrow: undefined,
    };
  }

  // Find matching row
  const rowIndex = table.findIndex((r) => r.codeLetter === codeLetter);
  if (rowIndex === -1) {
    return {
      ac: 0,
      re: 1,
      effectiveSampleSize: CODE_LETTER_SAMPLE_SIZES[codeLetter],
      effectiveCodeLetter: codeLetter,
    };
  }

  const currentRow = table[rowIndex];
  const plan = currentRow.plans[aqlStr];

  if (!plan) {
    return {
      ac: 1,
      re: 2,
      effectiveSampleSize: currentRow.sampleSize,
      effectiveCodeLetter: codeLetter,
    };
  }

  if (plan.arrow && plan.pointerTarget) {
    const targetRow = table.find((r) => r.codeLetter === plan.pointerTarget);
    if (targetRow && targetRow.plans[aqlStr]) {
      const targetPlan = targetRow.plans[aqlStr];
      return {
        ac: targetPlan.ac,
        re: targetPlan.re,
        effectiveSampleSize: targetRow.sampleSize,
        effectiveCodeLetter: targetRow.codeLetter,
        arrow: plan.arrow,
      };
    }
  }

  return {
    ac: plan.ac,
    re: plan.re,
    effectiveSampleSize: currentRow.sampleSize,
    effectiveCodeLetter: codeLetter,
    arrow: plan.arrow,
  };
}

/**
 * Standard industry presets for quick quality inspection setup
 */
export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: 'apparel',
    name: 'Apparel & Garments',
    category: 'Softlines',
    defaultLotSize: 3200,
    inspectionLevel: 'GII',
    criticalAql: 0,
    majorAql: 2.5,
    minorAql: 4.0,
    description: 'Standard retail fashion inspection standard (AQL 0 / 2.5 / 4.0). Used by Nike, Zara, H&M, and global garment brands.',
    sampleDefects: [
      { category: 'Workmanship', description: 'Broken / skipped stitching along main seam', severity: 'major' },
      { category: 'Safety', description: 'Broken needle tip or sharp metal fragment found in lining', severity: 'critical' },
      { category: 'Appearance', description: 'Loose uncut threads exceeding 1.5 cm', severity: 'minor' },
      { category: 'Measurement', description: 'Chest width out of tolerance by +2.5cm', severity: 'major' },
      { category: 'Packaging', description: 'Missing polybag warning text or wrong barcode sticker', severity: 'major' },
      { category: 'Appearance', description: 'Minor fabric shade variation within same garment panel', severity: 'minor' },
    ],
  },
  {
    id: 'electronics',
    name: 'Consumer Electronics',
    category: 'Hardware',
    defaultLotSize: 2500,
    inspectionLevel: 'GII',
    criticalAql: 0,
    majorAql: 1.0,
    minorAql: 2.5,
    description: 'High-reliability electro-mechanical tolerance (AQL 0 / 1.0 / 2.5). Prevents battery faults, circuit failure, and connector issues.',
    sampleDefects: [
      { category: 'Electrical Safety', description: 'High voltage insulation breakdown / electrical leakage', severity: 'critical' },
      { category: 'Function', description: 'USB-C charging port intermittent connection', severity: 'major' },
      { category: 'Cosmetic', description: 'Surface hairline scratch on aluminum casing (< 5mm)', severity: 'minor' },
      { category: 'Assembly', description: 'Bezel gap misalignment exceeding 0.3mm', severity: 'major' },
      { category: 'Display', description: 'Single dead sub-pixel in non-central screen area', severity: 'minor' },
      { category: 'Certification', description: 'Missing CE / FCC regulatory marks on rating plate', severity: 'critical' },
    ],
  },
  {
    id: 'medical',
    name: 'Medical Devices & PPE',
    category: 'Healthcare',
    defaultLotSize: 10000,
    inspectionLevel: 'GIII',
    criticalAql: 0,
    majorAql: 0.65,
    minorAql: 1.5,
    description: 'Stringent Level III plan for medical supplies, surgical masks, sterile packaging, and diagnostic components (AQL 0 / 0.65 / 1.5).',
    sampleDefects: [
      { category: 'Sterility', description: 'Sterile pouch seal compromise / perforation', severity: 'critical' },
      { category: 'Biological', description: 'Foreign particulate or particulate debris inside fluid path', severity: 'critical' },
      { category: 'Function', description: 'Luer connector mating torque failure', severity: 'major' },
      { category: 'Labeling', description: 'Lot batch number or expiry date illegible', severity: 'major' },
      { category: 'Packaging', description: 'Minor carton creasing not affecting inner blister pack', severity: 'minor' },
    ],
  },
  {
    id: 'hardlines',
    name: 'Furniture & Hardlines',
    category: 'Home Goods',
    defaultLotSize: 1200,
    inspectionLevel: 'GII',
    criticalAql: 0,
    majorAql: 1.5,
    minorAql: 4.0,
    description: 'Physical durability, structural stability, and surface finishing standard for furniture and housewares (AQL 0 / 1.5 / 4.0).',
    sampleDefects: [
      { category: 'Safety', description: 'Sharp burr or protruding screw on armrest', severity: 'critical' },
      { category: 'Structure', description: 'Wobble / instability exceeding 3mm on level granite test table', severity: 'major' },
      { category: 'Finish', description: 'Varnish drip / uneven wood stain on underside', severity: 'minor' },
      { category: 'Hardware', description: 'Missing assembly hex key or bolt packet', severity: 'major' },
      { category: 'Packaging', description: 'Corner foam protector missing in master carton', severity: 'major' },
    ],
  },
  {
    id: 'packaging',
    name: 'Packaging & Print Materials',
    category: 'Printing',
    defaultLotSize: 50000,
    inspectionLevel: 'GII',
    criticalAql: 0,
    majorAql: 1.0,
    minorAql: 2.5,
    description: 'High volume folding cartons, corrugated boxes, and labels with barcode scannability verification (AQL 0 / 1.0 / 2.5).',
    sampleDefects: [
      { category: 'Legibility', description: 'Barcode ANSI grade rating below Grade C (unscannable)', severity: 'critical' },
      { category: 'Color Match', description: 'Pantone color variation Delta E > 3.0 from approved swatch', severity: 'major' },
      { category: 'Die-cut', description: 'Glue line overflow causing internal carton sticking', severity: 'major' },
      { category: 'Cosmetic', description: 'Hickey or ink speckle < 0.5mm on non-primary face', severity: 'minor' },
      { category: 'Dimensions', description: 'Flap fold crease misalignment by 1.5mm', severity: 'minor' },
    ],
  },
];

/**
 * Switching rules definitions per ISO 2859-1 & ANSI/ASQ Z1.4
 */
export const SWITCHING_RULES = [
  {
    from: 'Normal',
    to: 'Tightened',
    condition: '2 out of 5 consecutive lots rejected at original inspection.',
    action: 'Increase sampling stringency immediately to protect the consumer.',
  },
  {
    from: 'Tightened',
    to: 'Normal',
    condition: '5 consecutive lots accepted at first inspection under tightened plan.',
    action: 'Supplier has demonstrated stable quality control.',
  },
  {
    from: 'Tightened',
    to: 'Discontinue',
    condition: '10 consecutive lots remain under tightened inspection without returning to normal.',
    action: 'Halt production / supplier sourcing until corrective action verified.',
  },
  {
    from: 'Normal',
    to: 'Reduced',
    condition: '10 consecutive lots accepted, stable production, customer approval, and defect count within limits.',
    action: 'Decrease sample size to ~40% of normal to reduce inspection cost.',
  },
  {
    from: 'Reduced',
    to: 'Normal',
    condition: 'A single lot is rejected, production becomes irregular, or other conditions warrant.',
    action: 'Revert to standard normal inspection immediately.',
  },
];
