import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Archive, Search, Download } from 'lucide-react'

const features = [
  { icon: BookOpen, title: '설교 노트 작성', desc: '제목, 본문, 개요, 내용을 체계적으로 기록하세요.' },
  { icon: Archive, title: '아카이브 관리', desc: '모든 설교를 날짜·태그·시리즈별로 정리합니다.' },
  { icon: Search, title: '빠른 검색', desc: '제목, 본문, 주제 어디서든 즉시 검색하세요.' },
  { icon: Download, title: '내보내기', desc: '설교 내용을 텍스트 파일로 간편하게 내보냅니다.' },
]

const pricing = [
  { check: '설교 무제한 저장' },
  { check: '전체 검색 기능' },
  { check: '태그 및 시리즈 관리' },
  { check: '내보내기 기능' },
  { check: '업데이트 무료 제공' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={22} className="text-indigo-600" />
            <span className="font-bold text-gray-900">설교 아카이브</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              로그인
            </Link>
            <Link to="/register" className="btn-primary">
              무료 체험
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <BookOpen size={12} />
            목사님을 위한 설교 관리 도구
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            설교 준비부터 보관까지<br />
            <span className="text-indigo-600">한 곳에서</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            수년간 쌓인 설교를 체계적으로 아카이브하고,
            본문 및 주제별로 즉시 찾아볼 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary text-base px-6 py-3">
              지금 시작하기 →
            </Link>
            <Link to="/login" className="btn-secondary text-base px-6 py-3">
              이미 계정이 있어요
            </Link>
          </div>
        </div>
      </section>

      {/* 기능 */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            설교 사역에 꼭 필요한 기능만
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">단 한 번의 구매</h2>
          <p className="text-gray-600 mb-8">월정액 없이 영구 사용</p>

          <div className="card p-8 border-2 border-indigo-500">
            <div className="text-4xl font-bold text-gray-900 mb-1">₩29,000</div>
            <div className="text-sm text-gray-500 mb-6">1회 결제 · 영구 사용</div>
            <ul className="space-y-3 mb-8 text-left">
              {pricing.map(({ check }) => (
                <li key={check} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  {check}
                </li>
              ))}
            </ul>
            <a
              href="https://gumroad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center block py-3"
            >
              구매하기
            </a>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} 설교 아카이브. 모든 권리 보유.
        </p>
      </footer>
    </div>
  )
}
