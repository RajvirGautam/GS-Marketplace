import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import Cookies from 'js-cookie';
import Icons from '../../assets/icons/Icons';
import NeonButton from '../ui/NeonButton';

const modalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

  @keyframes modal-pop {
    0% { opacity: 0; transform: scale(0.95) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes scan-line {
    0% { top: 0%; }
    50% { top: 100%; }
    100% { top: 0%; }
  }
  .animate-modal-pop { animation: modal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-scan-line { animation: scan-line 3s linear infinite; }
  .mono { font-family: 'Space Mono', monospace; }
  
  .input-brutal {
    background: #111;
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    font-family: 'Space Mono', monospace;
    transition: all 0.2s;
  }
  .input-brutal:focus {
    border-color: #00D9FF;
    background: #000;
    outline: none;
  }
  .debug-panel {
    background: #000;
    border: 1px solid rgba(0, 217, 255, 0.3);
    color: #00D9FF;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    max-h: 200px;
    overflow-y: auto;
  }
`;

const IdVerificationModal = ({ isOpen, onClose, userEmail }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fullName, setFullName] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [debugInfo, setDebugInfo] = useState([]);
  const [extractedText, setExtractedText] = useState('');

  const addDebugInfo = (message) => {
    setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Image preprocessing
  const preprocessImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const maxWidth = 1600;
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const contrast = 1.8;
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
            let newValue = factor * (avg - 128) + 128;
            
            if (newValue < 128) {
              newValue = Math.max(0, newValue * 0.7);
            } else {
              newValue = Math.min(255, newValue * 1.2);
            }
            
            data[i] = data[i + 1] = data[i + 2] = newValue;
          }
          
          ctx.putImageData(imageData, 0, 0);
          canvas.toBlob((blob) => resolve(blob), 'image/png');
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Fuzzy matching functions (simplified)
  const fuzzyMatchName = (scannedText, targetName) => {
    const scannedLower = scannedText.toLowerCase();
    const nameParts = targetName.trim().toLowerCase().split(/\s+/).filter(part => part.length >= 2);
    
    let matchCount = 0;
    const requiredMatches = Math.ceil(nameParts.length / 2);
    
    for (const part of nameParts) {
      if (scannedLower.includes(part)) {
        matchCount++;
        addDebugInfo(`   ✓ "${part}" found`);
      }
    }
    
    return matchCount >= requiredMatches;
  };

  const fuzzyMatchEnrollment = (scannedText, targetEnrollment) => {
    const target = targetEnrollment.toLowerCase().replace(/\s+/g, '');
    const scanned = scannedText.toLowerCase();
    
    if (scanned.includes(target)) {
      addDebugInfo(`✅ Enrollment found: direct match`);
      return true;
    }
    
    return false;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    setFile(selectedFile);
    setVerificationStatus('idle');
    setExtractedText('');
    setDebugInfo([]);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleVerification = async () => {
    if (!file || !fullName.trim() || !enrollment.trim()) {
      alert('Please fill in all fields and upload your ID card.');
      return;
    }

    setIsProcessing(true);
    setVerificationStatus('idle');
    setOcrProgress(0);
    setDebugInfo([]);

    try {
      addDebugInfo('🚀 Starting ID verification...');
      addDebugInfo(`📝 Name: "${fullName}"`);
      addDebugInfo(`🔢 Enrollment: "${enrollment}"`);
      
      // Preprocess image
      addDebugInfo('🖼️  Preprocessing image...');
      const processedImage = await preprocessImage(file);
      
      // Perform OCR
      addDebugInfo('🔍 Running OCR scan...');
      const { data: { text } } = await Tesseract.recognize(
        processedImage,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              setOcrProgress(progress);
            }
          },
        }
      );
      
      setExtractedText(text);
      addDebugInfo('✅ OCR complete');
      
      // Verify name and enrollment
      addDebugInfo('👤 Verifying name...');
      const nameMatch = fuzzyMatchName(text, fullName);
      
      addDebugInfo('🎫 Verifying enrollment...');
      const enrollmentMatch = fuzzyMatchEnrollment(text, enrollment);
      
      if (nameMatch && enrollmentMatch) {
        addDebugInfo('🎉 Verification successful!');
        addDebugInfo('📤 Sending to server...');
        
        // Send to backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('accessToken')}`
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            enrollmentNumber: enrollment.trim()
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          addDebugInfo('✅ Account verified successfully!');
          setVerificationStatus('success');
          setTimeout(() => {
            window.location.href = '/marketplace';
          }, 2000);
        } else {
          addDebugInfo(`❌ Server error: ${data.message}`);
          alert(data.message || 'Verification failed');
          setVerificationStatus('failed');
        }
      } else {
        addDebugInfo('❌ Verification failed');
        if (!nameMatch) addDebugInfo('⚠️  Name not found on ID card');
        if (!enrollmentMatch) addDebugInfo('⚠️  Enrollment number not found on ID card');
        setVerificationStatus('failed');
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      addDebugInfo(`❌ Error: ${error.message}`);
      setVerificationStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <style>{modalStyles}</style>
      
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#050505] border border-white/20 shadow-2xl animate-modal-pop overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase text-white mb-2">One Last Step!</h2>
              <p className="text-white/80 text-sm mono">Verify your SGSITS enrollment to access the marketplace</p>
              {userEmail && <p className="text-white/60 text-xs mono mt-1">Logged in as: {userEmail}</p>}
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-white/40 text-white hover:bg-white/20 transition-all"
            >
              <Icons.X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Instructions */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 p-4">
            <div className="flex items-start gap-3">
              <Icons.Info className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/80 mono leading-relaxed">
                <strong className="text-cyan-500">Upload your college ID card</strong> and enter your details. Our AI will verify your enrollment automatically.
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white ml-1 uppercase mono">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full input-brutal px-4 py-3 text-sm" 
                placeholder="Rajvir Gautam" 
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white ml-1 uppercase mono">Enrollment No.</label>
              <input 
                type="text" 
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value)}
                className="w-full input-brutal px-4 py-3 text-sm" 
                placeholder="0801CS211234" 
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* File Upload */}
          <div 
            className={`relative border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-colors
            ${dragActive ? 'border-[#00D9FF] bg-[#00D9FF]/10' : 'border-white/20 hover:border-white/40 bg-zinc-900/50'} cursor-pointer`}
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={(e) => handleFileSelect(e.target.files[0])}
              disabled={isProcessing}
            />
            
            {file ? (
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3 text-green-500 font-bold justify-center">
                  <Icons.CheckCircle />
                  <span className="mono text-xs uppercase">{file.name}</span>
                </div>
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="ID Preview" 
                    className="max-h-48 mx-auto border border-white/20 shadow-lg"
                  />
                )}
                {!isProcessing && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setImagePreview(null);
                    }}
                    className="text-[10px] text-red-400 hover:text-red-300 mono uppercase"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white">
                  <Icons.UploadCloud size={32} />
                </div>
                <p className="text-sm font-bold text-white uppercase mono">
                  Upload College ID Card
                </p>
                <p className="text-[10px] text-white/40 mt-2 mono">JPG, PNG • MAX 10MB • CLEAR & WELL-LIT</p>
              </>
            )}
            
            {dragActive && <div className="absolute left-0 right-0 h-0.5 bg-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.8)] animate-scan-line pointer-events-none"></div>}
          </div>

          {/* Submit Button */}
          <NeonButton 
            primary={verificationStatus !== 'failed'} 
            className="w-full justify-center py-4 rounded-none font-mono uppercase text-xs font-bold"
            disabled={isProcessing || verificationStatus === 'success' || !file || !fullName || !enrollment}
            onClick={handleVerification}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {ocrProgress > 0 ? `SCANNING... ${ocrProgress}%` : 'PREPARING...'}
              </span>
            ) : verificationStatus === 'success' ? (
              <span className="flex items-center gap-2">
                <Icons.CheckCircle size={16}/> VERIFIED! REDIRECTING...
              </span>
            ) : (
              'VERIFY MY ID'
            )}
          </NeonButton>

          {/* Debug Panel */}
          {debugInfo.length > 0 && (
            <div className="debug-panel p-4 space-y-2">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#00D9FF]/20">
                <span className="font-bold uppercase text-[#00D9FF]">// VERIFICATION LOG</span>
              </div>
              
              <div className="space-y-0.5 max-h-40 overflow-y-auto">
                {debugInfo.map((info, i) => (
                  <div 
                    key={i} 
                    className={`text-[9px] leading-relaxed ${
                      info.includes('✅') || info.includes('✓') ? 'text-green-400' :
                      info.includes('❌') ? 'text-red-400' :
                      info.includes('⚠️') ? 'text-yellow-400' :
                      info.includes('🎉') ? 'text-green-300 font-bold' :
                      'text-white/70'
                    }`}
                  >
                    {info}
                  </div>
                ))}
              </div>

              {extractedText && (
                <details className="mt-4 pt-3 border-t border-[#00D9FF]/20">
                  <summary className="cursor-pointer text-[10px] text-[#00D9FF] hover:text-white uppercase">
                    📄 View OCR Text
                  </summary>
                  <div className="mt-3 p-3 bg-black/50 text-[9px] text-white/60 max-h-32 overflow-y-auto">
                    {extractedText}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdVerificationModal;