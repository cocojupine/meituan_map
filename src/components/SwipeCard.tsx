"use client";

import { useState, useEffect } from 'react';
import { PanInfo, motion, useMotionValue, useTransform, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import { X, Heart, Star, MessageCircle } from 'lucide-react';

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
  avgPrice: number;
  discount: string;
  deliveryType: string;
  review: string;
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
      <div className="relative h-[35%] bg-surface p-4 flex flex-col justify-between">
        {/* Row 1: Title & Price */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-text-primary tracking-tight w-3/4">{card.name}</h2>
          <p className="text-red-500 font-bold">
            <span className="text-lg">¥</span>
            <span className="text-4xl">{card.price.split('.')[0]}</span>
            {card.price.includes('.') && <span className="text-lg">.{card.price.split('.')[1]}</span>}
          </p>
        </div>

        {/* Row 2: Social Proof */}
        <div className="flex items-center text-sm text-gray-500 gap-2 -mt-1">
          <div className="flex items-center gap-0.5">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-yellow-500">{card.rating}</span>
          </div>
          <span>{card.sales}</span>
          <span>人均¥{card.avgPrice}</span>
        </div>

        {/* Row 3: Marketing & Distance */}
        <div className="flex items-center gap-2">
          {[card.discount, card.deliveryType].map(renderPill)}
        </div>

        {/* Row 4: Featured Review */}
        <div className="bg-gray-100/80 p-2 rounded-lg flex items-start gap-2">
          <MessageCircle size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-snug">{card.review}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
