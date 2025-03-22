import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{ padding: 60 }}>
      <h1>Welcome to your Dashboard 🎉</h1>
      <button onClick={handleLogout} style={{
        marginTop: '24px',
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#e53935',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        Log Out
      </button>
    </div>
  )
}
