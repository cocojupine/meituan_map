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
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-shadow-lg">{card.name}</h2>
          </div>
          <p className="text-white font-bold text-shadow-lg">
            <span className="text-lg">¥</span>
            <span className="text-3xl">{card.price}</span>
          </p>
        </div>
      </div>
      <div className="relative h-[35%] bg-surface p-3 flex flex-col">
        <div className="flex items-center text-xs text-gray-500 gap-2">
          <span>⭐️ {card.rating} 分</span>
          <span>{card.sales}</span>
          <span>{card.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded-md text-xs font-medium">20减10</span>
          <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-md text-xs font-medium">极速退</span>
          <span className="text-xs text-gray-400">{card.deliveryFee}</span>
        </div>
        <div className="flex-grow" />
        <div className="bg-gray-50 p-2 rounded-lg mt-2">
          <p className="text-xs text-gray-600 truncate">“{card.review}”</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
