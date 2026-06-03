import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs, where, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import SermonCard from '../components/SermonCard'
import { BookOpen, PlusCircle, TrendingUp, Calendar } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [recent, setRecent] = useState([])
  const [stats, setStats] = useState({ total: 0, thisMonth: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const sermonsRef = collection(db, 'users', user.uid, 'sermons')

      const [recentSnap, totalSnap, monthSnap] = await Promise.all([
        getDocs(query(sermonsRef, orderBy('date', 'desc'), limit(6))),
        getCountFromServer(sermonsRef),
        getCountFromServer(query(
          sermonsRef,
          where('date', '>=', format(startOfMonth(new Date()), 'yyyy-MM-dd')),
          where('date', '<=', format(endOfMonth(new Date()), 'yyyy-MM-dd'))
        )),
      ])

      setRecent(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setStats({ total: totalSnap.data().count, thisMonth: monthSnap.data().count })
      setLoading(false)
    }
    load()
  }, [user])

  const today = format(new Date(), 'yyyy년 M월 d일 EEEE', { locale: ko })

  return (
    <div className="max-w-5xl mx-auto">
      {/* 인사 */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-gray-900">
          안녕하세요, {profile?.name || '목사님'} 👋
        </h1>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <BookOpen size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm text-gray-500 font-medium">전체 설교</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-400 mt-0.5">편</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500 font-medium">이번 달</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.thisMonth}</div>
          <div className="text-xs text-gray-400 mt-0.5">편</div>
        </div>
      </div>

      {/* 최근 설교 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">최근 설교</h2>
        <div className="flex gap-2">
          <Link to="/app/sermons" className="btn-secondary text-xs px-3 py-1.5">
            전체 보기
          </Link>
          <Link to="/app/sermons/new" className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
            <PlusCircle size={13} />
            새 설교
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : recent.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">아직 작성된 설교가 없습니다.</p>
          <Link to="/app/sermons/new" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle size={15} />
            첫 설교 작성하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recent.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      )}
    </div>
  )
}
