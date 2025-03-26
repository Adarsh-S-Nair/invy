import { useState } from 'react'
import './Modal.css'

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
  fields = [],
  actionLabel = 'Submit',
  onSubmit = null,
}) {

  const isFormMode = fields.length > 0

  const [formData, setFormData] = useState(() =>
    Object.fromEntries(
      fields.map((f) => {
        let val = f.defaultValue !== undefined ? f.defaultValue : ''
        if (f.currency && typeof val === 'number' && !isNaN(val)) {
          val = val.toFixed(2)
        }
        return [f.name, val]
      })
    )
  )
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const formatCurrency = (val) => {
    if (val === '' || val === null || isNaN(val)) return ''
    const num = parseFloat(val)
    return `$${num.toFixed(2)}`
  }
  
  const parseCurrency = (val) => {
    const cleaned = val.replace(/[^0-9.]/g, '')
    return parseFloat(cleaned) || 0
  }  
  
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    const missingRequired = fields.filter(
      (f) => f.required && !formData[f.name]?.toString().trim()
    )

    if (missingRequired.length > 0) {
      setError('Please fill in all required fields.')
      return
    }

    if (onSubmit) onSubmit(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <div className="modal-body">
          {isFormMode ? (
            <div className="form-modal-grid">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`form-field ${field.fullWidth ? 'full' : 'half'}`}
                >
                  <label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                  </label>
                
                  <div className={`input-wrapper ${field.currency ? 'currency' : ''}`}>
                    {field.currency && <span className="currency-symbol">$</span>}
                    <input
                      id={field.name}
                      type={field.type || 'text'}
                      value={formData[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      onBlur={() => {
                        if (field.currency) {
                          const raw = parseFloat(formData[field.name])
                          if (!isNaN(raw)) {
                            setFormData((prev) => ({
                              ...prev,
                              [field.name]: raw.toFixed(2),
                            }))
                          }
                        }
                      }}
                      min={field.min}
                      step={field.step}
                    />
                  </div>
                </div>
              ))}

              {error && <p className="modal-error">{error}</p>}
            </div>
          ) : (
            children
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-muted" onClick={onClose}>
            Cancel
          </button>

          {isFormMode && (
            <button className="btn btn-primary" onClick={handleSubmit}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
