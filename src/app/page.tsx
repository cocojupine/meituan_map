"use client";

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import CardStack from '@/components/CardStack';
import BottomBar from '@/components/BottomBar';
import MatchModal from '@/components/MatchModal';

export default function Home() {
  const [mode, setMode] = useState<'SOLO' | 'GROUP'>('SOLO');
  const [showMatchModal, setShowMatchModal] = useState(false);

  return (
    <div className="h-full w-full flex flex-col items-center">
      {/* 1. 顶部状态栏 Header */}
      <header className="absolute top-0 z-50 w-full h-16 flex items-center justify-between px-4 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center gap-1.5">
          <MapPin size={18} className="text-text-primary" />
          <span className="font-bold text-text-primary tracking-tight">浙大紫金港</span>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-gray-200 rounded-full text-sm font-medium">
          <button 
            onClick={() => setMode('SOLO')}
            className={`px-3 py-1 rounded-full transition-colors ${mode === 'SOLO' ? 'bg-white shadow-sm' : 'text-text-secondary'}`}>
            Solo
          </button>
          <button 
            onClick={() => setMode('GROUP')}
            className={`px-3 py-1 rounded-full transition-colors ${mode === 'GROUP' ? 'bg-white shadow-sm' : 'text-text-secondary'}`}>
            Group
          </button>
        </div>
      </header>

      {/* 2. 核心卡片区域 */}
      <CardStack />

      {/* 3. 底部动态进度栏 */}
      <BottomBar mode={mode} />

      {/* 4. Match 弹窗 (初始隐藏) */}
      <MatchModal isOpen={showMatchModal} onClose={() => setShowMatchModal(false)} />

      {/* 临时触发器，用于预览弹窗 */}
      <button onClick={() => setShowMatchModal(true)} className='absolute bottom-36 z-50 bg-blue-500 text-white p-2 rounded-full'>
        Test Match Modal
      </button>
    </div>
  );
}
