import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Provide a custom div icon to avoid relying on external CDN images which might blocked
const createCustomIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const depotIcon = createCustomIcon('#ef4444'); // Red for depot
const waypointIcon = createCustomIcon('#19e65e'); // Green for stops

const API_URL = 'http://localhost:4000/api';

// Helper component to auto-center map when route changes
function RecenterMap({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

interface Order {
  id: string;
  product: string;
  product_detail: string;
  status: string;
  origin: string;
  destination: string;
  priority?: string;
}

interface Waypoint {
  order_id: string;
  product: string;
  lat: number;
  lng: number;
  distance_from_prev: number;
}

export default function RoutePlanning() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedData, setOptimizedData] = useState<{
    ordered_waypoints: Waypoint[];
    total_distance_km: number;
  } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        // For planning, we mostly care about pending/delayed orders
        setOrders(data.filter((o: any) => o.status !== '已完成'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOptimize = async () => {
    if (selectedIds.length === 0) {
      alert('请至少选择一个订单进行规划');
      return;
    }

    setIsOptimizing(true);
    try {
      const res = await fetch(`${API_URL}/routes/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedIds })
      });

      if (res.ok) {
        const data = await res.json();
        setOptimizedData(data);
      } else {
        alert('路径优化请求失败');
      }
    } catch (err) {
      console.error('Optimize error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const routePoints: [number, number][] = optimizedData
    ? [[39.9042, 116.4074], ...optimizedData.ordered_waypoints.map(w => [w.lat, w.lng] as [number, number])]
    : [];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-6 py-3 bg-surface-darker z-20 shrink-0">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight">农业物流系统</h1>
              <p className="text-text-secondary text-xs">管理员控制台</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors" to="/users">用户管理</Link>
            <Link className="text-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors" to="/finance">财务</Link>
            <Link className="text-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors" to="/settings">设置</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex w-full max-w-xs items-center rounded-lg bg-border-dark h-9">
            <div className="text-text-secondary flex items-center justify-center pl-3">
              <span className="material-symbols-outlined !text-[20px]">search</span>
            </div>
            <input className="w-full bg-transparent border-none text-white placeholder:text-text-secondary focus:ring-0 text-sm h-full" placeholder="搜索订单或路线..." />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-text-secondary hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 size-2 bg-primary rounded-full"></span>
            </button>

            <div className="h-6 w-px bg-border-dark mx-2"></div>

            <div className="flex items-center gap-3">
              <img alt="管理员头像" className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-border-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzPO9xSGjQLZlfMlb4JSrLrlFTcKfKHeFb7jW8Uddgql1z2ORZ8b9oZbZV0tTaIUBV46kmBxYRr2SW2hCrHJlcTjpwUeAjS1op_icu_BOtGQmGeb6VCc2diYii0L2TWWDq0sew7MPqy3gjwXTvAE5cNnpd-N_mIpgHej1WOk-i0dMkjvGvF4ea98BKwl261WlCx0Wm43FPrK7sd2xJ8O0Z1ddHhXvGaQJImCoBGnnnqQkUV3EhvduXRcmkizVe0YNabGvk3WrjaA" />
              <div className="hidden md:flex flex-col">
                <p className="text-sm font-semibold text-white">Alex Morgan</p>
                <p className="text-xs text-text-secondary">物流主管</p>
              </div>
              <button onClick={handleLogout} className="ml-2 text-text-secondary hover:text-red-500 transition-colors" title="退出登录">
                <span className="material-symbols-outlined !text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden h-full relative">
        <aside className="w-full lg:w-[520px] xl:w-[600px] flex flex-col border-r border-border-dark bg-surface-darker shrink-0 z-10 shadow-2xl">
          <div className="p-6 pb-4 border-b border-border-dark bg-surface-darker">
            <div className="flex flex-col gap-1 mb-6">
              <h1 className="text-white tracking-tight text-2xl font-bold">路径规划</h1>
              <p className="text-text-secondary text-sm">选择订单以生成优化的配送路径。</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-border-dark hover:bg-opacity-80 transition-colors pl-3 pr-2 border border-transparent hover:border-primary/30 group">
                <span className="text-white text-xs font-medium">类型: 冷藏</span>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-white !text-[16px]">expand_more</span>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-border-dark hover:bg-opacity-80 transition-colors pl-3 pr-2 border border-transparent hover:border-primary/30 group">
                <span className="text-white text-xs font-medium">优先级: 高</span>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-white !text-[16px]">expand_more</span>
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-border-dark hover:bg-opacity-80 transition-colors pl-3 pr-2 border border-transparent hover:border-primary/30 group">
                <span className="text-white text-xs font-medium">窗口: 上午</span>
                <span className="material-symbols-outlined text-text-secondary group-hover:text-white !text-[16px]">expand_more</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-darker p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                待处理订单 ({orders.length})
              </h3>
              <button
                onClick={() => setSelectedIds(selectedIds.length === orders.length ? [] : orders.map(o => o.id))}
                className="text-primary text-xs font-medium hover:underline"
              >
                {selectedIds.length === orders.length ? '取消全选' : '全选'}
              </button>
            </div>

            <div className="space-y-3">
              {orders.map(order => (
                <div
                  key={order.id}
                  onClick={() => handleToggleSelect(order.id)}
                  className={`group flex flex-col bg-surface-dark border ${selectedIds.includes(order.id) ? 'border-primary' : 'border-border-dark'} rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.status === '延误' ? 'bg-red-500' : 'bg-primary'}`}></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => { }} // Controlled by div click
                        className="rounded border-text-secondary bg-transparent text-primary focus:ring-offset-surface-dark focus:ring-primary size-4"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">{order.id}</span>
                          {order.status === '延误' && (
                            <span className="bg-red-500/20 text-red-500 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">优先级: 高</span>
                          )}
                        </div>
                        <div className="text-text-secondary text-xs mt-0.5">{order.product} • {order.product_detail}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 pl-9">
                    <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                      <span className="material-symbols-outlined !text-[14px]">location_on</span>
                      <span>{order.destination}</span>
                    </div>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <p className="text-center text-text-secondary text-sm py-10">暂无待规划订单</p>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border-dark bg-surface-darker">
            <div className="flex items-center justify-between mb-3 text-xs text-text-secondary">
              <span>所选订单: <b className="text-white">{selectedIds.length} 个</b></span>
              <span>预估距离: <b className="text-white">{optimizedData ? `${optimizedData.total_distance_km} km` : '--'}</b></span>
            </div>
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-green-400 transition-colors text-surface-darker gap-2 text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_0_20px_rgba(25,230,94,0.3)] ${isOptimizing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined !text-[20px]">{isOptimizing ? 'sync' : 'magic_button'}</span>
              <span className="truncate">{isOptimizing ? '正在计算最优路径...' : '优化路径'}</span>
            </button>
          </div>
        </aside>
        <div className="flex-1 relative bg-slate-900 h-full w-full z-0 p-1">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <MapContainer
              center={[39.9042, 116.4074]}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />

              <RecenterMap points={routePoints} />

              {/* Depot Marker */}
              <Marker position={[39.9042, 116.4074]} icon={depotIcon}>
                <Popup>
                  <div className="text-slate-900 font-sans">
                    <strong>中央枢纽 (起点)</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Waypoint Markers */}
              {optimizedData?.ordered_waypoints.map((wp, index) => (
                <Marker key={wp.order_id} position={[wp.lat, wp.lng]} icon={waypointIcon}>
                  <Popup>
                    <div className="text-slate-900 font-sans">
                      <span className="bg-primary text-[10px] px-1 rounded mr-1">第 {index + 1} 站</span>
                      <strong>{wp.order_id}</strong><br />
                      产品: {wp.product}<br />
                      距离上一站: {wp.distance_from_prev} km
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Route Line */}
              {routePoints.length > 0 && (
                <Polyline
                  positions={routePoints}
                  color="#19e65e"
                  weight={4}
                  opacity={0.8}
                  dashArray="10, 10"
                />
              )}
            </MapContainer>

          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-surface-darker/90 backdrop-blur border border-border-dark rounded-xl p-3 shadow-2xl flex gap-6">
            <div className="flex flex-col items-center px-4 border-r border-border-dark">
              <span className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">配送站点</span>
              <span className="text-white font-bold text-lg">{optimizedData?.ordered_waypoints.length || 0}</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">总里程</span>
              <span className="text-white font-bold text-lg">{optimizedData?.total_distance_km || 0} km</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
