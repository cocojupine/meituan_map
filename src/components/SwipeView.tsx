"use client";

import { useState, FC, Dispatch, SetStateAction } from 'react';
import CardStack from '@/components/CardStack';
import BottomBar from '@/components/BottomBar';
import { FOOD_ITEMS, type FoodItem } from '@/lib/data';

type AppStep = 'SEARCH' | 'SCANNING' | 'SWIPE' | 'SUMMARY';

interface SwipeViewProps {
  setAppStep: Dispatch<SetStateAction<AppStep>>;
  setCartItems: Dispatch<SetStateAction<FoodItem[]>>;
}

const SwipeView: FC<SwipeViewProps> = ({ setAppStep, setCartItems }) => {
  const [cards, setCards] = useState<FoodItem[]>(FOOD_ITEMS);
  const [shortlist, setShortlist] = useState<FoodItem[]>([]);

  const handlePass = (card: FoodItem) => {
    setCards(prev => prev.filter(c => c.id !== card.id));
  };

  const handleLike = (card: FoodItem) => {
    setShortlist(prev => [...prev, card]);
    setCards(prev => prev.filter(c => c.id !== card.id));
  };

  const handleSuperLike = (card: any) => {
    setShortlist(prev => [{ ...card, isMustEat: true }, ...prev.filter(item => item.id !== card.id)]);
    setCards(prev => prev.filter(c => c.id !== card.id));
  };

  const handleGoToSummary = () => {
    setCartItems(shortlist);
    setAppStep('SUMMARY');
  };

  if (cards.length === 0) {
    // Handle empty state within the swipe view, or trigger summary
    handleGoToSummary();
    return null; // Or a loading spinner
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <header className="absolute top-0 z-50 w-full h-16 flex items-center justify-between px-4 bg-white/70 backdrop-blur-xl border-b border-white/20" />
      <CardStack cards={cards} onPass={handlePass} onLike={handleLike} onSuperLike={handleSuperLike} />
      <BottomBar shortlistCount={shortlist.length} onOpenSummary={handleGoToSummary} />
    </div>
  );
};

export default SwipeView;
