import { Link } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api';

interface Order {
  id: string;
  date: string;
  product: string;
  productDetail: string;
  productImage: string;
  origin: string;
  originDetail: string;
  destination: string;
  destinationDetail: string;
  status: '运输中' | '待处理' | '已完成' | '延误';
  driver?: string;
  driverImage?: string;
  temperature: string;
  coldChain: boolean;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    status: '待处理',
    productImage: 'https://picsum.photos/seed/agri/200/200',
    temperature: '常温',
    coldChain: false
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const mapOrderFromDB = (dbOrder: any): Order => ({
    id: dbOrder.id,
    date: dbOrder.date,
    product: dbOrder.product,
    productDetail: dbOrder.product_detail,
    productImage: dbOrder.product_image,
    origin: dbOrder.origin,
    originDetail: dbOrder.origin_detail,
    destination: dbOrder.destination,
    destinationDetail: dbOrder.destination_detail,
    status: dbOrder.status as any,
    driver: dbOrder.driver,
    driverImage: dbOrder.driver_image,
    temperature: dbOrder.temperature,
    coldChain: dbOrder.cold_chain
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.map(mapOrderFromDB));
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleCreateOrder = async (e: FormEvent) => {
    e.preventDefault();
    const orderToCreate = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      product: newOrder.product || '未知产品',
      product_detail: newOrder.productDetail || '100 kg • 散装',
      product_image: newOrder.productImage || 'https://picsum.photos/seed/agri/200/200',
      origin: newOrder.origin || '未知起点',
      origin_detail: newOrder.originDetail || '未知地区',
      destination: newOrder.destination || '未知终点',
      destination_detail: newOrder.destinationDetail || '未知地区',
      status: newOrder.status || '待处理',
      temperature: newOrder.temperature || '常温',
      cold_chain: !!newOrder.coldChain
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderToCreate)
      });
      if (res.ok) {
        const data = await res.json();
        setOrders([mapOrderFromDB(data), ...orders]);
        setShowModal(false);
        setNewOrder({ status: '待处理', productImage: 'https://picsum.photos/seed/agri/200/200', temperature: '常温', coldChain: false });
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-x-hidden">
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#29382e] bg-white dark:bg-[#111813] px-10 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight">农业物流系统</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs">管理员控制台</p>
            </div>
          </div>
          <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full ring-1 ring-slate-200 dark:ring-[#29382e]">
              <div className="text-slate-500 dark:text-[#9db8a6] flex border-none bg-slate-50 dark:bg-[#29382e] items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-50 dark:bg-[#29382e] focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-[#9db8a6] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="搜索" defaultValue="" />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden lg:flex items-center gap-9">
            <Link className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white text-sm font-medium leading-normal transition-colors" to="/dashboard">仪表盘</Link>
            <Link className="text-primary text-sm font-bold leading-normal" to="/orders">订单</Link>
            <Link className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white text-sm font-medium leading-normal transition-colors" to="#">库存</Link>
            <Link className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white text-sm font-medium leading-normal transition-colors" to="/routes">路线</Link>
            <Link className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white text-sm font-medium leading-normal transition-colors" to="/users">用户管理</Link>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#112116] hover:bg-green-400 transition-colors text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">新建订单</span>
            </button>
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-100 hover:bg-slate-200 dark:bg-[#29382e] dark:hover:bg-[#35473a] text-slate-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-100 hover:bg-slate-200 dark:bg-[#29382e] dark:hover:bg-[#35473a] text-slate-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/50" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuActCr9nM9PLnw3fG5epDPN1Lg4c3RlaygEr8LT_VIUNIyxCnnT8saU5lUoyvaSe3_ZwjlVcY-lX-YPvxfq5FBRUxNeEuJkUWJjUZYWOWA4Z4qXkWUh1Kb1SnSDTq3-uIv7ST9bWKXsODT85HOZrL5IH6JHn38O0_KU8lJrDeSDYuDXDyZA2Dt9MHXtBp24IkItSn3H5QDU758da8bO6vDrLldzzeu1VpRfyAcR-3xIC9_p8x5vNI7muD8K4eXxYXOs7NNdUgtTGg")' }}></div>
        </div>
      </header>
      <div className="flex flex-1 justify-center py-5 px-4 md:px-10">
        <div className="flex flex-col max-w-[1440px] flex-1 w-full">
          <div className="flex flex-wrap justify-between gap-3 mb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">订单管理</h1>
              <p className="text-slate-500 dark:text-[#9db8a6] text-base font-normal leading-normal">高效跟踪和管理农产品物流配送。</p>
            </div>
            <div className="flex gap-3 items-end">
              <button className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-[#29382e] text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-[#3a4e40] transition-colors text-sm font-bold leading-normal gap-2">
                <span className="material-symbols-outlined text-[20px]">file_download</span>
                <span className="truncate">导出报表</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#1c2921] p-5 rounded-xl border border-slate-200 dark:border-[#29382e] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 dark:text-[#9db8a6] text-sm font-medium">订单总数</p>
                <span className="material-symbols-outlined text-primary">inventory_2</span>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold">1,248</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>较上周增长 12%</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1c2921] p-5 rounded-xl border border-slate-200 dark:border-[#29382e] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 dark:text-[#9db8a6] text-sm font-medium">运输中</p>
                <span className="material-symbols-outlined text-blue-400">local_shipping</span>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold">86</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                <span>活跃运输任务</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1c2921] p-5 rounded-xl border border-slate-200 dark:border-[#29382e] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 dark:text-[#9db8a6] text-sm font-medium">待处理</p>
                <span className="material-symbols-outlined text-yellow-400">schedule</span>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold">24</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-red-400 font-medium">
                <span className="material-symbols-outlined text-sm">priority_high</span>
                <span>4 个高优先级</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1c2921] p-5 rounded-xl border border-slate-200 dark:border-[#29382e] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 dark:text-[#9db8a6] text-sm font-medium">已完成</p>
                <span className="material-symbols-outlined text-green-400">check_circle</span>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-bold">1,138</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                <span>98% 准时送达</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1c2921] rounded-t-xl border border-slate-200 dark:border-[#29382e] p-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <label className="flex flex-col min-w-40 h-10 w-full lg:w-96">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full ring-1 ring-slate-200 dark:ring-[#29382e] bg-slate-50 dark:bg-[#29382e]">
                  <div className="text-slate-500 dark:text-[#9db8a6] flex border-none items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <span className="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-[#9db8a6] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" placeholder="按订单编号、产品或地点搜索..." defaultValue="" />
                </div>
              </label>
              <div className="flex gap-3 flex-wrap items-center">
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#29382e] dark:hover:bg-[#3a4e40] pl-4 pr-3 transition-colors border border-slate-200 dark:border-transparent">
                  <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">状态: 全部</p>
                  <span className="material-symbols-outlined text-slate-700 dark:text-white text-lg">expand_more</span>
                </button>
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#29382e] dark:hover:bg-[#3a4e40] pl-4 pr-3 transition-colors border border-slate-200 dark:border-transparent">
                  <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">产品类型</p>
                  <span className="material-symbols-outlined text-slate-700 dark:text-white text-lg">expand_more</span>
                </button>
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#29382e] dark:hover:bg-[#3a4e40] pl-4 pr-3 transition-colors border border-slate-200 dark:border-transparent">
                  <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">日期范围</p>
                  <span className="material-symbols-outlined text-slate-700 dark:text-white text-lg">calendar_today</span>
                </button>
                <div className="h-6 w-px bg-slate-300 dark:bg-[#29382e] mx-1"></div>
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#29382e] dark:hover:bg-[#3a4e40] transition-colors text-slate-700 dark:text-white border border-slate-200 dark:border-transparent">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white dark:bg-[#1c2921] border-x border-b border-slate-200 dark:border-[#29382e] rounded-b-xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#23332a] border-b border-slate-200 dark:border-[#29382e]">
                  <th className="p-4 w-14">
                    <input className="rounded border-slate-300 dark:border-[#3e5546] bg-white dark:bg-[#111813] text-primary focus:ring-primary/50 focus:ring-offset-0" type="checkbox" />
                  </th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider">订单编号</th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider">产品</th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider">起点</th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider">终点</th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider">温度要求</th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider">冷链运输</th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider">状态</th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider">司机</th>
                  <th className="p-4 text-xs font-medium text-slate-500 dark:text-[#9db8a6] uppercase tracking-wider text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#29382e]">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-[#23332a] transition-colors">
                    <td className="p-4">
                      <input className="rounded border-slate-300 dark:border-[#3e5546] bg-white dark:bg-[#111813] text-primary focus:ring-primary/50 focus:ring-offset-0" type="checkbox" />
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-900 dark:text-white">{order.id}</span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{order.date}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url('${order.productImage}')` }}></div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{order.product}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{order.productDetail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-900 dark:text-white">{order.origin}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{order.originDetail}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-900 dark:text-white">{order.destination}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{order.destinationDetail}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-slate-400">thermostat</span>
                        <span className="text-sm text-slate-900 dark:text-white">{order.temperature}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {order.coldChain ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                          <span className="material-symbols-outlined text-xs">ac_unit</span>
                          需要
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">不需要</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${order.status === '运输中' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          order.status === '待处理' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            order.status === '已完成' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                        <span className={`size-1.5 rounded-full ${order.status === '运输中' ? 'bg-blue-500' :
                            order.status === '待处理' ? 'bg-yellow-500' :
                              order.status === '已完成' ? 'bg-green-500' :
                                'bg-red-500'
                          }`}></span>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.driver ? (
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${order.driverImage}')` }}></div>
                          <span className="text-sm text-slate-900 dark:text-white">{order.driver}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">未分配</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-slate-200 dark:border-[#29382e] flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                显示第 <span className="font-medium text-slate-900 dark:text-white">1</span> 到 <span className="font-medium text-slate-900 dark:text-white">4</span> 条，共 <span className="font-medium text-slate-900 dark:text-white">128</span> 条结果
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border border-slate-300 dark:border-[#3e5546] text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#23332a] disabled:opacity-50">上一页</button>
                <button className="px-3 py-1 rounded border border-slate-300 dark:border-[#3e5546] text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#23332a]">下一页</button>
              </div>
            </div>
          </div>
          <div className="@container mt-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-white dark:bg-[#1c2921] rounded-xl border border-slate-200 dark:border-[#29382e] p-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">快捷操作</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-[#111813] hover:bg-slate-100 dark:hover:bg-[#23332a] transition-colors group">
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-[#29382e] group-hover:bg-slate-300 dark:group-hover:bg-[#3a4e40] flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-slate-700 dark:text-white">add_box</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-white">创建订单</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-[#111813] hover:bg-slate-100 dark:hover:bg-[#23332a] transition-colors group">
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-[#29382e] group-hover:bg-slate-300 dark:group-hover:bg-[#3a4e40] flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-slate-700 dark:text-white">person_add</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-white">添加司机</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-[#111813] hover:bg-slate-100 dark:hover:bg-[#23332a] transition-colors group">
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-[#29382e] group-hover:bg-slate-300 dark:group-hover:bg-[#3a4e40] flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-slate-700 dark:text-white">warehouse</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-white">库存管理</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-[#111813] hover:bg-slate-100 dark:hover:bg-[#23332a] transition-colors group">
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-[#29382e] group-hover:bg-slate-300 dark:group-hover:bg-[#3a4e40] flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-slate-700 dark:text-white">summarize</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-white">查看报表</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white dark:bg-[#1c2921] rounded-xl border border-slate-200 dark:border-[#29382e] p-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">实时动态</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="size-2 rounded-full bg-primary mt-1.5"></div>
                      <div className="w-px h-full bg-slate-200 dark:bg-[#29382e] my-1"></div>
                    </div>
                    <div className="pb-2">
                      <p className="text-sm text-slate-900 dark:text-white font-medium">订单 #ORD-7392 已取货</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">司机 迈克尔·R 已到达绿谷农场</p>
                      <p className="text-xs text-slate-400 mt-1">2 分钟前</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="size-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <div className="w-px h-full bg-slate-200 dark:bg-[#29382e] my-1"></div>
                    </div>
                    <div className="pb-2">
                      <p className="text-sm text-slate-900 dark:text-white font-medium">新货运请求</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">全食超市创建了订单 #ORD-7393</p>
                      <p className="text-xs text-slate-400 mt-1">15 分钟前</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="size-2 rounded-full bg-yellow-500 mt-1.5"></div>
                    </div>
                    <div className="pb-2">
                      <p className="text-sm text-slate-900 dark:text-white font-medium">天气警报：大雨</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">101号公路北行方向受影响，涉及3名司机</p>
                      <p className="text-xs text-slate-400 mt-1">1 小时前</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1c2921] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-[#29382e] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-[#29382e] flex justify-between items-center bg-slate-50 dark:bg-[#23332a]">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">新建物流订单</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">产品名称</label>
                <input
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="例如：有机番茄"
                  value={newOrder.product || ''}
                  onChange={e => setNewOrder({ ...newOrder, product: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">重量/规格</label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="500 kg • 箱装"
                    value={newOrder.productDetail || ''}
                    onChange={e => setNewOrder({ ...newOrder, productDetail: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">状态</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    value={newOrder.status}
                    onChange={e => setNewOrder({ ...newOrder, status: e.target.value as any })}
                  >
                    <option value="待处理">待处理</option>
                    <option value="运输中">运输中</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">起点 (农场/仓库)</label>
                <input
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="绿谷农场"
                  value={newOrder.origin || ''}
                  onChange={e => setNewOrder({ ...newOrder, origin: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">终点 (配送中心/市场)</label>
                <input
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="全食配送中心"
                  value={newOrder.destination || ''}
                  onChange={e => setNewOrder({ ...newOrder, destination: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">温度要求</label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="例如：2°C - 8°C"
                    value={newOrder.temperature || ''}
                    onChange={e => setNewOrder({ ...newOrder, temperature: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#111813] transition-colors">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 dark:border-[#3c5344] text-primary focus:ring-primary dark:bg-[#111813]"
                      checked={newOrder.coldChain || false}
                      onChange={e => setNewOrder({ ...newOrder, coldChain: e.target.checked })}
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">需要冷链运输</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#29382e] text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-[#23332a] transition-colors">
                  取消
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-[#112116] font-bold hover:bg-green-400 transition-colors shadow-lg shadow-primary/20">
                  确认创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
