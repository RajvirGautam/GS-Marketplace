// src/components/dashboard/AddProductModal.jsx
import React, { useState, useRef } from 'react';
import { productAPI } from '../../services/api';
import { showError, showLoading, showSuccess, showInfo, updateToast } from '../../utils/toast';

const AddProductModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [highlights, setHighlights] = useState(['']);
  const [specs, setSpecs] = useState([{ label: '', value: '' }]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  const categories = [
    { value: 'books', label: 'Books & Notes', emoji: '📚' },
    { value: 'electronics', label: 'Electronics', emoji: '⚡' },
    { value: 'stationery', label: 'Stationery', emoji: '✏️' },
    { value: 'lab', label: 'Lab Equipment', emoji: '🔬' },
    { value: 'tools', label: 'Tools', emoji: '🔧' },
    { value: 'hostel', label: 'Hostel Items', emoji: '🏠' },
    { value: 'sports', label: 'Sports & Fitness', emoji: '⚽' },
    { value: 'music', label: 'Musical Instruments', emoji: '🎸' },
    { value: 'clothing', label: 'Clothing & Uniforms', emoji: '👕' },
    { value: 'misc', label: 'Miscellaneous', emoji: '📦' },
  ];

  const branches = [
    { value: 'all', label: 'All Branches' },
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

  const meetupSpots = [
    'Library Main Gate',
    'ATC Building Entrance',
    'LT Hall (Lecture Theatre)',
    'Main Gate (Opposite Lantern)',
    'College Canteen',
    'Diamond Jubilee Hall',
    'Hostel Block A/B/C',
    'Sports Ground Pavilion',
    'Workshop Area',
    'Admin Block'
  ];

  // Handle file upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      showError('Too Many Images', 'You can upload a maximum of 5 images per listing.');
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
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const [aiFilledFields, setAiFilledFields] = useState(false);

  const clearAIFill = () => {
    setFormData({ title: '', description: '', price: '', category: '', branch: '', year: '', condition: '', type: 'sale' });
    setHighlights(['']);
    setSpecs([{ label: '', value: '' }]);
    setAiFilledFields(false);
    setAiSuggestion(null);
  };

  const handleAIFill = async () => {
    if (images.length === 0) {
      showError('No Image', 'Upload an image first so the AI can analyze it.');
      return;
    }

    setIsAIAnalyzing(true);
    setAiSuggestion(null);
    setAiProgress(0);

    const progressInterval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 400);

    const toastId = showLoading('Analyzing with AI...', 'Snapping a look at your image — hang tight!');

    try {
      const res = await productAPI.generateListing(images[0]);
      if (res.success) {
        const d = res.data;

        // Populate all text fields
        setFormData(prev => ({
          ...prev,
          title: d.title || prev.title,
          description: d.description || prev.description,
          category: d.category || prev.category,
          condition: d.condition || prev.condition,
        }));

        // Populate lists
        if (d.highlights && d.highlights.length > 0) setHighlights(d.highlights);
        if (d.specs && d.specs.length > 0) setSpecs(d.specs);

        setAiFilledFields(true);

        updateToast(toastId, 'success', 'AI Fill Complete!', 'All fields filled — review and edit before submitting.');
      } else {
        updateToast(toastId, 'error', 'AI Failed', 'Analysis failed. Please try manual input.');
      }
    } catch (err) {
      console.error('AI Fill error:', err);
      const msg = err?.response?.data?.message || 'AI Analysis failed. Try manual input.';
      updateToast(toastId, 'error', 'AI Failed', msg);
    } finally {
      clearInterval(progressInterval);
      setAiProgress(100);
      setTimeout(() => {
        setIsAIAnalyzing(false);
        setTimeout(() => setAiProgress(0), 300);
      }, 400);
    }
  };

  const applyAIPricing = () => {
    if (aiSuggestion?.suggestedPrice) {
      setFormData(prev => ({ ...prev, price: aiSuggestion.suggestedPrice }));
    }
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
      if (images.length === 0) newErrors.images = 'At least 1 image required';
    }
    if (step === 2) {
      if (!formData.category) newErrors.category = 'Required';
      if (!formData.branch) newErrors.branch = 'Required';
      if (!formData.year) newErrors.year = 'Required';
      if (!formData.condition) newErrors.condition = 'Required';
      if (formData.type !== 'free' && (!formData.price || parseFloat(formData.price) <= 0)) {
        newErrors.price = 'Required';
      }
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
    setUploadProgress(0);

    const toastId = showLoading('Creating listing...', 'Uploading your product — this may take a moment.');

    try {
      const filteredHighlights = highlights.filter((h) => h.trim());
      const filteredSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

      // Simulate progress
      setUploadProgress(20);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create FormData
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.type === 'free' ? 0 : formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('branch', formData.branch);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('highlights', JSON.stringify(filteredHighlights));
      formDataToSend.append('specs', JSON.stringify(filteredSpecs));

      setUploadProgress(40);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      setUploadProgress(60);

      const response = await productAPI.create(formDataToSend);

      setUploadProgress(100);

      if (response.success) {
        updateToast(toastId, 'success', 'Product Listed!', 'Your listing is now live on the marketplace.');
        handleClose();
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      updateToast(toastId, 'error', 'Listing Failed', error.response?.data?.message || 'Failed to create the product listing.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
    });
    setImages([]);
    setImagePreviews([]);
    setHighlights(['']);
    setSpecs([{ label: '', value: '' }]);
    setCurrentStep(1);
    setErrors({});
    setIsSubmitting(false);
    setUploadProgress(0);
    setAiFilledFields(false);
    setAiSuggestion(null);
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
          position: relative;
          overflow: hidden;
        }

        .btn-brutal-primary:hover:not(:disabled) {
          background: #00D9FF;
          border-color: #00D9FF;
          transform: translate(-2px, -2px);
          box-shadow: 2px 2px 0 #fff;
        }

        .btn-brutal-primary:disabled {
          opacity: 0.7;
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

      {/* Progress bar */}
      {isSubmitting && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={!isSubmitting ? handleClose : undefined}></div>

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

                {/* ── PHOTO UPLOAD (TOP) ── */}
                <div style={{ marginBottom: 20 }}>
                  <label className="block mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Product Images (Min 1) *</label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {imagePreviews.length < 5 && (
                    <div onClick={() => fileInputRef.current?.click()} className="upload-zone mb-3">
                      <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="mono text-xs text-white opacity-60 uppercase tracking-wider">CLICK TO UPLOAD</p>
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
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

                {/* ── AI FILL BUTTON (prominent, below upload) ── */}
                {imagePreviews.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAIFill}
                    disabled={isAIAnalyzing}
                    style={{
                      width: '100%', marginBottom: 24,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '13px 20px',
                      background: isAIAnalyzing
                        ? 'rgba(0,217,255,0.06)'
                        : 'linear-gradient(135deg, rgba(0,217,255,0.12), rgba(124,58,237,0.12))',
                      border: `1.5px solid ${isAIAnalyzing ? 'rgba(0,217,255,0.2)' : 'rgba(0,217,255,0.4)'}`,
                      borderRadius: 6,
                      color: '#00D9FF',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: 12, fontWeight: 700, letterSpacing: 1,
                      textTransform: 'uppercase',
                      cursor: isAIAnalyzing ? 'default' : 'pointer',
                      opacity: 1,
                      transition: 'all 0.2s',
                    }}
                  >
                    {!isAIAnalyzing && <span style={{ fontSize: 16 }}>✨</span>}
                    {isAIAnalyzing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${aiProgress}%`, background: '#00D9FF', transition: 'width 0.3s ease-out' }} />
                        </div>
                        <span style={{ minWidth: 40, textAlign: 'right', fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{aiProgress}%</span>
                      </div>
                    ) : 'Fill All Fields with AI'}
                  </button>
                )}

                {/* ── AI FILLED BANNER ── */}
                {aiFilledFields && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, rgba(0,217,255,0.07), rgba(124,58,237,0.07))',
                    border: '1px solid rgba(0,217,255,0.25)',
                    borderRadius: 6, padding: '10px 14px', marginBottom: 20,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>✨</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#00D9FF', fontFamily: 'Space Mono, monospace', letterSpacing: 0.5 }}>
                          Fields auto-filled by AI
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                          Title · Description · Category · Condition · Highlights · Specs — review before submitting
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={clearAIFill}
                      style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.5)', borderRadius: 4, padding: '4px 10px',
                        fontSize: 10, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'Space Mono, monospace', letterSpacing: 0.5,
                        transition: 'all 0.15s', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    >✕ CLEAR</button>
                  </div>
                )}

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
                        <div className="mono text-[10px] text-white opacity-70 uppercase">{cat.label}</div>
                      </div>
                    ))}
                  </div>
                  {errors.category && <p className="error-text mt-2">{errors.category}</p>}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block mono text-xs text-white opacity-60 uppercase tracking-wider">Price (₹) *</label>
                    {aiSuggestion?.suggestedPrice && (
                      <button
                        type="button"
                        onClick={applyAIPricing}
                        className="text-[10px] font-bold text-cyan-400 border-b border-cyan-400/30 hover:text-cyan-300 transition-colors"
                      >
                        APPLY AI PRICE: ₹{aiSuggestion.suggestedPrice}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-brutal pl-8"
                    />
                  </div>
                  {errors.price && <p className="error-text">{errors.price}</p>}
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
                      <option value="all">All Years</option>
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
                    {isSubmitting ? `UPLOADING ${uploadProgress}%...` : 'PUBLISH LISTING'}
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