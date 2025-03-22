// src/components/CreateBusinessForm.js
import { useState } from 'react'

export default function CreateBusinessForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return
    onCreate(name)
  }

  return (
    <>
      <input
        type="text"
        placeholder="Enter business name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={onCancel} style={{ background: 'var(--color-muted)' }}>
          Cancel
        </button>
        <button onClick={handleSubmit} style={{ background: 'var(--color-primary)', color: 'white' }}>
          Create
        </button>
      </div>
    </>
  )
}
