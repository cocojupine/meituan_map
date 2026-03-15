"use client";

import { motion } from 'framer-motion';

interface BottomBarProps {
  mode: 'SOLO' | 'GROUP';
  onOpenCart: () => void;
}

const BottomBar = ({ mode, onOpenCart }: BottomBarProps) => {
  return (
    <motion.div 
      onClick={onOpenCart}
      className="absolute bottom-0 z-40 w-full h-32 bg-white/75 backdrop-blur-xl border-t border-white/40 shadow-bottom-bar rounded-t-3xl p-4 flex items-center justify-between cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
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
          <div className="flex items-center text-text-secondary font-medium">
            <span>查看购物车</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
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
    </motion.div>
  );
};

export default BottomBar;
