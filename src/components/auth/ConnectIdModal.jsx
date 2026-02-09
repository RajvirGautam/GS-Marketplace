import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js'; 
import Icons from '../../assets/icons/Icons';
import NeonButton from '../ui/NeonButton';
// --- IMPORT THE IMAGE ---
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
  /* Keeping the requested floating animation */
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-modal-pop { animation: modal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-scan-line { animation: scan-line 3s linear infinite; }
  .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }

  /* Brutalist Specifics */
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
`;

const ConnectIdModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [dragActive, setDragActive] = useState(false);
  
  // Form Data States
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [enrollment, setEnrollment] = useState('');
  
  // Google States
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleError, setGoogleError] = useState('');

  // Verification Logic States
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle', 'success', 'failed'

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
        setActiveTab('manual');
        setFile(null);
        setFullName('');
        setEnrollment('');
        setGoogleEmail('');
        setGoogleError('');
        setDragActive(false);
        setIsProcessing(false);
        setVerificationStatus('idle');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

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
      setFile(e.dataTransfer.files[0]);
      setVerificationStatus('idle'); 
    }
  };

  const handleGoogleLogin = () => {
    if (!googleEmail.endsWith('@sgsits.ac.in')) {
      setGoogleError('Access Denied. Official @sgsits.ac.in mail required.');
      return;
    }
    setGoogleError('');
    alert(`Redirecting to Google OAuth for ${googleEmail}...`);
  };

  const normalizeText = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[ilI|]/g, '1')
        .replace(/[oO]/g, '0')
        .replace(/[zZ]/g, '2');
  };

  const handleVerification = async () => {
    if (!file || !fullName || !enrollment) {
        alert("Please fill in all fields and upload an ID card.");
        return;
    }
    setIsProcessing(true);
    setVerificationStatus('idle');
    try {
        console.log("--- STARTING OCR PROCESS ---");
        const { data: { text } } = await Tesseract.recognize(
            file, 'eng',
            { logger: m => console.log(`[OCR Progress]: ${Math.round(m.progress * 100)}% - ${m.status}`) } 
        );
        
        const scannedClean = normalizeText(text);
        const enrollmentClean = normalizeText(enrollment);
        const nameParts = fullName.toLowerCase().trim().split(/\s+/);
        const scannedLower = text.toLowerCase(); 

        const nameMatch = nameParts.every(part => scannedLower.includes(part));
        const enrollmentMatch = scannedClean.includes(enrollmentClean);

        if (nameMatch && enrollmentMatch) {
            setVerificationStatus('success');
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            console.warn("Verification Failed.");
            setVerificationStatus('failed');
        }
    } catch (error) {
        console.error("OCR Error:", error);
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
                SCANNING ID CARD...
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

      <div className="relative w-full max-w-4xl bg-[#050505] border border-white/20 shadow-2xl flex flex-col md:flex-row animate-modal-pop overflow-hidden">
        
        {/* Left Side: Aesthetic / USP Highlight - Now Brutalist */}
        <div className="w-full md:w-2/5 bg-zinc-900 border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden p-8 flex flex-col justify-between text-white">
          
          {/* Background Grid Pattern instead of Blobs */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Top content */}
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

          {/* --- CENTERED IMAGE SECTION (Animation Preserved) --- */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-6">
             <img 
                src={LoginGraphic} 
                alt="Security Graphic" 
className="w-full max-w-[240px] h-auto object-contain drop-shadow-xl animate-float-slow opacity-90 transition-all duration-500"             />
          </div>
          {/* ------------------------------ */}

          {/* Bottom content */}
          <div className="relative z-10">
            <div className="bg-black border border-white/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-[#00D9FF] animate-pulse"></div>
                <span className="text-[10px] font-bold mono text-[#00D9FF] uppercase tracking-wider">SECURED VERIFICATION ACTIVE</span>
              </div>
              <p className="text-[10px] text-white/50 mono leading-relaxed">
                > SYSTEM ACCESS GRANTED <br/>
                > VERIFYING ID CARD VIA INSTITUTE DATABASE...
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: The Form - Brutalist Inputs */}
        <div className="w-full md:w-3/5 p-8 relative bg-[#0A0A0A]">
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
                         {/* Google Icon */}
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
                          className="bg-[#00D9FF] hover:bg-white text-black px-4 py-2 text-xs font-bold uppercase transition-colors mono">
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
             
             {/* Wake Up Layer */}
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
                        placeholder="0801..." 
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
                <input type="file" disabled={activeTab === 'google'} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                    setFile(e.target.files[0]);
                    setVerificationStatus('idle'); // Reset status on new file
                }} />
                
                {file ? (
                    <div className="flex items-center gap-3 text-green-500 font-bold">
                        <Icons.CheckCircle />
                        <span className="mono text-xs uppercase">{file.name}</span>
                        <span className="text-[10px] text-white/40 font-normal mono">(READY_FOR_OCR)</span>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-white">
                            <Icons.UploadCloud />
                        </div>
                        <p className="text-xs font-bold text-white uppercase mono">
                            Upload College ID Card
                        </p>
                        <p className="text-[10px] text-white/40 mt-1 mono">DRAG & DROP OR CLICK TO BROWSE</p>
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConnectIdModal;