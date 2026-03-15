"use client";

import { useState, useEffect, useRef } from 'react';
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

const SwipeCard = ({ card, isTop, onLike, onPass, onSuperLike }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const isMounted = useRef(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const controls = useAnimation();

  // Set isMounted to false when the component unmounts to prevent state updates on unmounted components
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const sequence = async () => {
      if (isTop && !hasInteracted) {
        // Wait for a bit before starting the animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // CRITICAL FIX: Only start the animation if the component is still mounted.
        // This prevents the "controls.start() should only be called after a component has mounted" error
        // which is a race condition that happens if the component unmounts during the timeout.
        if (isMounted.current) {
          await controls.start({
            x: [0, 20, -20, 0],
            rotate: [0, 5, -5, 0],
            transition: { duration: 1, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }
          });
        }
      }
    };

    sequence();

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
      className={`absolute w-full rounded-3xl overflow-hidden bg-surface shadow-card-main ${isTop ? 'cursor-grab' : ''}`}
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
      <div className="relative w-full aspect-square">
        <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            priority={isTop}
          />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="relative bg-white p-4 flex flex-col rounded-b-[24px]">
        {/* 1. Title & Price */}
        <div className="flex justify-between items-baseline">
          <h2 className="text-xl font-extrabold text-gray-900 line-clamp-1 flex-1 pr-2">{card.name}</h2>
          <p className="flex-shrink-0">
            <span className="text-xs font-bold text-[#FF4A26] align-baseline">¥</span>
            <span className="text-2xl font-black text-[#FF4A26]">{card.price}</span>
          </p>
        </div>

        {/* 2. Core Business Data */}
        <div className="flex items-center text-xs text-gray-500 gap-2 font-medium mt-1">
          <span className="text-[#FF8000] font-bold">{card.rating}</span>
          <span>月售{card.sales}</span>
          <span className="mx-1">|</span>
          <span>{card.deliveryTime}</span>
        </div>

        {/* 3. Welfare & Space Tags */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold">距您步行5分钟</span>
          <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded text-[10px] font-bold">20减10</span>
          <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-bold">免配送费</span>
        </div>

        {/* 4. Featured Review Bubble */}
        <div className="mt-auto pt-2">
            <div className="bg-[#F8F9FA] rounded-xl p-3 flex items-start gap-1.5">
                <span className="text-gray-400 font-serif text-lg leading-none mt-0.5">“</span>
                <p className="text-xs text-gray-600 line-clamp-2 flex-1">{card.review}</p>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
