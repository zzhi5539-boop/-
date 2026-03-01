import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '登录失败，请检查您的凭证');
            }

            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || '登录失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4">
            <div className="layout-container w-full max-w-[1100px] flex flex-col md:flex-row bg-white dark:bg-stone-900 rounded-xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
                <div className="hidden md:flex md:w-1/2 relative bg-primary/10 items-center justify-center p-12">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQoejmx3ROHCulmKjrEXeHj5tDp_ES31Ne-TZQDTjjaUDsZ8cAkLgeVndLC6MNyCNF8CRq8k5BHhn-rBEVg7Ux5qF_C0M1BZLWhFOqh8bAgmaNR-Ew3g2ZcOrtGkbfipaXPoRE7q5dyRYWBkel6jV79-r4H4SVy8Rg2MQVTHmNIvsanzKiSCZvpDmqcxEBgdwqOD4_NXnwOPlkkjZa6iNjh9he3gNRo1bo9XtJQHwVkn1xQECBpbTTKgRmAXKUc3FTxBrTXnK45g")', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    ></div>
                    <div className="relative z-10 text-center">
                        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-slate-900 shadow-lg">
                            <span className="material-symbols-outlined text-4xl">local_shipping</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">智慧农业物流平台</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            连接田间到餐桌的每一公里。集成调度、实时监控与高效仓储管理，助力农业现代化升级。
                        </p>
                        <div className="mt-12 flex justify-center gap-6">
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">10k+</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">每日运输量</span>
                            </div>
                            <div className="w-px h-10 bg-slate-300 dark:bg-stone-700"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.9%</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">准时到达率</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-3xl">agriculture</span>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">农业物流系统</h1>
                        </div>
                        <p className="text-slate-500 dark:text-stone-400">欢迎回来，请登录您的账号</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-stone-300 mb-2">邮箱</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">person</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-stone-700 rounded-lg bg-slate-50 dark:bg-stone-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="请输入邮箱 (例如: sarah.j@agrilogistics.com)"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-stone-300 mb-2">密码</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">lock</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-stone-700 rounded-lg bg-slate-50 dark:bg-stone-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="请输入您的密码 (POC测试随意输入)"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600" type="button">
                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" id="remember-me" type="checkbox" />
                                <label className="ml-2 block text-sm text-slate-600 dark:text-stone-400" htmlFor="remember-me">记住我</label>
                            </div>
                            <div className="text-sm">
                                <a className="font-medium text-slate-600 hover:text-primary dark:text-stone-400" href="#">忘记密码？</a>
                            </div>
                        </div>
                        <button
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-slate-900 ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? '登录中...' : '进入系统'}
                        </button>
                    </form>
                    <div className="mt-12">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-stone-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-stone-900 text-slate-400 font-medium">支持的角色访问</span>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50 dark:bg-stone-800 border border-slate-100 dark:border-stone-700">
                                <span className="material-symbols-outlined text-primary mb-1">admin_panel_settings</span>
                                <span className="text-xs font-medium text-slate-700 dark:text-stone-300">系统管理员</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50 dark:bg-stone-800 border border-slate-100 dark:border-stone-700">
                                <span className="material-symbols-outlined text-primary mb-1">map</span>
                                <span className="text-xs font-medium text-slate-700 dark:text-stone-300">调度专员</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50 dark:bg-stone-800 border border-slate-100 dark:border-stone-700">
                                <span className="material-symbols-outlined text-primary mb-1">minor_crash</span>
                                <span className="text-xs font-medium text-slate-700 dark:text-stone-300">物流司机</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-center text-xs text-slate-400 dark:text-stone-600">
                        © 2024 农业物流管理系统 版权所有
                    </p>
                </div>
            </div>
        </div>
    );
}
