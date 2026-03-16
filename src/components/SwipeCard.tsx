"use client";

import { useState, useEffect } from 'react';
import { PanInfo, motion, useMotionValue, useTransform, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import { X, Heart, Star, MessageCircle } from 'lucide-react';

interface CardProps {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  discountTag: string;
  image: string;
  tags: string[];
  rating: number;
  sales: string;
  avgPrice: number;
  deliveryType: string;
  review: string;
  ranking: string;
  brandTag: string | null;
  locationTag?: string;
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

  const renderPill = (text: string) => {
    if (!text) return null;
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-600';

    if (text.includes('专送')) {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
    } else if (text.includes('减') || text.includes('折')) {
      bgColor = 'bg-red-100';
      textColor = 'text-red-600';
    }

    return (
      <span key={text} className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {text}
      </span>
    );
  };

  return (
    <motion.div
      className={`absolute w-full h-full rounded-3xl overflow-hidden bg-white shadow-lg ${isTop ? 'cursor-grab' : ''}`}
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
            className="absolute inset-0 z-20 flex items-center justify-between p-6 pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              animate={{ x: [-5, 0, -5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex items-center gap-2 p-2 bg-black/30 rounded-full backdrop-blur-sm"
            >
              <X size={24} className="text-white drop-shadow-md" />
              <span className="text-sm font-semibold text-white pr-2">不感兴趣</span>
            </motion.div>
            <motion.div 
              animate={{ x: [5, 0, 5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex items-center gap-2 p-2 bg-black/30 rounded-full backdrop-blur-sm"
            >
              <span className="text-sm font-semibold text-white pl-2">有点心动</span>
              <Heart size={24} className="text-red-400 drop-shadow-md" fill="currentColor" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div className="relative h-[58%] w-full">
        <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            priority={isTop}
          />
        {card.brandTag && (
          <div className="absolute top-0 left-0 bg-black/60 text-yellow-300 text-[10px] font-bold py-1 px-2 rounded-br-lg z-10">
            👑 {card.brandTag}
          </div>
        )}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="relative h-[42%] bg-white p-3.5 flex flex-col justify-between">
        {card.ranking && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
            🏆 {card.ranking}
          </div>
        )}
        
        {/* Row 1: Title & Price */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight w-3/4 line-clamp-1">{card.name}</h2>
          <div className="flex items-baseline gap-1.5 flex-shrink-0">
            <span className="bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-sm">{card.discountTag}</span>
            <del className="text-gray-400 text-sm">¥{card.originalPrice}</del>
          </div>
        </div>

        {/* Row 2: Social Proof & Delivery */}
        <div className="flex items-center text-xs text-gray-500 divide-x divide-gray-300 -mt-1">
          <div className="flex items-center gap-0.5 pr-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-700">{card.rating}</span>
          </div>
          <span className="px-2">{card.sales}</span>
          <span className="px-2">起送 ¥{card.avgPrice}</span>
          <span className="pl-2">配送 ¥0</span>
        </div>

        {/* Row 3: Marketing Pills */}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">{card.tags[0]}</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">{card.deliveryType}</span>
        </div>

        {/* Row 4: Featured Review */}
        <div className="bg-gray-100 p-2 rounded-md flex items-start gap-1.5">
          <MessageCircle size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-600 leading-tight line-clamp-1">{card.review}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
