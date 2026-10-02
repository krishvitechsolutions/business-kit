'use client';

import React, { useState } from 'react';
import { WhatsAppCatalogue, CatalogueProduct } from '@/lib/types';
import { formatINR, generateWhatsAppUrl } from '@/lib/utils';
import { MessageSquare, ShoppingBag, Share2, Tag, Check, Sparkles, Phone, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CatalogueTemplateProps {
  catalogue: WhatsAppCatalogue;
  id?: string;
}

export default function CatalogueTemplate({ catalogue, id = 'catalogue-document' }: CatalogueTemplateProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['All', ...Array.from(new Set(catalogue.products.map((p) => p.category || 'General')))];

  const filteredProducts =
    selectedCategory === 'All'
      ? catalogue.products
      : catalogue.products.filter((p) => p.category === selectedCategory);

  const handleOrder = (product: CatalogueProduct) => {
    const msg =
      product.whatsappOrderMessage ||
      `Hello ${catalogue.businessName}! I would like to order "${product.name}" for ${formatINR(product.price)}. Please confirm availability and payment details.`;
    const url = generateWhatsAppUrl(catalogue.whatsappNumber, msg);
    window.open(url, '_blank');
  };

  const handleShareCatalogue = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      confetti({ particleCount: 30, spread: 50 });
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div id={id} className="print-area w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Banner for the Shop / Catalogue */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShoppingBag className="w-48 h-48" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
              Verified WhatsApp Catalogue
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{catalogue.businessName}</h1>
          <p className="text-sm text-emerald-100 leading-relaxed">{catalogue.description}</p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Orders: {catalogue.whatsappNumber}</span>
            </div>
            <button
              onClick={handleShareCatalogue}
              className="flex items-center gap-2 text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-1.5 rounded-xl transition shadow-sm"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Catalogue'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
          >
            {/* Top Product Card Header */}
            <div>
              <div className="h-40 bg-gradient-to-tr from-slate-100 to-slate-50 flex flex-col items-center justify-center p-6 border-b border-slate-100 relative">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-slate-200/60">
                  <Tag className="w-8 h-8" />
                </div>
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-[10px]">
                    {product.discountPercent}% OFF
                  </span>
                )}
                <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 font-bold text-[10px]">
                  {product.category || 'General'}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{product.name}</h3>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>

                {product.sku && (
                  <p className="text-[10px] text-slate-400 font-mono">SKU: {product.sku}</p>
                )}
              </div>
            </div>

            {/* Price & Action */}
            <div className="p-5 pt-0 mt-auto">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-black text-slate-900">{formatINR(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleOrder(product)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
