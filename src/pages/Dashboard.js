import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Modal from '../components/Modal'
import DashboardCard from '../components/DashboardCard'
import CreateBusinessForm from '../components/CreateBusinessForm'
import './Dashboard.css'
import { FaDollarSign, FaMoneyBillWave, FaChartLine, FaReceipt } from 'react-icons/fa'

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

      const { data, error } = await supabase.from('businesses').select('*').eq('owner_id', user.id).maybeSingle()

      if (!error && data) {
        console.log('Business:', data)
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
    <div className="dashboard">
      <div className="page-header">
        Dashboard
      </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Row 1 - 4 Cards, each 3 wide (12 total), 1 tall */}
          <DashboardCard width={3} height={1}>
            <h3>Gross Revenue</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$12,340</p>
          </DashboardCard>

          <DashboardCard width={3} height={1}>
            <h3>Income</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$8,220</p>
          </DashboardCard>

          <DashboardCard width={3} height={1}>
            <h3>Expenses</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$4,120</p>
          </DashboardCard>

          <DashboardCard width={3} height={1}>
            <h3>Transactions</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>354</p>
          </DashboardCard>

          {/* Row 2 - 2 Cards, each 6 wide, 2 tall */}
          <DashboardCard width={8} height={2}>
            <h3>Income vs Expenses</h3>
            <p>[Bar chart here]</p>
          </DashboardCard>

          <DashboardCard width={4} height={2}>
            <h3>Stock Alerts</h3>
            <p>[Low stock items table]</p>
          </DashboardCard>

          {/* Row 3 - 2 Cards, each 6 wide, 2 tall */}
          <DashboardCard width={4} height={2}>
            <h3>Top Selling Items</h3>
            <p>[Table here]</p>
          </DashboardCard>

          <DashboardCard width={8} height={2}>
            <h3>Recent Transactions</h3>
            <p>[Transactions table]</p>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
