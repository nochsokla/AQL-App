/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { CalculationResult, DefectItem, InspectionMetadata } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GeminiChatbotProps {
  calculationResult: CalculationResult;
  metadata: InspectionMetadata;
  defects: DefectItem[];
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  calculationResult,
  metadata,
  defects,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am your AQL & Quality Assurance Copilot. I can help you evaluate your sampling plan (${calculationResult.lotSize.toLocaleString()} units, Code Letter ${calculationResult.codeLetter}), classify defect severities (Critical vs Major vs Minor), recommend ISO 2859-1 switching rules, or analyze your current findings. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Context summary to feed as system context
  const currentContext = `
Current Inspection Context:
- Product: ${metadata.productName || 'Unspecified'} (Style: ${metadata.styleNumber || 'N/A'})
- PO Number: ${metadata.poNumber || 'N/A'}
- Supplier: ${metadata.supplier || 'N/A'} (${metadata.factoryLocation || 'N/A'})
- Inspection Stage: ${metadata.inspectionStage}
- Lot / Batch Size: ${calculationResult.lotSize} units
- Inspection Level: ${calculationResult.inspectionLevel} (${calculationResult.strictness})
- Code Letter: ${calculationResult.codeLetter}
- Sample Size: ${calculationResult.sampleSize} units (${calculationResult.percentageOfLot}% of lot)
- Critical Limit (AQL ${calculationResult.critical.aql}): Ac = ${calculationResult.critical.ac}, Re = ${calculationResult.critical.re}
- Major Limit (AQL ${calculationResult.major.aql}): Ac = ${calculationResult.major.ac}, Re = ${calculationResult.major.re}
- Minor Limit (AQL ${calculationResult.minor.aql}): Ac = ${calculationResult.minor.ac}, Re = ${calculationResult.minor.re}
- Total Logged Defects: ${defects.length} items (Critical: ${defects.filter(d => d.severity === 'critical').reduce((s,d) => s + d.count, 0)}, Major: ${defects.filter(d => d.severity === 'major').reduce((s,d) => s + d.count, 0)}, Minor: ${defects.filter(d => d.severity === 'minor').reduce((s,d) => s + d.count, 0)})
`;

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare conversation history
      const historyContents = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        }));

      historyContents.push({
        role: 'user',
        parts: [{ text: messageText }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: historyContents,
        config: {
          systemInstruction: `You are an expert Certified Quality Engineer (CQE) and AQL sampling consultant specialized in ANSI/ASQ Z1.4, ISO 2859-1, and MIL-STD-105E attribute inspection standards.
Your role:
1. Explain sampling calculations, sample size code letters, Ac/Re acceptance criteria, and arrow rules.
2. Provide objective criteria for classifying defects into Critical (safety/hazard/regulatory), Major (functionality/unsaleable), and Minor (cosmetic/workmanship).
3. Advise on ISO 2859-1 switching rules (Normal to Tightened when 2 of 5 lots fail, Tightened to Normal when 5 consecutive lots pass, Normal to Reduced after 10 consecutive passes).
4. Analyze the user's active inspection findings and recommend actionable factory rework and quality control measures.
Keep answers structured, concise, professional, and practical for factory quality managers and supply chain inspectors.
Here is the active inspection context for the current session:
${currentContext}`,
          temperature: 0.7,
        },
      });

      const modelReplyText = response.text || 'I apologize, but I could not generate an answer at this time.';

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: modelReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Gemini error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'An error occurred while connecting to the quality assistant. Please verify your connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Conversation cleared. I am ready to advise on your sampling plan (${calculationResult.lotSize.toLocaleString()} units, Code ${calculationResult.codeLetter}) or defect evaluations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    'How do I classify a seam tear vs loose thread?',
    'When should our team switch to Tightened inspection?',
    'What is the difference between General II and General III?',
    'Analyze my current defect counts against AQL limits',
  ];

  return (
    <div className="no-print">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-xl flex items-center gap-2 border border-slate-700 transition-all hover:scale-105"
          title="Open AQL Quality AI Assistant"
        >
          <Bot className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-semibold pr-1">AQL AI Advisor</span>
        </button>
      )}

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-400/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-sky-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>AQL Quality Advisor</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] text-slate-400">
                  ISO 2859-1 & ANSI/ASQ Z1.4 Expert
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="text-slate-400 hover:text-white p-1.5 rounded transition-colors"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          <div className="px-3.5 py-1.5 bg-slate-100 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              Lot: <strong>{calculationResult.lotSize.toLocaleString()}</strong> · Sample: <strong>{calculationResult.sampleSize}</strong> (Code {calculationResult.codeLetter})
            </span>
            <span className="text-[10px] text-sky-700 font-mono">
              Ac: {calculationResult.critical.ac}/{calculationResult.major.ac}/{calculationResult.minor.ac}
            </span>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-sky-700" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-lg p-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`text-[9px] mt-1.5 text-right ${
                      msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-white">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs">
                <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-sky-700" />
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                  <span>Consulting AQL standards...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 3 && !isLoading && (
            <div className="p-2 bg-slate-100/90 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
              <span className="text-[10px] text-slate-500 shrink-0 font-medium">Try asking:</span>
              {quickPrompts.slice(0, 2).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 px-2 py-0.5 rounded text-[11px] truncate max-w-[180px] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about AQL limits, defects, switching..."
              disabled={isLoading}
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
