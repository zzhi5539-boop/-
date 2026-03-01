import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const API_URL = 'http://localhost:4000/api';

// Pseudo-random number generator based on a string seed (Order ID)
const seededRandom = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  // Mulberry32 generator
  let t = h += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

// Generate stable real GPS coordinates for a given order ID within a radius of Beijing (39.9042, 116.4074)
const getOrderRealCoordinates = (orderId: string): [number, number] => {
  const randLatOffset = (seededRandom(orderId + '_lat') - 0.5) * 0.5; // roughly +/- 50km
  const randLngOffset = (seededRandom(orderId + '_lng') - 0.5) * 0.5;
  return [
    39.9042 + randLatOffset,
    116.4074 + randLngOffset
  ];
};

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
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/orders');
        if (!response.ok) {
          throw new Error('网络请求失败');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Fetch orders error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const inTransitOrders = orders.filter(o => o.status === '运输中').length;
  const pendingOrders = orders.filter(o => o.status === '待处理').length;
  const completedOrders = orders.filter(o => o.status === '已完成').length;

  const activeOrders = orders.filter(o => o.status === '运输中' || o.status === '待处理' || o.status === '延误');

  // Calculate completion rate safely to avoid NaN
  const completionRate = totalOrders > 0
    ? ((completedOrders / totalOrders) * 100).toFixed(1)
    : '0.0';

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
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group transition-all" to="/dashboard">
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <span className="text-sm font-medium">仪表盘</span>
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
          <div className="mt-auto pb-4">
            <div className="rounded-xl bg-gradient-to-br from-[#1a2e22] to-background-dark p-4 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex flex-col gap-2">
                <span className="material-symbols-outlined text-primary mb-1">eco</span>
                <h4 className="text-white text-sm font-medium">节能模式已开启</h4>
                <p className="text-xs text-slate-400">系统正在优化路线以提高燃油效率。</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
        <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark z-10">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight">仪表盘概览</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">欢迎回来，以下是今天的最新动态。</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="block w-64 rounded-lg border-0 py-2.5 pl-10 text-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 bg-slate-50 dark:bg-[#1a2e22] placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:text-white sm:leading-6 transition-shadow" placeholder="搜索订单号、司机或地点..." type="text" />
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
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-light dark:bg-[#1a2e22] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">总订单量</p>
                  <h3 className="text-3xl font-bold mt-1">
                    {isLoading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-20 rounded inline-block"></span> : totalOrders}
                  </h3>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> 12%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">较上周</span>
              </div>
            </div>
            <div className="bg-surface-light dark:bg-[#1a2e22] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">送达率</p>
                  <h3 className="text-3xl font-bold mt-1">
                    {isLoading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-20 rounded inline-block"></span> : `${completionRate}%`}
                  </h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> 2.1%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">较上周</span>
              </div>
            </div>
            <div className="bg-surface-light dark:bg-[#1a2e22] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">运输中</p>
                  <h3 className="text-3xl font-bold mt-1">
                    {isLoading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-16 rounded inline-block"></span> : inTransitOrders}
                  </h3>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-500">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-xs font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-sm mr-0.5">trending_down</span> 0.5%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">较上周</span>
              </div>
            </div>
            <div className="bg-surface-light dark:bg-[#1a2e22] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">待处理</p>
                  <h3 className="text-3xl font-bold mt-1">
                    {isLoading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-16 rounded inline-block"></span> : pendingOrders}
                  </h3>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500">
                  <span className="material-symbols-outlined">pending_actions</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">3辆维护中</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-surface-light dark:bg-[#1a2e22] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[500px]">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold">车队实时追踪</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-slate-900">所有区域</button>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">北区</button>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">南区</button>
                </div>
              </div>
              <div className="relative flex-1 w-full overflow-hidden bg-slate-900 rounded-b-xl z-0">
                <MapContainer
                  center={[39.9042, 116.4074]}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  />

                  {activeOrders.map((order) => {
                    const position = getOrderRealCoordinates(order.id);

                    // Optional: Custom divIcon if you want to keep the pulse effect
                    // Here we use standard Leaflet Markers with popups for a robust mapping experience
                    return (
                      <Marker
                        key={order.id}
                        position={position}
                      >
                        <Popup className="dark-popup">
                          <div className="text-slate-900 font-sans">
                            <strong>{order.id}</strong><br />
                            产品: {order.product}<br />
                            状态: {order.status}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-surface-light dark:bg-[#1a2e22] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">配送统计</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">过去7天表现</p>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold">845</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">次配送</span>
                </div>
                <div className="flex-1 min-h-[160px] w-full relative flex items-end justify-between gap-2 px-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[40%] hover:bg-primary/50 transition-colors group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">120</div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[65%] hover:bg-primary/50 transition-colors group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">185</div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[50%] hover:bg-primary/50 transition-colors group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">140</div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[75%] hover:bg-primary/50 transition-colors group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">210</div>
                  </div>
                  <div className="w-full bg-primary rounded-t-sm h-[85%] hover:bg-primary/80 transition-colors shadow-[0_0_15px_rgba(25,230,94,0.3)] group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">245</div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[30%] hover:bg-primary/50 transition-colors group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">90</div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[20%] hover:bg-primary/50 transition-colors group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">60</div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                  <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
                </div>
              </div>
              <div className="bg-surface-light dark:bg-[#1a2e22] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">异常告警</h3>
                  <a className="text-xs text-primary hover:underline" href="#">查看全部</a>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                    <span className="material-symbols-outlined text-orange-500 text-lg mt-0.5">warning</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">路线偏离</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">车辆 #204 偏离计划路线 2 公里。</p>
                      <p className="text-[10px] text-slate-400 mt-1">10分钟前</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                    <span className="material-symbols-outlined text-blue-500 text-lg mt-0.5">schedule</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">预计延迟</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">401高速拥堵，影响3个配送任务。</p>
                      <p className="text-[10px] text-slate-400 mt-1">25分钟前</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-light dark:bg-background-dark border border-slate-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">check_circle</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">维护完成</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">车辆 #11 已完成维护并恢复使用。</p>
                      <p className="text-[10px] text-slate-400 mt-1">1小时前</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-[#1a2e22] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-semibold">最近订单</h3>
              <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
                <span>筛选</span>
                <span className="material-symbols-outlined text-lg">filter_list</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium" scope="col">订单号</th>
                    <th className="px-6 py-4 font-medium" scope="col">客户名称</th>
                    <th className="px-6 py-4 font-medium" scope="col">配送地点</th>
                    <th className="px-6 py-4 font-medium" scope="col">状态</th>
                    <th className="px-6 py-4 font-medium" scope="col">司机</th>
                    <th className="px-6 py-4 font-medium text-right" scope="col">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="bg-surface-light dark:bg-[#1a2e22]">
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8 animate-pulse ml-auto"></div></td>
                      </tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        暂无订单数据
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order) => {
                      // Status styling helper
                      const getStatusStyle = (status: string) => {
                        switch (status) {
                          case '已完成': return { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', pulse: false };
                          case '运输中': return { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', pulse: true };
                          case '待处理': return { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', pulse: false };
                          case '延误': return { bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500', pulse: true };
                          default: return { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500', pulse: false };
                        }
                      };

                      const style = getStatusStyle(order.status);

                      return (
                        <tr key={order.id} className="bg-surface-light dark:bg-[#1a2e22] hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{order.id}</td>
                          <td className="px-6 py-4">{order.origin}</td>
                          <td className="px-6 py-4">{order.destination_detail}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${style.pulse ? 'animate-pulse' : ''}`}></span>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex items-center gap-2">
                            {order.driver_image ? (
                              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <img alt="Driver" className="w-full h-full object-cover" src={order.driver_image} />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                --
                              </div>
                            )}
                            <span className={order.driver ? '' : 'text-slate-400 italic'}>
                              {order.driver || '未分配'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-slate-400 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-center">
              <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                查看所有订单 <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
