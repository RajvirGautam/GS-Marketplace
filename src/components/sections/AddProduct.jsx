// src/components/sections/AddProduct.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons
const Upload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const X = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Minus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
    location: '',
    tag: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [highlights, setHighlights] = useState(['']);
  const [specs, setSpecs] = useState([{ label: '', value: '' }]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Categories matching your product structure
  const categories = [
    { value: 'electronics', label: '⚡ Electronics', emoji: '⚡' },
    { value: 'books', label: '📚 Books & Notes', emoji: '📚' },
    { value: 'stationery', label: '✏️ Stationery', emoji: '✏️' },
    { value: 'lab', label: '🔬 Lab Equipment', emoji: '🔬' },
    { value: 'tools', label: '🔧 Tools', emoji: '🔧' },
    { value: 'hostel', label: '🏠 Hostel Items', emoji: '🏠' },
    { value: 'misc', label: '📦 Miscellaneous', emoji: '📦' },
  ];

  const branches = [
    { value: 'cs', label: 'Computer Science' },
    { value: 'it', label: 'Information Technology' },
    { value: 'ece', label: 'Electronics & Comm.' },
    { value: 'eee', label: 'Electrical' },
    { value: 'mech', label: 'Mechanical' },
    { value: 'civil', label: 'Civil' },
  ];

  const conditions = ['New', 'Like New', 'Good', 'Acceptable'];
  const types = [
    { value: 'sale', label: '💵 For Sale (Cash)' },
    { value: 'barter', label: '🔄 For Barter (Exchange)' },
    { value: 'rent', label: '⏱️ For Rent' },
    { value: 'free', label: '🎁 Free Giveaway' },
  ];

  // Handle file upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setErrors({ ...errors, images: 'Maximum 5 images allowed' });
      return;
    }

    setImages([...images, ...files]);

    // Create previews
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

  // Handle highlights
  const addHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const updateHighlight = (index, value) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const removeHighlight = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Handle specs
  const addSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const updateSpec = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
      if (images.length === 0) newErrors.images = 'At least one image is required';
    }

    if (step === 2) {
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.branch) newErrors.branch = 'Branch is required';
      if (!formData.year) newErrors.year = 'Year is required';
      if (!formData.condition) newErrors.condition = 'Condition is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
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
  };

  const handleSubmit = () => {
    if (!validateStep(2)) return;

    // Filter empty highlights and specs
    const filteredHighlights = highlights.filter((h) => h.trim());
    const filteredSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const productData = {
      ...formData,
      highlights: filteredHighlights,
      specs: filteredSpecs,
      images: imagePreviews, // In production, upload to cloud storage
      numericPrice: parseFloat(formData.price),
      isTrending: false,
      isVerified: true,
      timeAgo: 'Just now',
      views: 0,
      saves: 0,
      messages: 0,
      status: 'active',
    };

    console.log('Product submitted:', productData);
    // TODO: Send to backend/API
    alert('Product listed successfully! 🎉');
    navigate('/dashboard');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600;700;900&family=Work+Sans:wght@300;400;500;600;700;800&display=swap');

        .add-product-root {
          font-family: 'Work Sans', sans-serif;
          background: #FDFAF5;
          color: #1A1614;
          min-height: 100vh;
        }

        .serif {
          font-family: 'Crimson Pro', serif;
        }

        /* Noise overlay */
        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 1;
        }

        /* Paper texture */
        .paper-texture {
          position: relative;
          background: 
            linear-gradient(90deg, rgba(218, 211, 196, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(218, 211, 196, 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        /* Custom input styles */
        .input-editorial {
          background: #FFFFFF;
          border: 2px solid #E8E3DB;
          color: #1A1614;
          font-family: 'Work Sans', sans-serif;
          padding: 14px 18px;
          font-size: 15px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(26, 22, 20, 0.04);
        }

        .input-editorial:focus {
          outline: none;
          border-color: #D97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1), 0 4px 12px rgba(26, 22, 20, 0.08);
          transform: translateY(-1px);
        }

        .input-editorial::placeholder {
          color: #A8A29E;
        }

        /* Textarea */
        textarea.input-editorial {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }

        /* Radio buttons */
        .radio-editorial {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #D6D3D1;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .radio-editorial:checked {
          border-color: #D97706;
          background: #D97706;
        }

        .radio-editorial:checked::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Buttons */
        .btn-primary {
          background: #1A1614;
          color: #FDFAF5;
          border: 2px solid #1A1614;
          padding: 16px 32px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 13px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(26, 22, 20, 0.15);
        }

        .btn-primary:hover {
          background: #D97706;
          border-color: #D97706;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.25);
        }

        .btn-secondary {
          background: transparent;
          color: #1A1614;
          border: 2px solid #E8E3DB;
          padding: 16px 32px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 13px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .btn-secondary:hover {
          border-color: #1A1614;
          background: #FFFFFF;
        }

        /* Image upload zone */
        .upload-zone {
          border: 3px dashed #D6D3D1;
          background: #FFFFFF;
          transition: all 0.3s;
          cursor: pointer;
        }

        .upload-zone:hover {
          border-color: #D97706;
          background: #FEF3E2;
        }

        .upload-zone.drag-active {
          border-color: #D97706;
          background: #FEF3E2;
          border-style: solid;
        }

        /* Image preview */
        .image-preview {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #F5F5F4;
          border: 2px solid #E8E3DB;
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
          background: rgba(26, 22, 20, 0.9);
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
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
          transform: scale(1.1);
        }

        /* Highlight/Spec item */
        .dynamic-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .dynamic-item-remove {
          background: transparent;
          border: 1px solid #E8E3DB;
          color: #78716C;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .dynamic-item-remove:hover {
          background: #FEE2E2;
          border-color: #DC2626;
          color: #DC2626;
        }

        .dynamic-item-add {
          background: #F5F5F4;
          border: 2px dashed #D6D3D1;
          color: #78716C;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dynamic-item-add:hover {
          background: #FFFFFF;
          border-color: #D97706;
          color: #D97706;
        }

        /* Step indicator */
        .step-indicator {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
        }

        .step {
          flex: 1;
          height: 4px;
          background: #E8E3DB;
          position: relative;
          overflow: hidden;
        }

        .step.active {
          background: #D97706;
        }

        .step.completed {
          background: #1A1614;
        }

        /* Error message */
        .error-message {
          color: #DC2626;
          font-size: 13px;
          margin-top: 6px;
          font-weight: 500;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Category card */
        .category-card {
          background: #FFFFFF;
          border: 2px solid #E8E3DB;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-card:hover {
          border-color: #D97706;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(217, 119, 6, 0.12);
        }

        .category-card.selected {
          border-color: #D97706;
          background: #FEF3E2;
        }

        /* Condition pill */
        .condition-pill {
          background: #FFFFFF;
          border: 2px solid #E8E3DB;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 14px;
        }

        .condition-pill:hover {
          border-color: #D97706;
          background: #FEF3E2;
        }

        .condition-pill.selected {
          border-color: #1A1614;
          background: #1A1614;
          color: #FDFAF5;
        }
      `}</style>

      <div className="add-product-root relative">
        <div className="noise-overlay"></div>
        <div className="paper-texture min-h-screen">
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="mb-12 fade-in-up">
              <button
                onClick={() => navigate(-1)}
                className="text-sm uppercase tracking-wider font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-6xl md:text-7xl font-black serif mb-4 leading-none">
                List Your <br />
                <span className="italic" style={{ color: '#D97706' }}>Product</span>
              </h1>
              <p className="text-lg text-stone-600 max-w-2xl leading-relaxed">
                Share your item with the SGSITS community. Fill in the details below and reach verified students on campus.
              </p>
            </div>

            {/* Step Indicator */}
            <div className="step-indicator fade-in-up">
              <div className={`step ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}></div>
            </div>

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="fade-in-up">
                <h2 className="text-3xl font-black serif mb-8">01 / Basic Details</h2>

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-stone-700">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Raspberry Pi 4 Model B"
                    className="input-editorial w-full"
                  />
                  {errors.title && <p className="error-message">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-stone-700">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product in detail. Include condition, usage, and any additional notes..."
                    className="input-editorial w-full"
                  />
                  {errors.description && <p className="error-message">{errors.description}</p>}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-stone-700">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1200"
                    className="input-editorial w-full"
                    min="0"
                    step="10"
                  />
                  {errors.price && <p className="error-message">{errors.price}</p>}
                </div>

                {/* Tag */}
                <div className="mb-8">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-stone-700">
                    Tag / Short Label
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="Electronics, Tools, Books..."
                    className="input-editorial w-full"
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-stone-700">
                    Product Images * (Max 5)
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {imagePreviews.length < 5 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="upload-zone p-12 text-center mb-6"
                    >
                      <Upload />
                      <p className="mt-4 font-semibold text-stone-700">Click to upload images</p>
                      <p className="text-sm text-stone-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button
                            onClick={() => removeImage(index)}
                            className="image-preview-remove"
                          >
                            <X />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.images && <p className="error-message">{errors.images}</p>}
                </div>

                {/* Navigation */}
                <div className="flex justify-end gap-4 pt-8 border-t-2 border-stone-200">
                  <button onClick={handleNext} className="btn-primary">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Category & Details */}
            {currentStep === 2 && (
              <div className="fade-in-up">
                <h2 className="text-3xl font-black serif mb-8">02 / Category & Details</h2>

                {/* Category */}
                <div className="mb-8">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-4 text-stone-700">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.value}
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`category-card ${formData.category === cat.value ? 'selected' : ''}`}
                      >
                        <div className="text-3xl mb-2">{cat.emoji}</div>
                        <div className="text-sm font-semibold">{cat.label.split(' ').slice(1).join(' ')}</div>
                      </div>
                    ))}
                  </div>
                  {errors.category && <p className="error-message mt-2">{errors.category}</p>}
                </div>

                {/* Type */}
                <div className="mb-8">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-4 text-stone-700">
                    Listing Type *
                  </label>
                  <div className="space-y-3">
                    {types.map((type) => (
                      <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="radio-editorial"
                        />
                        <span className="text-base font-semibold group-hover:text-amber-600 transition-colors">
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Branch */}
                <div className="mb-6">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-stone-700">
                    Your Branch *
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="input-editorial w-full"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.value} value={branch.value}>
                        {branch.label}
                      </option>
                    ))}
                  </select>
                  {errors.branch && <p className="error-message">{errors.branch}</p>}
                </div>

                {/* Year */}
                <div className="mb-6">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-stone-700">
                    Your Year *
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="input-editorial w-full"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.year && <p className="error-message">{errors.year}</p>}
                </div>

                {/* Condition */}
                <div className="mb-6">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-4 text-stone-700">
                    Condition *
                  </label>
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
                  {errors.condition && <p className="error-message mt-2">{errors.condition}</p>}
                </div>

                {/* Location */}
                <div className="mb-8">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-stone-700">
                    Meetup Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Near ATC, Library, Hostel 2..."
                    className="input-editorial w-full"
                  />
                  {errors.location && <p className="error-message">{errors.location}</p>}
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-4 pt-8 border-t-2 border-stone-200">
                  <button onClick={handleBack} className="btn-secondary">
                    ← Back
                  </button>
                  <button onClick={handleNext} className="btn-primary">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 3 && (
              <div className="fade-in-up">
                <h2 className="text-3xl font-black serif mb-8">03 / Additional Details</h2>

                {/* Highlights */}
                <div className="mb-8">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-4 text-stone-700">
                    Product Highlights (Optional)
                  </label>
                  <p className="text-sm text-stone-500 mb-4">Key features or selling points</p>

                  <div className="space-y-3 mb-4">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="dynamic-item">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => updateHighlight(index, e.target.value)}
                          placeholder="e.g., 4 GB RAM, WiFi & BT 5.0"
                          className="input-editorial flex-1"
                        />
                        {highlights.length > 1 && (
                          <button onClick={() => removeHighlight(index)} className="dynamic-item-remove">
                            <Minus />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {highlights.length < 6 && (
                    <button onClick={addHighlight} className="dynamic-item-add">
                      <Plus /> Add Highlight
                    </button>
                  )}
                </div>

                {/* Specs */}
                <div className="mb-8">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-4 text-stone-700">
                    Specifications (Optional)
                  </label>
                  <p className="text-sm text-stone-500 mb-4">Technical details like Model, RAM, etc.</p>

                  <div className="space-y-3 mb-4">
                    {specs.map((spec, index) => (
                      <div key={index} className="dynamic-item">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => updateSpec(index, 'label', e.target.value)}
                          placeholder="Label (e.g., RAM)"
                          className="input-editorial flex-1"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => updateSpec(index, 'value', e.target.value)}
                          placeholder="Value (e.g., 4GB)"
                          className="input-editorial flex-1"
                        />
                        {specs.length > 1 && (
                          <button onClick={() => removeSpec(index)} className="dynamic-item-remove">
                            <Minus />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {specs.length < 8 && (
                    <button onClick={addSpec} className="dynamic-item-add">
                      <Plus /> Add Spec
                    </button>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-4 pt-8 border-t-2 border-stone-200">
                  <button onClick={handleBack} className="btn-secondary">
                    ← Back
                  </button>
                  <button onClick={handleSubmit} className="btn-primary">
                    Publish Listing
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

export default AddProduct;