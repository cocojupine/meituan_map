"use client";

import { motion } from 'framer-motion';

interface BottomBarProps {
  shortlistCount: number;
  onOpenSummary: () => void;
}

const BottomBar = ({ shortlistCount, onOpenSummary }: BottomBarProps) => {
  return (
    <div className="absolute bottom-0 z-40 w-full h-32 bg-white/75 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-t-3xl p-4 flex items-center justify-between">
      <p className="font-semibold text-text-secondary">已筛选 <span className="text-text-primary font-bold text-lg">{shortlistCount}</span> 家餐厅</p>
      <button onClick={onOpenSummary} className="bg-meituan-gradient text-text-primary font-bold text-lg rounded-full px-8 py-4 shadow-lg">
        查看决策池
      </button>
    </div>
  );
};

export default BottomBar;
