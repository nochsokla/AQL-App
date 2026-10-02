/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalculationResult, DefectItem, InspectionMetadata } from '../types';
import { MASTER_NORMAL_TABLE, STANDARD_AQL_LEVELS } from '../data/aqlData';

/**
 * Generates and downloads a CSV inspection sheet template
 */
export function exportInspectionTemplateCSV(
  meta: InspectionMetadata,
  calc: CalculationResult,
  defects: DefectItem[],
  verdict: 'ACCEPTED' | 'REJECTED' | 'PENDING',
  hasInspectorSignature: boolean = false
) {
  const lines: string[] = [];

  // Title & Header Info
  lines.push('ACCEPTABLE QUALITY LIMIT (AQL) INSPECTION REPORT & TEMPLATE');
  lines.push(`Standard: ANSI/ASQ Z1.4 / ISO 2859-1 (MIL-STD-105E)`);
  lines.push(`Exported Date: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  // Order Details
  lines.push('--- INSPECTION METADATA ---');
  lines.push(`PO Number,${escapeCsv(meta.poNumber)}`);
  lines.push(`Product Name,${escapeCsv(meta.productName)}`);
  lines.push(`Style / SKU #,${escapeCsv(meta.styleNumber)}`);
  lines.push(`Supplier / Vendor,${escapeCsv(meta.supplier)}`);
  lines.push(`Factory Location,${escapeCsv(meta.factoryLocation)}`);
  lines.push(`Inspector Name,${escapeCsv(meta.inspectorName)}`);
  lines.push(`Inspection Date,${escapeCsv(meta.inspectionDate)}`);
  lines.push(`Inspection Stage,${escapeCsv(meta.inspectionStage)}`);
  lines.push('');

  // Sampling Plan Parameters
  lines.push('--- SAMPLING PLAN PARAMETERS ---');
  lines.push(`Total Lot / Order Size,${calc.lotSize} units`);
  lines.push(`Inspection Level,${calc.inspectionLevel}`);
  lines.push(`Inspection Strictness,${calc.strictness.toUpperCase()}`);
  lines.push(`Sample Size Code Letter,${calc.codeLetter}`);
  lines.push(`Calculated Sample Size,${calc.sampleSize} units (${calc.percentageOfLot}% of lot)`);
  lines.push('');

  // AQL Limits & Defect Tally
  const critFound = defects.filter((d) => d.severity === 'critical').reduce((sum, d) => sum + d.count, 0);
  const majFound = defects.filter((d) => d.severity === 'major').reduce((sum, d) => sum + d.count, 0);
  const minFound = defects.filter((d) => d.severity === 'minor').reduce((sum, d) => sum + d.count, 0);

  lines.push('--- AQL CRITERIA & SUMMARY RESULTS ---');
  lines.push('Severity Tier,AQL Target,Max Allowed (Ac),Min Reject (Re),Defects Found,Status');
  lines.push(
    `Critical,${calc.critical.aql},${calc.critical.ac},${calc.critical.re},${critFound},${
      critFound <= calc.critical.ac ? 'CONFORMING' : 'FAILED'
    }`
  );
  lines.push(
    `Major,${calc.major.aql},${calc.major.ac},${calc.major.re},${majFound},${
      majFound <= calc.major.ac ? 'CONFORMING' : 'FAILED'
    }`
  );
  lines.push(
    `Minor,${calc.minor.aql},${calc.minor.ac},${calc.minor.re},${minFound},${
      minFound <= calc.minor.ac ? 'CONFORMING' : 'FAILED'
    }`
  );
  lines.push(`Overall Lot Inspection Result,,,,${verdict}`);
  lines.push('');

  // Defect Log
  lines.push('--- DEFECT LOG & CHECKLIST ---');
  lines.push('Index,Category,Defect Description,Severity,Count Found,Sample Tested,Photo Evidence');
  defects.forEach((item, idx) => {
    lines.push(
      `${idx + 1},${escapeCsv(item.category)},${escapeCsv(item.description)},${item.severity.toUpperCase()},${
        item.count
      },${calc.sampleSize},${item.photoUrl ? 'Attached (Captured)' : 'None'}`
    );
  });
  lines.push('');

  // Notes & Signatures
  lines.push('--- INSPECTOR NOTES & SIGN-OFF ---');
  lines.push(`Inspector Notes,${escapeCsv(meta.notes)}`);
  lines.push(`Inspector Signature,${hasInspectorSignature ? 'Digitally Signed (Verified Canvas Capture)' : 'Pending Signature'},Date,${meta.inspectionDate}`);
  lines.push('Factory Manager Signature,___________________________,Date,______________');

  const csvContent = lines.join('\n');
  downloadBlob(csvContent, `AQL_Inspection_Template_${meta.poNumber || 'Sheet'}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports the ANSI/ASQ Z1.4 Normal Master Table as CSV
 */
export function exportMasterAqlTableCSV() {
  const lines: string[] = [];
  lines.push('ANSI/ASQ Z1.4 & ISO 2859-1 SINGLE SAMPLING PLANS FOR NORMAL INSPECTION (MASTER TABLE)');
  lines.push('');

  const headers = ['Code Letter', 'Sample Size', ...STANDARD_AQL_LEVELS.map((aql) => `AQL ${aql} (Ac/Re)`)];
  lines.push(headers.join(','));

  MASTER_NORMAL_TABLE.forEach((row) => {
    const rowValues = [row.codeLetter, row.sampleSize.toString()];
    STANDARD_AQL_LEVELS.forEach((aql) => {
      const plan = row.plans[aql];
      if (!plan) {
        rowValues.push('-');
      } else if (plan.arrow === 'down') {
        rowValues.push(`"↓ (Use ${plan.pointerTarget})"`);
      } else if (plan.arrow === 'up') {
        rowValues.push(`"↑ (Use ${plan.pointerTarget})"`);
      } else {
        rowValues.push(`"${plan.ac} / ${plan.re}"`);
      }
    });
    lines.push(rowValues.join(','));
  });

  const csvContent = lines.join('\n');
  downloadBlob(csvContent, 'ANSI_ASQ_Z1.4_Master_AQL_Table.csv', 'text/csv;charset=utf-8;');
}

function escapeCsv(str: string): string {
  if (!str) return '""';
  const clean = str.replace(/"/g, '""');
  return `"${clean}"`;
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
