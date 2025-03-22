import { useState } from 'react'
import Modal from '../components/Modal'
import CreateBusinessForm from '../components/CreateBusinessForm'
import './Dashboard.css'

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)

  const handleCreateBusiness = (name) => {
    console.log('Creating business:', name)
    setShowModal(false)
  }

  return (
    <div className="dashboard-empty">
      <img src="/images/get-started.svg" alt="Get started" />
      <p className="subtle-text">You haven’t set up your business yet. Let’s get started.</p>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Create Business
      </button>

      <Modal
        title="Create a new business"
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
