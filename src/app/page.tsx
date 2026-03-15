"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, ScanLine, ArrowRight, Navigation, MessageSquare, ArrowLeft, User, Users, RotateCcw } from 'lucide-react';
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
  <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A] p-4 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-sm bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white"
    >
      <h2 className="text-3xl font-extrabold tracking-tight text-white mb-6 text-center">今天想怎么吃？</h2>
      <div className="flex items-center bg-black/20 p-1 rounded-full my-6">
        <button 
          onClick={() => setLocalIsGroup(false)}
          className={`relative w-full text-sm font-semibold py-2.5 rounded-full transition-colors ${!localIsGroup ? 'text-white' : 'text-gray-400'}`}>
          {!localIsGroup && <motion.div layoutId="activePill" className="absolute inset-0 bg-white/10 rounded-full shadow-md" />}
          <span className="relative z-10">单人快速凑单</span>
        </button>
        <button 
          onClick={() => setLocalIsGroup(true)}
          className={`relative w-full text-sm font-semibold py-2.5 rounded-full transition-colors ${localIsGroup ? 'text-white' : 'text-gray-400'}`}>
          {localIsGroup && <motion.div layoutId="activePill" className="absolute inset-0 bg-white/10 rounded-full shadow-md" />}
          <span className="relative z-10">宿舍组局发牌</span>
        </button>
      </div>
      <button 
        onClick={handleStart}
        className="w-full bg-gradient-to-r from-[#FFD000] to-[#FFC300] text-black text-lg font-bold py-4 rounded-full shadow-[0_8px_20px_rgba(255,195,0,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
      >
        <ScanLine size={20} />
        锁定范围，生成美食牌库
      </button>
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">🔥 当前紫金港有 1,204 名同学正在发牌</p>
      </div>
      <div className="text-center mt-6">
        <p className="text-xs text-gray-500">最近常点: <span className="font-semibold text-gray-400">隆江猪脚饭、塔斯汀...</span></p>
      </div>
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
      className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">🎉 匹配成功！</h2>
        <p className="text-gray-500 mt-1">你们都馋这家！</p>
      </div>
      <div className="relative w-full h-48">
        <img src={matchedItem.image} alt={matchedItem.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-center text-gray-900">{matchedItem.name}</h3>
        <button 
          onClick={onConfirm}
          className="mt-6 w-full bg-gradient-to-r from-[#FFD000] to-[#FFC300] text-black font-bold text-lg rounded-xl py-4 shadow-[0_0_20px_rgba(255,195,0,0.3)] flex items-center justify-center gap-2"
        >
          查看组局神券 👉
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const SwipeView = ({ setAppStep, shortlist, setShortlist, setSuperLikedItem, isGroupMode, onToggleMode }) => {
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
      <header className="absolute top-0 z-30 w-full p-4 flex items-center justify-between gap-2 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-green-500" />
          <span className="font-bold text-gray-800">浙江大学（紫金港校区）</span>
        </div>
        <button onClick={onToggleMode} className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium flex items-center gap-1 bg-white shadow-sm transition-colors active:bg-gray-50">
          {isGroupMode ? (
            <><User size={14} /> 切换单人</>
          ) : (
            <><Users size={14} /> 切换组局</>
          )}
        </button>
      </header>

      <div className="absolute top-[72px] z-20 w-full flex gap-2 px-4 py-2 overflow-x-auto hide-scrollbar">
        <button className="whitespace-nowrap px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs rounded-full font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.02)]">👑 必吃榜</button>
        <button className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs text-gray-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">🛵 30分钟达</button>
        <button className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs text-gray-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">💰 20元内</button>
        <button className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs text-gray-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">⭐️ 评分最高</button>
      </div>

      <CardStack cards={cards} onLike={(c) => handleAction(c, 'like')} onPass={() => handleAction(cards[cards.length - 1], 'pass')} onSuperLike={() => handleAction(cards[cards.length - 1], 'superlike')} />

      <div className="absolute right-4 bottom-36 z-20">
        <button className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 shadow-glass flex items-center justify-center text-gray-500 active:scale-95 transition-transform">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="absolute bottom-28 z-20 w-full text-center">
        <p className="text-[10px] text-gray-400 mb-2">✨ 附近还有 18 家优质推荐</p>
      </div>

      {isGroupMode ? (
        <div className="absolute bottom-0 z-40 w-full h-28 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] p-4 flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex -space-x-4">
              <span className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-lg shadow-sm">🐶</span>
              <span className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-lg shadow-sm">🐱</span>
              <span className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-lg shadow-sm">🐼</span>
            </div>
            <p className="ml-4 font-semibold text-gray-600">正在等待室友滑动... (已选 <span className="text-gray-900 font-bold">{shortlist.length}</span> 家)</p>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-0 z-40 w-full h-28 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] p-4 flex items-center justify-between">
          <p className="font-semibold text-gray-500">已将 <span className="text-gray-800 font-bold">{shortlist.length}</span> 家餐厅加入备选</p>
          <button 
            onClick={() => setAppStep('SUMMARY')}
            disabled={shortlist.length === 0}
            className="font-bold text-lg rounded-full px-6 py-3 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none bg-gradient-to-r from-[#FFD000] to-[#FFC300] text-black shadow-[0_0_20px_rgba(255,195,0,0.3)] animate-pulse-slow"
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
    <div className="min-h-screen bg-[#F5F6F8] pb-32">
      <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button onClick={() => { setShortlist([]); setAppStep('SWIPE'); }} className="flex items-center gap-1 text-gray-600 font-medium">
          <ArrowLeft size={20} />
          返回重刷
        </button>
        <h1 className="font-bold text-lg text-gray-900">{isGroupMode ? '组局成功' : '确认订单'}</h1>
        <div className="w-16" />
      </header>

      <main className="px-4 pt-4">
        {isGroupMode && shortlist.length > 0 ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🎉 终选餐厅 🎉</h2>
              <p className="text-gray-500">就是它！你们共同的选择！</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <img src={shortlist[shortlist.length - 1].image} alt={shortlist[shortlist.length - 1].name} className="w-full h-40 rounded-xl object-cover" />
              <h3 className="text-xl font-bold mt-4 text-gray-900">{shortlist[shortlist.length - 1].name}</h3>
            </div>

            <div className="mt-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 to-black rounded-2xl p-5 text-center shadow-xl relative">
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-[#F5F6F8] rounded-full" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-[#F5F6F8] rounded-full" />
              <div className="absolute left-10 right-10 top-1/2 border-t border-dashed border-gray-500" />
              <p className="text-yellow-400 font-bold text-2xl drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">4人同行专享</p>
              <p className="text-white font-bold text-4xl mt-1 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">满100减30</p>
              <p className="text-yellow-500/80 text-sm mt-2">组局神券</p>
            </div>
          </>
        ) : (
          (() => {
            const finalShortlist = superLikedItem ? [superLikedItem] : shortlist;
            return (
              <>
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-gray-900">紫金港校区东1大门 (外卖柜)</p>
                      <p className="text-sm text-gray-500 mt-1">李同学 138****1234</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  {finalShortlist.map(item => (
                    <div key={item.id} className="flex items-start gap-3 mb-4 last:mb-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0" />
                      <div className="flex-1 flex flex-col justify-between h-16">
                        <p className="text-base font-bold text-gray-900 leading-tight">{item.name}</p>
                        <div className="flex justify-between items-end">
                          <span className="text-xs text-gray-500">打包费 ¥1</span>
                          <p className="font-black text-gray-900">
                            <span className="text-xs">¥</span>
                            <span className="text-lg">{item.price}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 border-dashed mt-2 pt-4 flex flex-col gap-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>菜品总价</span>
                      <span>¥{finalShortlist.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>配送费</span>
                      <span>¥1</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#FF4A26]">
                      <span>美团红包抵扣</span>
                      <span>-¥5.00</span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white px-4 py-3 border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.04)] z-50">
        {isGroupMode ? (
          <>
            <button className="w-full text-center text-sm text-gray-500 py-2 mb-1 active:text-gray-700 transition-colors">查看堂食路线</button>
            <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-[#FFD000] to-[#FFC300] text-black font-bold text-lg py-3.5 rounded-full shadow-[0_4px_12px_rgba(255,195,0,0.3)]">
              💬 召唤室友拼单
            </button>
          </>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-900 font-bold">合计</span>
              <span className="text-2xl font-black text-[#FF4A26]">¥{(shortlist.reduce((acc, item) => acc + parseFloat(item.price), 0) + 1 - 5).toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="w-1/2 bg-gradient-to-r from-[#FFD000] to-[#FFC300] text-black font-bold text-lg py-3.5 rounded-full shadow-[0_4px_12px_rgba(255,195,0,0.3)]">
              🛵 极速外卖下单
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

  const handleToggleMode = () => {
    setIsGroupMode(prev => !prev);
    setShortlist([]);
  };

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
            <SwipeView setAppStep={setAppStep} shortlist={shortlist} setShortlist={setShortlist} setSuperLikedItem={setSuperLikedItem} isGroupMode={isGroupMode} onToggleMode={handleToggleMode} />
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
