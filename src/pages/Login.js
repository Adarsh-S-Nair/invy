import './Login.css'
import AuthForm from '../components/AuthForm'
import { useState } from 'react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="auth-page">
      <div className="auth-left">
        <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
      <div className="auth-right">
        <div className="content-wrapper">
            <h1>Welcome</h1>
            <p>Manage your inventory smarter, faster, and more effortlessly.</p>
        </div>
      </div>
    </div>
  )
}
