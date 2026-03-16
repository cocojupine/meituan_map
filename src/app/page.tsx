"use client";

import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, ScanLine, ArrowRight, Navigation, MessageSquare, ArrowLeft } from 'lucide-react';
import CardStack from '@/components/CardStack';
import { FOOD_ITEMS } from '@/lib/data';

// --- TYPE DEFINITIONS ---
type AppStep = 'SEARCH' | 'SCANNING' | 'SWIPE' | 'SUMMARY';

// This interface must match the structure of objects in lib/data.ts
interface FoodItem {
  id: number;
  name: string;
  price: string;
  image: string;
  locationTag: string;
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

// --- VIEW COMPONENTS ---

interface SearchViewProps {
  setAppStep: Dispatch<SetStateAction<AppStep>>;
  setIsGroupMode: Dispatch<SetStateAction<boolean>>;
}

const SearchView = ({ setAppStep, setIsGroupMode }: SearchViewProps) => {
  const [localIsGroup, setLocalIsGroup] = useState(false);

  const handleStart = () => {
    setIsGroupMode(localIsGroup);
    setAppStep('SCANNING');
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A] p-4" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(40, 40, 40, 0) 0%, #1A1A1A 70%), linear-gradient(-45deg, rgba(30,30,30,0.8) 25%, transparent 25%, transparent 50%, rgba(30,30,30,0.8) 50%, rgba(30,30,30,0.8) 75%, transparent 75%, transparent)', backgroundSize: '100% 100%, 10px 10px' }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-glass text-white"
      >
        <h2 className="text-2xl font-bold tracking-tight">今天在紫金港怎么吃？</h2>
        <p className="text-sm text-white/60 mt-1">选择模式，让我为你生成专属美食牌库</p>
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full my-6">
          <button 
            onClick={() => setLocalIsGroup(false)}
            className={`w-full text-sm font-semibold py-2 rounded-full transition-colors ${!localIsGroup ? 'bg-surface text-text-primary' : 'text-gray-400'}`}>
            单人快速凑单
          </button>
          <button 
            onClick={() => setLocalIsGroup(true)}
            className={`w-full text-sm font-semibold py-2 rounded-full transition-colors ${localIsGroup ? 'bg-surface text-text-primary' : 'text-gray-400'}`}>
            宿舍组局发牌
          </button>
        </div>
        <button 
          onClick={handleStart}
          className="w-full bg-brand-primary text-black font-bold text-lg rounded-xl py-4 shadow-lg flex items-center justify-center gap-2"
        >
          <ScanLine size={20} />
          锁定范围，生成美食牌库
        </button>
      </motion.div>
    </div>
  );
};

interface ScanningViewProps {
  setAppStep: Dispatch<SetStateAction<AppStep>>;
}

