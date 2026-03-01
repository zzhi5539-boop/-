import { Link, useNavigate } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: '管理员' | '调度员' | '司机';
  status: '活跃' | '离线' | '已暂停';
  accessLevel: number; // 0-100
  initials: string;
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    role: '司机',
    status: '活跃',
    accessLevel: 30
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const mapUserFromDB = (dbUser: any): User => ({
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as any,
    status: dbUser.status as any,
    accessLevel: dbUser.access_level,
    initials: dbUser.initials
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (res.ok) {
        const data = await res.json();
        const mappedUsers = data.map(mapUserFromDB);
        setUsers(mappedUsers);
        if (mappedUsers.length > 0 && !editingUser) setEditingUser(mappedUsers[0]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    const initials = (newUser.name || '??').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name || '未知用户',
          email: newUser.email || 'unknown@example.com',
          role: newUser.role || '司机',
          status: newUser.status || '活跃',
          access_level: Number(newUser.accessLevel) || 30,
          initials
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUsers([mapUserFromDB(data), ...users]);
        setShowAddModal(false);
        setNewUser({ role: '司机', status: '活跃', accessLevel: 30 });
      }
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleEditUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!userToEdit.id) return;

    const initials = (userToEdit.name || '??').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    try {
      const res = await fetch(`${API_URL}/users/${userToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userToEdit.name,
          email: userToEdit.email,
          role: userToEdit.role,
          status: userToEdit.status,
          initials
        })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = mapUserFromDB(data);
        const updatedUsers = users.map(u => u.id === userToEdit.id ? updatedUser : u);
        setUsers(updatedUsers);
        setShowEditModal(false);

        if (editingUser?.id === userToEdit.id) {
          setEditingUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const openDeleteModal = (id: string) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`${API_URL}/users/${userToDelete}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const updatedUsers = users.filter(u => u.id !== userToDelete);
        setUsers(updatedUsers);
        setShowDeleteModal(false);
        setUserToDelete(null);
        if (editingUser?.id === userToDelete) {
          setEditingUser(updatedUsers[0] || null);
        }
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`${API_URL}/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_level: editingUser.accessLevel,
          role: editingUser.role
        })
      });
      if (res.ok) {
        const data = await res.json();
        const updatedUser = mapUserFromDB(data);
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        alert('权限更改已保存');
      }
    } catch (error) {
      console.error('Failed to update user permissions:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased">
      <div className="w-64 flex-shrink-0 flex flex-col justify-between bg-white dark:bg-[#111813] border-r border-slate-200 dark:border-[#29382e]">
        <div className="flex flex-col gap-4 p-4">
          <Link to="/dashboard" className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">agriculture</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-tight">农业物流系统</h1>
              <p className="text-slate-500 dark:text-[#9db8a6] text-xs font-normal leading-normal">管理员控制台</p>
            </div>
          </Link>
          <div className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-[#9db8a6] hover:bg-slate-100 dark:hover:bg-[#29382e] hover:text-slate-900 dark:hover:text-white transition-colors group" to="/dashboard">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">dashboard</span>
              <span className="text-sm font-medium">仪表盘</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-[#9db8a6] hover:bg-slate-100 dark:hover:bg-[#29382e] hover:text-slate-900 dark:hover:text-white transition-colors group" to="/orders">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">list_alt</span>
              <span className="text-sm font-medium">订单管理</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-[#9db8a6] hover:bg-slate-100 dark:hover:bg-[#29382e] hover:text-slate-900 dark:hover:text-white transition-colors group" to="/routes">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">map</span>
              <span className="text-sm font-medium">路径规划</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-[#9db8a6] hover:bg-slate-100 dark:hover:bg-[#29382e] hover:text-slate-900 dark:hover:text-white transition-colors group" to="/finance">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">bar_chart</span>
              <span className="text-sm font-medium">财务报表</span>
            </Link>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-[#29382e] text-primary dark:text-white border-l-4 border-primary">
              <span className="material-symbols-outlined text-xl text-primary">group</span>
              <span className="text-sm font-bold">用户管理</span>
            </div>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-[#9db8a6] hover:bg-slate-100 dark:hover:bg-[#29382e] hover:text-slate-900 dark:hover:text-white transition-colors group" to="/settings">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">settings</span>
              <span className="text-sm font-medium">系统设置</span>
            </Link>
          </div>
        </div>
        <div className="p-4">
          <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-green-500 text-[#111813] text-sm font-bold transition-colors">
            <span className="material-symbols-outlined mr-2 text-lg">add</span>
            <span className="truncate">新建货运任务</span>
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-[#29382e] bg-white dark:bg-[#111813] px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-slate-400 dark:text-[#9db8a6]">security</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">用户权限管理</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 dark:text-[#9db8a6]">search</span>
              </div>
              <input className="block w-full p-2 pl-10 text-sm text-slate-900 border border-slate-300 rounded-lg bg-slate-50 focus:ring-primary focus:border-primary dark:bg-[#29382e] dark:border-transparent dark:placeholder-[#9db8a6] dark:text-white dark:focus:ring-primary dark:focus:border-primary" placeholder="搜索权限..." type="text" />
            </div>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#29382e] text-slate-500 dark:text-white relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <div className="flex items-center gap-3">
              <img alt="管理员头像" className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi731gtv-4U9y-oFS956A0U5kaOdz2lPu3OwwpVedyEzrVZk_GROnAD_pqDFbU_TpDRHRKBBo8YRTJcX2VBJ8eU4qXQr7tqA-ttaKKZ-gCtvtx3HhOSvasnVtM8E83_xqUHJHdGZVsF_Ho_8CEmrpTHYmgrwm4yCuLNTZ23sA_Wx9oOeKhocquv4K_E55We9P99CAUc9MInDosd2NpW8k4XjKuvM5OZdWPnT_OElnDtdVlYIFRraFX0OsvsECcdTkytDW-W2ddFg" />
              <div className="hidden md:flex flex-col">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">Alex Morgan</p>
                <p className="text-[10px] text-slate-500 dark:text-[#9db8a6] mt-0.5">物流主管</p>
              </div>
              <button onClick={handleLogout} className="ml-1 text-slate-400 hover:text-red-500 transition-colors" title="退出登录">
                <span className="material-symbols-outlined !text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-[#0d1410]">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">角色与访问控制</h1>
                <p className="mt-2 text-slate-500 dark:text-[#9db8a6] max-w-2xl">
                  配置管理人员、物流协调员和现场司机的访问级别。更改将记录并立即生效。
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white dark:bg-[#1c261f] border border-slate-300 dark:border-[#3c5344] rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-[#29382e] transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">download</span>
                  导出日志
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-primary text-[#111813] rounded-lg text-sm font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  添加新用户
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#1c261f] p-3 rounded-lg border border-slate-200 dark:border-[#3c5344] flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 dark:text-[#9db8a6]">filter_list</span>
                <select className="bg-transparent border-none text-sm w-full text-slate-700 dark:text-white focus:ring-0 p-0">
                  <option>所有角色</option>
                  <option>管理员</option>
                  <option>调度员</option>
                  <option>司机</option>
                </select>
              </div>
              <div className="bg-white dark:bg-[#1c261f] p-3 rounded-lg border border-slate-200 dark:border-[#3c5344] flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 dark:text-[#9db8a6]">toggle_on</span>
                <select className="bg-transparent border-none text-sm w-full text-slate-700 dark:text-white focus:ring-0 p-0">
                  <option>激活状态</option>
                  <option>活跃</option>
                  <option>非活跃</option>
                  <option>待处理</option>
                </select>
              </div>
              <div className="bg-white dark:bg-[#1c261f] p-3 rounded-lg border border-slate-200 dark:border-[#3c5344] md:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 dark:text-[#9db8a6]">search</span>
                  <input className="bg-transparent border-none text-sm w-full text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-[#9db8a6] focus:ring-0 p-0" placeholder="通过姓名、邮箱或ID搜索..." />
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
              <div className="flex-1 bg-white dark:bg-[#111813] rounded-xl border border-slate-200 dark:border-[#3c5344] overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#1c261f] border-b border-slate-200 dark:border-[#3c5344]">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9db8a6]">用户</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9db8a6]">角色</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9db8a6]">状态</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9db8a6]">访问级别</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9db8a6] text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#29382e]">
                      {users.map((user, index) => (
                        <tr
                          key={user.id}
                          onClick={() => setEditingUser(user)}
                          className={`hover:bg-slate-50 dark:hover:bg-[#1c261f] group transition-colors cursor-pointer border-l-4 ${editingUser?.id === user.id ? 'bg-slate-50 dark:bg-[#1c261f]/50 border-l-primary' : 'border-l-transparent'}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-[#29382e] flex items-center justify-center text-xs font-bold text-slate-600 dark:text-white">{user.initials}</div>
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                                <div className="text-xs text-slate-500 dark:text-[#9db8a6]">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === '管理员' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                              user.role === '调度员' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                              }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <div className={`h-2 w-2 rounded-full ${user.status === '活跃' ? 'bg-green-500' :
                                user.status === '离线' ? 'bg-slate-400' :
                                  'bg-red-500'
                                }`}></div>
                              <span className="text-sm text-slate-600 dark:text-slate-300">{user.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-slate-200 dark:bg-[#29382e] rounded-full h-1.5 w-24">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${user.accessLevel}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-[#9db8a6] mt-1 block">
                              {user.accessLevel === 100 ? '完全访问' : user.accessLevel > 50 ? '高级访问' : user.accessLevel > 0 ? '有限访问' : '已撤销'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                              className="text-slate-400 hover:text-primary dark:text-[#9db8a6] dark:hover:text-primary mx-1 transition-colors"
                              title="编辑用户信息"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openDeleteModal(user.id); }}
                              className="text-slate-400 hover:text-red-500 dark:text-[#9db8a6] dark:hover:text-red-500 mx-1 transition-colors"
                              title="删除用户"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#1c261f] flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-[#9db8a6]">显示 1-4 共 24 个用户</span>
                  <div className="flex gap-2">
                    <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#29382e] text-slate-500 dark:text-white disabled:opacity-50"><span className="material-symbols-outlined">chevron_left</span></button>
                    <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#29382e] text-slate-500 dark:text-white"><span className="material-symbols-outlined">chevron_right</span></button>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-96 bg-white dark:bg-[#111813] rounded-xl border border-slate-200 dark:border-[#3c5344] flex flex-col shadow-2xl">
                <div className="p-5 border-b border-slate-200 dark:border-[#3c5344] flex items-center justify-between bg-slate-50 dark:bg-[#1c261f] rounded-t-xl">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">编辑权限</h3>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                </div>
                {editingUser ? (
                  <div className="p-5 flex-1 overflow-y-auto">
                    <div className="flex flex-col items-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-[#29382e] flex items-center justify-center text-xl font-bold text-slate-600 dark:text-white mb-3">{editingUser.initials}</div>
                      <input
                        className="text-lg font-bold text-slate-900 dark:text-white bg-transparent border-none text-center focus:ring-0 p-0 w-full"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                      <select
                        className="text-sm text-slate-500 dark:text-[#9db8a6] bg-transparent border-none focus:ring-0 p-0 mt-1"
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                      >
                        <option value="管理员">管理员</option>
                        <option value="调度员">调度员</option>
                        <option value="司机">司机</option>
                      </select>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#5e7a68] mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">local_shipping</span> 物流模块
                        </h5>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#1c261f] cursor-pointer hover:border-primary transition-colors">
                            <input defaultChecked className="h-4 w-4 rounded border-slate-300 dark:border-[#3c5344] text-primary focus:ring-primary dark:bg-[#111813]" type="checkbox" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">查看货运</div>
                              <div className="text-xs text-slate-500 dark:text-[#9db8a6]">日志只读权限</div>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#1c261f] cursor-pointer hover:border-primary transition-colors">
                            <input defaultChecked className="h-4 w-4 rounded border-slate-300 dark:border-[#3c5344] text-primary focus:ring-primary dark:bg-[#111813]" type="checkbox" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">管理车队</div>
                              <div className="text-xs text-slate-500 dark:text-[#9db8a6]">添加/编辑车辆和司机</div>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#5e7a68] mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">payments</span> 财务模块
                        </h5>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#1c261f] cursor-pointer hover:border-primary transition-colors">
                            <input defaultChecked className="h-4 w-4 rounded border-slate-300 dark:border-[#3c5344] text-primary focus:ring-primary dark:bg-[#111813]" type="checkbox" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">查看报表</div>
                              <div className="text-xs text-slate-500 dark:text-[#9db8a6]">访问损益表</div>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#1c261f] cursor-pointer hover:border-primary transition-colors">
                            <input className="h-4 w-4 rounded border-slate-300 dark:border-[#3c5344] text-primary focus:ring-primary dark:bg-[#111813]" type="checkbox" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">审批发票</div>
                              <div className="text-xs text-slate-500 dark:text-[#9db8a6]">授权超过 1k 美元的付款</div>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#5e7a68] mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">settings_suggest</span> 系统设置
                        </h5>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-[#29382e] bg-slate-50 dark:bg-[#1c261f] cursor-pointer hover:border-primary transition-colors">
                            <input
                              className="h-4 w-4 rounded border-slate-300 dark:border-[#3c5344] text-primary focus:ring-primary dark:bg-[#111813]"
                              type="checkbox"
                              checked={editingUser.accessLevel > 50}
                              onChange={(e) => setEditingUser({ ...editingUser, accessLevel: e.target.checked ? 100 : 30 })}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">用户管理</div>
                              <div className="text-xs text-slate-500 dark:text-[#9db8a6]">创建/删除用户</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-10 text-center">
                    <p className="text-slate-400 dark:text-[#9db8a6]">选择一个用户以编辑其权限</p>
                  </div>
                )}
                <div className="p-5 border-t border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#1c261f] rounded-b-xl flex gap-3">
                  <button
                    onClick={handleUpdateUser}
                    disabled={!editingUser}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-[#111813] text-sm font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50"
                  >
                    保存更改
                  </button>
                  <button
                    onClick={() => setEditingUser(users[0] || null)}
                    className="py-2.5 px-4 rounded-lg border border-slate-300 dark:border-[#3c5344] text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-100 dark:hover:bg-[#29382e] transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1c261f] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-[#3c5344] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-[#3c5344] flex justify-between items-center bg-slate-50 dark:bg-[#23332a]">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">添加新用户</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">姓名</label>
                <input
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="例如：张三"
                  value={newUser.name || ''}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">邮箱</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="zhangsan@agrilogistics.com"
                  value={newUser.email || ''}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">角色</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value as any })}
                  >
                    <option value="管理员">管理员</option>
                    <option value="调度员">调度员</option>
                    <option value="司机">司机</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">访问级别 (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    value={newUser.accessLevel}
                    onChange={e => setNewUser({ ...newUser, accessLevel: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#3c5344] text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-[#23332a] transition-colors">
                  取消
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-[#111813] font-bold hover:bg-green-500 transition-colors shadow-lg shadow-primary/20">
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1c261f] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-[#3c5344] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-[#3c5344] flex justify-between items-center bg-slate-50 dark:bg-[#23332a]">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">编辑用户信息</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">姓名</label>
                <input
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                  value={userToEdit.name || ''}
                  onChange={e => setUserToEdit({ ...userToEdit, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">邮箱</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                  value={userToEdit.email || ''}
                  onChange={e => setUserToEdit({ ...userToEdit, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">角色</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    value={userToEdit.role}
                    onChange={e => setUserToEdit({ ...userToEdit, role: e.target.value as any })}
                  >
                    <option value="管理员">管理员</option>
                    <option value="调度员">调度员</option>
                    <option value="司机">司机</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">状态</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#3c5344] bg-slate-50 dark:bg-[#111813] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    value={userToEdit.status}
                    onChange={e => setUserToEdit({ ...userToEdit, status: e.target.value as any })}
                  >
                    <option value="活跃">活跃</option>
                    <option value="离线">离线</option>
                    <option value="已暂停">已暂停</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#3c5344] text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-[#23332a] transition-colors">
                  取消
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-[#111813] font-bold hover:bg-green-500 transition-colors shadow-lg shadow-primary/20">
                  保存更改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1c261f] w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-[#3c5344] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">delete_forever</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">确认删除用户？</h3>
              <p className="text-slate-500 dark:text-[#9db8a6] text-sm mb-6">
                此操作将永久删除该用户及其所有关联权限，且无法撤销。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#3c5344] text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-[#23332a] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
