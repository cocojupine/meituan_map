"use client";

import { useState, useEffect, Dispatch, SetStateAction, FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, ScanLine, User, Users } from 'lucide-react';
import CardStack from '@/components/CardStack';
import { FOOD_ITEMS } from '@/lib/data';

// --- TYPE DEFINITIONS ---
type AppStep = 'SEARCH' | 'SCANNING' | 'SWIPE' | 'SUMMARY';

interface FoodItem {
  id: number;
  name: string;
  price: string;
  image: string;
  tags: string[];
  rating: number;
  sales: number;
  description: string;
}

// --- PROPS INTERFACES ---
interface ViewProps {
  setAppStep: Dispatch<SetStateAction<AppStep>>;
}

interface SearchViewProps extends ViewProps {
  setIsGroupMode: Dispatch<SetStateAction<boolean>>;
}

interface SwipeViewProps extends ViewProps {
  cards: FoodItem[];
  setCards: Dispatch<SetStateAction<FoodItem[]>>;
  shortlist: FoodItem[];
  setShortlist: Dispatch<SetStateAction<FoodItem[]>>;
  setSuperLikedItem: Dispatch<SetStateAction<FoodItem | null>>;
  isGroupMode: boolean;
  onToggleMode: () => void;
}

interface SummaryViewProps extends ViewProps {
  shortlist: FoodItem[];
  setShortlist: Dispatch<SetStateAction<FoodItem[]>>;
  superLikedItem: FoodItem | null;
  isGroupMode: boolean;
}

interface MatchModalProps {
  matchedItem: FoodItem;
  onConfirm: () => void;
}


// --- VIEW COMPONENTS ---

