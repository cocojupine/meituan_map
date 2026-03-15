"use client";

import { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import CardStack from '@/components/CardStack';
import BottomBar from '@/components/BottomBar';
import MatchModal from '@/components/MatchModal';
import CartDrawer from '@/components/CartDrawer';
import EmptyState from '@/components/EmptyState';

const FOOD_ITEMS = [
  { id: 5, name: '塔斯汀中国汉堡', price: '15.9', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', tags: ['超值套餐', '香辣鸡腿'], locationTag: '距东1教学楼步行5分钟' },
  { id: 4, name: '瑞幸生椰拿铁', price: '12.9', image: 'https://images.unsplash.com/photo-1611928549863-4565ad5b0d6c?w=800&q=80', tags: ['夏日冰饮', '人手一杯'], locationTag: '无需出校门' },
  { id: 3, name: '紫金港堕落街烤肉', price: '59.9', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', tags: ['滋滋冒油', '夜宵首选'], locationTag: '外卖柜直达寝室' },
  { id: 2, name: '三墩老街葱包烩', price: '8.0', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', tags: ['杭州特色', '早餐'], locationTag: '距玉泉正门步行2分钟' },
  { id: 1, name: '招牌隆江猪脚饭', price: '19.9', image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=800&q=80', tags: ['满30减15', '新客专享'], locationTag: '距西溪食堂步行10分钟' },
];

export default function Home() {
  const [cards, setCards] = useState(FOOD_ITEMS);
  const [mode, setMode] = useState<'SOLO' | 'GROUP'>('SOLO');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0),
    [cartItems]
  );

  const handlePass = (id: number) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const handleLike = (card: any) => {
    setCartItems(prev => [...prev, { ...card, isMustEat: false }]);
    setCards(prev => prev.filter(c => c.id !== card.id));
  };

  const handleSuperLike = (card: any) => {
    setCartItems(prev => [{ ...card, isMustEat: true }, ...prev.filter(item => item.id !== card.id)]);
    setCards(prev => prev.filter(c => c.id !== card.id));
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="h-full w-full flex flex-col items-center">
      {/* 1. 顶部状态栏 Header */}
      <header className="absolute top-0 z-50 w-full h-16 flex items-center justify-between px-4 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center gap-1.5">
          <MapPin size={18} className="text-text-primary" />
          <span className="font-bold text-text-primary tracking-tight">浙大紫金港</span>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-gray-200 rounded-full text-sm font-medium">
          <button 
            onClick={() => setMode('SOLO')}
            className={`px-3 py-1 rounded-full transition-colors ${mode === 'SOLO' ? 'bg-white shadow-sm' : 'text-text-secondary'}`}>
            Solo
          </button>
          <button 
            onClick={() => setMode('GROUP')}
            className={`px-3 py-1 rounded-full transition-colors ${mode === 'GROUP' ? 'bg-white shadow-sm' : 'text-text-secondary'}`}>
            Group
          </button>
        </div>
      </header>

      {/* 2. 核心卡片区域 */}
      {cards.length > 0 ? (
        <CardStack cards={cards} onPass={handlePass} onLike={handleLike} onSuperLike={handleSuperLike} />
      ) : (
        <EmptyState onOpenCart={() => setIsCartOpen(true)} />
      )}

      {/* 3. 底部动态进度栏 */}
      <BottomBar mode={mode} totalPrice={totalPrice} onOpenCart={() => setIsCartOpen(true)} />

      {/* 4. Match 弹窗 (初始隐藏) */}
      <MatchModal isOpen={showMatchModal} onClose={() => setShowMatchModal(false)} />

      {/* 5. 购物车抽屉 */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemoveItem={handleRemoveFromCart} 
      />
    </div>
  );
}
