'use client';

import React, { useState } from 'react';
import { Download, Printer, Share2, Save, Copy, Check, Palette, Sparkles, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { exportElementToPDF, exportElementToImage, triggerPrint } from '@/lib/pdf';
import { generateWhatsAppUrl } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { TemplateId } from '@/lib/types';

interface DocumentActionBarProps {
  documentId: string;
  documentTitle: string;
  targetElementId: string;
  onSave?: () => void;
  onDuplicate?: () => void;
  selectedTemplate?: TemplateId;
  onTemplateChange?: (t: TemplateId) => void;
  whatsappRecipientPhone?: string;
  whatsappSummaryText?: string;
}

export default function DocumentActionBar({
  documentId,
  documentTitle,
  targetElementId,
  onSave,
  onDuplicate,
  selectedTemplate = 'modern',
  onTemplateChange,
  whatsappRecipientPhone,
  whatsappSummaryText,
}: DocumentActionBarProps) {
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      await exportElementToPDF({
        elementId: targetElementId,
        fileName: `${documentTitle}-${documentId}`,
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleDownloadImage = async () => {
    setDownloadingImg(true);
    try {
      await exportElementToImage({
        elementId: targetElementId,
        fileName: `${documentTitle}-${documentId}`,
        format: 'png',
      });
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.8 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingImg(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      setSavedSuccess(true);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.85 },
      });
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const defaultMsg =
      whatsappSummaryText ||
      `Hello! Please find the business document (${documentTitle}) generated for your reference. Thank you!`;
    const waUrl = generateWhatsAppUrl(whatsappRecipientPhone || '', defaultMsg);
    window.open(waUrl, '_blank');
  };

  const templates: { id: TemplateId; name: string; color: string }[] = [
    { id: 'modern', name: 'Modern Blue', color: 'bg-blue-600' },
    { id: 'indigo', name: 'Indigo Slate', color: 'bg-indigo-600' },
    { id: 'classic', name: 'Classic Mono', color: 'bg-slate-800' },
    { id: 'bordered', name: 'Bordered Gold', color: 'bg-amber-600' },
    { id: 'minimal', name: 'Minimalist Clean', color: 'bg-slate-500' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 no-print">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Template Selector */}
        {onTemplateChange && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mr-1">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Style Template:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTemplateChange(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    selectedTemplate === t.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${t.color}`} />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {onSave && (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Saved to Docs!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-600" />
                  <span>Save</span>
                </>
              )}
            </button>
          )}

          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition"
            >
              <Copy className="w-4 h-4 text-slate-600" />
              <span>Duplicate</span>
            </button>
          )}

          <button
            onClick={() => triggerPrint(targetElementId)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print</span>
          </button>

          {/* Download PNG Image Button for WhatsApp */}
          <button
            onClick={handleDownloadImage}
            disabled={downloadingImg}
            title="Download crisp PNG image to send directly into WhatsApp chats"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs shadow-xs transition disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>{downloadingImg ? 'Exporting Image...' : 'Export PNG (WhatsApp)'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send on WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPDF ? 'Exporting PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
