"use client";

import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from './SwipeCard';

// 1. 定义卡片数据类型 (根据报错日志补充了 tags 和 locationTag)
export interface CardData {
  id: number;
  name: string;
  price: string;
  image: string;
  tags: string[];
  locationTag?: string; // 如果有的卡片没有标签，可以加上 ? 设为可选
}

// 2. 严格定义 page.tsx 传过来的 Props
interface CardStackProps {
  cards: CardData[];
  onPass: (id: number) => void;
  onLike: (card: CardData) => void;
  onSuperLike: (card: CardData) => void;
}

// 3. 将组件改为接收外部 Props，不再自己使用 useState
const CardStack = ({ cards, onLike, onPass, onSuperLike }: CardStackProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence>
        {cards.map((card, index) => {
          const isTop = index === cards.length - 1;
          const y = (cards.length - 1 - index) * 12;
          const scale = 1 - (cards.length - 1 - index) * 0.05;

          return (
            <motion.div
              key={card.id}
              className="absolute w-[90%] h-[65%]"
              initial={{ scale, y, opacity: 1 - (cards.length - 1 - index) * 0.2 }}
              animate={{ scale, y, opacity: 1 - (cards.length - 1 - index) * 0.2 }}
              exit={{ x: card.id === cards[cards.length - 1].id ? (Math.random() > 0.5 ? 300 : -300) : 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <SwipeCard
                card={card}
                isTop={isTop}
                onLike={() => onLike(card)}
                onPass={() => onPass(card.id)}
                onSuperLike={() => onSuperLike(card)}
                initialY={y}
                initialScale={scale}
              />
              {index === cards.length - 2 && <div className="absolute inset-0 bg-black/10 rounded-3xl backdrop-filter brightness-95 blur-sm" />} 
              {index === cards.length - 3 && <div className="absolute inset-0 bg-black/20 rounded-3xl backdrop-filter brightness-90 blur-md" />}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CardStack;