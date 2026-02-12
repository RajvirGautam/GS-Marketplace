// src/components/modals/AddProductModal.jsx
import React, { useState, useRef } from 'react';
import { productAPI } from '../../services/api';

const AddProductModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    branch: '',
    year: '',
    condition: '',
    type: 'sale',
    location: 'SGSITS Campus',
    tag: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [highlights, setHighlights] = useState(['']);
  const [specs, setSpecs] = useState([{ label: '', value: '' }]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

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

  // Handle file upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setErrors({ ...errors, images: 'Maximum 5 images allowed' });
      return;
    }

    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const addHighlight = () => setHighlights([...highlights, '']);
  const updateHighlight = (index, value) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };
  const removeHighlight = (index) => setHighlights(highlights.filter((_, i) => i !== index));

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const updateSpec = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };
  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Required';
      if (!formData.description.trim()) newErrors.description = 'Required';
      if (formData.type !== 'free' && (!formData.price || parseFloat(formData.price) <= 0)) {
        newErrors.price = 'Required';
      }
      if (images.length === 0) newErrors.images = 'At least 1 image required';
    }
    if (step === 2) {
      if (!formData.category) newErrors.category = 'Required';
      if (!formData.branch) newErrors.branch = 'Required';
      if (!formData.year) newErrors.year = 'Required';
      if (!formData.condition) newErrors.condition = 'Required';
      if (!formData.location.trim()) newErrors.location = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
  if (!validateStep(2)) return;

  setIsSubmitting(true);

  try {
    const filteredHighlights = highlights.filter((h) => h.trim());
    const filteredSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    // Create FormData
    const formDataToSend = new FormData();
    
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.type === 'free' ? 0 : formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('condition', formData.condition);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('tag', formData.tag || 'FOR SALE');
    formDataToSend.append('branch', formData.branch); // ADD THIS
    formDataToSend.append('year', formData.year); // ADD THIS
    formDataToSend.append('highlights', JSON.stringify(filteredHighlights));
    formDataToSend.append('specs', JSON.stringify(filteredSpecs));

    // Append images
    images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    const response = await productAPI.create(formDataToSend);

    if (response.success) {
      alert('Product listed successfully! 🎉');
      handleClose();
      window.location.reload(); // Refresh to show new product
    }
  } catch (error) {
    console.error('Error creating product:', error);
    alert(error.response?.data?.message || 'Failed to create product');
  } finally {
    setIsSubmitting(false);
  }
};


  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      branch: '',
      year: '',
      condition: '',
      type: 'sale',
      location: 'SGSITS Campus',
      tag: '',
    });
    setImages([]);
    setImagePreviews([]);
    setHighlights(['']);
    setSpecs([{ label: '', value: '' }]);
    setCurrentStep(1);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .add-product-modal {
          font-family: 'Manrope', sans-serif;
        }

        .mono {
          font-family: 'Space Mono', monospace;
        }

        /* Modal backdrop */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9998;
          animation: fadeIn 0.3s ease-out;
        }

        /* Modal container */
        .modal-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-content {
          background: #0A0A0A;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scrollbar */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Noise overlay */
        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        /* Grid lines */
        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px),
            repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px);
          pointer-events: none;
          z-index: 1;
        }

        /* Input styles */
        .input-brutal {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 12px 16px;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          transition: all 0.2s;
          width: 100%;
        }

        .input-brutal:focus {
          outline: none;
          border-color: #00D9FF;
          background: #000;
        }

        .input-brutal::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        textarea.input-brutal {
          resize: vertical;
          min-height: 100px;
          font-family: 'Manrope', sans-serif;
          line-height: 1.5;
        }

        /* Select */
        select.input-brutal {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        /* Buttons */
        .btn-brutal-primary {
          background: #fff;
          color: #0A0A0A;
          border: 2px solid #fff;
          padding: 14px 28px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 11px;
          transition: all 0.2s;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
        }

        .btn-brutal-primary:hover:not(:disabled) {
          background: #00D9FF;
          border-color: #00D9FF;
          transform: translate(-2px, -2px);
          box-shadow: 2px 2px 0 #fff;
        }

        .btn-brutal-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-brutal-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 14px 28px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 11px;
          transition: all 0.2s;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
        }

        .btn-brutal-secondary:hover {
          border-color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        /* Category card */
        .category-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px;
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

        /* Condition pill */
        .condition-pill {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 11px;
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

        /* Radio */
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

        /* Image upload */
        .upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.02);
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .upload-zone:hover {
          border-color: #00D9FF;
          background: rgba(0, 217, 255, 0.05);
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-preview-remove {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0;
        }

        .image-preview:hover .image-preview-remove {
          opacity: 1;
        }

        .image-preview-remove:hover {
          background: #DC2626;
          border-color: #DC2626;
        }

        /* Step indicator */
        .step-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
        }

        .step {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
        }

        .step.active {
          background: #00D9FF;
        }

        .step.completed {
          background: #fff;
        }

        /* Error */
        .error-text {
          color: #FF6B6B;
          font-size: 11px;
          margin-top: 6px;
          font-family: 'Space Mono', monospace;
        }

        /* Close button */
        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.6);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .close-btn:hover {
          border-color: #fff;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={handleClose}></div>

      {/* Modal */}
      <div className="modal-container">
        <div className="modal-content add-product-modal">
          <div className="noise-overlay"></div>
          <div className="grid-lines"></div>

          <div className="relative z-10 p-8 md:p-12">
            {/* Close button */}
            <button onClick={handleClose} className="close-btn" disabled={isSubmitting}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="mono text-xs text-white opacity-40 mb-2 uppercase tracking-wider">ADD LISTING</div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                LIST YOUR <span style={{ color: '#00D9FF' }}>PRODUCT</span>
              </h2>
            </div>

            {/* Step indicator */}
            <div className="step-bar">
              <div className={`step ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}></div>
            </div>

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div>
                <div className="mono text-xs text-white opacity-60 mb-6 uppercase tracking-wider">STEP 01 / BASIC INFO</div>

                {/* Title */}
                <div className="mb-5">
                  <label className="block mono text-xs text-white opacity-60 mb-2 uppercase tracking-wider">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Raspberry Pi 4 Model B"
                    className="input-brutal"
                  />
                  {errors.title && <p className="error-text">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="mb-5">
                  <label className="block mono text-xs text-white opacity-60 mb-2 uppercase tracking-wider">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product in detail..."
                    className="input-brutal"
                  />
                  {errors.description && <p className="error-text">{errors.description}</p>}
                </div>

                {/* Price & Tag */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mono text-xs text-white opacity-60 mb-2 uppercase tracking-wider">
                      Price (₹) {formData.type !== 'free' && '*'}
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="1200"
                      className="input-brutal"
                      min="0"
                      step="10"
                      disabled={formData.type === 'free'}
                    />
                    {errors.price && <p className="error-text">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block mono text-xs text-white opacity-60 mb-2 uppercase tracking-wider">Tag</label>
                    <input
                      type="text"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder="Electronics"
                      className="input-brutal"
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="mb-6">
                  <label className="block mono text-xs text-white opacity-60 mb-3 uppercase tracking-wider">Images * (Max 5)</label>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {imagePreviews.length < 5 && (
                    <div onClick={() => fileInputRef.current?.click()} className="upload-zone mb-4">
                      <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="mono text-xs text-white opacity-60 uppercase tracking-wider">CLICK TO UPLOAD</p>
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button onClick={() => removeImage(index)} className="image-preview-remove">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.images && <p className="error-text">{errors.images}</p>}
                </div>

                {/* Navigation */}
                <div className="flex justify-end gap-3 pt-6 border-t border-white border-opacity-10">
                  <button onClick={handleNext} className="btn-brutal-primary">CONTINUE →</button>
                </div>
              </div>
            )}

            {/* Step 2: Category & Details */}
            {currentStep === 2 && (
              <div>
                <div className="mono text-xs text-white opacity-60 mb-6 uppercase tracking-wider">STEP 02 / DETAILS</div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block mono text-xs text-white opacity-60 mb-3 uppercase tracking-wider">Category *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.value}
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`category-card ${formData.category === cat.value ? 'selected' : ''}`}
                      >
                        <div className="text-2xl mb-2">{cat.emoji}</div>
                        <div className="mono text-10px text-white opacity-70 uppercase">{cat.label}</div>
                      </div>
                    ))}
                  </div>
                  {errors.category && <p className="error-text mt-2">{errors.category}</p>}
                </div>

                {/* Type */}
                <div className="mb-6">
                  <label className="block mono text-xs text-white opacity-60 mb-3 uppercase tracking-wider">Type *</label>
                  <div className="space-y-3">
                    {types.map((type) => (
                      <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
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

                {/* Branch & Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block mono text-xs text-white opacity-60 mb-2 uppercase tracking-wider">Branch *</label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="input-brutal"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch.value} value={branch.value}>{branch.label}</option>
                      ))}
                    </select>
                    {errors.branch && <p className="error-text">{errors.branch}</p>}
                  </div>
                  <div>
                    <label className="block mono text-xs text-white opacity-60 mb-2 uppercase tracking-wider">Year *</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="input-brutal"
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                    {errors.year && <p className="error-text">{errors.year}</p>}
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-5">
                  <label className="block mono text-xs text-white opacity-60 mb-3 uppercase tracking-wider">Condition *</label>
                  <div className="flex flex-wrap gap-3">
                    {conditions.map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setFormData({ ...formData, condition: cond })}
                        className={`condition-pill ${formData.condition === cond ? 'selected' : ''}`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                  {errors.condition && <p className="error-text mt-2">{errors.condition}</p>}
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block mono text-xs text-white opacity-60 mb-2 uppercase tracking-wider">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Near Library, ATC, Hostel 2..."
                    className="input-brutal"
                  />
                  {errors.location && <p className="error-text">{errors.location}</p>}
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-3 pt-6 border-t border-white border-opacity-10">
                  <button onClick={handleBack} className="btn-brutal-secondary">← BACK</button>
                  <button onClick={handleNext} className="btn-brutal-primary">CONTINUE →</button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 3 && (
              <div>
                <div className="mono text-xs text-white opacity-60 mb-6 uppercase tracking-wider">STEP 03 / OPTIONAL</div>

                {/* Highlights */}
                <div className="mb-6">
                  <label className="block mono text-xs text-white opacity-60 mb-3 uppercase tracking-wider">Highlights</label>
                  <div className="space-y-2 mb-3">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => updateHighlight(index, e.target.value)}
                          placeholder="e.g., 4GB RAM, WiFi 5.0"
                          className="input-brutal flex-1"
                        />
                        {highlights.length > 1 && (
                          <button
                            onClick={() => removeHighlight(index)}
                            className="btn-brutal-secondary !px-3"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {highlights.length < 6 && (
                    <button onClick={addHighlight} className="btn-brutal-secondary !py-2">
                      + ADD HIGHLIGHT
                    </button>
                  )}
                </div>

                {/* Specs */}
                <div className="mb-6">
                  <label className="block mono text-xs text-white opacity-60 mb-3 uppercase tracking-wider">Specs</label>
                  <div className="space-y-2 mb-3">
                    {specs.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => updateSpec(index, 'label', e.target.value)}
                          placeholder="Label"
                          className="input-brutal flex-1"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => updateSpec(index, 'value', e.target.value)}
                          placeholder="Value"
                          className="input-brutal flex-1"
                        />
                        {specs.length > 1 && (
                          <button
                            onClick={() => removeSpec(index)}
                            className="btn-brutal-secondary !px-3"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {specs.length < 8 && (
                    <button onClick={addSpec} className="btn-brutal-secondary !py-2">
                      + ADD SPEC
                    </button>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-3 pt-6 border-t border-white border-opacity-10">
                  <button onClick={handleBack} className="btn-brutal-secondary" disabled={isSubmitting}>← BACK</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="btn-brutal-primary"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'PUBLISH LISTING'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;