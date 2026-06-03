import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        setProfile(snap.exists() ? snap.data() : null)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email, password, licenseKey, name) {
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e) => e.trim())
    const isAdmin = adminEmails.includes(email)

    if (!isAdmin) {
      // 일반 사용자: 라이선스 키 검증
      const licenseRef = doc(db, 'licenses', licenseKey)
      const licenseSnap = await getDoc(licenseRef)

      if (!licenseSnap.exists()) throw new Error('유효하지 않은 라이선스 키입니다.')
      if (licenseSnap.data().used) throw new Error('이미 사용된 라이선스 키입니다.')

      const cred = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(db, 'users', cred.user.uid), {
        name, email, licenseKey,
        createdAt: new Date().toISOString(),
        plan: 'full',
      })

      await updateDoc(licenseRef, { used: true, usedBy: cred.user.uid, usedAt: new Date().toISOString() })

      return cred
    }

    // 관리자: 라이선스 키 없이 바로 가입
    const cred = await createUserWithEmailAndPassword(auth, email, password)

    await setDoc(doc(db, 'users', cred.user.uid), {
      name, email,
      licenseKey: 'ADMIN',
      createdAt: new Date().toISOString(),
      plan: 'admin',
    })

    return cred
  }

  async function logout() {
    return signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