const ScanningView = ({ setAppStep }: ScanningViewProps) => {
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

interface MatchModalProps {
  matchedItem: FoodItem;
  onConfirm: () => void;
}

const MatchModal = ({ matchedItem, onConfirm }: MatchModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4"
  >
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 100 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
      className="w-full max-w-sm bg-surface rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-text-primary">🎉 匹配成功！</h2>
        <p className="text-text-secondary mt-1">你们都馋这家！</p>
      </div>
      <div className="relative w-full h-48">
        <img src={matchedItem.image} alt={matchedItem.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-center">{matchedItem.name}</h3>
        <button 
          onClick={onConfirm}
          className="mt-6 w-full bg-brand-primary text-black font-bold text-lg rounded-xl py-4 shadow-lg flex items-center justify-center gap-2"
        >
          查看组局神券 👉
        </button>
      </div>
    </motion.div>
  </motion.div>
);

interface SwipeViewProps {
  setAppStep: Dispatch<SetStateAction<AppStep>>;
  shortlist: FoodItem[];
  setShortlist: Dispatch<SetStateAction<FoodItem[]>>;
  setSuperLikedItem: Dispatch<SetStateAction<FoodItem | null>>;
  isGroupMode: boolean;
  setIsGroupMode: Dispatch<SetStateAction<boolean>>;
}

const SwipeView = ({ setAppStep, shortlist, setShortlist, setSuperLikedItem, isGroupMode, setIsGroupMode }: SwipeViewProps) => {
  const [cards, setCards] = useState<FoodItem[]>(FOOD_ITEMS);
  const [showMatchModal, setShowMatchModal] = useState(false);

  useEffect(() => {
    if (isGroupMode && shortlist.length === 3) {
      setShowMatchModal(true);
    }
  }, [shortlist, isGroupMode]);

  const handleConfirmMatch = () => {
    setShowMatchModal(false);
    setAppStep('SUMMARY');
  };

  const handleAction = (card: FoodItem, action: 'like' | 'pass' | 'superlike') => {
    if (action === 'like') {
      setShortlist(prev => [...prev, card]);
      setCards(prev => prev.filter(c => c.id !== card.id));
    } else if (action === 'pass') {
      setCards(prev => prev.filter(c => c.id !== card.id));
    } else if (action === 'superlike') {
      setShortlist(prev => [...prev, card]);
      setSuperLikedItem(card);
      setAppStep('SUMMARY');
    }
  };
  
  if (cards.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-background p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <MapPin className="text-gray-300 w-16 h-16 mx-auto" />
          <h3 className="text-lg font-semibold text-text-primary mt-4">附近的优质推荐已刷完啦 ✨</h3>
          <p className="text-text-secondary mt-1">快去看看你挑选了哪些美食吧！</p>
          <button 
            onClick={() => setAppStep('SUMMARY')}
            className="mt-8 w-full max-w-xs bg-brand-primary text-black font-bold text-lg rounded-xl py-4 shadow-lg flex items-center justify-center gap-2"
          >
            查看我的决策池 👉
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center bg-background">
      {/* --- Top Bar Added --- */}
      <header className="absolute top-0 z-50 w-full p-4 flex items-center justify-center">
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full backdrop-blur-lg border border-white/10">
          <button 
            onClick={() => setIsGroupMode(false)}
            className={`w-28 text-sm font-semibold py-1.5 rounded-full transition-colors ${!isGroupMode ? 'bg-surface text-text-primary' : 'text-gray-400'}`}>
            单人模式
          </button>
          <button 
            onClick={() => setIsGroupMode(true)}
            className={`w-28 text-sm font-semibold py-1.5 rounded-full transition-colors ${isGroupMode ? 'bg-surface text-text-primary' : 'text-gray-400'}`}>
            组局模式
          </button>
        </div>
      </header>

      <CardStack 
        cards={cards} 
        onLike={(c) => {
          if (c && c.locationTag) {
            handleAction(c as FoodItem, 'like');
          }
        }} 
        onPass={() => handleAction(cards[cards.length - 1], 'pass')} 
        onSuperLike={() => handleAction(cards[cards.length - 1], 'superlike')} 
      />
      {isGroupMode ? (
        <div className="absolute bottom-0 z-40 w-full h-24 bg-surface-muted p-4 flex items-center justify-center shadow-top">
          <div className="flex items-center">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm">🐶</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm">🐱</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm">🐼</div>
            </div>
            <p className="ml-3 font-semibold text-text-secondary">正在等待室友滑动... (已选 <span className="text-text-primary font-bold">{shortlist.length}</span> 家)</p>
          </div>
        </div>
      ) : (
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
      )}
      <AnimatePresence>
        {showMatchModal && shortlist.length >= 3 && <MatchModal matchedItem={shortlist[2]} onConfirm={handleConfirmMatch} />}
      </AnimatePresence>
    </div>
  );
};

interface SummaryViewProps {
  setAppStep: Dispatch<SetStateAction<AppStep>>;
  shortlist: FoodItem[];
  setShortlist: Dispatch<SetStateAction<FoodItem[]>>;
  superLikedItem: FoodItem | null;
  isGroupMode: boolean;
}

const SummaryView = ({ setAppStep, shortlist, setShortlist, superLikedItem, isGroupMode }: SummaryViewProps) => {
  const [showPaymentToast, setShowPaymentToast] = useState(false);

  const handleCheckout = () => {
    setShowPaymentToast(true);
    setTimeout(() => setShowPaymentToast(false), 3000);
  };

  // Calculate total price
  const totalPrice = shortlist.reduce((acc, item) => acc + parseFloat(item.price), 0);
  const deliveryFee = 5.0;
  const packageFee = 2.0;
  const finalPrice = totalPrice + deliveryFee + packageFee;

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button onClick={() => { setShortlist([]); setAppStep('SWIPE'); }} className="flex items-center gap-1 text-gray-600 font-medium">
          <ArrowLeft size={18} />
          返回重刷
        </button>
        <h1 className="font-bold text-lg text-gray-800">确认订单</h1>
        <div className="w-12" />
      </header>

      <main className="flex-grow p-4 overflow-y-auto space-y-4">
        {/* Address Module */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-800">浙江大学 紫金港校区</p>
              <p className="text-sm text-gray-500 mt-0.5">张三 138****1234</p>
            </div>
          </div>
        </div>

        {/* Order Details Module */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-3">商品明细</h3>
          {shortlist.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-dashed border-gray-200 last:border-b-0">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
              <p className="flex-grow font-medium text-gray-700">{item.name}</p>
              <p className="font-bold text-gray-800">¥{item.price}</p>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 mt-2 text-sm">
            <p className="text-gray-600">打包费</p>
            <p className="font-medium text-gray-800">¥{packageFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center pt-2 text-sm border-b border-gray-200 pb-3">
            <p className="text-gray-600">配送费</p>
            <p className="font-medium text-gray-800">¥{deliveryFee.toFixed(2)}</p>
          </div>
          <div className="text-right mt-3">
            <p className="text-gray-500 text-sm">合计 <span className="font-bold text-red-500 text-2xl">¥{finalPrice.toFixed(2)}</span></p>
          </div>
        </div>
      </main>

      <footer className="flex-shrink-0 p-4 bg-white border-t border-gray-200/80 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-center w-full">
          <a href="#" className="text-sm text-blue-500 mb-3">查看堂食路线</a>
          <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg rounded-full py-3 shadow-lg">
            提交订单
          </button>
        </div>
      </footer>

      <AnimatePresence>
        {showPaymentToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl p-6 text-center shadow-xl">
              <h3 className="text-lg font-bold text-green-600">支付成功！</h3>
              <p className="text-text-secondary mt-2">商家已接单，骑手正赶往餐厅</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [appStep, setAppStep] = useState<AppStep>('SEARCH');
  const [shortlist, setShortlist] = useState<FoodItem[]>([]);
  const [superLikedItem, setSuperLikedItem] = useState<FoodItem | null>(null);
  const [isGroupMode, setIsGroupMode] = useState(false);

  const viewVariants = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeInOut' } },
  };

  return (
    <div className="h-full w-full flex flex-col items-center overflow-hidden">
      <AnimatePresence mode="wait">
        {appStep === 'SEARCH' && (
          <motion.div key="search" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <SearchView setAppStep={setAppStep} setIsGroupMode={setIsGroupMode} />
          </motion.div>
        )}
        {appStep === 'SCANNING' && (
          <motion.div key="scanning" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <ScanningView setAppStep={setAppStep} />
          </motion.div>
        )}
        {appStep === 'SWIPE' && (
          <motion.div key="swipe" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <SwipeView 
              setAppStep={setAppStep} 
              shortlist={shortlist} 
              setShortlist={setShortlist} 
              setSuperLikedItem={setSuperLikedItem} 
              isGroupMode={isGroupMode} 
              setIsGroupMode={setIsGroupMode} 
            />
          </motion.div>
        )}
        {appStep === 'SUMMARY' && (
          <motion.div key="summary" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <SummaryView 
              setAppStep={setAppStep} 
              shortlist={shortlist} 
              setShortlist={setShortlist} 
              superLikedItem={superLikedItem} 
              isGroupMode={isGroupMode} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
