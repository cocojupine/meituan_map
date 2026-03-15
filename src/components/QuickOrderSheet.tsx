"use client";

import { AnimatePresence, motion } from 'framer-motion';

const QuickOrderSheet = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[99] bg-black/50"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 w-full bg-background rounded-t-3xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">极速下单</h2>
            <p className="text-text-secondary mt-2">已为您智能凑齐起送价，共计 ¥30.0</p>
            <button className="w-full mt-6 bg-meituan-gradient text-text-primary font-bold text-lg rounded-xl py-4 shadow-lg">
              确认支付
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickOrderSheet;
