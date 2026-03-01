import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/api';

interface FinanceOrder {
    id: string;
    date: string;
    product: string;
    origin: string;
    destination: string;
    status: string;
    weight_kg: number;
    unit_price: number;
    revenue: number;
    cost: number;
    profit: number;
}

interface FinanceSummary {
    total_revenue: number;
    total_cost: number;
    net_profit: number;
    order_count: number;
    completed_count: number;
    in_transit_count: number;
}

export default function Finance() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<FinanceSummary | null>(null);
    const [orders, setOrders] = useState<FinanceOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const response = await fetch(`${API_URL}/finance/summary`);
                if (!response.ok) throw new Error('网络请求失败');
                const data = await response.json();
                setSummary(data.summary);
                setOrders(data.orders);
            } catch (error) {
                console.error('Fetch finance error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFinanceData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount);
    };

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden">
            {/* Sidebar - Same as Dashboard */}
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
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-all" to="/dashboard">
                            <span className="material-symbols-outlined text-xl">dashboard</span>
                            <span className="text-sm font-medium">仪表盘</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-all" to="/orders">
                            <span className="material-symbols-outlined text-xl">shopping_cart</span>
                            <span className="text-sm font-medium">订单管理</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-all" to="/routes">
                            <span className="material-symbols-outlined text-xl">map</span>
                            <span className="text-sm font-medium">路径规划</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group transition-all" to="/finance">
                            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                            <span className="text-sm font-medium">财务报表</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-all" to="/users">
                            <span className="material-symbols-outlined text-xl">group</span>
                            <span className="text-sm font-medium">用户管理</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-all" to="/settings">
                            <span className="material-symbols-outlined text-xl">settings</span>
                            <span className="text-sm font-medium">系统设置</span>
                        </Link>
                    </nav>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
                <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark z-10">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold tracking-tight">财务报表</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">实时监控物流收益与支出详情。</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-xl">logout</span>
                            退出登录
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: '总收入', value: formatCurrency(summary?.total_revenue || 0), icon: 'payments', color: 'text-primary' },
                                    { label: '总支出', value: formatCurrency(summary?.total_cost || 0), icon: 'shopping_basket', color: 'text-orange-500' },
                                    { label: '净利润', value: formatCurrency(summary?.net_profit || 0), icon: 'trending_up', color: 'text-green-500' },
                                    { label: '订单总量', value: summary?.order_count || 0, icon: 'receipt_long', color: 'text-blue-500' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-surface-light dark:bg-[#1a2e22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-2 rounded-lg bg-slate-50 dark:bg-background-dark ${stat.color}`}>
                                                <span className="material-symbols-outlined">{stat.icon}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Detail Table */}
                            <div className="bg-surface-light dark:bg-[#1a2e22] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <h3 className="font-bold">财务明细账单</h3>
                                    <button className="text-primary text-sm font-medium hover:underline">导出报表</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-background-dark/50">
                                                <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">订单编号</th>
                                                <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">产品类型</th>
                                                <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">重量 (kg)</th>
                                                <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">收入</th>
                                                <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">成本</th>
                                                <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">利润</th>
                                                <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">状态</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{order.product}</td>
                                                    <td className="px-6 py-4 text-sm font-mono">{order.weight_kg}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-green-500">{formatCurrency(order.revenue)}</td>
                                                    <td className="px-6 py-4 text-sm text-red-400">{formatCurrency(order.cost)}</td>
                                                    <td className="px-6 py-4 text-sm font-bold">{formatCurrency(order.profit)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.status === '已完成' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                                                                order.status === '运输中' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                                                                    'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-400'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
