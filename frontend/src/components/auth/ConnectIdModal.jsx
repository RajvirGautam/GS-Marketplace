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

  .debug-panel {
    background: #000;
    border: 1px solid rgba(0, 217, 255, 0.3);
    color: #00D9FF;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    max-h: 200px;
    overflow-y: auto;
  }

  .debug-panel::-webkit-scrollbar {
    width: 4px;
  }
  .debug-panel::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  .debug-panel::-webkit-scrollbar-thumb {
    background: rgba(0, 217, 255, 0.3);
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
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Scale for optimal OCR (higher resolution for text recognition)
          const maxWidth = 1600;
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Enhanced preprocessing: grayscale + adaptive thresholding
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            // Adaptive contrast enhancement
            const contrast = 1.8;
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
            let newValue = factor * (avg - 128) + 128;
            
            // Apply threshold for better text recognition
            if (newValue < 128) {
              newValue = Math.max(0, newValue * 0.7);
            } else {
              newValue = Math.min(255, newValue * 1.2);
            }
            
            data[i] = data[i + 1] = data[i + 2] = newValue;
          }
          
          ctx.putImageData(imageData, 0, 0);
          
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

  // --- ENHANCED NORMALIZATION: Character-level substitution map ---
  const createNormalizedVersion = (text) => {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      // Common OCR misreads
      .replace(/[il|!]/g, '1')  // i, l, |, ! → 1
      .replace(/[o]/g, '0')      // o → 0
      .replace(/[z]/g, '2')      // z → 2
      .replace(/[s$]/g, '5')     // s, $ → 5
      .replace(/[b]/g, '8')      // b → 8
      .replace(/[g]/g, '9')      // g → 9
      .replace(/[t]/g, '7');     // t → 7
  };

  // --- ADVANCED FUZZY MATCHING with multiple strategies ---
  const fuzzyMatchEnrollment = (scannedText, targetEnrollment, debugLog) => {
    const target = targetEnrollment.toLowerCase().replace(/\s+/g, '');
    const scanned = scannedText.toLowerCase();
    
    debugLog(`🎯 Target Enrollment: "${targetEnrollment}"`);
    debugLog(`📄 Searching in ${scanned.length} characters of scanned text`);
    
    // Strategy 1: Direct case-insensitive match
    if (scanned.includes(target)) {
      debugLog(`✅ Strategy 1: Direct match found`);
      return true;
    }
    
    // Strategy 2: Normalized match (with OCR character substitutions)
    const normalizedTarget = createNormalizedVersion(target);
    const normalizedScanned = createNormalizedVersion(scanned);
    
    debugLog(`🔄 Normalized Target: "${normalizedTarget}"`);
    
    if (normalizedScanned.includes(normalizedTarget)) {
      debugLog(`✅ Strategy 2: Normalized match found`);
      return true;
    }
    
    // Strategy 3: Extract all number sequences and check similarity
    const scannedNumbers = scanned.match(/[a-z0-9]{6,}/gi) || [];
    debugLog(`🔢 Found ${scannedNumbers.length} alphanumeric sequences (6+ chars)`);
    
    for (const seq of scannedNumbers) {
      const similarity = calculateSimilarity(seq.toLowerCase(), target);
      debugLog(`   Checking "${seq}" → similarity: ${(similarity * 100).toFixed(1)}%`);
      
      if (similarity >= 0.75) { // 75% similarity threshold
        debugLog(`✅ Strategy 3: High similarity match (${(similarity * 100).toFixed(1)}%)`);
        return true;
      }
    }
    
    // Strategy 4: Check with character-level tolerance
    const tokens = scanned.split(/\s+/);
    for (const token of tokens) {
      if (token.length >= target.length - 2 && token.length <= target.length + 2) {
        const similarity = calculateSimilarity(token, target);
        if (similarity >= 0.8) {
          debugLog(`✅ Strategy 4: Token match with tolerance (${(similarity * 100).toFixed(1)}%)`);
          return true;
        }
      }
    }
    
    // Strategy 5: Sliding window approach with normalized versions
    const windowSize = normalizedTarget.length;
    for (let i = 0; i <= normalizedScanned.length - windowSize; i++) {
      const window = normalizedScanned.substring(i, i + windowSize);
      const similarity = calculateSimilarity(window, normalizedTarget);
      
      if (similarity >= 0.8) {
        debugLog(`✅ Strategy 5: Sliding window match at position ${i} (${(similarity * 100).toFixed(1)}%)`);
        return true;
      }
    }
    
    debugLog(`❌ No match found with any strategy`);
    return false;
  };

  // --- LEVENSHTEIN DISTANCE based similarity calculation ---
  const calculateSimilarity = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
  };

  // --- ENHANCED NAME MATCHING (case-insensitive) ---
  const fuzzyMatchName = (scannedText, targetName, debugLog) => {
    const scannedLower = scannedText.toLowerCase();
    const nameParts = targetName.trim().toLowerCase().split(/\s+/).filter(part => part.length >= 2);
    
    debugLog(`🔎 Checking ${nameParts.length} name parts: ${nameParts.join(', ')}`);
    
    let matchCount = 0;
    const requiredMatches = Math.ceil(nameParts.length / 2);
    
    for (const part of nameParts) {
      // Direct match
      if (scannedLower.includes(part)) {
        matchCount++;
        debugLog(`   ✓ "${part}" found (direct)`);
        continue;
      }
      
      // Fuzzy match with tolerance
      const words = scannedLower.split(/\s+/);
      for (const word of words) {
        if (word.length >= part.length - 1 && word.length <= part.length + 1) {
          const similarity = calculateSimilarity(word, part);
          if (similarity >= 0.85) {
            matchCount++;
            debugLog(`   ✓ "${part}" matched "${word}" (${(similarity * 100).toFixed(1)}% similar)`);
            break;
          }
        }
      }
    }
    
    const matched = matchCount >= requiredMatches;
    debugLog(`📊 Name Match: ${matchCount}/${nameParts.length} parts (need ${requiredMatches}): ${matched ? '✓ PASS' : '✗ FAIL'}`);
    return matched;
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
    if (!file || !fullName.trim() || !enrollment.trim()) {
      alert("Please fill in all fields and upload an ID card.");
      return;
    }
    
    setIsProcessing(true);
    setVerificationStatus('idle');
    setOcrProgress(0);
    setExtractedText('');
    setDebugInfo([]);
    
    try {
      addDebugInfo('═══════════════════════════════');
      addDebugInfo('🚀 VERIFICATION PROCESS STARTED');
      addDebugInfo('═══════════════════════════════');
      addDebugInfo(`📝 Name Input: "${fullName}"`);
      addDebugInfo(`🔢 Enrollment Input: "${enrollment}"`);
      addDebugInfo(`📁 File: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
      
      // Preprocess image
      addDebugInfo('🖼️  Preprocessing image...');
      const processedImage = await preprocessImage(file);
      addDebugInfo('✓ Image preprocessed successfully');
      
      addDebugInfo('🔍 Starting OCR scan...');
      
      // Perform OCR
      const { data: { text, confidence } } = await Tesseract.recognize(
        processedImage,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              setOcrProgress(progress);
              if (progress % 25 === 0 && progress > 0) {
                addDebugInfo(`⚙️  OCR Progress: ${progress}%`);
              }
            }
          },
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ./-',
          tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        }
      );
      
      setExtractedText(text);
      addDebugInfo('═══════════════════════════════');
      addDebugInfo(`✅ OCR COMPLETE`);
      addDebugInfo(`📊 Confidence: ${Math.round(confidence)}%`);
      addDebugInfo(`📄 Extracted ${text.length} characters`);
      addDebugInfo('═══════════════════════════════');
      
      // Name Verification
      addDebugInfo('');
      addDebugInfo('👤 NAME VERIFICATION:');
      addDebugInfo('─────────────────────────────');
      const nameMatch = fuzzyMatchName(text, fullName, addDebugInfo);
      
      // Enrollment Verification
      addDebugInfo('');
      addDebugInfo('🎫 ENROLLMENT VERIFICATION:');
      addDebugInfo('─────────────────────────────');
      const enrollmentMatch = fuzzyMatchEnrollment(text, enrollment, addDebugInfo);
      
      // Final Decision
      addDebugInfo('');
      addDebugInfo('═══════════════════════════════');
      addDebugInfo('📋 VERIFICATION RESULTS:');
      addDebugInfo('─────────────────────────────');
      addDebugInfo(`👤 Name: ${nameMatch ? '✅ VERIFIED' : '❌ FAILED'}`);
      addDebugInfo(`🎫 Enrollment: ${enrollmentMatch ? '✅ VERIFIED' : '❌ FAILED'}`);
      addDebugInfo('═══════════════════════════════');
      
      if (nameMatch && enrollmentMatch) {
        addDebugInfo('');
        addDebugInfo('🎉 ✅ VERIFICATION SUCCESSFUL! 🎉');
        addDebugInfo('Redirecting to marketplace...');
        setVerificationStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        addDebugInfo('');
        addDebugInfo('❌ VERIFICATION FAILED');
        if (!nameMatch) addDebugInfo('⚠️  Reason: Name not found or insufficient match');
        if (!enrollmentMatch) addDebugInfo('⚠️  Reason: Enrollment number not found or insufficient match');
        addDebugInfo('');
        addDebugInfo('💡 Tips:');
        addDebugInfo('   • Ensure ID card is clear and well-lit');
        addDebugInfo('   • Check that name/enrollment are typed correctly');
        addDebugInfo('   • Try uploading a higher quality image');
        setVerificationStatus('failed');
      }
      
    } catch (error) {
      console.error("OCR Error:", error);
      addDebugInfo('');
      addDebugInfo('═══════════════════════════════');
      addDebugInfo(`❌ CRITICAL ERROR: ${error.message}`);
      addDebugInfo('═══════════════════════════════');
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
          {ocrProgress > 0 ? `SCANNING... ${ocrProgress}%` : 'PREPARING IMAGE...'}
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
          <Icons.AlertCircle size={16} /> VERIFICATION FAILED. CHECK LOGS & RETRY
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
        
        {/* Left Side */}
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
                  {isProcessing ? `AI SCANNING ${ocrProgress}%` : 'SECURED VERIFICATION ACTIVE'}
                </span>
              </div>
              <p className="text-[10px] text-white/50 mono leading-relaxed">
                SYSTEM ACCESS GRANTED <br/>
                {isProcessing ? 'ANALYZING ID CARD WITH AI...' : 'READY FOR VERIFICATION...'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
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
                  placeholder="0801CS211234" 
                />
                <p className="text-[9px] text-white/40 mono mt-1">Case insensitive • AI will handle OCR errors</p>
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
                      className="max-h-40 mx-auto border border-white/20 shadow-lg"
                    />
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setImagePreview(null);
                      setExtractedText('');
                      setDebugInfo([]);
                    }}
                    className="text-[10px] text-red-400 hover:text-red-300 mono uppercase"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-white">
                    <Icons.UploadCloud />
                  </div>
                  <p className="text-xs font-bold text-white uppercase mono">
                    Upload College ID Card
                  </p>
                  <p className="text-[10px] text-white/40 mt-1 mono">JPG, PNG • MAX 10MB • CLEAR & WELL-LIT</p>
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
              <div className="debug-panel p-4 space-y-2 mt-6">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#00D9FF]/20">
                  <span className="font-bold uppercase text-[#00D9FF]">// AI VERIFICATION LOG</span>
                  <button 
                    onClick={() => {
                      setExtractedText('');
                      setDebugInfo([]);
                    }}
                    className="text-[8px] text-white/40 hover:text-white uppercase tracking-wider px-2 py-1 border border-white/10 hover:border-white/30 transition-colors"
                  >
                    CLEAR
                  </button>
                </div>
                
                <div className="space-y-0.5 max-h-48 overflow-y-auto pr-2">
                  {debugInfo.map((info, i) => (
                    <div 
                      key={i} 
                      className={`text-[9px] leading-relaxed ${
                        info.includes('✅') || info.includes('✓') ? 'text-green-400' :
                        info.includes('❌') || info.includes('✗') ? 'text-red-400' :
                        info.includes('⚠️') ? 'text-yellow-400' :
                        info.includes('═══') ? 'text-[#00D9FF] font-bold' :
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
                    <summary className="cursor-pointer text-[10px] text-[#00D9FF] hover:text-white uppercase tracking-wider">
                      📄 View Raw OCR Text ({extractedText.length} characters)
                    </summary>
                    <div className="mt-3 p-3 bg-black/50 border border-white/5 text-[9px] text-white/60 max-h-32 overflow-y-auto break-all leading-relaxed font-mono">
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
