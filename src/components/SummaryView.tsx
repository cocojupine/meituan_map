"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown, MoveRight, MessageSquare, Navigation } from 'lucide-react';

const SummaryView = ({ setAppStep, cartItems }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>(cartItems.map(i => i.id));

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <button onClick={() => setAppStep('SWIPE')} className="flex items-center gap-1 text-text-secondary font-medium">
          <ArrowLeft size={18} />
          返回重刷
        </button>
        <h1 className="font-bold text-lg text-text-primary">决策池</h1>
        <div className="w-12" />
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        {/* Data Summary (Mock) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">数据洞察</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Mock cards */}
            <div className="flex-shrink-0 w-40 h-24 bg-surface rounded-xl p-3 shadow-md">...</div>
            <div className="flex-shrink-0 w-40 h-24 bg-surface rounded-xl p-3 shadow-md">...</div>
            <div className="flex-shrink-0 w-40 h-24 bg-surface rounded-xl p-3 shadow-md">...</div>
          </div>
        </div>

        {/* Cart Items List */}
        <div>
          <h2 className="text-xl font-bold mb-2">备选清单</h2>
          <div className="space-y-2">
            {cartItems.map(item => (
              <div key={item.id} onClick={() => toggleItemSelection(item.id)} className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${selectedItems.includes(item.id) ? 'bg-yellow-100/80 ring-2 ring-brand-primary' : 'bg-surface'}`}>
                <p className="font-semibold">{item.name}</p>
                <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${selectedItems.includes(item.id) ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'}`}>
                  {selectedItems.includes(item.id) && <Check size={14} className="text-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Strategy Action Bar */}
      <footer className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-brand-primary">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-yellow-400 text-white shadow-lg">
              <MoveRight size={28} />
            </div>
            <span className="text-xs font-semibold">极速外卖</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-200">
              <Navigation size={28} />
            </div>
            <span className="text-xs font-semibold">堂食导航</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-200">
              <MessageSquare size={28} />
            </div>
            <span className="text-xs font-semibold">微信拉票</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SummaryView;
