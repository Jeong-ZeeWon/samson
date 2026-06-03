import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Key } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', licenseKey: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    try {
      await register(form.email, form.password, form.licenseKey.trim(), form.name)
      navigate('/app')
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen size={24} className="text-indigo-600" />
            <span className="font-bold text-gray-900 text-lg">설교 아카이브</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">계정 만들기</h1>
          <p className="text-sm text-gray-500 mt-1">라이선스 키가 필요합니다</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="홍길동 목사"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="pastor@church.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="6자 이상"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Key size={13} />
                라이선스 키
              </label>
              <input
                name="licenseKey"
                type="text"
                value={form.licenseKey}
                onChange={handleChange}
                className="input-field font-mono tracking-wider"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                구매 시 이메일로 전달된 키를 입력하세요
              </p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? '계정 생성 중...' : '계정 만들기'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            이미 계정이 있나요?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              로그인
            </Link>
          </p>
        </div>

        <p className="text-center mt-4">
          <a
            href="https://gumroad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-500 hover:underline"
          >
            라이선스 구매하기 →
          </a>
        </p>
      </div>
    </div>
  )
}
