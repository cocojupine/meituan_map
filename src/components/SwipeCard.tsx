"use client";

import { useState, useEffect } from 'react';
import { PanInfo, motion, useMotionValue, useTransform, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import { X, Heart, Star } from 'lucide-react';

interface CardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  tags: string[];
  rating: number;
  sales: string;
  distance: string;
  deliveryTime: string;
}

interface SwipeCardProps {
  card: CardProps;
  isTop: boolean;
  onLike: () => void;
  onPass: () => void;
  onSuperLike: () => void;
  initialY: number;
  initialScale: number;
}

const SwipeCard = ({ card, isTop, onLike, onPass, onSuperLike, initialY, initialScale }: SwipeCardProps) => {
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
      <div className="relative h-[35%] bg-surface p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">{card.name}</h2>
        
        {/* --- Meituan-like Info Added --- */}
        <div className="flex items-center text-sm text-text-secondary mt-1.5 gap-3">
          <div className="flex items-center gap-0.5">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-yellow-500">{card.rating}</span>
          </div>
          <span>{card.sales}</span>
          <span>{card.distance}</span>
          <span>{card.deliveryTime}</span>
        </div>

        <div className="flex items-center gap-2 mt-2.5">
          {card.tags.map(tag => (
            <span key={tag} className="bg-[#FFF6E5] text-[#FF8C00] px-2 py-1 rounded-md text-xs font-medium">{tag}</span>
          ))}
        </div>
        <div className="flex-grow" />
        <div className="flex justify-end items-end">
          <p className="text-price-highlight text-4xl font-bold">
            <span className="text-2xl">¥</span>{card.price}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
