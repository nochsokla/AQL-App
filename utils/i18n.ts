/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'kh' | 'cn';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'kh', label: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  { code: 'cn', label: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export const TRANSLATIONS = {
  // Navigation & Branding
  brandName: {
    en: 'ALPHA AQL',
    kh: 'ALPHA AQL',
    cn: 'ALPHA AQL 质检矩阵',
  },
  tagline: {
    en: 'Quality Inspection Matrix',
    kh: 'ម៉ាទ្រីសអធិការកិច្ចគុណភាព',
    cn: '品控抽样与检验系统',
  },
  tabCalculator: {
    en: 'Calculator',
    kh: 'ម៉ាស៊ីនគិតគូរ',
    cn: '抽样计算器',
  },
  tabTables: {
    en: 'AQL Tables',
    kh: 'តារាង AQL',
    cn: 'AQL 标准表',
  },
  tabTemplate: {
    en: 'Inspection Sheet',
    kh: 'សន្លឹកអធិការកិច្ច',
    cn: '检验报告单',
  },
  tabGuide: {
    en: 'Switching Rules',
    kh: 'វិធានផ្លាស់ប្តូរ',
    cn: '转移规则指南',
  },

  // Network & Storage Status
  statusOnline: {
    en: 'Online',
    kh: 'អនឡាញ',
    cn: '在线连网',
  },
  statusOffline: {
    en: 'Offline Cache Active',
    kh: 'ក្រៅបណ្តាញ (ទិន្នន័យក្នុងឧបករណ៍)',
    cn: '离线工作 (已启用本地缓存)',
  },
  statusSaved: {
    en: 'Auto-saved locally',
    kh: 'បានរក្សាទុកក្នុងឧបករណ៍',
    cn: '已自动保存在本地',
  },
  statusSaving: {
    en: 'Saving...',
    kh: 'កំពុងរក្សាទុក...',
    cn: '正在保存...',
  },
  lastSavedAt: {
    en: 'Last saved',
    kh: 'រក្សាទុកចុងក្រោយ',
    cn: '最后保存时间',
  },
  resetDraft: {
    en: 'Reset Draft',
    kh: 'កំណត់ឡើងវិញ',
    cn: '重置草稿',
  },
  resetConfirm: {
    en: 'Reset all inspection template data and defects back to empty default?',
    kh: 'តើអ្នកពិតជាចង់កំណត់ទិន្នន័យអធិការកិច្ច និងចំណុចខ្វះខាតឡើងវិញឬ?',
    cn: '确定要重置所有检验单数据并清空缺陷记录吗？',
  },

  // Day / Night Theme
  dayMode: {
    en: 'Day Mode',
    kh: 'របៀបពេលថ្ងៃ',
    cn: '日间明亮模式',
  },
  nightMode: {
    en: 'Night Mode',
    kh: 'របៀបពេលយប់',
    cn: '夜间深色模式',
  },
  toggleTheme: {
    en: 'Toggle Day/Night Theme',
    kh: 'ប្តូររបៀបថ្ងៃ/យប់',
    cn: '切换日间/夜间模式',
  },

  // Inspection Header & Metadata
  docTitle: {
    en: 'AQL Lot Acceptance Inspection Report',
    kh: 'របាយការណ៍អធិការកិច្ចទទួលយកឡូតិ៍ AQL',
    cn: 'AQL 批次验收检验报告单',
  },
  docStandard: {
    en: 'Inspection Standard: ANSI/ASQ Z1.4 / ISO 2859-1 · Single Sampling Normal Plan',
    kh: 'ស្តង់ដារអធិការកិច្ច: ANSI/ASQ Z1.4 / ISO 2859-1 · ផែនការយកគំរូទោលធម្មតា',
    cn: '检验标准：ANSI/ASQ Z1.4 / ISO 2859-1 · 正常检验一次抽样方案',
  },
  sectionOrderInfo: {
    en: '1. Order & Production Details',
    kh: '១. ព័ត៌មានលម្អិតអំពីការបញ្ជាទិញ និងផលិតកម្ម',
    cn: '1. 订单与生产基本信息',
  },
  poNumber: {
    en: 'PO Number',
    kh: 'លេខ PO',
    cn: '采购订单号 (PO#)',
  },
  productName: {
    en: 'Product / Item Name',
    kh: 'ឈ្មោះផលិតផល / ទំនិញ',
    cn: '产品品名',
  },
  styleNumber: {
    en: 'Style / SKU Number',
    kh: 'ម៉ូដ / លេខ SKU',
    cn: '款号 / SKU 货号',
  },
  supplier: {
    en: 'Supplier / Vendor',
    kh: 'អ្នកផ្គត់ផ្គង់ / ក្រុមហ៊ុន',
    cn: '供应商 / 生产商',
  },
  factoryLocation: {
    en: 'Factory Location',
    kh: 'ទីតាំងរោងចក្រ',
    cn: '工厂地址 / 验货地点',
  },
  inspectorName: {
    en: 'Lead QA Inspector',
    kh: 'អ្នកត្រួតពិនិត្យ QA នាំមុខ',
    cn: '主检员姓名',
  },
  inspectionDate: {
    en: 'Inspection Date',
    kh: 'កាលបរិច្ឆេទអធិការកិច្ច',
    cn: '检验日期',
  },
  inspectionStage: {
    en: 'Inspection Stage',
    kh: 'ដំណាក់កាលអធិការកិច្ច',
    cn: '检验阶段 (FRI/PSI)',
  },

  // Sampling Parameters
  sectionSamplingPlan: {
    en: '2. Active AQL Sampling Parameters',
    kh: '២. ប៉ារ៉ាម៉ែត្រយកគំរូ AQL សកម្ម',
    cn: '2. AQL 抽样方案与判定限值',
  },
  lotSize: {
    en: 'Lot / Batch Size',
    kh: 'ទំហំឡូតិ៍ / បាច់',
    cn: '批量总数 (Lot Size)',
  },
  sampleSize: {
    en: 'Sample Size',
    kh: 'ទំហំគំរូដែលត្រូវពិនិត្យ',
    cn: '抽取样本数 (Sample)',
  },
  codeLetter: {
    en: 'Code Letter',
    kh: 'អក្សរកូដគំរូ',
    cn: '样本量字码 (Code)',
  },
  inspectionLevel: {
    en: 'Inspection Level',
    kh: 'កម្រិតអធិការកិច្ច',
    cn: '检验水平 (Level)',
  },
  strictness: {
    en: 'Strictness',
    kh: 'ភាពតឹងរ៉ឹង',
    cn: '严格度 (Strictness)',
  },
  normal: {
    en: 'Normal',
    kh: 'ធម្មតា',
    cn: '正常检验',
  },
  tightened: {
    en: 'Tightened',
    kh: 'រឹតបន្តឹង',
    cn: '加严检验',
  },
  reduced: {
    en: 'Reduced',
    kh: 'បន្ធូរបន្ថយ',
    cn: '放宽检验',
  },

  // Defect Severities & Thresholds
  critical: {
    en: 'Critical',
    kh: 'ធ្ងន់ធ្ងរ',
    cn: '致命缺陷 (Critical)',
  },
  major: {
    en: 'Major',
    kh: 'ចម្បង',
    cn: '严重缺陷 (Major)',
  },
  minor: {
    en: 'Minor',
    kh: 'បន្ទាប់បន្សំ',
    cn: '轻微缺陷 (Minor)',
  },
  maxAllowedAc: {
    en: 'Max Allowed (Ac)',
    kh: 'អនុញ្ញាតអតិបរមា (Ac)',
    cn: '合格判定数 (Ac)',
  },
  minRejectRe: {
    en: 'Min Reject (Re)',
    kh: 'បដិសេធអប្បបរមា (Re)',
    cn: '不合格判定数 (Re)',
  },
  defectsFound: {
    en: 'Defects Found',
    kh: 'ចំណុចខ្វះខាតដែលរកឃើញ',
    cn: '检出缺陷数',
  },
  totalDefects: {
    en: 'Total Defects',
    kh: 'ចំណុចខ្វះខាតសរុប',
    cn: '缺陷总数',
  },

  // Disposition Verdict
  overallDisposition: {
    en: 'Overall Disposition',
    kh: 'សេចក្តីសម្រេចចុងក្រោយ',
    cn: '整体判定结论',
  },
  verdictAccepted: {
    en: 'ACCEPTED / CONFORMING',
    kh: 'បានអនុម័ត / ស្របតាមស្តង់ដារ',
    cn: '判定合格 / 予以接收',
  },
  verdictRejected: {
    en: 'REJECTED / DEFECTIVE',
    kh: 'បានបដិសេធ / មានកំហុសលើសកម្រិត',
    cn: '判定不合格 / 予以拒收',
  },

  // Defect Categories
  catWorkmanship: {
    en: 'Workmanship',
    kh: 'ការងារផលិត',
    cn: '生产做工',
  },
  catAppearance: {
    en: 'Appearance',
    kh: 'រូបរាងខាងក្រៅ',
    cn: '外观缺陷',
  },
  catPackaging: {
    en: 'Packaging',
    kh: 'ការវេចខ្ចប់',
    cn: '包装标识',
  },
  catMeasurement: {
    en: 'Measurement',
    kh: 'រង្វាស់ទំហំ',
    cn: '尺寸规格',
  },
  catFunctionality: {
    en: 'Functionality',
    kh: 'មុខងារដំណើរការ',
    cn: '功能性能',
  },

  // Sections & Features
  sectionAnalytics: {
    en: '3. Defect Category Distribution & Trend Analysis',
    kh: '៣. ការបែងចែកប្រភេទចំណុចខ្វះខាត និងនិន្នាការ',
    cn: '3. 缺陷类别分布与累积趋势图',
  },
  sectionChecklist: {
    en: '4. Physical Defect Findings & Photographic Log',
    kh: '៤. កំណត់ត្រាចំណុចខ្វះខាតជាក់ស្តែង និងភស្តុតាងរូបថត',
    cn: '4. 现场缺陷清单与实拍照片',
  },
  sectionObservations: {
    en: '5. Inspector Observations & Corrective Actions',
    kh: '៥. ការសង្កេតរបស់អ្នកត្រួតពិនិត្យ និងវិធានការកែតម្រូវ',
    cn: '5. 验货员综合评语与改善建议',
  },
  sectionSignatures: {
    en: '6. Digital Audit Sign-off & Authorization',
    kh: '៦. ហត្ថលេខាឌីជីថល និងការអនុញ្ញាត',
    cn: '6. 现场电子签名确认与签章',
  },
  sectionQr: {
    en: '7. Inspection Verification QR Code & Digital Certificate',
    kh: '៧. QR កូដផ្ទៀងផ្ទាត់អធិការកិច្ច និងវិញ្ញាបនបត្រឌីជីថល',
    cn: '7. 检验真实性防伪二维码与电子证书',
  },

  // Buttons & Actions
  exportCsv: {
    en: 'Export CSV',
    kh: 'ទាញយក CSV',
    cn: '导出 CSV',
  },
  printSheet: {
    en: 'Print QC Sheet',
    kh: 'បោះពុម្ពរបាយការណ៍',
    cn: '打印报告单',
  },
  inspectionQrBtn: {
    en: 'Inspection QR',
    kh: 'QR អធិការកិច្ច',
    cn: '防伪二维码',
  },
  addDefectBtn: {
    en: 'Add Defect',
    kh: 'បន្ថែមចំណុចខ្វះខាត',
    cn: '添加缺陷',
  },
  takePhotoBtn: {
    en: 'Take Photo',
    kh: 'ថតរូបភាព',
    cn: '现场拍照',
  },
  retakePhotoBtn: {
    en: 'Retake Photo',
    kh: 'ថតរូបម្តងទៀត',
    cn: '重新拍摄',
  },
  removePhotoBtn: {
    en: 'Remove Photo',
    kh: 'លុបរូបភាព',
    cn: '移除照片',
  },
  viewPhotoBtn: {
    en: 'View Photo',
    kh: 'មើលរូបភាព',
    cn: '查看大图',
  },
  loadPresetBtn: {
    en: 'Load Industry Preset Checklist',
    kh: 'ផ្ទុកបញ្ជីត្រួតពិនិត្យគំរូ',
    cn: '加载行业预设清单',
  },
  clearSignature: {
    en: 'Clear Signature',
    kh: 'លុបហត្ថលេខា',
    cn: '清除签名',
  },
  saveSignature: {
    en: 'Save Signature',
    kh: 'រក្សាទុកហត្ថលេខា',
    cn: '确认保存签名',
  },
  signHere: {
    en: 'Sign on canvas with finger, stylus, or mouse',
    kh: 'ចុះហត្ថលេខាលើផ្ទាំងនេះដោយប្រើម្រាមដៃ ប៊ិចស្ទ្រីលូស ឬកណ្តុរ',
    cn: '请在上方画板使用手指、触控笔或鼠标签名',
  },
  copyContent: {
    en: 'Copy Content',
    kh: 'ចម្លងមាតិកា',
    cn: '复制内容',
  },
  copied: {
    en: 'Copied!',
    kh: 'បានចម្លង!',
    cn: '已复制！',
  },
  downloadPng: {
    en: 'Download PNG',
    kh: 'ទាញយក PNG',
    cn: '下载高清 PNG',
  },
  close: {
    en: 'Close',
    kh: 'បិទ',
    cn: '关闭',
  },

  // Descriptions & Guidance
  offlineBannerNotice: {
    en: 'Remote Facility Mode Active: All templates, defect logs, photos, and signatures are automatically cached locally on this device.',
    kh: 'របៀបរោងចក្រដាច់ស្រយាលសកម្ម: គំរូ បញ្ជីកំហុស រូបថត និងហត្ថលេខាទាំងអស់ត្រូវបានរក្សាទុកក្នុងឧបករណ៍នេះដោយស្វ័យប្រវត្តិ។',
    cn: '偏远工厂离线模式已激活：所有检验模板、缺陷数据、实拍照片与电子签名均已自动在本地设备离线缓存。',
  },
  trendAnalysisNotice: {
    en: 'Monitors cumulative defect progression across 5 inspection sample milestones (0% to 100%) against acceptance limits.',
    kh: 'តាមដានការកើនឡើងនៃចំណុចខ្វះខាតសរុបឆ្លងកាត់ដំណាក់កាលគំរូចំនួន ៥ (០% ដល់ ១០០%) ធៀបនឹងកម្រិតអនុញ្ញាត។',
    cn: '监控抽样全过程（0% 至 100% 阶段）缺陷累积发生进度与各 AQL 接收阈值之比对。',
  },
  qrScanInstruction: {
    en: 'Scan with any smartphone camera to verify this audit report on the web or inspect the structured JSON summary.',
    kh: 'ស្កេនជាមួយកាមេរ៉ាទូរស័ព្ទណាមួយដើម្បីផ្ទៀងផ្ទាត់របាយការណ៍អធិការកិច្ចនេះ ឬពិនិត្យទិន្នន័យ JSON។',
    cn: '使用任意智能手机相机扫码即可在线校验本报告真伪或提取结构化 JSON 检验数据。',
  },
  factoryRepTitle: {
    en: 'Factory / Vendor Representative',
    kh: 'តំណាងរោងចក្រ / អ្នកផ្គត់ផ្គង់',
    cn: '工厂 / 供应商代表',
  },
  leadAuditorTitle: {
    en: 'Lead Quality Assurance Auditor',
    kh: 'សវនករត្រួតពិនិត្យគុណភាពនាំមុខ',
    cn: '高级质量保证审核员',
  },
};

export type TranslationKey = keyof typeof TRANSLATIONS;

export function t(key: TranslationKey, lang: Language): string {
  const item = TRANSLATIONS[key];
  if (!item) return key;
  return item[lang] || item['en'] || key;
}
