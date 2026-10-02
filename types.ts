/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InspectionLevel = 'S-1' | 'S-2' | 'S-3' | 'S-4' | 'GI' | 'GII' | 'GIII';

export type InspectionStrictness = 'normal' | 'tightened' | 'reduced';

export type CodeLetter = 
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' 
  | 'H' | 'J' | 'K' | 'L' | 'M' | 'N' | 'P' | 'Q' | 'R';

export type DefectSeverity = 'critical' | 'major' | 'minor';

export interface LotRange {
  min: number;
  max: number | null; // null represents "and over"
  label: string;
  levels: Record<InspectionLevel, CodeLetter>;
}

export interface SamplingCell {
  ac: number;
  re: number;
  arrow?: 'up' | 'down';
  pointerTarget?: CodeLetter;
}

export interface AqlMasterRow {
  codeLetter: CodeLetter;
  sampleSize: number;
  // AQL values mapping: '0.065' | '0.10' | '0.15' | '0.25' | '0.40' | '0.65' | '1.0' | '1.5' | '2.5' | '4.0' | '6.5'
  plans: Record<string, SamplingCell>;
}

export interface CalculationResult {
  lotSize: number;
  inspectionLevel: InspectionLevel;
  strictness: InspectionStrictness;
  codeLetter: CodeLetter;
  sampleSize: number;
  percentageOfLot: number;
  critical: {
    aql: number;
    ac: number;
    re: number;
    effectiveSampleSize: number;
    effectiveCodeLetter: CodeLetter;
    arrow?: 'up' | 'down';
  };
  major: {
    aql: number;
    ac: number;
    re: number;
    effectiveSampleSize: number;
    effectiveCodeLetter: CodeLetter;
    arrow?: 'up' | 'down';
  };
  minor: {
    aql: number;
    ac: number;
    re: number;
    effectiveSampleSize: number;
    effectiveCodeLetter: CodeLetter;
    arrow?: 'up' | 'down';
  };
}

export interface DefectItem {
  id: string;
  category: string;
  description: string;
  severity: DefectSeverity;
  count: number;
  foundInSample?: number;
  photoUrl?: string; // Captured photo from browser MediaDevices camera or upload
}

export interface IndustryPreset {
  id: string;
  name: string;
  category: string;
  defaultLotSize: number;
  inspectionLevel: InspectionLevel;
  criticalAql: number;
  majorAql: number;
  minorAql: number;
  description: string;
  sampleDefects: Omit<DefectItem, 'id' | 'count'>[];
}

export interface InspectionMetadata {
  poNumber: string;
  styleNumber: string;
  productName: string;
  supplier: string;
  factoryLocation: string;
  inspectorName: string;
  inspectionDate: string;
  inspectionStage: 'Pre-Production (PPI)' | 'During Production (DUPRO)' | 'Final Random Inspection (FRI)';
  notes: string;
}
