"use client";

import { AnimatePresence, motion } from 'framer-motion';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MatchModal = ({ isOpen, onClose }: MatchModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()} // 防止点击卡片关闭弹窗
            className="relative w-[90%] max-w-sm bg-[#1A1A1A] rounded-3xl border-2 border-yellow-400/50 shadow-2xl p-6 text-center"
          >
            <h2 className="text-3xl font-bold text-white tracking-tight animate-pulse">🎉 宿舍 Match 成功！</h2>
            
            <div className="relative my-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl p-5 text-black">
              {/* 锯齿边缘 */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-5 bg-[#1A1A1A] rounded-b-full" />
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-12 h-5 bg-[#1A1A1A] rounded-t-full" />

              <p className="font-bold text-xl">4人同行专享</p>
              <p className="text-5xl font-extrabold my-2">满100减30</p>
              <p className="text-xs opacity-80">仅限今晚22:00前可用</p>
            </div>

            {/* --- Mini-Map --- */}
            <div className="w-full h-32 bg-[#1A1A1A] rounded-xl relative overflow-hidden border border-[#333] p-4 flex items-center justify-between mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white" />
                <span className="text-xs text-text-secondary">你的寝室</span>
              </div>
              <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
                <motion.path
                  d="M 48 64 C 100 64, 150 64, 200 64" // Simplified path for straight line
                  stroke="#22c55e" 
                  strokeWidth="3"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                />
              </svg>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-white" />
                <span className="text-xs text-text-secondary">目标餐厅</span>
              </div>
            </div>

            <button className="w-full bg-meituan-gradient text-text-primary font-bold text-lg rounded-xl py-4 shadow-lg transform hover:scale-105 transition-transform">
              领券并一键召唤室友
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchModal;
