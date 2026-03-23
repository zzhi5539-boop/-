import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon not showing up in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Pseudo-random number generator based on a string seed (Order ID)
const seededRandom = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  let t = h += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

// Map Order ID to Real Coordinates (Around Beijing: 39.9042, 116.4074)
const getOrderRealCoordinates = (orderId: string): [number, number] => {
  const randLatOffset = (seededRandom(orderId + '_lat') - 0.5) * 0.5;
  const randLngOffset = (seededRandom(orderId + '_lng') - 0.5) * 0.5;
  return [
    39.9042 + randLatOffset,
    116.4074 + randLngOffset
  ];
};

// Helper: Format ISO timestamp to friendly ETA or relative time
const formatETA = (timestamp: string | null) => {
  if (!timestamp) return '计算中...';
  try {
    const eta = new Date(timestamp);
    const now = new Date();
    const diffMs = eta.getTime() - now.getTime();
    if (diffMs < 0) return '即将到达';
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) return `${diffHrs}小时${diffMins}分`;
    return `${diffMins}分钟`;
  } catch (e) {
    return '计算中...';
  }
};

interface OrderTracking {
  current_speed: number;
  current_temperature: number | null;
  humidity: number | null;
  fuel_level: number | null;
  congestion_level: string;
  eta_timestamp: string | null;
  updated_at: string;
}

interface Order {
  id: string;
  date: string;
  product: string;
  product_detail: string;
  product_image: string;
  origin: string;
  origin_detail: string;
  destination: string;
  destination_detail: string;
  status: '运输中' | '待处理' | '已完成' | '延误';
  driver: string | null;
  driver_image: string | null;
  temperature: string;
  cold_chain: boolean;
  created_at?: string;
  order_tracking?: OrderTracking;
}

export default function RealTimeMonitoring() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/orders');
        if (!response.ok) throw new Error('网络请求失败');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Fetch orders error:', error);
      }
    };
    fetchOrders();
    // Refresh every 30 seconds to simulate real-time updates
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter(o => o.status === '运输中' || o.status === '待处理' || o.status === '延误');

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden">
      <aside className="w-64 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark transition-colors duration-300">
        <div className="flex flex-col p-4 gap-4 h-full">
          <Link to="/dashboard" className="flex items-center gap-3 px-2 py-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight">农业物流系统</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs">管理员控制台</p>
            </div>
          </Link>
          <nav className="flex flex-col gap-1 mt-4">
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="/dashboard">
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <span className="text-sm font-medium">仪表盘</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group transition-all" to="/monitoring">
              <span className="material-symbols-outlined text-xl">location_on</span>
              <span className="text-sm font-medium">实时监控</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="/orders">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              <span className="text-sm font-medium">订单管理</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="/routes">
              <span className="material-symbols-outlined text-xl">map</span>
              <span className="text-sm font-medium">路径规划</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="/finance">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              <span className="text-sm font-medium">财务报表</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="/users">
              <span className="material-symbols-outlined text-xl">group</span>
              <span className="text-sm font-medium">用户管理</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="/settings">
              <span className="material-symbols-outlined text-xl">settings</span>
              <span className="text-sm font-medium">系统设置</span>
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
        <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark z-10">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight">车辆实时监控</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">实时追踪车队位置和详细状态。</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group flex-1 min-w-[300px]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="block w-full rounded-lg border-0 py-2.5 pl-10 text-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 bg-slate-50 dark:bg-[#1a2e22] placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:text-white sm:leading-6 transition-shadow" placeholder="搜索车辆或订单..." type="text" />
            </div>
            
            <button className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
            </button>
            <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <div className="flex items-center gap-3">
              <img alt="管理员头像" className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi731gtv-4U9y-oFS956A0U5kaOdz2lPu3OwwpVedyEzrVZk_GROnAD_pqDFbU_TpDRHRKBBo8YRTJcX2VBJ8eU4qXQr7tqA-ttaKKZ-gCtvtx3HhOSvasnVtM8E83_xqUHJHdGZVsF_Ho_8CEmrpTHYmgrwm4yCuLNTZ23sA_Wx9oOeKhocquv4K_E55We9P99CAUc9MInDosd2NpW8k4XjKuvM5OZdWPnT_OElnDtdVlYIFRraFX0OsvsECcdTkytDW-W2ddFg" />
              <div className="hidden md:flex flex-col">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Alex Morgan</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">物流主管</p>
              </div>
              <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="退出登录">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1 w-full h-full relative z-0">
          <MapContainer
            center={[39.9042, 116.4074]}
            zoom={10}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {activeOrders.map((order) => {
              const position = getOrderRealCoordinates(order.id);
              const tracking = order.order_tracking;
              
              return (
                <Marker key={order.id} position={position}>
                  <Popup className="dark-popup font-sans min-w-[240px]">
                    <div className="text-slate-900 dark:text-slate-900">
                      <div className="border-b border-slate-200 pb-2 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                        <strong className="text-base font-bold text-slate-800">订单: {order.id}</strong>
                      </div>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between items-center"><span className="text-slate-500 font-medium whitespace-nowrap">产品:</span> <span className="font-semibold text-right">{order.product}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 font-medium whitespace-nowrap">车辆状态:</span> <span className="font-semibold text-blue-600 text-right">{order.status}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 font-medium whitespace-nowrap">设定温度:</span> <span className="font-semibold text-right">{order.temperature}</span></div>
                        
                        {tracking ? (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium whitespace-nowrap">实时温度:</span> 
                              <span className="font-semibold text-primary text-right">{tracking.current_temperature}°C</span>
                            </div>
                            <div className="flex justify-between items-center"><span className="text-slate-500 font-medium whitespace-nowrap">当前时速:</span> <span className="font-semibold text-right">{tracking.current_speed} km/h</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-500 font-medium whitespace-nowrap">车厢湿度:</span> <span className="font-semibold text-right">{tracking.humidity}%</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-500 font-medium whitespace-nowrap">剩余油量:</span> <span className="font-semibold text-right">{tracking.fuel_level}%</span></div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium whitespace-nowrap">道路拥塞:</span> 
                              <span className={`font-semibold text-right ${tracking.congestion_level.includes('拥堵') ? 'text-red-500' : tracking.congestion_level === '缓行' ? 'text-yellow-600' : 'text-green-600'}`}>{tracking.congestion_level}</span>
                            </div>
                            <div className="flex justify-between items-center"><span className="text-slate-500 font-medium whitespace-nowrap">预计送达:</span> <span className="font-semibold text-right">{formatETA(tracking.eta_timestamp)}</span></div>
                          </>
                        ) : (
                          <div className="text-xs text-slate-400 italic text-center py-2 mt-2 border-t border-slate-100">
                            暂无实时追踪信息
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
