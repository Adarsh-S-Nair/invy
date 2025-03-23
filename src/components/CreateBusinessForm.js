import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function CreateBusinessForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!name.trim()) return

    setLoading(true)
    setError(null)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('Could not get user.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('businesses')
      .insert({
        name,
        owner_id: user.id,
      })

    setLoading(false)

    if (insertError) {
      setError('Failed to create business.')
      console.error(insertError)
    } else {
      onCreate(name) // let parent know we’re done
    }
  }

  return (
    <>
      <input
        type="text"
        placeholder="Enter business name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {error && <p className="modal-error">{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button className="btn btn-muted" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </>
  )
}
