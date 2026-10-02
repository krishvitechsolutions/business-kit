'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { WhatsAppCatalogue, CatalogueProduct } from '@/lib/types';
import { storage } from '@/lib/storage';
import CatalogueTemplate from '@/components/documents/CatalogueTemplate';
import { exportElementToPDF } from '@/lib/pdf';
import { ShoppingBag, Plus, Trash2, Eye, Download, Share2, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhatsAppCataloguePage() {
  const { businessProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
  const [downloading, setDownloading] = useState(false);

  const [catalogue, setCatalogue] = useState<WhatsAppCatalogue>(() => {
    const list = storage.getCatalogues();
    return (
      list[0] || {
        id: `cat-${Date.now()}`,
        userId: 'user-01',
        title: 'Apex Cloud & Software Solutions Catalogue 2026',
        description: 'Explore our popular digital transformation packages for Indian MSMEs.',
        whatsappNumber: businessProfile.whatsapp || '+919876543210',
        businessName: businessProfile.businessName || 'Apex Infotech Solutions',
        currency: '₹',
        products: [],
        createdAt: new Date().toISOString(),
      }
    );
  });

  const handleAddProduct = () => {
    const newProduct: CatalogueProduct = {
      id: `p-${Date.now()}`,
      name: 'New Product / Service',
      description: 'Enter short product features and specifications here.',
      price: 1999,
      originalPrice: 2999,
      discountPercent: 33,
      sku: 'SKU-001',
      category: 'General',
      inStock: true,
      whatsappOrderMessage: `Hello! I would like to order New Product (₹1,999).`,
    };
    setCatalogue((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
  };

  const handleRemoveProduct = (id: string) => {
    if (catalogue.products.length <= 1) return;
    setCatalogue((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const handleProductChange = (id: string, field: keyof CatalogueProduct, val: any) => {
    setCatalogue((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    }));
  };

  const handleSave = () => {
    storage.saveCatalogue(catalogue);
    confetti({ particleCount: 35, spread: 50 });
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await exportElementToPDF({
        elementId: 'catalogue-document',
        fileName: `Catalogue-${catalogue.businessName.replace(/\s+/g, '_')}`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Mobile E-Commerce & WhatsApp Sales</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            WhatsApp Product Catalogue Maker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Build a mobile-friendly product menu with discounts, custom categories, and 1-click WhatsApp order generation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl shrink-0 no-print">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Edit Products
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'preview' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. Live Catalogue View</span>
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Catalogue:</span>
          <span className="text-xs font-bold text-emerald-700">{catalogue.products.length} Products Live</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition"
          >
            Save Catalogue
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition"
          >
            <Download className="w-4 h-4 inline mr-1" />
            <span>{downloading ? 'Exporting...' : 'Download PDF Menu'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="space-y-6">
          {/* Catalogue Title & WA Number */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Catalogue Store Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  value={catalogue.businessName}
                  onChange={(e) => setCatalogue({ ...catalogue, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Order Number *</label>
                <input
                  type="tel"
                  placeholder="+919876543210"
                  value={catalogue.whatsappNumber}
                  onChange={(e) => setCatalogue({ ...catalogue, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Catalogue Subtitle / Description</label>
                <input
                  type="text"
                  value={catalogue.description}
                  onChange={(e) => setCatalogue({ ...catalogue, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Product Items List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Product Inventory List</h3>
              <button
                type="button"
                onClick={handleAddProduct}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition"
              >
                <Plus className="w-4 h-4" /> Add Product Card
              </button>
            </div>

            <div className="space-y-4">
              {catalogue.products.map((prod, idx) => (
                <div key={prod.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Product #{idx + 1}</span>
                    {catalogue.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(prod.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Title *</label>
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) => handleProductChange(prod.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Garments / Software"
                        value={prod.category}
                        onChange={(e) => handleProductChange(prod.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">SKU Code</label>
                      <input
                        type="text"
                        value={prod.sku || ''}
                        onChange={(e) => handleProductChange(prod.id, 'sku', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                      <input
                        type="number"
                        value={prod.price}
                        onChange={(e) => handleProductChange(prod.id, 'price', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Original Price (₹ MRP)</label>
                      <input
                        type="number"
                        value={prod.originalPrice || ''}
                        onChange={(e) => handleProductChange(prod.id, 'originalPrice', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Discount %</label>
                      <input
                        type="number"
                        value={prod.discountPercent || ''}
                        onChange={(e) => handleProductChange(prod.id, 'discountPercent', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-12">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Description</label>
                      <input
                        type="text"
                        value={prod.description}
                        onChange={(e) => handleProductChange(prod.id, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <CatalogueTemplate catalogue={catalogue} id="catalogue-document" />
        </div>
      )}
    </div>
  );
}
