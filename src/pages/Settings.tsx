import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/api';

interface SettingsData {
    system_name: string;
    notification_email: string;
    temperature_alert_min: number;
    temperature_alert_max: number;
    auto_dispatch: boolean;
    language: string;
    data_retention_days: number;
}

export default function Settings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                if (!response.ok) throw new Error('获取设置失败');
                const data = await response.json();
                setSettings(data);
            } catch (error) {
                console.error('Fetch settings error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!settings) return;
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setSettings({
            ...settings,
            [name]: val
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (!response.ok) throw new Error('保存失败');
            setMessage({ type: 'success', text: '设置已成功保存' });
        } catch (error) {
            setMessage({ type: 'error', text: '保存失败，请稍后重试' });
        } finally {
            setIsSaving(false);
        }
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
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-all" to="/finance">
                            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                            <span className="text-sm font-medium">财务报表</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2e22] transition-all" to="/users">
                            <span className="material-symbols-outlined text-xl">group</span>
                            <span className="text-sm font-medium">用户管理</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group transition-all" to="/settings">
                            <span className="material-symbols-outlined text-xl">settings</span>
                            <span className="text-sm font-medium">系统设置</span>
                        </Link>
                    </nav>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
                <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-background-dark z-10">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold tracking-tight">系统设置</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">管理全局系统参数与安全阈值。</p>
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
                        <div className="max-w-3xl mx-auto flex flex-col gap-6">
                            {message && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                    }`}>
                                    <span className="material-symbols-outlined">
                                        {message.type === 'success' ? 'check_circle' : 'error'}
                                    </span>
                                    <p className="text-sm font-medium">{message.text}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-[#1a2e22] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold">基础配置</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-6">
                                    {/* System Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">系统名称</label>
                                        <input
                                            type="text"
                                            name="system_name"
                                            value={settings?.system_name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                        />
                                    </div>

                                    {/* Notification Email */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">告警通知邮箱</label>
                                        <input
                                            type="email"
                                            name="notification_email"
                                            value={settings?.notification_email}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                        />
                                    </div>

                                    {/* Temperature Thresholds */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">冷链最低温 (°C)</label>
                                            <input
                                                type="number"
                                                name="temperature_alert_min"
                                                value={settings?.temperature_alert_min}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">冷链最高温 (°C)</label>
                                            <input
                                                type="number"
                                                name="temperature_alert_max"
                                                value={settings?.temperature_alert_max}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow"
                                            />
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-background-dark rounded-xl">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold">自动派单模式</p>
                                            <p className="text-xs text-slate-500">基于地理围栏和司机状态自动分配新订单。</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="auto_dispatch"
                                                checked={settings?.auto_dispatch}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 bg-primary hover:bg-green-400 disabled:opacity-50 text-surface-darker px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-surface-darker"></div>
                                                    正在保存...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-xl">save</span>
                                                    保存设置
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
