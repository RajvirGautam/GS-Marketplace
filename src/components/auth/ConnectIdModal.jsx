import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js'; 
import Icons from '../../assets/icons/Icons';
import NeonButton from '../ui/NeonButton';
import LoginGraphic from './LoginGraphic.png';

// --- Styles for the Modal Animation ---
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
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-modal-pop { animation: modal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-scan-line { animation: scan-line 3s linear infinite; }
  .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }

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
  .input-brutal:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* OCR Debug Panel */
  .debug-panel {
    background: #000;
    border: 1px solid rgba(0, 217, 255, 0.3);
    color: #00D9FF;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    max-height: 200px;
    overflow-y: auto;
  }
`;

const ConnectIdModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [dragActive, setDragActive] = useState(false);
  
  // Form Data States
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fullName, setFullName] = useState('');
  const [enrollment, setEnrollment] = useState('');
  
  // Google States
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleError, setGoogleError] = useState('');

  // Verification Logic States
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [debugInfo, setDebugInfo] = useState([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('manual');
      setFile(null);
      setImagePreview(null);
      setFullName('');
      setEnrollment('');
      setGoogleEmail('');
      setGoogleError('');
      setDragActive(false);
      setIsProcessing(false);
      setVerificationStatus('idle');
      setOcrProgress(0);
      setExtractedText('');
      setDebugInfo([]);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  // --- Image Preprocessing ---
  const preprocessImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for preprocessing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size (scale down if too large for better performance)
          const maxWidth = 1200;
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Convert to grayscale and increase contrast
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            // Increase contrast
            const contrast = 1.5;
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
            let newValue = factor * (avg - 128) + 128;
            newValue = Math.max(0, Math.min(255, newValue));
            
            data[i] = data[i + 1] = data[i + 2] = newValue;
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          // Convert to blob
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- Enhanced Text Normalization ---
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[^\w]/g, '') // Remove special characters
      .replace(/[ilI|]/g, '1')
      .replace(/[oO]/g, '0')
      .replace(/[zZ]/g, '2')
      .replace(/[sS]/g, '5')
      .replace(/[bB]/g, '8');
  };

  // --- Fuzzy Matching Function ---
  const fuzzyMatch = (text, search) => {
    text = text.toLowerCase();
    search = search.toLowerCase();
    
    // Direct substring match
    if (text.includes(search)) return true;
    
    // Character-by-character fuzzy match (allows for 20% error rate)
    let matches = 0;
    let searchIndex = 0;
    
    for (let i = 0; i < text.length && searchIndex < search.length; i++) {
      if (text[i] === search[searchIndex]) {
        matches++;
        searchIndex++;
      }
    }
    
    const matchRate = matches / search.length;
    return matchRate >= 0.8; // 80% match required
  };

  // --- Handlers ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeTab !== 'manual') return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeTab !== 'manual') return;

    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }
    
    setFile(selectedFile);
    setVerificationStatus('idle');
    setExtractedText('');
    setDebugInfo([]);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleGoogleLogin = () => {
    if (!googleEmail.endsWith('@sgsits.ac.in')) {
      setGoogleError('Access Denied. Official @sgsits.ac.in mail required.');
      return;
    }
    setGoogleError('');
    alert(`Redirecting to Google OAuth for ${googleEmail}...`);
  };

  const addDebugInfo = (message) => {
    setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleVerification = async () => {
    if (!file || !fullName || !enrollment) {
      alert("Please fill in all fields and upload an ID card.");
      return;
    }
    
    setIsProcessing(true);
    setVerificationStatus('idle');
    setOcrProgress(0);
    setExtractedText('');
    setDebugInfo([]);
    
    try {
      addDebugInfo('🔄 Starting verification process...');
      addDebugInfo(`📝 Name: ${fullName}`);
      addDebugInfo(`🔢 Enrollment: ${enrollment}`);
      
      // Preprocess image
      addDebugInfo('🖼️  Preprocessing image...');
      const processedImage = await preprocessImage(file);
      
      addDebugInfo('🔍 Starting OCR scan...');
      
      // Perform OCR with enhanced configuration
      const { data: { text, confidence } } = await Tesseract.recognize(
        processedImage,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              setOcrProgress(progress);
              if (progress % 20 === 0) {
                addDebugInfo(`⚙️  OCR Progress: ${progress}%`);
              }
            }
          },
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .-/',
          tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        }
      );
      
      setExtractedText(text);
      addDebugInfo(`✅ OCR Complete! Confidence: ${Math.round(confidence)}%`);
      addDebugInfo(`📄 Extracted Text Length: ${text.length} characters`);
      
      // Enhanced matching logic
      const scannedLower = text.toLowerCase();
      const scannedNormalized = normalizeText(text);
      const enrollmentNormalized = normalizeText(enrollment);
      
      // Name matching - check each word
      const nameParts = fullName.trim().toLowerCase().split(/\s+/);
      addDebugInfo(`🔎 Checking name parts: ${nameParts.join(', ')}`);
      
      let nameMatchCount = 0;
      nameParts.forEach(part => {
        if (part.length >= 3) { // Only check meaningful parts
          if (fuzzyMatch(scannedLower, part)) {
            nameMatchCount++;
            addDebugInfo(`✓ Found name part: "${part}"`);
          }
        }
      });
      
      const nameMatch = nameMatchCount >= Math.ceil(nameParts.length / 2); // At least half the name parts
      
      // Enrollment matching - multiple strategies
      addDebugInfo(`🔎 Checking enrollment: ${enrollment}`);
      
      let enrollmentMatch = false;
      
      // Strategy 1: Direct substring match
      if (scannedLower.includes(enrollment.toLowerCase())) {
        enrollmentMatch = true;
        addDebugInfo(`✓ Enrollment found (direct match)`);
      }
      
      // Strategy 2: Normalized match
      if (!enrollmentMatch && scannedNormalized.includes(enrollmentNormalized)) {
        enrollmentMatch = true;
        addDebugInfo(`✓ Enrollment found (normalized match)`);
      }
      
      // Strategy 3: Fuzzy match with number extraction
      if (!enrollmentMatch) {
        const extractedNumbers = text.match(/\d+/g) || [];
        for (const num of extractedNumbers) {
          if (num.length >= 6 && fuzzyMatch(num, enrollment)) {
            enrollmentMatch = true;
            addDebugInfo(`✓ Enrollment found (fuzzy match): ${num}`);
            break;
          }
        }
      }
      
      // Strategy 4: Check for partial enrollment match (useful for long enrollment numbers)
      if (!enrollmentMatch && enrollment.length >= 8) {
        const enrollmentPart = enrollment.substring(0, 6);
        if (scannedLower.includes(enrollmentPart.toLowerCase())) {
          enrollmentMatch = true;
          addDebugInfo(`✓ Enrollment found (partial match)`);
        }
      }
      
      addDebugInfo('─────────────────────────');
      addDebugInfo(`📊 Name Match: ${nameMatch ? '✓ YES' : '✗ NO'} (${nameMatchCount}/${nameParts.length} parts)`);
      addDebugInfo(`📊 Enrollment Match: ${enrollmentMatch ? '✓ YES' : '✗ NO'}`);
      
      // Final verification
      if (nameMatch && enrollmentMatch) {
        addDebugInfo('🎉 VERIFICATION SUCCESSFUL!');
        setVerificationStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        addDebugInfo('❌ VERIFICATION FAILED');
        if (!nameMatch) addDebugInfo('⚠️  Name not found or insufficient matches');
        if (!enrollmentMatch) addDebugInfo('⚠️  Enrollment number not found');
        setVerificationStatus('failed');
      }
      
    } catch (error) {
      console.error("OCR Error:", error);
      addDebugInfo(`❌ ERROR: ${error.message}`);
      setVerificationStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <span className="flex items-center gap-2 mono text-xs">
          <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {ocrProgress > 0 ? `SCANNING... ${ocrProgress}%` : 'PREPARING...'}
        </span>
      );
    }
    if (verificationStatus === 'success') {
      return (
        <span className="flex items-center gap-2 text-black font-bold mono text-xs uppercase">
          <Icons.CheckCircle size={16}/> VERIFIED! REDIRECTING...
        </span>
      );
    }
    if (verificationStatus === 'failed') {
      return (
        <span className="flex items-center gap-2 text-red-500 font-bold mono text-xs uppercase">
          <Icons.AlertCircle size={16} /> VERIFICATION FAILED. RETRY.
        </span>
      );
    }
    return "SUBMIT FOR VERIFICATION";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <style>{modalStyles}</style>
      
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl bg-[#050505] border border-white/20 shadow-2xl flex flex-col md:flex-row animate-modal-pop overflow-hidden max-h-[90vh]">
        
        {/* Left Side: Aesthetic / USP Highlight */}
        <div className="w-full md:w-2/5 bg-zinc-900 border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden p-8 flex flex-col justify-between text-white">
          
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#00D9FF] flex items-center justify-center mb-6 border border-white/10 text-black shadow-[4px_4px_0px_white]">
              <Icons.ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase leading-tight mb-2 tracking-tighter">
              Secure Campus<br/>Network
            </h2>
            <p className="text-white/60 text-xs font-medium mono border-l-2 border-[#00D9FF] pl-3">
              // Join the exclusive marketplace for SGSITS. <br/>
              // Verified students only. No middlemen.
            </p>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center py-6">
            <img 
              src={LoginGraphic} 
              alt="Security Graphic" 
              className="w-full max-w-[240px] h-auto object-contain drop-shadow-xl animate-float-slow opacity-90 transition-all duration-500"
            />
          </div>

          <div className="relative z-10">
            <div className="bg-black border border-white/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[#00D9FF] animate-pulse"></div>
                <span className="text-[10px] font-bold mono text-[#00D9FF] uppercase tracking-wider">
                  {isProcessing ? `OCR SCANNING ${ocrProgress}%` : 'SECURED VERIFICATION ACTIVE'}
                </span>
              </div>
              <p className="text-[10px] text-white/50 mono leading-relaxed">
                SYSTEM ACCESS GRANTED <br/>
                {isProcessing ? 'ANALYZING ID CARD...' : 'READY FOR VERIFICATION...'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="w-full md:w-3/5 p-8 relative bg-[#0A0A0A] overflow-y-auto custom-scrollbar">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-white/20 text-white/40 hover:text-white hover:border-white hover:bg-white/10 transition-all z-20"
          >
            <Icons.X size={16} />
          </button>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-1">Connect ID</h3>
            <div className="h-0.5 w-10 bg-[#00D9FF]"></div>
            <p className="text-white mono text-xs mt-2">Verify your identity to start trading.</p>
          </div>

          {/* Google Toggle Section */}
          <div className="mb-6 relative z-10">
            <div className={`p-4 border transition-all duration-300 ${activeTab === 'google' ? 'border-[#00D9FF] bg-[#00D9FF]/5' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}`}>
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('google')}>
                <div className="w-6 h-6 bg-white flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                <span className="font-bold text-white mono text-xs uppercase">Quick Connect with Google</span>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'google' ? 'max-h-32 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="your.name@sgsits.ac.in"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="flex-1 input-brutal px-4 py-2 text-xs"
                  />
                  <button 
                    onClick={handleGoogleLogin}
                    className="bg-[#00D9FF] hover:bg-white text-black px-4 py-2 text-xs font-bold uppercase transition-colors mono"
                  >
                    Verify
                  </button>
                </div>
                {googleError && <p className="text-red-500 text-[10px] mt-2 font-bold mono uppercase flex items-center gap-1"><Icons.AlertCircle size={12}/> {googleError}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[10px] font-bold text-white/40 uppercase mono">Or Manual Upload</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          {/* Manual Form Container */}
          <div className={`relative space-y-4 transition-all duration-300 ${activeTab === 'google' ? 'opacity-40' : 'opacity-100'}`}>
            
            {activeTab === 'google' && (
              <div 
                className="absolute inset-0 z-50 cursor-pointer"
                onClick={() => setActiveTab('manual')}
                title="Click to enable manual upload"
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white ml-1 uppercase mono">Full Name</label>
                <input 
                  type="text" 
                  disabled={activeTab === 'google'} 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full input-brutal px-4 py-3 text-sm" 
                  placeholder="Rajvir Gautam" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white ml-1 uppercase mono">Enrollment No.</label>
                <input 
                  type="text" 
                  disabled={activeTab === 'google'} 
                  value={enrollment}
                  onChange={(e) => setEnrollment(e.target.value)}
                  className="w-full input-brutal px-4 py-3 text-sm" 
                  placeholder="0801CS..." 
                />
              </div>
            </div>

            <div 
              className={`relative border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-colors
              ${dragActive ? 'border-[#00D9FF] bg-[#00D9FF]/10' : 'border-white/20 hover:border-white/40 bg-zinc-900/50'}
              ${activeTab === 'manual' ? 'cursor-pointer' : ''}`}
              onDragEnter={handleDrag} 
              onDragLeave={handleDrag} 
              onDragOver={handleDrag} 
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                disabled={activeTab === 'google'} 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={(e) => handleFileSelect(e.target.files[0])}
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
                      className="max-h-32 mx-auto border border-white/20"
                    />
                  )}
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-white">
                    <Icons.UploadCloud />
                  </div>
                  <p className="text-xs font-bold text-white uppercase mono">
                    Upload College ID Card
                  </p>
                  <p className="text-[10px] text-white/40 mt-1 mono">JPG, PNG • MAX 5MB</p>
                </>
              )}
              
              {dragActive && activeTab === 'manual' && <div className="absolute left-0 right-0 h-0.5 bg-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.8)] animate-scan-line pointer-events-none"></div>}
            </div>

            <NeonButton 
              primary={verificationStatus !== 'failed'} 
              className={`w-full justify-center py-4 mt-4 rounded-none font-mono uppercase text-xs font-bold ${verificationStatus === 'failed' ? 'bg-red-900/20 border-red-500 text-red-500 hover:border-red-400' : ''}`}
              disabled={activeTab === 'google' || isProcessing || verificationStatus === 'success'}
              onClick={handleVerification}
            >
              {getButtonContent()}
            </NeonButton>

            {/* Debug Panel */}
            {(extractedText || debugInfo.length > 0) && (
              <div className="debug-panel p-4 space-y-2 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold uppercase text-[#00D9FF]">// Verification Log</span>
                  <button 
                    onClick={() => {
                      setExtractedText('');
                      setDebugInfo([]);
                    }}
                    className="text-[8px] text-white/40 hover:text-white"
                  >
                    CLEAR
                  </button>
                </div>
                
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {debugInfo.map((info, i) => (
                    <div key={i} className="text-[9px] text-white/70">{info}</div>
                  ))}
                </div>
                
                {extractedText && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-[10px] text-[#00D9FF] hover:text-white">
                      View Raw OCR Text ({extractedText.length} chars)
                    </summary>
                    <div className="mt-2 p-2 bg-black/50 text-[8px] text-white/60 max-h-24 overflow-y-auto break-all">
                      {extractedText}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectIdModal;