import { Link } from 'react-router-dom';

export default function RoutePlanning() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-6 py-3 bg-surface-darker z-20 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight">农业物流系统</h1>
              <p className="text-text-secondary text-xs">管理员控制台</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors" to="/dashboard">仪表盘</Link>
            <Link className="text-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors" to="/orders">订单</Link>
            <Link className="text-white text-sm font-medium leading-normal border-b-2 border-primary pb-0.5" to="/routes">路线</Link>
            <Link className="text-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors" to="#">车队</Link>
            <Link className="text-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors" to="#">报表</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex w-full max-w-xs items-center rounded-lg bg-border-dark h-9">
            <div className="text-text-secondary flex items-center justify-center pl-3">
              <span className="material-symbols-outlined !text-[20px]">search</span>
            </div>
            <input className="w-full bg-transparent border-none text-white placeholder:text-text-secondary focus:ring-0 text-sm h-full" placeholder="搜索订单或路线..."/>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-text-secondary hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 size-2 bg-primary rounded-full"></span>
            </button>
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-border-dark" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzPO9xSGjQLZlfMlb4JSrLrlFTcKfKHeFb7jW8Uddgql1z2ORZ8b9oZbZV0tTaIUBV46kmBxYRr2SW2hCrHJlcTjpwUeAjS1op_icu_BOtGQmGeb6VCc2diYii0L2TWWDq0sew7MPqy3gjwXTvAE5cNnpd-N_mIpgHej1WOk-i0dMkjvGvF4ea98BKwl261WlCx0Wm43FPrK7sd2xJ8O0Z1ddHhXvGaQJImCoBGnnnqQkUV3EhvduXRcmkizVe0YNabGvk3WrjaA")'}}></div>
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
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">待处理订单 (12)</h3>
              <button className="text-primary text-xs font-medium hover:underline">全选</button>
            </div>
            <div className="space-y-3">
              <div className="group flex flex-col bg-surface-dark border border-border-dark rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <input defaultChecked className="rounded border-text-secondary bg-transparent text-primary focus:ring-offset-surface-dark focus:ring-primary size-4" type="checkbox"/>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">#ORD-2023</span>
                        <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">高优先级</span>
                      </div>
                      <div className="text-text-secondary text-xs mt-0.5">生鲜市场 • 2.5 吨</div>
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium bg-border-dark px-2 py-1 rounded">08:00 AM</span>
                </div>
                <div className="flex items-center gap-4 mt-2 pl-9">
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                    <span className="material-symbols-outlined !text-[14px]">location_on</span>
                    <span>北区枢纽</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                    <span className="material-symbols-outlined !text-[14px]">ac_unit</span>
                    <span>冷藏</span>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col bg-surface-dark border border-border-dark rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <input defaultChecked className="rounded border-text-secondary bg-transparent text-primary focus:ring-offset-surface-dark focus:ring-primary size-4" type="checkbox"/>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">#ORD-2024</span>
                      </div>
                      <div className="text-text-secondary text-xs mt-0.5">绿谷合作社 • 1.2 吨</div>
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium bg-border-dark px-2 py-1 rounded">09:30 AM</span>
                </div>
                <div className="flex items-center gap-4 mt-2 pl-9">
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                    <span className="material-symbols-outlined !text-[14px]">location_on</span>
                    <span>东区枢纽</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                    <span className="material-symbols-outlined !text-[14px]">local_shipping</span>
                    <span>标准</span>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col bg-surface-dark border border-border-dark rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <input className="rounded border-text-secondary bg-transparent text-primary focus:ring-offset-surface-dark focus:ring-primary size-4" type="checkbox"/>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">#ORD-2025</span>
                        <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">中优先级</span>
                      </div>
                      <div className="text-text-secondary text-xs mt-0.5">城市中心仓库 • 5.0 吨</div>
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium bg-border-dark px-2 py-1 rounded">11:00 AM</span>
                </div>
                <div className="flex items-center gap-4 mt-2 pl-9">
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                    <span className="material-symbols-outlined !text-[14px]">location_on</span>
                    <span>南区枢纽</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                    <span className="material-symbols-outlined !text-[14px]">ac_unit</span>
                    <span>冷藏</span>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col bg-surface-dark border border-border-dark rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <input className="rounded border-text-secondary bg-transparent text-primary focus:ring-offset-surface-dark focus:ring-primary size-4" type="checkbox"/>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">#ORD-2026</span>
                      </div>
                      <div className="text-text-secondary text-xs mt-0.5">有机全食 • 3.1 吨</div>
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium bg-border-dark px-2 py-1 rounded">01:15 PM</span>
                </div>
                <div className="flex items-center gap-4 mt-2 pl-9">
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                    <span className="material-symbols-outlined !text-[14px]">location_on</span>
                    <span>西区枢纽</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                    <span className="material-symbols-outlined !text-[14px]">local_shipping</span>
                    <span>标准</span>
                  </div>
                </div>
              </div>
              <div className="group flex flex-col bg-surface-dark border border-border-dark rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden opacity-60">
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div className="flex items-center gap-3">
                    <input className="rounded border-text-secondary bg-transparent text-primary focus:ring-offset-surface-dark focus:ring-primary size-4" type="checkbox"/>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">#ORD-2027</span>
                      </div>
                      <div className="text-text-secondary text-xs mt-0.5">日出杂货 • 1.8 吨</div>
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium bg-border-dark px-2 py-1 rounded">02:45 PM</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-border-dark bg-surface-darker">
            <div className="flex items-center justify-between mb-3 text-xs text-text-secondary">
              <span>预估距离: <b className="text-white">142 公里</b></span>
              <span>预估时间: <b className="text-white">3小时 45分</b></span>
            </div>
            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-green-400 transition-colors text-surface-darker gap-2 text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_0_20px_rgba(25,230,94,0.3)]">
              <span className="material-symbols-outlined !text-[20px]">magic_button</span>
              <span className="truncate">优化路径</span>
            </button>
          </div>
        </aside>
        <div className="flex-1 relative bg-surface-darker h-full w-full">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button className="bg-surface-darker border border-border-dark text-white p-2 rounded-lg shadow-lg hover:bg-border-dark transition-colors" title="图层设置">
              <span className="material-symbols-outlined !text-[20px]">layers</span>
            </button>
            <div className="flex bg-surface-darker border border-border-dark rounded-lg shadow-lg overflow-hidden">
              <button className="text-white p-2 hover:bg-border-dark transition-colors border-r border-border-dark">
                <span className="material-symbols-outlined !text-[20px]">add</span>
              </button>
              <button className="text-white p-2 hover:bg-border-dark transition-colors">
                <span className="material-symbols-outlined !text-[20px]">remove</span>
              </button>
            </div>
          </div>
          <div className="w-full h-full relative overflow-hidden bg-surface-darker">
            <img alt="Dark satellite map view of agricultural fields and roads" className="w-full h-full object-cover opacity-40 grayscale mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwykGMM4JxWM2YmAEYlh-DN568kEcPdfE0XNngkv2-LBIycz3ePJGW9ucN3v8i_Csx9DI5mCXDyShX9aeaPXrjL9by5e0tn4OL5TEDIQzrjVg7973E2xVmqIeRe0RdUymHhzg1bOe3MyoMXj4dzV6u6il8hBvACfzghNftSpoMC3h4G8EgLRBsXKRtkZPq-m9EnHQ46u_vEeNJe8YHJSEHrhZv34gYcsuc0ZWWfBtyT8oXUK_dKFwanRo4XF9TZIeoUWfoR-fX3Q"/>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 5}}>
              <path className="drop-shadow-[0_0_8px_rgba(25,230,94,0.8)]" d="M 300 150 Q 450 200 500 350 T 700 450 T 850 300 T 1000 350" fill="none" stroke="#19e65e" strokeDasharray="8 4" strokeWidth="4"></path>
              <circle cx="300" cy="150" fill="#111813" r="8" stroke="#19e65e" strokeWidth="3"></circle>
              <circle cx="300" cy="150" fill="#19e65e" fillOpacity="0.2" r="16"></circle>
              <circle cx="500" cy="350" fill="#111813" r="6" stroke="white" strokeWidth="3"></circle>
              <circle cx="700" cy="450" fill="#111813" r="6" stroke="white" strokeWidth="3"></circle>
              <circle cx="850" cy="300" fill="#111813" r="6" stroke="white" strokeWidth="3"></circle>
              <circle cx="1000" cy="350" fill="#111813" r="8" stroke="#ef4444" strokeWidth="3"></circle>
            </svg>
            <div className="absolute top-[130px] left-[280px] z-10">
              <div className="bg-surface-darker border border-primary text-white text-xs px-3 py-1.5 rounded-lg shadow-xl font-medium flex items-center gap-2 transform -translate-y-full -translate-x-1/2 mb-2">
                <span className="bg-primary text-surface-darker text-[10px] font-bold px-1 rounded">起点</span>
                <span>中央枢纽</span>
              </div>
            </div>
            <div className="absolute top-[330px] left-[480px] z-10">
              <div className="bg-surface-darker border border-border-dark text-white text-xs px-2 py-1 rounded-lg shadow-xl font-medium transform -translate-y-full -translate-x-1/2 mb-2 whitespace-nowrap">
                1. 农场生鲜
              </div>
            </div>
            <div className="absolute top-[430px] left-[680px] z-10">
              <div className="bg-surface-darker border border-border-dark text-white text-xs px-2 py-1 rounded-lg shadow-xl font-medium transform -translate-y-full -translate-x-1/2 mb-2 whitespace-nowrap">
                2. 绿谷
              </div>
            </div>
            <div className="absolute top-[280px] left-[830px] z-10">
              <div className="bg-surface-darker border border-border-dark text-white text-xs px-2 py-1 rounded-lg shadow-xl font-medium transform -translate-y-full -translate-x-1/2 mb-2 whitespace-nowrap">
                3. 城市仓库
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-surface-darker/90 backdrop-blur border border-border-dark rounded-xl p-3 shadow-2xl flex gap-6">
            <div className="flex flex-col items-center px-4 border-r border-border-dark">
              <span className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">订单总数</span>
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <div className="flex flex-col items-center px-4 border-r border-border-dark">
              <span className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">总重量</span>
              <span className="text-white font-bold text-lg">8.7 吨</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">提升效率</span>
              <span className="text-primary font-bold text-lg">+12%</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
