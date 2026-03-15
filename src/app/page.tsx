"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, ScanLine, ArrowRight, Navigation, MessageSquare } from 'lucide-react';
import CardStack from '@/components/CardStack'; // Assuming this is our well-designed card stack
import { FOOD_ITEMS } from '@/lib/data'; // Assuming data is here

// --- TYPE DEFINITIONS ---
type AppStep = 'SEARCH' | 'SCANNING' | 'SWIPE' | 'SUMMARY';

// --- VIEW COMPONENTS (defined in the same file for simplicity) ---

const SearchView = ({ setAppStep }) => (
  <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A] p-4" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(40, 40, 40, 0) 0%, #1A1A1A 70%), linear-gradient(-45deg, rgba(30,30,30,0.8) 25%, transparent 25%, transparent 50%, rgba(30,30,30,0.8) 50%, rgba(30,30,30,0.8) 75%, transparent 75%, transparent)', backgroundSize: '100% 100%, 10px 10px' }}>
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-glass text-white"
    >
      <h2 className="text-2xl font-bold tracking-tight">今天在紫金港怎么吃？</h2>
      <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full my-6">
        {/* Simplified Toggle */}
        <button className="w-full text-sm font-semibold py-2 rounded-full bg-surface text-text-primary">单人外卖</button>
        <button className="w-full text-sm font-semibold py-2 rounded-full text-gray-400">宿舍组局</button>
      </div>
      <button 
        onClick={() => setAppStep('SCANNING')}
        className="w-full bg-brand-primary text-black font-bold text-lg rounded-xl py-4 shadow-lg flex items-center justify-center gap-2"
      >
        <ScanLine size={20} />
        锁定范围，生成美食牌库
      </button>
    </motion.div>
  </div>
);

const ScanningView = ({ setAppStep }) => {
  useEffect(() => {
    const timer = setTimeout(() => setAppStep('SWIPE'), 2500);
    return () => clearTimeout(timer);
  }, [setAppStep]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A]">
      <div className="relative flex items-center justify-center w-48 h-48">
        <motion.div className="absolute w-full h-full rounded-full bg-brand-primary/20" animate={{ scale: [1, 3], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
        <motion.div className="absolute w-full h-full rounded-full bg-brand-primary/20" animate={{ scale: [1, 3], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
        <MapPin size={56} className="text-brand-primary relative z-10" />
      </div>
      <p className="mt-4 text-gray-400 font-medium">正在分析周边 1.5km 优质商户...</p>
    </div>
  );
};

const SwipeView = ({ setAppStep, shortlist, setShortlist }) => {
  const [cards, setCards] = useState(FOOD_ITEMS);

  const handleAction = (card, action) => {
    if (action === 'like') {
      setShortlist(prev => [...prev, card]);
    }
    setCards(prev => prev.filter(c => c.id !== card.id));
  };
  
  if (cards.length === 0) {
    useEffect(() => setAppStep('SUMMARY'), [setAppStep]);
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col items-center bg-background">
      <CardStack cards={cards} onLike={(c) => handleAction(c, 'like')} onPass={(c) => handleAction(c, 'pass')} onSuperLike={(c) => handleAction(c, 'like')} />
      <div className="absolute bottom-0 z-40 w-full h-24 bg-surface-muted p-4 flex items-center justify-between shadow-top">
        <p className="font-semibold text-text-secondary">已将 <span className="text-text-primary font-bold">{shortlist.length}</span> 家餐厅加入备选</p>
        <button 
          onClick={() => setAppStep('SUMMARY')}
          disabled={shortlist.length === 0}
          className="font-bold text-lg rounded-full px-6 py-3 transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-brand-primary text-black"
        >
          对比决策 👉
        </button>
      </div>
    </div>
  );
};

const SummaryView = ({ setAppStep, shortlist, setShortlist }) => (
  <div className="h-full w-full flex flex-col bg-background">
    <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
      <button onClick={() => { setShortlist([]); setAppStep('SWIPE'); }} className="flex items-center gap-1 text-text-secondary font-medium">
        <ArrowLeft size={18} />
        返回重刷
      </button>
      <h1 className="font-bold text-lg text-text-primary">终极对决</h1>
      <div className="w-12" />
    </header>
    <main className="flex-grow p-4 overflow-y-auto space-y-2">
      {shortlist.map(item => (
        <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface shadow-sm">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
          <div className="flex-grow">
            <p className="font-bold text-text-primary">{item.name}</p>
            <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full w-fit mt-1">📍 {item.locationTag}</p>
          </div>
          <p className="font-bold text-xl text-price-highlight">¥{item.price}</p>
        </div>
      ))}
    </main>
    <footer className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around items-center">
        <button className="flex flex-col items-center gap-1.5 text-text-primary">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-brand-primary text-black shadow-lg">
            <ArrowRight size={32} />
          </div>
          <span className="text-xs font-semibold">极速外卖下单</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-text-secondary">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-200">
            <Navigation size={28} />
          </div>
          <span className="text-xs font-semibold">去堂食</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-text-secondary">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-200">
            <MessageSquare size={28} />
          </div>
          <span className="text-xs font-semibold">发送给室友</span>
        </button>
      </div>
    </footer>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [appStep, setAppStep] = useState<AppStep>('SEARCH');
  const [shortlist, setShortlist] = useState<any[]>([]);

  const viewVariants = {
    initial: { opacity: 0, scale: 0.98 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 1.02, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <div className="h-full w-full flex flex-col items-center overflow-hidden">
      <AnimatePresence mode="wait">
        {appStep === 'SEARCH' && (
          <motion.div key="search" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <SearchView setAppStep={setAppStep} />
          </motion.div>
        )}
        {appStep === 'SCANNING' && (
          <motion.div key="scanning" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <ScanningView setAppStep={setAppStep} />
          </motion.div>
        )}
        {appStep === 'SWIPE' && (
          <motion.div key="swipe" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <SwipeView setAppStep={setAppStep} shortlist={shortlist} setShortlist={setShortlist} />
          </motion.div>
        )}
        {appStep === 'SUMMARY' && (
          <motion.div key="summary" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <SummaryView setAppStep={setAppStep} shortlist={shortlist} setShortlist={setShortlist} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
