import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden">
      <aside className="w-64 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark transition-colors duration-300">
        <div className="flex flex-col p-4 gap-4 h-full">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight">农业物流系统</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs">管理员控制台</p>
            </div>
          </div>
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
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="#">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              <span className="text-sm font-medium">财务报表</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="/users">
              <span className="material-symbols-outlined text-xl">group</span>
              <span className="text-sm font-medium">用户管理</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] hover:text-slate-900 dark:hover:text-slate-200 transition-all" to="#">
              <span className="material-symbols-outlined text-xl">settings</span>
              <span className="text-sm font-medium">系统设置</span>
            </Link>
          </nav>
          <div className="mt-auto">
            <div className="rounded-xl bg-gradient-to-br from-[#1a2e22] to-background-dark p-4 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex flex-col gap-2">
                <span className="material-symbols-outlined text-primary mb-1">eco</span>
                <h4 className="text-white text-sm font-medium">节能模式已开启</h4>
                <p className="text-xs text-slate-400">系统正在优化路线以提高燃油效率。</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <img alt="管理员头像" className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi731gtv-4U9y-oFS956A0U5kaOdz2lPu3OwwpVedyEzrVZk_GROnAD_pqDFbU_TpDRHRKBBo8YRTJcX2VBJ8eU4qXQr7tqA-ttaKKZ-gCtvtx3HhOSvasnVtM8E83_xqUHJHdGZVsF_Ho_8CEmrpTHYmgrwm4yCuLNTZ23sA_Wx9oOeKhocquv4K_E55We9P99CAUc9MInDosd2NpW8k4XjKuvM5OZdWPnT_OElnDtdVlYIFRraFX0OsvsECcdTkytDW-W2ddFg"/>
              <div className="flex flex-col">
                <p className="text-sm font-semibold">Alex Morgan</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">物流主管</p>
              </div>
              <button className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <span className="material-symbols-outlined">logout</span>
              </button>
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
              <input className="block w-64 rounded-lg border-0 py-2.5 pl-10 text-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 bg-slate-50 dark:bg-[#1a2e22] placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:text-white sm:leading-6 transition-shadow" placeholder="搜索订单号、司机或地点..." type="text"/>
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
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-light dark:bg-[#1a2e22] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">总订单量</p>
                  <h3 className="text-3xl font-bold mt-1">1,248</h3>
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
                  <h3 className="text-3xl font-bold mt-1">98.2%</h3>
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
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">燃油效率</p>
                  <h3 className="text-3xl font-bold mt-1">12.4 <span className="text-lg font-normal text-slate-500">公里/升</span></h3>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-500">
                  <span className="material-symbols-outlined">local_gas_station</span>
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
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">活跃车辆</p>
                  <h3 className="text-3xl font-bold mt-1">42/45</h3>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500">
                  <span className="material-symbols-outlined">local_shipping</span>
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
              <div className="relative flex-1 bg-slate-100 dark:bg-slate-900 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-50 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-slate-900/20 pointer-events-none"></div>
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-slate-900 shadow-lg"></div>
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a2e22] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    货车 #104 - 配送中
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg"></div>
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a2e22] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    厢式货车 #05 - 装货中
                  </div>
                </div>
                <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-slate-900 shadow-lg"></div>
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a2e22] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    货车 #112 - 返程中
                  </div>
                </div>
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
                  <tr className="bg-surface-light dark:bg-[#1a2e22] hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#ORD-7782</td>
                    <td className="px-6 py-4">GreenValley 农场</td>
                    <td className="px-6 py-4">加利福尼亚州 萨克拉门托</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        已送达
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <img alt="Driver" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoPui4AkelyWMJ7GCCZi3F4RTQoFUp0qIjfB8IXajPqzrUZ2Z4DUKv9xjV_sPDqXXVXqS3XyT1tl6ytyaX_m9njaL97WpDeyB_k7qI1E1qQVyRgxHc1IvaY7yvXyQpTdbaQsnpsc0EHSqwTpHzBNbHKzOL3TPw7_CQ0Gui-sUBMR2zayLMyMmlHPJHLCebkHWKTm4ExM2Wxiqi4vSzPEf7sDw52vIxy23OTFKLJfV8bgbhW7OHE2zTOPlwNOwkNG-qe_lqXHwVww"/>
                      </div>
                      <span>Mike R.</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-surface-light dark:bg-[#1a2e22] hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#ORD-7783</td>
                    <td className="px-6 py-4">有机丰收公司</td>
                    <td className="px-6 py-4">加利福尼亚州 弗雷斯诺</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        运输中
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <img alt="Driver" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJL-WFHgp3cV8G9rg_temnggWIIj8vjwoGmj_g0caIjbh-a4J_P19JpJwja7-NPvMdL7NF2bcu18hIuR8mr5Nwb8nEXE_aAkz0jLnx23xpNSuZ6uWGA5Xiw3qBYFEO8zO9lzz6S9Iyb0r4Mydd7T2mYPoPMFV5EJabbeAu1MX_8nb6_uqXssvlkb_1T2hHoZSuszav2OtanScgyaIv_8czq7ALBIzB7kR6jvjTKqiDVok669T19Rfgu3DYeFl4ZowgC-AU3iyEuA"/>
                      </div>
                      <span>Sarah J.</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-surface-light dark:bg-[#1a2e22] hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#ORD-7784</td>
                    <td className="px-6 py-4">鲜果市场</td>
                    <td className="px-6 py-4">加利福尼亚州 莫德斯托</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        待处理
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        --
                      </div>
                      <span className="text-slate-400 italic">未分配</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-surface-light dark:bg-[#1a2e22] hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#ORD-7785</td>
                    <td className="px-6 py-4">日落杂货店</td>
                    <td className="px-6 py-4">加利福尼亚州 圣何塞</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        运输中
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <img alt="Driver" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqDhoxMmrZz5WEzKxLi95PLs0ZLmHiqYc61SABAj7DcZgeZ6H0qeo1SOcFpTrKRu0kAO8vvqcfxC-ldN9RVRDrRtZW7EO8nbGHPOhhG0cBrK8VfLblSINWcxcI3c_-gSh9n6MQWUA3MMPRrhqKYgdkLcNUlyRPZIGOCjap1jkhsdzqu4v1Iq0joIMgeeSqqlBwJXa-iywkzokx_-N4cx1BkBKXjya-_TxW5jNkcxBa3lkIYu8eDKaoqg4XgAQ1q4bXCwlZcnNkA"/>
                      </div>
                      <span>David K.</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
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
