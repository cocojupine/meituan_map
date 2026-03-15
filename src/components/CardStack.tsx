"use client";

import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from './SwipeCard';
import type { FoodItem } from '@/lib/data';

// 2. 严格定义 page.tsx 传过来的 Props
interface CardStackProps {
  cards: FoodItem[];
  onPass: (card: FoodItem) => void;
  onLike: (card: FoodItem) => void;
  onSuperLike: (card: FoodItem) => void;
}

// 3. 将组件改为接收外部 Props，不再自己使用 useState
const CardStack = ({ cards, onLike, onPass, onSuperLike }: CardStackProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence>
        {cards.map((card, index) => {
          const isTop = index === cards.length - 1;
          // Keep a small vertical offset for the stacking effect
          const y = (cards.length - 1 - index) * 10;

          return (
            <motion.div
              key={card.id}
              className="absolute w-full h-full" // Allow card to fill the container
              style={{ zIndex: index }} // Ensure correct stacking order
              initial={{ y, scale: 1 }}
              animate={{ y, scale: 1 }}
              exit={{ 
                x: card.id === cards[cards.length - 1].id ? (Math.random() > 0.5 ? 300 : -300) : 0, 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <SwipeCard
                card={card}
                isTop={isTop}
                onLike={() => onLike(card)}
                onPass={() => onPass(card)}
                onSuperLike={() => onSuperLike(card)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CardStack;