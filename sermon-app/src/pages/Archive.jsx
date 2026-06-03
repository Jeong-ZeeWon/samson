import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import SermonCard from '../components/SermonCard'
import { Search, PlusCircle, Filter } from 'lucide-react'

export default function Archive() {
  const { user } = useAuth()
  const [sermons, setSermons] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const snap = await getDocs(
        query(collection(db, 'users', user.uid, 'sermons'), orderBy('date', 'desc'))
      )
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setSermons(data)
      setFiltered(data)
      setLoading(false)
    }
    load()
  }, [user])

  useEffect(() => {
    let result = sermons
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.scripture?.toLowerCase().includes(q) ||
          s.theme?.toLowerCase().includes(q) ||
          s.content?.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (selectedTag) {
      result = result.filter((s) => s.tags?.includes(selectedTag))
    }
    setFiltered(result)
  }, [search, selectedTag, sermons])

  // 전체 태그 목록 수집
  const allTags = [...new Set(sermons.flatMap((s) => s.tags || []))].sort()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">설교 아카이브</h1>
        <Link to="/app/sermons/new" className="btn-primary flex items-center gap-1.5">
          <PlusCircle size={15} />
          새 설교
        </Link>
      </div>

      {/* 검색 + 필터 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="제목, 본문, 주제, 태그 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        {allTags.length > 0 && (
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="input-field sm:w-44"
          >
            <option value="">모든 태그</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        )}
      </div>

      {/* 태그 필터 칩 */}
      {selectedTag && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">필터:</span>
          <button
            onClick={() => setSelectedTag('')}
            className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full flex items-center gap-1 hover:bg-indigo-200 transition-colors"
          >
            {selectedTag} ×
          </button>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-4">
        {filtered.length}편 {search || selectedTag ? '검색됨' : '전체'}
      </p>

      {loading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400">
            {search || selectedTag ? '검색 결과가 없습니다.' : '아직 설교가 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      )}
    </div>
  )
}
