"use client";

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';

const CartDrawer = ({ isOpen, onClose, items, onRemoveItem }) => {
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
            className="absolute bottom-0 w-full h-[60vh] bg-white/80 backdrop-blur-xl rounded-t-3xl flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-bold text-text-primary">我的备选池</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow p-4 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md object-cover" />
                    <div>
                      <p className="font-semibold text-text-primary">{item.name}</p>
                      {item.isMustEat && <span className="text-xs font-bold text-red-500">[🔥 必吃]</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-text-primary">¥{item.price}</p>
                    <button onClick={() => onRemoveItem(item.id)} className="p-2 rounded-full hover:bg-gray-200">
                      <Trash2 size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <button className="w-full bg-meituan-gradient text-text-primary font-bold text-lg rounded-xl py-4 shadow-lg">
                确认结算 ¥{total.toFixed(1)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
