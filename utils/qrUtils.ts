/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalculationResult, DefectItem, InspectionMetadata } from '../types';

export function getDefectTally(defects: DefectItem[]) {
  const critical = defects.filter((d) => d.severity === 'critical').reduce((s, d) => s + d.count, 0);
  const major = defects.filter((d) => d.severity === 'major').reduce((s, d) => s + d.count, 0);
  const minor = defects.filter((d) => d.severity === 'minor').reduce((s, d) => s + d.count, 0);
  return { critical, major, minor, total: critical + major + minor };
}

export function generateQrVerificationUrl(
  metadata: InspectionMetadata,
  calculationResult: CalculationResult,
  defects: DefectItem[],
  verdict: 'ACCEPTED' | 'REJECTED' | 'PENDING'
): string {
  const tally = getDefectTally(defects);
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://aql-matrix.audit';

  const params = new URLSearchParams({
    po: metadata.poNumber || 'N/A',
    sku: metadata.styleNumber || 'N/A',
    verdict,
    lot: calculationResult.lotSize.toString(),
    sample: calculationResult.sampleSize.toString(),
    code: calculationResult.codeLetter,
    date: metadata.inspectionDate,
    auditor: metadata.inspectorName || 'Lead Auditor',
    crit: tally.critical.toString(),
    maj: tally.major.toString(),
    min: tally.minor.toString(),
    supplier: metadata.supplier || 'N/A',
  });

  return `${baseUrl}?${params.toString()}#verified`;
}

export function generateQrJsonSummary(
  metadata: InspectionMetadata,
  calculationResult: CalculationResult,
  defects: DefectItem[],
  verdict: 'ACCEPTED' | 'REJECTED' | 'PENDING'
): string {
  const tally = getDefectTally(defects);
  return JSON.stringify(
    {
      auditTitle: 'AQL Quality Inspection Audit Certificate',
      standard: 'ANSI/ASQ Z1.4 / ISO 2859-1 (MIL-STD-105E)',
      poNumber: metadata.poNumber || 'N/A',
      productName: metadata.productName || 'N/A',
      styleNumber: metadata.styleNumber || 'N/A',
      supplier: metadata.supplier || 'N/A',
      factoryLocation: metadata.factoryLocation || 'N/A',
      inspector: metadata.inspectorName || 'Lead Auditor',
      inspectionDate: metadata.inspectionDate,
      verdict,
      samplingPlan: {
        lotSize: calculationResult.lotSize,
        sampleSize: calculationResult.sampleSize,
        codeLetter: calculationResult.codeLetter,
        inspectionLevel: calculationResult.inspectionLevel,
        strictness: calculationResult.strictness,
        limits: {
          criticalAql: calculationResult.critical.aql,
          criticalAc: calculationResult.critical.ac,
          criticalRe: calculationResult.critical.re,
          majorAql: calculationResult.major.aql,
          majorAc: calculationResult.major.ac,
          majorRe: calculationResult.major.re,
          minorAql: calculationResult.minor.aql,
          minorAc: calculationResult.minor.ac,
          minorRe: calculationResult.minor.re,
        },
      },
      defectFindings: {
        criticalCount: tally.critical,
        majorCount: tally.major,
        minorCount: tally.minor,
        totalDefects: tally.total,
      },
      verifiedAt: new Date().toISOString(),
    },
    null,
    2
  );
}
