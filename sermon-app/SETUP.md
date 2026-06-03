# 설교 아카이브 앱 — 설정 & 배포 가이드

## 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com) → 새 프로젝트 생성
2. **Authentication** → 이메일/비밀번호 로그인 활성화
3. **Firestore Database** → 프로덕션 모드로 생성
4. **프로젝트 설정** → 웹 앱 추가 → config 값 복사

## 2. 환경변수 설정

```bash
cp .env.example .env.local
# .env.local 파일에 Firebase config 값 입력
```

## 3. Firestore 보안 규칙 적용

Firebase Console → Firestore → 규칙 탭에 `firestore.rules` 내용 붙여넣기

## 4. 라이선스 키 생성 (Firestore)

```javascript
// Firebase Console → Firestore → licenses 컬렉션에 문서 추가
// 문서 ID = 라이선스 키 (예: SMCH-2024-ABCD-1234)
{
  "used": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

또는 스크립트로 일괄 생성:
```bash
node scripts/generate-licenses.js
```

## 5. 로컬 개발

```bash
npm install
npm run dev
```

## 6. Firebase Hosting 배포

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # dist 폴더, SPA 설정 선택
npm run build
firebase deploy
```

## 7. 판매 (Gumroad 사용)

1. [Gumroad](https://gumroad.com) 계정 생성
2. 새 제품 → **Digital product** → 가격: ₩29,000
3. 결제 완료 후 라이선스 키 자동 발송 설정:
   - Gumroad → 제품 → **Thank you page** 또는 이메일에 키 포함
   - 또는 Make(Integromat)/Zapier로 결제 → Firestore에 키 자동 생성 자동화

## 라이선스 키 발급 자동화 (권장)

Make.com 또는 Zapier:
- 트리거: Gumroad 결제 완료
- 액션 1: UUID 생성 (예: `SMCH-XXXX-XXXX-XXXX`)
- 액션 2: Firestore에 `licenses/{key}` 문서 생성 `{used: false}`
- 액션 3: 구매자 이메일로 키 발송

## 도메인 연결

Firebase Hosting → 커스텀 도메인 추가
예: `sermon-archive.kr`
