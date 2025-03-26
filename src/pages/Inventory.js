import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { formatCurrency } from '../utils/utils'
import './Inventory.css'
import emptyBox from '../assets/empty-box.svg'
import Table from '../components/Table'
import Modal from '../components/Modal'
import ContextMenu from '../components/ContextMenu'
import { FiMoreVertical, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { FaPlus, FaSearch } from "react-icons/fa"
import { MdEdit, MdDelete, MdMoreVert } from "react-icons/md";



export default function Inventory({ business }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [openMenuIndex, setOpenMenuIndex] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(15) // default


  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('items')
                                          .select('*')
                                          .eq('business_id', business.id)
                                          .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching items:', error)
    } else {
      setItems(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    const calculatePageSize = () => {
      const rowHeight = 50 // approx row height in px (adjust if needed)
      const availableHeight = window.innerHeight - 380
      const calculated = Math.floor(availableHeight / rowHeight)
      setPageSize(calculated)
    }
  
    calculatePageSize()
  
    window.addEventListener('resize', calculatePageSize)
    return () => window.removeEventListener('resize', calculatePageSize)
  }, [])

  useEffect(() => {
    if (!business?.id) return
  
    fetchItems()
  }, [business])

  const handleAddItem = async (formData) => {
    if (!business) {
      console.error('No business found.')
      return
    }
  
    const { error } = await supabase.from('items').insert([
      {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 0,
        purchase_price: parseFloat(formData.purchase_price) || 0,
        sell_price: parseFloat(formData.sell_price) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 0,
        business_id: business.id,
      },
    ])
  
    if (error) {
      console.error('Failed to insert item:', error)
      return
    }
    setShowAddModal(false)
    fetchItems()
  }
  
  const openEditModal = (item) => {
    setItemToEdit(item)
    setEditModalOpen(true)
  }

  const handleEditItem = async (updatedData) => {
    if (!itemToEdit?.id) {
      console.error("Missing item ID")
      return
    }
  
    const { error } = await supabase.from('items').update({
      name: updatedData.name,
      category: updatedData.category,
      quantity: parseInt(updatedData.quantity) || 0,
      purchase_price: parseFloat(updatedData.purchase_price) || 0,
      sell_price: parseFloat(updatedData.sell_price) || 0,
      low_stock_threshold: parseInt(updatedData.low_stock_threshold) || 0,
    }).eq('id', itemToEdit.id)
  
    if (error) {
      console.error('Error updating item:', error)
      return
    }
    setEditModalOpen(false)
    setItemToEdit(null)
    fetchItems()
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return
  
    const { error } = await supabase.from('items').delete().eq('id', itemToDelete.id)
  
    if (error) {
      console.error('Failed to delete item:', error)
      return
    }
  
    setDeleteModalOpen(false)
    setItemToDelete(null)
    fetchItems()
  }
  

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Quantity', accessorKey: 'quantity' },
    { header: 'Purchase Price', accessorKey: 'purchase_price', cell: info => formatCurrency(info.getValue()) },
    { header: 'Sell Price', accessorKey: 'sell_price', cell: info => formatCurrency(info.getValue()) },
    {
      header: 'Status',
      id: 'status', // use `id` instead of `accessorKey` since we're not pulling directly from data
      cell: info => {
        const row = info.row.original
        const rowIndex = info.row.index
    
        const { quantity, low_stock_threshold } = row
    
        let status = 'In Stock'
        if (quantity <= 0) {
          status = 'Out of Stock'
        } else if (quantity <= low_stock_threshold) {
          status = 'Low on Stock'
        }
    
        return (
          <div className="cell-with-icon-wrapper">
            <span className={`status-tag ${status.toLowerCase().replace(/\s/g, '-')}`}>
              {status}
            </span>
    
            <button
              className="action-icon-btn"
              onClick={() => setOpenMenuIndex(openMenuIndex === rowIndex ? null : rowIndex)}
            >
              <MdMoreVert size={20} />
            </button>
    
            {openMenuIndex === rowIndex && (
              <div className="context-menu-anchor">
                <ContextMenu
                  items={[
                    {
                      label: 'Edit',
                      icon: <MdEdit size={16} />,
                      onClick: () => {
                        openEditModal(row)
                        setOpenMenuIndex(null)
                      },
                    },
                    {
                      label: 'Delete',
                      icon: <MdDelete size={16} />,
                      onClick: () => {
                        setItemToDelete(row)
                        setDeleteModalOpen(true)
                        setOpenMenuIndex(null)
                      },
                      danger: true,
                    },
                  ]}
                  onClose={() => setOpenMenuIndex(null)}
                />
              </div>
            )}
          </div>
        )
      }
    }
  ]

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase()
  
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.quantity.toString().includes(query) ||
      item.sell_price.toString().includes(query) ||
      item.purchase_price.toString().includes(query)
    )
  })

  return (
    <div className="inventory-page">
      <div className="page-header">Inventory</div>

      <div className="inventory-content">
        <div className="inventory-card">
          <div className="inventory-inner-card">
            {items.length === 0 ? (
              <div className="empty-state">
                <img src={emptyBox} alt="No items" />
                <p>No items found in your inventory</p>
                <button className="primary-btn" onClick={() => setShowAddModal(true)}>
                  Add Item
                </button>
              </div>
            ) : (
              <>
                <div className="table-header-row">
                  <div className="search-bar">
                    <FaSearch size={16} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <button className="btn btn-primary new-item-btn" onClick={() => setShowAddModal(true)}>
                    <FaPlus />
                    New Item
                  </button>
                </div>

                <Table
                  data={filteredItems}
                  columns={columns}
                  pageSize={pageSize}
                  openMenuIndex={openMenuIndex}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <Modal
          title="Add New Item"
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          actionLabel="Add"
          loadingLabel="Adding..."
          onSubmit={handleAddItem}
          fields={[
            { name: 'name', label: 'Item Name', required: true, fullWidth: true },
            { name: 'category', label: 'Category', required: true, fullWidth: true },
            { name: 'quantity', label: 'Quantity', type: 'number', min: 0, step: 1, defaultValue: 0 },
            { name: 'low_stock_threshold', label: 'Low Stock Threshold', type: 'number', min: 0, step: 1, defaultValue: 0 },
            { name: 'purchase_price', label: 'Purchase Price', type: 'number', min: 0, step: 0.01, currency: true, defaultValue: 0 },
            { name: 'sell_price', label: 'Sell Price', type: 'number', min: 0, step: 0.01, currency: true, defaultValue: 0 }
          ]}
        />      
      )}

      {itemToEdit && (
        <Modal
          title="Edit Item"
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setItemToEdit(null)
          }}
          actionLabel="Save"
          loadingLabel="Saving..."
          onSubmit={(updatedData) => handleEditItem(updatedData)}
          fields={[
            { name: 'name', label: 'Item Name', required: true, fullWidth: true, defaultValue: itemToEdit.name },
            { name: 'category', label: 'Category', required: true, fullWidth: true, defaultValue: itemToEdit.category },
            { name: 'quantity', label: 'Quantity', type: 'number', min: 0, step: 1, defaultValue: itemToEdit.quantity },
            { name: 'low_stock_threshold', label: 'Low Stock Threshold', type: 'number', min: 0, step: 1, defaultValue: itemToEdit.low_stock_threshold },
            { name: 'purchase_price', label: 'Purchase Price', type: 'number', min: 0, step: 0.01, currency: true, defaultValue: itemToEdit.purchase_price },
            { name: 'sell_price', label: 'Sell Price', type: 'number', min: 0, step: 0.01, currency: true, defaultValue: itemToEdit.sell_price }
          ]}
        />
      )}

      {itemToDelete && (
        <Modal
          title="Delete Item"
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setItemToDelete(null)
          }}
          actionLabel="Delete"
          loadingLabel="Deleting..."
          actionType="danger"
          onSubmit={handleDeleteItem}
        >
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
            Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  )
}

