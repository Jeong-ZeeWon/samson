import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  ArrowLeft, Edit2, Trash2, Download, Calendar, BookOpen, Tag,
} from 'lucide-react'

export default function SermonDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sermon, setSermon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user) return
    async function load() {
      const snap = await getDoc(doc(db, 'users', user.uid, 'sermons', id))
      if (snap.exists()) setSermon({ id: snap.id, ...snap.data() })
      setLoading(false)
    }
    load()
  }, [id, user])

  async function handleDelete() {
    if (!confirm('이 설교를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
    setDeleting(true)
    await deleteDoc(doc(db, 'users', user.uid, 'sermons', id))
    navigate('/app/sermons', { replace: true })
  }

  function handleExport() {
    if (!sermon) return
    const lines = [
      `제목: ${sermon.title}`,
      sermon.date ? `날짜: ${format(new Date(sermon.date), 'yyyy년 M월 d일', { locale: ko })}` : '',
      sermon.scripture ? `본문: ${sermon.scripture}` : '',
      sermon.series ? `시리즈: ${sermon.series}` : '',
      sermon.theme ? `주제: ${sermon.theme}` : '',
      '',
      sermon.outline?.filter(Boolean).length
        ? `[개요]\n${sermon.outline.filter(Boolean).map((o, i) => `${i + 1}. ${o}`).join('\n')}`
        : '',
      '',
      sermon.content ? `[설교 내용]\n${sermon.content}` : '',
      '',
      sermon.notes ? `[메모]\n${sermon.notes}` : '',
      sermon.tags?.length ? `\n태그: ${sermon.tags.join(', ')}` : '',
    ].filter(Boolean).join('\n')

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sermon.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="text-center py-12 text-gray-400">불러오는 중...</div>
  if (!sermon) return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">설교를 찾을 수 없습니다.</p>
      <Link to="/app/sermons" className="btn-primary">아카이브로 돌아가기</Link>
    </div>
  )

  const dateStr = sermon.date
    ? format(new Date(sermon.date), 'yyyy년 M월 d일 (EEEE)', { locale: ko })
    : null

  return (
    <div className="max-w-3xl mx-auto">
      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={15} />
          뒤로가기
        </button>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-1.5 text-xs">
            <Download size={13} />
            내보내기
          </button>
          <Link to={`/app/sermons/${id}/edit`} className="btn-secondary flex items-center gap-1.5 text-xs">
            <Edit2 size={13} />
            수정
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-danger flex items-center gap-1.5 text-xs"
          >
            <Trash2 size={13} />
            삭제
          </button>
        </div>
      </div>

      {/* 헤더 */}
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{sermon.title}</h1>
          {sermon.series && (
            <span className="flex-shrink-0 bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">
              {sermon.series}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {dateStr && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {dateStr}
            </span>
          )}
          {sermon.scripture && (
            <span className="flex items-center gap-1.5 font-medium text-indigo-600">
              <BookOpen size={14} />
              {sermon.scripture}
            </span>
          )}
        </div>

        {sermon.theme && (
          <p className="mt-3 text-gray-600 font-medium">{sermon.theme}</p>
        )}

        {sermon.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {sermon.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 개요 */}
      {sermon.outline?.filter(Boolean).length > 0 && (
        <div className="card p-6 mb-4">
          <h2 className="section-title">설교 개요</h2>
          <ol className="space-y-2">
            {sermon.outline.filter(Boolean).map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <span className="text-indigo-500 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 내용 */}
      {sermon.content && (
        <div className="card p-6 mb-4">
          <h2 className="section-title">설교 내용</h2>
          <div className="prose text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
            {sermon.content}
          </div>
        </div>
      )}

      {/* 메모 */}
      {sermon.notes && (
        <div className="card p-6 mb-8 border-l-4 border-l-amber-400">
          <h2 className="section-title text-amber-700">개인 메모</h2>
          <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
            {sermon.notes}
          </div>
        </div>
      )}
    </div>
  )
}
