import { useAuth } from '../contexts/AuthContext'
import { Key, User, Mail, CheckCircle } from 'lucide-react'

export default function Settings() {
  const { user, profile } = useAuth()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">설정</h1>

      <div className="card p-6 mb-4">
        <h2 className="section-title">계정 정보</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <User size={16} className="text-gray-400" />
            <span className="text-gray-500 w-20">이름</span>
            <span className="text-gray-900 font-medium">{profile?.name || '-'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <span className="text-gray-500 w-20">이메일</span>
            <span className="text-gray-900">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Key size={16} className="text-gray-400" />
            <span className="text-gray-500 w-20">라이선스</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
              {profile?.licenseKey || '-'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-gray-500 w-20">플랜</span>
            {profile?.plan === 'admin' ? (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
                관리자
              </span>
            ) : (
              <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                영구 라이선스
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="section-title">도움말</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            문의 사항이 있으시면 <strong>baysuss@gmail.com</strong>으로 연락해 주세요.
          </p>
          <p>
            라이선스를 분실하셨거나 계정 관련 문제가 있으시면 구매 시 받으신 영수증 이메일과 함께 문의해 주세요.
          </p>
        </div>
      </div>
    </div>
  )
}
