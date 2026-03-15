"use client";

import { PanInfo, motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

interface CardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  tags: string[];
}

interface SwipeCardProps {
  card: CardProps;
  isTop: boolean;
  onRemove: (id: number, action: 'like' | 'skip') => void;
  initialY?: number;
  initialScale?: number;
}

const SwipeCard = ({ card, isTop, onRemove, initialY, initialScale }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(initialY || 0);
  const scale = useMotionValue(initialScale || 1);

  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const likeScale = useTransform(x, [20, 80], [0.5, 1]);
  const skipOpacity = useTransform(x, [-80, -20], [1, 0]);
  const skipScale = useTransform(x, [-80, -20], [1, 0.5]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onRemove(card.id, 'like');
    } else if (info.offset.x < -100) {
      onRemove(card.id, 'skip');
    }
  };

  return (
    <motion.div
      className={`absolute w-full h-full rounded-3xl overflow-hidden bg-surface shadow-card-main ${isTop ? 'cursor-grab' : ''}`}
      style={{ x, y, rotate, scale }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      dragElastic={0.7}
    >
      {/* 1. 上半层 (Image) */}
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

      {/* 2. 下半层 (Info) */}
      <div className="relative h-[35%] bg-surface p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">{card.name}</h2>
        <div className="flex items-center gap-2 mt-2">
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