const SearchView: FC<SearchViewProps> = ({ setAppStep, setIsGroupMode }) => {
  const [localIsGroup, setLocalIsGroup] = useState(false);

  const handleStart = () => {
    setIsGroupMode(localIsGroup);
    setAppStep('SCANNING');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#1A1A1A] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] text-white">
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
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

const ScanningView: FC<ViewProps> = ({ setAppStep }) => {
  useEffect(() => {
    const timer = setTimeout(() => setAppStep('SWIPE'), 2500);
    return () => clearTimeout(timer);
  }, [setAppStep]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
      <div className="relative flex items-center justify-center w-48 h-48">
        <motion.div className="absolute w-full h-full rounded-full bg-yellow-400/20" animate={{ scale: [1, 3], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
        <motion.div className="absolute w-full h-full rounded-full bg-yellow-400/20" animate={{ scale: [1, 3], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
        <MapPin size={56} className="text-yellow-400 relative z-10" />
      </div>
      <p className="mt-4 text-gray-400 font-medium">正在分析周边 1.5km 优质商户...</p>
    </div>
  );
};

const MatchModal: FC<MatchModalProps> = ({ matchedItem, onConfirm }) => (
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
        <Image src={matchedItem.image} alt={matchedItem.name} layout="fill" objectFit="cover" />
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

const SwipeView: FC<SwipeViewProps> = ({ setAppStep, cards, setCards, shortlist, setShortlist, setSuperLikedItem, isGroupMode, onToggleMode }) => {
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
    if (!card) return;

    if (action !== 'superlike') {
      setCards(prev => prev.filter(c => c.id !== card.id));
    }

    if (action === 'like') {
      setShortlist(prev => [...prev, card]);
    } else if (action === 'superlike') {
      setShortlist(prev => [...prev, card]);
      setSuperLikedItem(card);
      setAppStep('SUMMARY');
    }
  };
  
  if (cards.length === 0 && !showMatchModal) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#1A1A1A] p-4 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <MapPin className="text-gray-600 w-16 h-16 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-300 mt-4">附近的优质推荐已刷完啦 ✨</h3>
          <p className="text-gray-500 mt-1">快去看看你挑选了哪些美食吧！</p>
          <button 
            onClick={() => setAppStep('SUMMARY')}
            className="mt-8 w-full max-w-xs bg-gradient-to-r from-[#FFD000] to-[#FFC300] text-black font-bold text-lg rounded-xl py-4 shadow-[0_0_20px_rgba(255,195,0,0.3)] flex items-center justify-center gap-2"
          >
            查看我的决策池 👉
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#1A1A1A] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <header className="flex-shrink-0 w-full p-4 flex items-center justify-between gap-2 z-30 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-green-400" />
          <span className="font-bold text-white">浙江大学（紫金港校区）</span>
        </div>
        <button onClick={onToggleMode} className="px-3 py-1.5 rounded-full border border-white/20 text-xs font-medium flex items-center gap-1 bg-white/10 text-white shadow-sm transition-colors active:bg-white/20">
          {isGroupMode ? <><User size={14} /> 切换单人</> : <><Users size={14} /> 切换组局</>}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="relative w-full h-full max-w-sm">
          <CardStack cards={cards} onLike={(c) => handleAction(c, 'like')} onPass={(c) => handleAction(c, 'pass')} onSuperLike={(c) => handleAction(c, 'superlike')} />
        </div>
      </main>

      <footer className="flex-shrink-0 w-full z-40 bg-black/10 backdrop-blur-xl border-t border-white/10">
        {isGroupMode ? (
          <div className="h-28 p-4 flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex -space-x-4">
                <span className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-lg shadow-sm">🐶</span>
                <span className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-lg shadow-sm">🐱</span>
                <span className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-lg shadow-sm">🐼</span>
              </div>
              <p className="ml-4 font-semibold text-gray-400">正在等待室友滑动... (已选 <span className="text-white font-bold">{shortlist.length}</span> 家)</p>
            </div>
          </div>
        ) : (
          <div className="h-28 p-4 flex items-center justify-between">
            <p className="font-semibold text-gray-400">已将 <span className="text-white font-bold">{shortlist.length}</span> 家餐厅加入备选</p>
            <button 
              onClick={() => setAppStep('SUMMARY')}
              disabled={shortlist.length === 0}
              className="font-bold text-lg rounded-full px-6 py-3 transition-all disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none bg-gradient-to-r from-[#FFD000] to-[#FFC300] text-black shadow-[0_0_20px_rgba(255,195,0,0.3)]"
            >
              对比决策 👉
            </button>
          </div>
        )}
      </footer>

      <AnimatePresence>
        {showMatchModal && shortlist.length >= 3 && <MatchModal matchedItem={shortlist[2]} onConfirm={handleConfirmMatch} />}
      </AnimatePresence>
    </div>
  );
};

const SummaryView: FC<SummaryViewProps> = ({ setAppStep, shortlist, setShortlist, superLikedItem, isGroupMode }) => {
    const [showPaymentToast, setShowPaymentToast] = useState(false);

    const handleCheckout = () => {
      setShowPaymentToast(true);
      setTimeout(() => setShowPaymentToast(false), 3000);
    };

    const finalShortlist = superLikedItem ? [superLikedItem] : shortlist;
    const subtotal = finalShortlist.reduce((acc, item) => acc + parseFloat(item.price), 0);
    const packagingFee = 2.5;
    const deliveryFee = 5;
    const total = subtotal + packagingFee + deliveryFee;

    const FeeLine = ({ label, amount, isBold = false }: { label: string; amount: number; isBold?: boolean }) => (
      <div className={`flex justify-between items-center ${isBold ? 'font-bold' : ''}`}>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-sm ${isBold ? 'font-bold' : 'text-gray-800'}`}>¥{amount.toFixed(2)}</p>
      </div>
    );

    if (isGroupMode) {
      return (
        <div className="w-full h-full bg-gray-50 flex flex-col">
          <header className="bg-white shadow-sm p-4 text-center relative flex-shrink-0">
            <button onClick={() => setAppStep('SWIPE')} className="absolute left-4 top-1/2 -translate-y-1/2 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-xl font-bold">小组订单确认</h1>
          </header>
          <main className="p-4 flex-1 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">🎉 组局成功! 🎉</h2>
                <p className="text-center text-gray-600 mb-6">已为你们选出最佳组合，并自动领取优惠券！</p>
                <div className="space-y-3">
                  {shortlist.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="w-10 h-10 rounded-md object-cover"/>
                        <span className="font-semibold text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-lg text-green-600">¥{parseFloat(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                  <div className="mt-6 text-center p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <h3 className="font-bold text-lg text-yellow-800">获得8折优惠券!</h3>
                    <p className="text-yellow-700 mt-1 text-sm">已自动放入您的账户，下次下单可用。</p>
                </div>
            </div>
          </main>
          <footer className="flex-shrink-0 bg-white/80 backdrop-blur-lg px-4 py-3 border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.04)] z-10 flex justify-between items-center">
            <button onClick={() => setAppStep('SWIPE')} className="text-gray-600">返回修改</button>
            <button onClick={() => {
              setShortlist([]);
              setAppStep('SEARCH');
            }} className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-full shadow-lg">
              发起新的组局
            </button>
          </footer>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-[#F5F6F8] flex flex-col">
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-lg z-10 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setAppStep('SWIPE')} className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-lg font-bold text-gray-900">确认订单</h1>
            <div className="w-8"></div>
          </div>
        </header>

        <main className="flex-1 px-4 pt-4 pb-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">配送至</p>
                <p className="font-bold text-lg text-gray-900">环球贸易中心 Wework</p>
                <p className="text-sm text-gray-600 mt-1">张三 188****8888</p>
              </div>
              <button className="text-sm font-medium text-blue-600 mt-1">修改</button>
            </div>
            <div className="border-t border-dashed my-4"></div>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">预计送达</p>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <p className="font-bold text-blue-600">12:30</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">商品</h2>
              <p className="text-sm text-gray-500">共 {finalShortlist.length} 件</p>
            </div>
            <div className="space-y-4">
              {finalShortlist.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image src={item.image} alt={item.name} width={64} height={64} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">默认</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">¥{parseFloat(item.price).toFixed(2)}</p>
                    <p className="text-sm text-gray-400">x1</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed my-4"></div>
            <div className="space-y-3">
              <FeeLine label="包装费" amount={packagingFee} />
              <FeeLine label="配送费" amount={deliveryFee} />
            </div>
            <div className="border-t border-dashed my-4"></div>
            <div className="space-y-3">
                <div className="flex justify-between items-center cursor-pointer">
                <p className="text-sm text-gray-600">订单备注</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400">口味、偏好等</p>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
              <div className="flex justify-between items-center cursor-pointer">
                <p className="text-sm text-gray-600">发票</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400">不支持开发票</p>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
            <div className="border-t border-dashed my-4"></div>
            <div className="flex justify-between items-center cursor-pointer">
              <p className="text-sm text-gray-600">优惠券</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-red-500">-¥2.00</p>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </div>
        </main>

        <footer className="flex-shrink-0 bg-white/80 backdrop-blur-lg z-10">
          <div className="border-t shadow-[0_-10px_30px_rgba(0,0,0,0.08)] px-4 pt-3 pb-4">
            <div className="flex justify-end items-center mb-2 gap-2">
                <p className="text-sm text-gray-500">已优惠 ¥2.00</p>
                <p className="text-sm font-medium text-gray-800">合计</p>
                <p className="text-2xl font-bold text-red-500">¥{(total - 2).toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center gap-3">
                <button onClick={() => setAppStep('SWIPE')} className="text-gray-600 font-medium">返回修改</button>
              <button onClick={handleCheckout} className="flex-grow bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg shadow-yellow-500/50">
                提交订单
              </button>
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {showPaymentToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full shadow-xl z-50"
            >
              支付成功! 订单已确认。
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
  const [cards, setCards] = useState<FoodItem[]>(FOOD_ITEMS);

  const handleToggleMode = () => {
    setIsGroupMode(prev => !prev);
    setShortlist([]);
    setCards(FOOD_ITEMS); // Reset cards when toggling mode
  };

  const viewVariants = {
    initial: { opacity: 0, scale: 0.98 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, scale: 1.02, transition: { duration: 0.2, ease: 'easeInOut' } },
  };
  
  const CurrentView = () => {
    switch (appStep) {
      case 'SEARCH':
        return <SearchView setAppStep={setAppStep} setIsGroupMode={setIsGroupMode} />;
      case 'SCANNING':
        return <ScanningView setAppStep={setAppStep} />;
      case 'SWIPE':
        return <SwipeView setAppStep={setAppStep} cards={cards} setCards={setCards} shortlist={shortlist} setShortlist={setShortlist} setSuperLikedItem={setSuperLikedItem} isGroupMode={isGroupMode} onToggleMode={handleToggleMode} />;
      case 'SUMMARY':
        return <SummaryView setAppStep={setAppStep} shortlist={shortlist} setShortlist={setShortlist} superLikedItem={superLikedItem} isGroupMode={isGroupMode} />;
      default:
        return null;
    }
  };

  return (
    <main className="w-full h-screen bg-gray-900 flex items-center justify-center p-4 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* This is the single, persistent "phone" container */}
      <div className="w-full max-w-sm h-[95vh] max-h-[850px] relative flex flex-col overflow-hidden">
        <AnimatePresence>
          <motion.div 
            key={appStep} 
            variants={viewVariants} 
            initial="initial" 
            animate="enter" 
            exit="exit" 
            className="w-full h-full absolute top-0 left-0"
          >
            <CurrentView />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
