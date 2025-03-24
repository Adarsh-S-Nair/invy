import { useState } from 'react'
import './Inventory.css'
import emptyBox from '../assets/empty-box.svg'
import Table from '../components/Table'

const generateFakeItems = () => {
  const names = ['Pepsi', 'Snickers', 'Doritos', 'Red Bull', 'KitKat', 'Monster', 'Twix', 'Skittles']
  const categories = ['Beverages', 'Snacks', 'Frozen', 'Candy', 'Energy']
  const statuses = ['In Stock', 'Low on Stock', 'Out of Stock']

  const items = []

  for (let i = 0; i < 40; i++) {
    const name = `${names[Math.floor(Math.random() * names.length)]} ${Math.floor(Math.random() * 1000)}`
    const category = categories[Math.floor(Math.random() * categories.length)]
    const quantity = Math.floor(Math.random() * 50)
    const purchasePrice = (Math.random() * 2).toFixed(2)
    const sellPrice = (parseFloat(purchasePrice) + Math.random() * 2).toFixed(2)
    const status =
      quantity === 0
        ? 'Out of Stock'
        : quantity < 10
        ? 'Low on Stock'
        : 'In Stock'

    items.push({
      name,
      category,
      quantity,
      purchasePrice: `$${purchasePrice}`,
      sellPrice: `$${sellPrice}`,
      status,
    })
  }

  return items
}

export default function Inventory() {
  // const [rowData] = useState([])
  const [rowData] = useState(generateFakeItems())

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Quantity', accessorKey: 'quantity' },
    { header: 'Purchase Price', accessorKey: 'purchasePrice' },
    { header: 'Sell Price', accessorKey: 'sellPrice' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: info => (
        <span className={`status-tag ${info.getValue().toLowerCase().replace(/\s/g, '-')}`}>
          {info.getValue()}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: () => <button className="edit-btn">Edit</button>,
    },
  ]

  return (
    <div className="inventory-page">
      <div className="page-header">Inventory</div>

      <div className="inventory-card">
        <div className="inventory-inner-card">
          {rowData.length === 0 ? (
            <div className="empty-state">
              <img src={emptyBox} alt="No items" />
              <p>No items found in your inventory</p>
              <button className="primary-btn">Add Item</button>
            </div>
          ) : (
            <Table columns={columns} data={rowData} />
          )}
        </div>
      </div>
    </div>
  )
}

