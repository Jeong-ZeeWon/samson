import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  BookOpen, LayoutDashboard, PlusCircle, Archive, Settings, LogOut, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/app', label: '대시보드', icon: LayoutDashboard },
  { to: '/app/sermons', label: '아카이브', icon: Archive },
  { to: '/app/sermons/new', label: '새 설교', icon: PlusCircle },
  { to: '/app/settings', label: '설정', icon: Settings },
]

export default function Layout({ children }) {
  const { user, profile, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-indigo-950 text-white w-60">
      <div className="px-6 py-5 border-b border-indigo-800 flex items-center gap-3">
        <BookOpen size={22} className="text-indigo-300" />
        <span className="font-bold text-base tracking-tight">설교 아카이브</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-indigo-800">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-indigo-300 font-medium truncate">{profile?.name || '사용자'}</p>
          <p className="text-xs text-indigo-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
        >
          <LogOut size={15} />
          로그아웃
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 데스크탑 사이드바 */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-60 z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* 모바일 헤더 */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-600" />
            <span className="font-bold text-sm">설교 아카이브</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
