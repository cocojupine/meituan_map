"use client";

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const EmptyState = ({ onOpenCart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center mb-6">
        <MapPin className="text-gray-300" size={64} />
      </div>
      <h2 className="text-xl font-bold text-text-primary">紫金港周边的推荐已刷完啦</h2>
      <p className="text-text-secondary mt-1">快去看看你的备选池吧</p>
      <motion.button
        onClick={onOpenCart}
        className="mt-6 bg-meituan-gradient text-text-primary font-bold rounded-full px-8 py-3 shadow-lg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        打开我的备选池
      </motion.button>
    </div>
  );
};

export default EmptyState;
