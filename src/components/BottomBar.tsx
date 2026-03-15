"use client";

import { motion } from 'framer-motion';

interface BottomBarProps {
  mode: 'SOLO' | 'GROUP';
}

const BottomBar = ({ mode }: BottomBarProps) => {
  return (
    <div className="absolute bottom-0 z-40 w-full h-32 bg-white/75 backdrop-blur-xl border-t border-white/40 shadow-bottom-bar rounded-t-3xl p-4 flex items-center justify-between">
      {mode === 'SOLO' ? (
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-text-secondary text-sm">已选 ¥19.9</span>
            <span className="text-price-highlight font-medium">还差 ¥10.1 免配送费</span>
            <div className="w-40 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="h-full bg-meituan-gradient rounded-full"
                initial={{ width: 0 }} 
                animate={{ width: '66%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
          <motion.button 
            className="bg-gradient-to-tr from-[#FFD000] to-[#FFC300] text-text-primary font-bold text-lg rounded-full px-8 py-4 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            去结算
          </motion.button>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white"><span>🧑‍💻</span></div>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white"><span>😴</span></div>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white"><span>🤔</span></div>
            </div>
            <p className="ml-4 text-text-secondary font-medium animate-pulse">正在等待室友滑动匹配...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
