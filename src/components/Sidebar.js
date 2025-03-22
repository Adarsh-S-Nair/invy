import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import {
  FiUser,
  FiMenu,
  FiHome,
  FiGrid,
  FiPackage,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'
import './Sidebar.css'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: <FiHome size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiGrid size={20} />, label: 'Business', path: '/business' },
    { icon: <FiPackage size={20} />, label: 'Inventory', path: '/inventory' },
    { icon: <FiSettings size={20} />, label: 'Settings', path: '/settings' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
      {isOpen && (
        <div className="sidebar-user">
            <div className="user-avatar">
            <FiUser size={20} />
            </div>
        </div>
        )}
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
            <FiMenu size={20} />
        </button>
      </div>

      <div className="sidebar-nav">
        {navItems.map((item, i) => (
          <div
            key={i}
            className={`sidebar-link ${
              location.pathname === item.path ? 'active' : ''
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-link logout" onClick={handleLogout}>
          <FiLogOut size={20} />
          {isOpen && <span>Log Out</span>}
        </div>
      </div>
    </div>
  )
}
