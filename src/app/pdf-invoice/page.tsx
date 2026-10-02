'use client';

import React, { useState } from 'react';
import { storage } from '@/lib/storage';
import { Invoice } from '@/lib/types';
import InvoiceTemplate from '@/components/documents/InvoiceTemplate';
import DocumentActionBar from '@/components/documents/DocumentActionBar';
import { FileText, Upload, Sparkles, FolderOpen, ArrowRight } from 'lucide-react';

export default function PDFInvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => storage.getInvoices());
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(() => {
    const list = storage.getInvoices();
    return list[0] || ({} as Invoice);
  });
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState('');

  const handleSelect = (inv: Invoice) => {
    setSelectedInvoice(inv);
  };

  const handleImportJSON = () => {
    setImportError('');
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.invoiceNumber || !parsed.seller || !parsed.items) {
        throw new Error('Missing mandatory invoice attributes (invoiceNumber, seller, items).');
      }
      storage.saveInvoice(parsed);
      setSelectedInvoice(parsed);
      setInvoices(storage.getInvoices());
      setJsonInput('');
    } catch (e: any) {
      setImportError(e.message || 'Invalid JSON format. Please verify standard invoice schema.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Dedicated A4 Print & PDF Workflow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            PDF Invoice Importer & Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Preview, load saved records, import invoice JSON configurations, and export high-fidelity A4 PDFs ready for accounting audits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Select Saved or Import JSON */}
        <div className="lg:col-span-4 space-y-6 no-print">
          {/* Select Saved Invoices */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span>Load from Saved Invoices</span>
            </h3>

            <div className="space-y-2">
              {invoices.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => handleSelect(inv)}
                  className={`w-full p-3 rounded-xl text-left transition border ${
                    selectedInvoice.id === inv.id
                      ? 'bg-blue-50 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-1">{inv.customerName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Import JSON */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-600" />
              <span>Import Invoice JSON Data</span>
            </h3>

            <textarea
              rows={4}
              placeholder='{"invoiceNumber":"INV-2026-999","seller":{...},"items":[...]}'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800"
            />

            {importError && <p className="text-xs text-rose-600 font-bold">{importError}</p>}

            <button
              onClick={handleImportJSON}
              disabled={!jsonInput.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
            >
              Parse & Load into A4 Engine
            </button>
          </div>
        </div>

        {/* Right Column: Live Document Action Bar & High-Res Template */}
        <div className="lg:col-span-8 space-y-6">
          {selectedInvoice.invoiceNumber && (
            <>
              <DocumentActionBar
                documentId={selectedInvoice.invoiceNumber}
                documentTitle={`PDF-Invoice-${selectedInvoice.invoiceNumber}`}
                targetElementId="pdf-invoice-container"
              />
              <div className="flex justify-center">
                <InvoiceTemplate invoice={selectedInvoice} id="pdf-invoice-container" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
