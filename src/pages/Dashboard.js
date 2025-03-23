import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Modal from '../components/Modal'
import CreateBusinessForm from '../components/CreateBusinessForm'
import './Dashboard.css'

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) return

      console.log(`User ID: ${user.id}`)

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (!error && data) {
        setBusiness(data)
      }

      setLoading(false)
    }

    fetchBusiness()
  }, [])

  const handleCreateBusiness = (name) => {
    // Re-fetch businesses after creating
    setShowModal(false)
    setLoading(true)
    setTimeout(() => {
      // Small delay to ensure Supabase insert has propagated
      window.location.reload()
    }, 500)
  }

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>
  }

  if (!business) {
    return (
      <div className="dashboard-empty">
        <img src="/images/get-started.svg" alt="Get started" />
        <p className="subtle-text">You haven’t set up your business yet. Let’s get started.</p>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Create Business
        </button>

        <Modal
          title="Create a New Business"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <CreateBusinessForm
            onCreate={handleCreateBusiness}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      </div>
    )
  }

  // 🎯 Placeholder dashboard view for users with a business
  return (
    <div className="dashboard-main">
      <h2>Welcome back 👋</h2>
      <p>Your business: <strong>{business.name}</strong></p>
      {/* You can replace this later with real dashboard widgets */}
    </div>
  )
}
