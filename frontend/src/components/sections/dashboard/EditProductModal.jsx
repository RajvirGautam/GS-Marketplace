import React, { useState, useEffect } from 'react';
import { productAPI } from '../../../services/api'

const EditProductModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'sell',
    barterFor: '',
    category: '',
    condition: 'like-new',
    location: 'SGSITS Campus',
    tag: 'FOR SALE',
    branch: '',
    year: '',
    highlights: [''],
    specs: [{ label: '', value: '' }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        type: product.type || 'sell',
        barterFor: product.barterFor || '',
        category: product.category || '',
        condition: product.condition || 'like-new',
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
    setError('');

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.type === 'sell' && !formData.price) {
      setError('Price is required for selling items');
      return;
    }

    if (formData.type === 'barter' && !formData.barterFor) {
      setError('Please specify what you want in barter');
      return;
    }

    try {
      setLoading(true);

      // Clean up data
      const updateData = {
        ...formData,
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        specs: formData.specs.filter(s => s.label.trim() !== '' && s.value.trim() !== ''),
        price: formData.type === 'free' ? 0 : parseFloat(formData.price) || 0,
        year: parseInt(formData.year) || undefined,
      };

      console.log('📝 Updating product:', product._id, updateData);

      const response = await productAPI.update(product._id, updateData);

      if (response.success) {
        console.log('✅ Product updated successfully');
        alert('✅ Product updated successfully!');
        onClose(true); // Pass true to indicate success
      } else {
        setError(response.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('❌ Error updating product:', err);
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-black">Edit Product</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

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

          {/* Type & Price */}
          <div className="form-row">
            <div className="form-section">
              <label className="form-label">Listing Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-input"
              >
                <option value="sell">Sell</option>
                <option value="barter">Barter</option>
                <option value="free">Free</option>
              </select>
            </div>

            {formData.type === 'sell' && (
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

            {formData.type === 'barter' && (
              <div className="form-section">
                <label className="form-label">Barter For *</label>
                <input
                  type="text"
                  name="barterFor"
                  value={formData.barterFor}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Gaming Laptop"
                />
              </div>
            )}
          </div>

          {/* Category & Condition */}
          <div className="form-row">
            <div className="form-section">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books & Notes</option>
                <option value="clothing">Clothing</option>
                <option value="sports">Sports Equipment</option>
                <option value="furniture">Furniture</option>
                <option value="vehicles">Vehicles</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-section">
              <label className="form-label">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="form-input"
              >
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          {/* Branch & Year */}
          <div className="form-row">
            <div className="form-section">
              <label className="form-label">Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Any Branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
              </select>
            </div>

            <div className="form-section">
              <label className="form-label">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Any Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
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
                    ✕
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
                    ✕
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
            ℹ️ Images cannot be changed. To change images, delete and create a new listing.
          </div>

          {/* Submit */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>

        <style>{`
          .modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-y: auto;
          }

          .modal-container {
            background: #0F0F0F;
            border: 1px solid rgba(255,255,255,0.2);
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease-out;
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

          .modal-header {
            padding: 24px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            background: #0F0F0F;
            z-index: 10;
          }

          .close-btn {
            width: 32px;
            height: 32px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .close-btn:hover {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.3);
          }

          .modal-body {
            padding: 24px;
          }

          .form-section {
            margin-bottom: 20px;
            flex: 1;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            color: rgba(255,255,255,0.7);
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-family: 'JetBrains Mono', monospace;
          }

          .form-input {
            width: 100%;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            padding: 12px;
            font-size: 14px;
            transition: all 0.2s;
          }

          .form-input:focus {
            outline: none;
            border-color: rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.08);
          }

          .btn-add {
            background: rgba(79,70,229,0.2);
            border: 1px solid rgba(79,70,229,0.3);
            color: #818CF8;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 700;
            font-family: 'JetBrains Mono', monospace;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-add:hover {
            background: rgba(79,70,229,0.3);
            border-color: rgba(79,70,229,0.5);
          }

          .btn-remove {
            width: 40px;
            background: rgba(239,68,68,0.2);
            border: 1px solid rgba(239,68,68,0.3);
            color: #EF4444;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-remove:hover {
            background: rgba(239,68,68,0.3);
            border-color: rgba(239,68,68,0.5);
          }

          .error-box {
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.3);
            color: #EF4444;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 13px;
          }

          .info-box {
            background: rgba(59,130,246,0.1);
            border: 1px solid rgba(59,130,246,0.3);
            color: #60A5FA;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 13px;
          }

          .modal-footer {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            position: sticky;
            bottom: 0;
            background: #0F0F0F;
            margin: 0 -24px -24px;
            padding: 20px 24px;
          }

          .btn-secondary {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            padding: 12px 24px;
            font-weight: 700;
            font-family: 'JetBrains Mono', monospace;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-secondary:hover:not(:disabled) {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.3);
          }

          .btn-primary {
            background: linear-gradient(to right, #4F46E5, #7C3AED);
            border: none;
            color: white;
            padding: 12px 24px;
            font-weight: 700;
            font-family: 'JetBrains Mono', monospace;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-primary:hover:not(:disabled) {
            transform: scale(1.02);
          }

          .btn-primary:disabled,
          .btn-secondary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          @media (max-width: 768px) {
            .form-row {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default EditProductModal;