export interface FoodItem {
  id: number;
  name: string;
  price: string;
  image: string;
  tags: string[];
  locationTag: string;
  rating: number;
  sales: string;
  deliveryTime: string;
  deliveryFee: string;
  review: string;
}

export const FOOD_ITEMS: FoodItem[] = [
  { 
    id: 5, 
    name: '塔斯汀中国汉堡', 
    price: '15.9', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 
    tags: ['超值套餐', '香辣鸡腿'], 
    locationTag: '距东1教学楼步行5分钟',
    rating: 4.9,
    sales: "月售 5000+",
    deliveryTime: "25分钟",
    deliveryFee: "免配送费",
    review: "“一口下去全是肉，满足感爆棚，下次还点！”"
  },
  { 
    id: 4, 
    name: '瑞幸生椰拿铁', 
    price: '12.9', 
    image: 'https://images.unsplash.com/photo-1611928549863-4565ad5b0d6c?w=800&q=80', 
    tags: ['夏日冰饮', '人手一杯'], 
    locationTag: '无需出校门',
    rating: 4.7,
    sales: "月售 8000+",
    deliveryTime: "5分钟",
    deliveryFee: "免配送费",
    review: "“冰冰凉凉，椰香味很足，夏天续命水！”"
  },
  { 
    id: 3, 
    name: '紫金港堕落街烤肉', 
    price: '59.9', 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', 
    tags: ['滋滋冒油', '夜宵首选'], 
    locationTag: '外卖柜直达寝室',
    rating: 4.8,
    sales: "月售 1000+",
    deliveryTime: "40分钟",
    deliveryFee: "配送费 ¥3",
    review: "“肉很新鲜，和室友一起吃氛围感拉满！”"
  },
  { 
    id: 2, 
    name: '三墩老街葱包烩', 
    price: '8.0', 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', 
    tags: ['杭州特色', '早餐'], 
    locationTag: '距玉泉正门步行2分钟',
    rating: 4.6,
    sales: "月售 900+",
    deliveryTime: "15分钟",
    deliveryFee: "免配送费",
    review: "“就是老底子的味道，甜面酱一刷，绝了！”"
  },
  { 
    id: 1, 
    name: '招牌隆江猪脚饭', 
    price: '19.9', 
    image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=800&q=80', 
    tags: ['满30减15', '新客专享'], 
    locationTag: '距西溪食堂步行10分钟',
    rating: 4.9,
    sales: "月售 3000+",
    deliveryTime: "35分钟",
    deliveryFee: "配送费 ¥1",
    review: "“分量超大，肉质很嫩，强烈推荐！”"
  },
];
