import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Plus, X } from 'lucide-react'

const BOOKS = [
  '창세기', '출애굽기', '레위기', '민수기', '신명기',
  '여호수아', '사사기', '룻기', '사무엘상', '사무엘하',
  '열왕기상', '열왕기하', '역대상', '역대하', '에스라',
  '느헤미야', '에스더', '욥기', '시편', '잠언',
  '전도서', '아가', '이사야', '예레미야', '예레미야애가',
  '에스겔', '다니엘', '호세아', '요엘', '아모스',
  '오바댜', '요나', '미가', '나훔', '하박국',
  '스바냐', '학개', '스가랴', '말라기',
  '마태복음', '마가복음', '누가복음', '요한복음', '사도행전',
  '로마서', '고린도전서', '고린도후서', '갈라디아서', '에베소서',
  '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서', '디모데전서',
  '디모데후서', '디도서', '빌레몬서', '히브리서', '야고보서',
  '베드로전서', '베드로후서', '요한일서', '요한이서', '요한삼서',
  '유다서', '요한계시록',
]

const EMPTY = {
  title: '', date: '', scripture: '', book: '', chapter: '', verse: '',
  theme: '', series: '', outline: [''], content: '', tags: [], notes: '',
}

export default function SermonForm() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY)
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit || !user) return
    async function load() {
      const snap = await getDoc(doc(db, 'users', user.uid, 'sermons', id))
      if (snap.exists()) {
        const data = snap.data()
        setForm({ ...EMPTY, ...data, outline: data.outline?.length ? data.outline : [''] })
      }
    }
    load()
  }, [id, user])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function setOutline(i, value) {
    setForm((f) => {
      const outline = [...f.outline]
      outline[i] = value
      return { ...f, outline }
    })
  }

  function addOutline() {
    setForm((f) => ({ ...f, outline: [...f.outline, ''] }))
  }

  function removeOutline(i) {
    setForm((f) => ({ ...f, outline: f.outline.filter((_, idx) => idx !== i) }))
  }

  function addTag() {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }))
    }
    setTagInput('')
  }

  function removeTag(tag) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title) { setError('제목을 입력해 주세요.'); return }
    setLoading(true)
    try {
      const data = {
        ...form,
        outline: form.outline.filter(Boolean),
        updatedAt: new Date().toISOString(),
      }
      if (isEdit) {
        await setDoc(doc(db, 'users', user.uid, 'sermons', id), data, { merge: true })
      } else {
        data.createdAt = new Date().toISOString()
        const ref = await addDoc(collection(db, 'users', user.uid, 'sermons'), data)
        navigate(`/app/sermons/${ref.id}`, { replace: true })
        return
      }
      navigate(`/app/sermons/${id}`)
    } catch (err) {
      setError('저장에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        뒤로가기
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? '설교 수정' : '새 설교 작성'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="card p-6 space-y-4">
          <h2 className="section-title">기본 정보</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설교 제목 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input-field"
              placeholder="예) 하나님의 사랑"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설교 날짜</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시리즈</label>
              <input
                type="text"
                value={form.series}
                onChange={(e) => set('series', e.target.value)}
                className="input-field"
                placeholder="예) 요한복음 강해"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주제</label>
            <input
              type="text"
              value={form.theme}
              onChange={(e) => set('theme', e.target.value)}
              className="input-field"
              placeholder="예) 하나님의 사랑과 구원"
            />
          </div>
        </div>

        {/* 본문 */}
        <div className="card p-6 space-y-4">
          <h2 className="section-title">성경 본문</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">본문 (직접 입력)</label>
            <input
              type="text"
              value={form.scripture}
              onChange={(e) => set('scripture', e.target.value)}
              className="input-field"
              placeholder="예) 요한복음 3:16-17"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성경 책</label>
              <select
                value={form.book}
                onChange={(e) => set('book', e.target.value)}
                className="input-field"
              >
                <option value="">선택</option>
                {BOOKS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">장</label>
              <input
                type="number"
                value={form.chapter}
                onChange={(e) => set('chapter', e.target.value)}
                className="input-field"
                placeholder="3"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">절</label>
              <input
                type="text"
                value={form.verse}
                onChange={(e) => set('verse', e.target.value)}
                className="input-field"
                placeholder="16-17"
              />
            </div>
          </div>
        </div>

        {/* 개요 */}
        <div className="card p-6">
          <h2 className="section-title">설교 개요</h2>
          <div className="space-y-2">
            {form.outline.map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-sm text-gray-400 mt-2.5 w-5 flex-shrink-0">{i + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setOutline(i, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`개요 ${i + 1}`}
                />
                {form.outline.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOutline(i)}
                    className="text-gray-400 hover:text-red-500 mt-2 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOutline}
            className="mt-3 flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Plus size={15} />
            개요 추가
          </button>
        </div>

        {/* 내용 */}
        <div className="card p-6">
          <h2 className="section-title">설교 내용</h2>
          <textarea
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            className="input-field min-h-64 resize-y font-sans leading-relaxed"
            placeholder="설교 본문 내용을 자유롭게 작성하세요..."
          />
        </div>

        {/* 태그 */}
        <div className="card p-6">
          <h2 className="section-title">태그</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              className="input-field flex-1"
              placeholder="태그 입력 후 Enter 또는 추가"
            />
            <button type="button" onClick={addTag} className="btn-secondary flex-shrink-0">
              추가
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900">
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 메모 */}
        <div className="card p-6">
          <h2 className="section-title">개인 메모</h2>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="input-field min-h-24 resize-y"
            placeholder="개인적인 묵상, 기도 제목, 참고 자료 등..."
          />
        </div>

        <div className="flex gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1"
          >
            취소
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? '저장 중...' : isEdit ? '수정 완료' : '설교 저장'}
          </button>
        </div>
      </form>
    </div>
  )
}
