/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Sun,
  Moon,
  Globe,
  Wifi,
  WifiOff,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, SUPPORTED_LANGUAGES } from '../utils/i18n';

interface TopNavProps {
  activeTab: 'calculator' | 'tables' | 'template' | 'guide';
  onSelectTab: (tab: 'calculator' | 'tables' | 'template' | 'guide') => void;
  onExportCSV: () => void;
  onPrint: () => void;
  onResetDraft?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onExportCSV,
  onPrint,
  onResetDraft,
}) => {
  const { theme, toggleTheme, language, setLanguage, t, isOnline, lastSaved } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand mark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('calculator')}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block shadow-xs shadow-sky-500/50"></span>
            <span>{t('brandName')}</span>
          </button>

          {/* Offline / Online Network & Storage Badge */}
          <div
            className={`hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
            }`}
            title={isOnline ? 'Online - Live syncing available' : t('offlineBannerNotice')}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{t('statusOnline')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>{t('statusOffline')}</span>
              </>
            )}
            {lastSaved && (
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px] border-l border-slate-300 dark:border-slate-700 pl-1.5 ml-0.5">
                {lastSaved}
              </span>
            )}
          </div>
        </div>

        {/* Zone 2: 4 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onSelectTab('calculator')}
            className={`transition-colors pb-1 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'text-slate-900 dark:text-white border-sky-600 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('tabCalculator')}
          </button>
          <button
            onClick={() => onSelectTab('tables')}
            className={`transition-colors pb-1 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'tables'
                ? 'text-slate-900 dark:text-white border-sky-600 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('tabTables')}
          </button>
          <button
            onClick={() => onSelectTab('template')}
            className={`transition-colors pb-1 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'template'
                ? 'text-slate-900 dark:text-white border-sky-600 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('tabTemplate')}
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`transition-colors pb-1 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'text-slate-900 dark:text-white border-sky-600 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('tabGuide')}
          </button>
        </nav>

        {/* Zone 3: Settings (Theme & Lang) & Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Day / Night Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/80 cursor-pointer"
            title={theme === 'dark' ? t('dayMode') : t('nightMode')}
            aria-label={t('toggleTheme')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Three-Language Switcher (En / Kh / Cn) */}
          <div className="relative">
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title={lang.nativeName}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export CSV (Screen) */}
          <button
            onClick={onExportCSV}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            title="Download editable CSV Inspection Template"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>{t('exportCsv')}</span>
          </button>

          {/* Print Report */}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded-md shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printSheet')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
