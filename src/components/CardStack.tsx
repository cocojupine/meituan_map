"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from './SwipeCard'; // 我们将复用并传入props

const FOOD_ITEMS = [
  { id: 5, name: '瑞幸生椰拿铁', price: '12.9', image: 'https://images.unsplash.com/photo-1603394397501-9c95b9532b8a?q=80&w=1887&auto=format&fit=crop', tags: ['夏日冰饮', '人手一杯'] },
  { id: 4, name: '紫金港堕落街烤肉', price: '59.9', image: 'https://images.unsplash.com/photo-1629230121198-99427a71a24a?q=80&w=1887&auto=format&fit=crop', tags: ['滋滋冒油', '夜宵首选'] },
  { id: 3, name: '三墩老街葱包烩', price: '8.0', image: 'https://images.unsplash.com/photo-1558584724-0e4b35ca58a9?q=80&w=1887&auto=format&fit=crop', tags: ['杭州特色', '早餐'] },
  { id: 2, name: '文三路卤味拼盘', price: '25.5', image: 'https://images.unsplash.com/photo-1623428187969-5da2d2f1f585?q=80&w=1887&auto=format&fit=crop', tags: ['下酒神菜', '看剧必备'] },
  { id: 1, name: '招牌隆江猪脚饭', price: '19.9', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?q=80&w=1887&auto=format&fit=crop', tags: ['满30减15', '新客专享'] },
];

const CardStack = () => {
  const [cards, setCards] = useState(FOOD_ITEMS);

  const handleRemove = (id: number, action: 'like' | 'skip') => {
    console.log(`${action} card ${id}`);
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence>
        {cards.map((card, index) => {
          const isTop = index === cards.length - 1;
          return (
            <motion.div
              key={card.id}
              className="absolute w-[90%] h-[65%]"
              initial={{ scale: 1 - (cards.length - 1 - index) * 0.05, y: (cards.length - 1 - index) * 12, opacity: 1 - (cards.length - 1 - index) * 0.2 }}
              animate={{ scale: 1 - (cards.length - 1 - index) * 0.05, y: (cards.length - 1 - index) * 12, opacity: 1 - (cards.length - 1 - index) * 0.2 }}
              exit={{ x: card.id === cards[cards.length - 1].id ? (Math.random() > 0.5 ? 300 : -300) : 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <SwipeCard
                card={card}
                isTop={isTop}
                initialY={1 - (cards.length - 1 - index) * 12}
                initialScale={1 - (cards.length - 1 - index) * 0.05}
                onRemove={handleRemove}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CardStack;
