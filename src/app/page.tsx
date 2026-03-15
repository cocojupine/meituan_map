"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, ScanLine, ArrowRight, Navigation, MessageSquare, ArrowLeft } from 'lucide-react';
import CardStack from '@/components/CardStack'; // Assuming this is our well-designed card stack
import { FOOD_ITEMS } from '@/lib/data'; // Assuming data is here

// --- TYPE DEFINITIONS ---
type AppStep = 'SEARCH' | 'SCANNING' | 'SWIPE' | 'SUMMARY';

// --- VIEW COMPONENTS (defined in the same file for simplicity) ---

const SearchView = ({ setAppStep, setIsGroupMode }) => {
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

// --- MATCH MODAL COMPONENT ---
const MatchModal = ({ matchedItem, onConfirm }) => (
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

const SwipeView = ({ setAppStep, shortlist, setShortlist, setSuperLikedItem, isGroupMode }) => {
  const [cards, setCards] = useState(FOOD_ITEMS);
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

  const handleAction = (card, action) => {
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
      <CardStack cards={cards} onLike={(c) => handleAction(c, 'like')} onPass={() => handleAction(cards[cards.length - 1], 'pass')} onSuperLike={() => handleAction(cards[cards.length - 1], 'superlike')} />
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
        {showMatchModal && <MatchModal matchedItem={shortlist[2]} onConfirm={handleConfirmMatch} />}
      </AnimatePresence>
    </div>
  );
};

const SummaryView = ({ setAppStep, shortlist, setShortlist, superLikedItem, isGroupMode }) => {
  const [showPaymentToast, setShowPaymentToast] = useState(false);

  const handleCheckout = () => {
    setShowPaymentToast(true);
    setTimeout(() => setShowPaymentToast(false), 3000);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={() => { setShortlist([]); setAppStep('SWIPE'); }} className="flex items-center gap-1 text-text-secondary font-medium">
          <ArrowLeft size={18} />
          返回重刷
        </button>
        <h1 className="font-bold text-lg text-text-primary">{isGroupMode ? '组局成功' : '终极对决'}</h1>
        <div className="w-12" />
      </header>

      {isGroupMode && shortlist.length > 0 ? (
        <main className="flex-grow p-4 overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">🎉 终选餐厅 🎉</h2>
            <p className="text-text-secondary">就是它！你们共同的选择！</p>
          </div>
          <div className="bg-surface rounded-2xl shadow-lg p-4">
            <img src={shortlist[shortlist.length - 1].image} alt={shortlist[shortlist.length - 1].name} className="w-full h-40 rounded-xl object-cover" />
            <h3 className="text-xl font-bold mt-4">{shortlist[shortlist.length - 1].name}</h3>
          </div>

          <div className="mt-6 bg-[#1A1A1A] rounded-2xl p-5 text-center shadow-xl">
            <p className="text-yellow-400 font-bold text-2xl">4人同行专享</p>
            <p className="text-white font-bold text-4xl mt-1">满100减30</p>
            <p className="text-yellow-500/80 text-sm mt-2">组局神券</p>
          </div>
        </main>
      ) : (
        <main className="flex-grow p-4 overflow-y-auto space-y-2">
          {shortlist.map(item => (
            <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl bg-surface shadow-sm">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
              <div className="flex-grow">
                {superLikedItem?.id === item.id && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 15 }} className="mb-1.5 w-fit bg-gradient-to-r from-red-500 to-orange-400 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">🔥 极速必吃</motion.div>
                )}
                <p className="font-bold text-text-primary text-lg">{item.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-text-secondary font-medium bg-gray-100 px-2 py-0.5 rounded-full w-fit">📍 {item.locationTag}</p>
                  <p className="font-bold text-xl text-price-highlight">¥{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </main>
      )}

      <footer className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        {isGroupMode ? (
          <div className="flex flex-col gap-3">
            <button onClick={handleCheckout} className="w-full bg-brand-primary text-black font-bold text-lg rounded-xl py-4 shadow-lg">
              一键召唤室友拼单
            </button>
            <button className="w-full bg-gray-200 text-text-primary font-bold text-lg rounded-xl py-4">
              查看堂食路线
            </button>
          </div>
        ) : (
          <div className="flex justify-around items-center">
            <button onClick={handleCheckout} className="flex flex-col items-center gap-1.5 text-text-primary">
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
        )}
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
              <h3 className="text-lg font-bold text-green-600">{isGroupMode ? '组局口令已复制' : '支付成功！'}</h3>
              <p className="text-text-secondary mt-2">{isGroupMode ? '快去微信群召唤室友吧！' : '商家已接单，骑手正赶往餐厅'}</p>
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
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [superLikedItem, setSuperLikedItem] = useState<any | null>(null);
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
            <SwipeView setAppStep={setAppStep} shortlist={shortlist} setShortlist={setShortlist} setSuperLikedItem={setSuperLikedItem} isGroupMode={isGroupMode} />
          </motion.div>
        )}
        {appStep === 'SUMMARY' && (
          <motion.div key="summary" variants={viewVariants} initial="initial" animate="enter" exit="exit" className="w-full h-full">
            <SummaryView setAppStep={setAppStep} shortlist={shortlist} setShortlist={setShortlist} superLikedItem={superLikedItem} isGroupMode={isGroupMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
