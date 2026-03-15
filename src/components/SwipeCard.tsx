"use client";

import { useState, useEffect } from 'react';
import { PanInfo, motion, useMotionValue, useTransform, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import { X, Heart } from 'lucide-react';

interface CardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  tags: string[];
}

const SwipeCard = ({ card, isTop, onLike, onPass, onSuperLike, initialY, initialScale }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(initialY || 0);
  const scale = useMotionValue(initialScale || 1);
  const controls = useAnimation();

  useEffect(() => {
    if (isTop && !hasInteracted) {
      const sequence = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await controls.start({
          x: [0, 20, -20, 0],
          rotate: [0, 5, -5, 0],
          transition: { duration: 1, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }
        });
      };
      sequence();
    }
  }, [isTop, hasInteracted, controls]);

  const handlePanStart = () => {
    controls.stop();
    setHasInteracted(true);
  };

  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onLike();
    } else if (info.offset.x < -100) {
      onPass();
    } else if (info.offset.y < -100) {
      onSuperLike();
    }
  };

  return (
    <motion.div
      className={`absolute w-full h-full rounded-3xl overflow-hidden bg-surface shadow-card-main ${isTop ? 'cursor-grab' : ''}`}
      style={{ x, y, rotate, scale }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onPanStart={handlePanStart}
      dragElastic={{ top: 0.5, left: 0.7, right: 0.7, bottom: 0.5 }}
      animate={controls}
    >
      <AnimatePresence>
        {isTop && !hasInteracted && (
          <motion.div 
            className="absolute inset-0 z-10 flex items-center justify-between p-6 pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              animate={{ x: [-5, 0, -5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex items-center gap-2 p-2 bg-white/20 rounded-full backdrop-blur-sm"
            >
              <X size={24} className="text-white drop-shadow-md" style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }} />
              <span className="text-sm font-semibold text-white pr-2">左划</span>
            </motion.div>
            <motion.div 
              animate={{ x: [5, 0, 5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex items-center gap-2 p-2 bg-white/20 rounded-full backdrop-blur-sm"
            >
              <span className="text-sm font-semibold text-white pl-2">右划</span>
              <Heart size={24} className="text-brand-primary drop-shadow-md" fill="#FFC300" style={{ filter: 'drop-shadow(0 0 8px rgba(255,195,0,0.8))' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div className="relative h-[65%] w-full">
        <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            priority={isTop}
          />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="relative h-[35%] bg-surface p-3 flex flex-col">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold truncate pr-2">{card.name}</h2>
          <p className="font-black text-[#FF4A26]">
            <span className="text-xs">¥</span>
            <span className="text-2xl">{card.price}</span>
          </p>
        </div>
        <div className="flex items-center text-[11px] text-gray-500 gap-2 mt-1">
          <span>⭐️ <span className="text-orange-500 font-bold">{card.rating}</span> 分</span>
          <span>{card.sales}</span>
          <span>{card.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded text-[10px] font-medium">30减15</span>
          <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded text-[10px] font-medium">新客专享</span>
          <span className="text-xs text-gray-400">{card.deliveryFee}</span>
        </div>
        <div className="flex-grow" />
        <div className="bg-gray-50 rounded-lg p-2 mt-3">
          <p className="text-xs text-gray-600 line-clamp-2">“{card.review}”</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
