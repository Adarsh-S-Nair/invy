import { useEffect, useRef } from 'react'
import './ContextMenu.css'

export default function ContextMenu({ items = [], onClose }) {
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="context-menu" ref={ref}>
      {items.map((item, index) => (
        <div key={index} className="context-menu-item" onClick={item.onClick}>
          {item.label}
        </div>
      ))}
    </div>
  )
}
