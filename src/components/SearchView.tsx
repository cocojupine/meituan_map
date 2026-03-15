"use client";

import { useState, FC, Dispatch, SetStateAction, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ScanLine } from 'lucide-react';

type AppStep = 'SEARCH' | 'SCANNING' | 'SWIPE' | 'SUMMARY';

interface RadarScannerProps {
  onScanComplete: () => void;
}

const RadarScanner: FC<RadarScannerProps> = ({ onScanComplete }) => {
  // This component will just show the animation and then trigger completion
  useEffect(() => {
    const timer = setTimeout(onScanComplete, 2000);
    return () => clearTimeout(timer);
  }, [onScanComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1A1A]">
      <div className="relative flex items-center justify-center w-48 h-48">
        <motion.div className="absolute w-full h-full rounded-full bg-brand-primary/20" animate={{ scale: [1, 3], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
        <motion.div className="absolute w-full h-full rounded-full bg-brand-primary/20" animate={{ scale: [1, 3], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
        <MapPin size={48} className="text-brand-primary" />
      </div>
      <p className="mt-4 text-text-secondary font-medium">📡 扫描周边 1.5km 优质商户...</p>
    </div>
  );
};

interface SearchViewProps {
  setAppStep: Dispatch<SetStateAction<AppStep>>;
}

const SearchView: FC<SearchViewProps> = ({ setAppStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('单人速食');

  if (isLoading) {
    return <RadarScanner onScanComplete={() => setAppStep('SWIPE')} />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-grid-pattern p-4" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(26, 26, 26, 0) 0%, #1A1A1A 60%), linear-gradient(-45deg, rgba(30,30,30,0.8) 25%, transparent 25%, transparent 50%, rgba(30,30,30,0.8) 50%, rgba(30,30,30,0.8) 75%, transparent 75%, transparent)', backgroundSize: '100% 100%, 20px 20px' }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white tracking-tight">今天想怎么吃？</h2>
        
        <div className="flex items-center gap-2 bg-gray-800/50 p-1 rounded-full my-6">
          {['单人速食', '宿舍组局', '社团聚餐'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`w-full text-sm font-semibold py-2 rounded-full transition-colors ${activeTab === tab ? 'text-text-primary' : 'text-gray-400 hover:bg-gray-700/50'}`}
            >
              {activeTab === tab && <motion.div layoutId="active-tab-indicator" className="absolute inset-0 bg-surface rounded-full z-0" />}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsLoading(true)}
          className="w-full bg-meituan-gradient text-text-primary font-bold text-lg rounded-xl py-4 shadow-lg flex items-center justify-center gap-2"
        >
          <ScanLine size={20} />
          扫描周边并生成牌库
        </button>
      </motion.div>
    </div>
  );
};

export default SearchView;
