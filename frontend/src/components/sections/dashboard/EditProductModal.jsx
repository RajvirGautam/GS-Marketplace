// src/components/dashboard/EditProductModal.jsx
import React, { useState, useEffect } from 'react';
import { productAPI } from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const EditProductModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'sale',
    category: '',
    condition: 'Like New',
    location: 'SGSITS Campus',
    tag: 'FOR SALE',
    branch: '',
    year: '',
    highlights: [''],
    specs: [{ label: '', value: '' }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);

  const categories = [
    { value: 'books', label: 'Books & Notes', emoji: '📚' },
    { value: 'electronics', label: 'Electronics', emoji: '⚡' },
    { value: 'stationery', label: 'Stationery', emoji: '✏️' },
    { value: 'lab', label: 'Lab Equipment', emoji: '🔬' },
    { value: 'tools', label: 'Tools', emoji: '🔧' },
    { value: 'hostel', label: 'Hostel Items', emoji: '🏠' },
    { value: 'misc', label: 'Miscellaneous', emoji: '📦' },
  ];

  const branches = [
    { value: 'cs', label: 'Computer Science' },
    { value: 'it', label: 'Information Technology' },
    { value: 'ece', label: 'Electronics & Comm.' },
    { value: 'ee', label: 'Electrical' },
    { value: 'mech', label: 'Mechanical' },
    { value: 'civil', label: 'Civil' },
  ];

  const conditions = ['New', 'Like New', 'Good', 'Acceptable'];
  const types = [
    { value: 'sale', label: 'FOR SALE', desc: 'Cash payment' },
    { value: 'barter', label: 'FOR BARTER', desc: 'Exchange item' },
    { value: 'rent', label: 'FOR RENT', desc: 'Temporary use' },
    { value: 'free', label: 'FREE', desc: 'Giveaway' },
  ];

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        type: product.type || 'sale',
        category: product.category || '',
        condition: product.condition || 'Like New',
        location: product.location || 'SGSITS Campus',
        tag: product.tag || 'FOR SALE',
        branch: product.branch || '',
        year: product.year || '',
        highlights: product.highlights?.length > 0 ? product.highlights : [''],
        specs: product.specs?.length > 0 ? product.specs : [{ label: '', value: '' }],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const addSpec = () => {
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, { label: '', value: '' }]
    }));
  };

  const removeSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('PLEASE FILL IN ALL REQUIRED FIELDS', {
        style: {
          background: '#0F0F0F',
          color: '#EF4444',
          border: '2px solid rgba(239,68,68,0.5)',
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        },
      });
      return;
    }

    if (formData.type === 'sale' && !formData.price) {
      toast.error('PRICE IS REQUIRED FOR SELLING', {
        style: {
          background: '#0F0F0F',
          color: '#EF4444',
          border: '2px solid rgba(239,68,68,0.5)',
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        },
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setUpdateProgress(0);

      const toastId = toast.loading('Updating product...', {
        style: {
          background: '#0F0F0F',
          color: '#fff',
          border: '1px solid rgba(0,217,255,0.3)',
          fontFamily: 'Space Mono, monospace',
          fontSize: '12px',
        },
      });

      // Simulate progress
      setUpdateProgress(30);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Clean up data
      const updateData = {
        ...formData,
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        specs: formData.specs.filter(s => s.label.trim() !== '' && s.value.trim() !== ''),
        price: formData.type === 'free' ? 0 : parseFloat(formData.price) || 0,
        year: parseInt(formData.year) || undefined,
      };

      setUpdateProgress(60);

      console.log('📝 Updating product:', product._id, updateData);

      const response = await productAPI.update(product._id, updateData);

      setUpdateProgress(100);

      if (response.success) {
        console.log('✅ Product updated successfully');
        toast.success('✅ PRODUCT UPDATED SUCCESSFULLY!', {
          id: toastId,
          style: {
            background: '#0F0F0F',
            color: '#00D9FF',
            border: '2px solid #00D9FF',
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          },
        });
        setTimeout(() => onClose(true), 1000); // Pass true to indicate success
      } else {
        toast.error(response.message || 'FAILED TO UPDATE PRODUCT', {
          id: toastId,
          style: {
            background: '#0F0F0F',
            color: '#EF4444',
            border: '2px solid rgba(239,68,68,0.5)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          },
        });
      }
    } catch (err) {
      console.error('❌ Error updating product:', err);
      toast.error(err.response?.data?.message || 'FAILED TO UPDATE PRODUCT', {
        style: {
          background: '#0F0F0F',
          color: '#EF4444',
          border: '2px solid rgba(239,68,68,0.5)',
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        },
      });
    } finally {
      setIsSubmitting(false);
      setUpdateProgress(0);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Custom Toaster with higher z-index */}
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0F0F0F',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
          },
        }}
        containerStyle={{
          zIndex: 99999, // Higher than modal
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .edit-product-modal {
          font-family: 'Manrope', sans-serif;
        }

        .mono {
          font-family: 'Space Mono', monospace;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(8px);
          z-index: 9998;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-container {
          background: #0A0A0A;
          border: 1px solid rgba(255,255,255,0.2);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
          position: relative;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Progress bar */
        .progress-bar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.1);
          z-index: 99999;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(to right, #00D9FF, #7C3AED);
          transition: width 0.3s ease;
        }

        /* Scrollbar */
        .modal-container::-webkit-scrollbar {
          width: 8px;
        }

        .modal-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .modal-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .modal-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: #0A0A0A;
          z-index: 10;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.6);
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.4);
          color: #fff;
        }

        .modal-body {
          padding: 24px;
        }

        .form-section {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          color: rgba(255,255,255,0.6);
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-family: 'Space Mono', monospace;
          letter-spacing: 1px;
        }

        .form-input {
          width: 100%;
          background: #111;
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          padding: 12px 16px;
          font-size: 13px;
          transition: all 0.2s;
          font-family: 'Space Mono', monospace;
        }

        .form-input:focus {
          outline: none;
          border-color: #00D9FF;
          background: #000;
        }

        textarea.form-input {
          resize: vertical;
          min-height: 100px;
          line-height: 1.5;
          font-family: 'Manrope', sans-serif;
        }

        select.form-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        .btn-add {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 8px 16px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Space Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-add:hover {
          border-color: #00D9FF;
          color: #00D9FF;
        }

        .btn-remove {
          width: 40px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #EF4444;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-remove:hover {
          background: rgba(239,68,68,0.2);
          border-color: rgba(239,68,68,0.5);
        }

        .info-box {
          background: rgba(0,217,255,0.05);
          border: 1px solid rgba(0,217,255,0.2);
          color: #00D9FF;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 11px;
          font-family: 'Space Mono', monospace;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          position: sticky;
          bottom: 0;
          background: #0A0A0A;
          margin: 0 -24px -24px;
          padding: 20px 24px;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 12px 24px;
          font-weight: 700;
          font-family: 'Space Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.4);
        }

        .btn-primary {
          background: #fff;
          border: 2px solid #fff;
          color: #0A0A0A;
          padding: 12px 24px;
          font-weight: 700;
          font-family: 'Space Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .btn-primary:hover:not(:disabled) {
          background: #00D9FF;
          border-color: #00D9FF;
          transform: translate(-2px, -2px);
          box-shadow: 2px 2px 0 #fff;
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .category-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-card:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .category-card.selected {
          border-color: #00D9FF;
          background: rgba(0, 217, 255, 0.1);
        }

        .condition-pill {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Space Mono', monospace;
        }

        .condition-pill:hover {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
        }

        .condition-pill.selected {
          border-color: #fff;
          background: #fff;
          color: #0A0A0A;
        }

        .radio-brutal {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          flex-shrink: 0;
        }

        .radio-brutal:checked {
          border-color: #00D9FF;
        }

        .radio-brutal:checked::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #00D9FF;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Progress bar */}
      {isSubmitting && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${updateProgress}%` }}></div>
        </div>
      )}

      <div className="modal-backdrop" onClick={!isSubmitting ? onClose : undefined}>
        <div className="modal-container edit-product-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="text-2xl font-black mono text-white">EDIT PRODUCT</h2>
            <button onClick={onClose} className="close-btn" disabled={isSubmitting}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body">
            
            {/* Basic Info */}
            <div className="form-section">
              <label className="form-label">Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., iPhone 13 Pro Max"
                required
              />
            </div>

            <div className="form-section">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                rows="4"
                placeholder="Describe your product..."
                required
              />
            </div>

            {/* Category */}
            <div className="form-section">
              <label className="form-label">Category *</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat.value}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`category-card ${formData.category === cat.value ? 'selected' : ''}`}
                  >
                    <div className="text-xl mb-1">{cat.emoji}</div>
                    <div className="text-[9px] text-white opacity-70 mono">{cat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="form-section">
              <label className="form-label">Listing Type *</label>
              <div className="space-y-2">
                {types.map((type) => (
                  <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="radio-brutal"
                    />
                    <div>
                      <div className="mono text-xs font-bold text-white">{type.label}</div>
                      <div className="text-xs text-white opacity-50">{type.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price (if not free) */}
            {formData.type !== 'free' && (
              <div className="form-section">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="5000"
                  min="0"
                />
              </div>
            )}

            {/* Branch & Year */}
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Branch *</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.value} value={branch.value}>{branch.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            {/* Condition */}
            <div className="form-section">
              <label className="form-label">Condition *</label>
              <div className="flex flex-wrap gap-2">
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: cond })}
                    className={`condition-pill ${formData.condition === cond ? 'selected' : ''}`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Tag */}
            <div className="form-row">
              <div className="form-section">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="SGSITS Campus"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Tag</label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="FOR SALE"
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="form-section">
              <label className="form-label">Highlights (Optional)</label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    className="form-input"
                    placeholder={`Highlight ${index + 1}`}
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="btn-remove"
                    >
                      −
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addHighlight} className="btn-add">
                + Add Highlight
              </button>
            </div>

            {/* Specs */}
            <div className="form-section">
              <label className="form-label">Specifications (Optional)</label>
              {formData.specs.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                    className="form-input"
                    placeholder="Label (e.g., RAM)"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="form-input"
                    placeholder="Value (e.g., 8GB)"
                  />
                  {formData.specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="btn-remove"
                    >
                      −
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addSpec} className="btn-add">
                + Add Specification
              </button>
            </div>

            {/* Note about images */}
            <div className="info-box">
              ℹ️ IMAGES CANNOT BE CHANGED. TO CHANGE IMAGES, DELETE AND CREATE A NEW LISTING.
            </div>

            {/* Submit */}
            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? `UPDATING ${updateProgress}%...` : 'UPDATE PRODUCT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProductModal;