"use client";

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const CheckoutSheet = ({ isOpen, onClose, items }) => {
  const total = useMemo(() => 
    items.reduce((sum, item) => sum + parseFloat(item.price), 0),
    [items]
  );

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
            className="absolute bottom-0 w-full h-[40%] bg-background rounded-t-3xl p-6 shadow-lg flex flex-col"
          >
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">确认订单</h2>
            <div className="flex-grow my-4 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <span className="text-text-primary">{item.name}</span>
                  <span className="text-text-primary font-medium">¥{item.price}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-meituan-gradient text-text-primary font-bold text-lg rounded-xl py-4 shadow-lg">
              确认支付 ¥{total.toFixed(1)}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutSheet;
