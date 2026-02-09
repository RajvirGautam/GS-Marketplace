import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js'; 
import Icons from '../../assets/icons/Icons';
import NeonButton from '../ui/NeonButton';
// --- IMPORT THE IMAGE ---
import LoginGraphic from './LoginGraphic.png';

// --- Styles for the Modal Animation ---
const modalStyles = `
  @keyframes modal-pop {
    0% { opacity: 0; transform: scale(0.95) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes scan-line {
    0% { top: 0%; }
    50% { top: 100%; }
    100% { top: 0%; }
  }
  /* Added a gentle float for the graphic */
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-modal-pop { animation: modal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-scan-line { animation: scan-line 3s linear infinite; }
  .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
`;

const ConnectIdModal = ({ isOpen, onClose, isDark }) => {
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

  // --- SMART NORMALIZATION ENGINE ---
  const normalizeText = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[ilI|]/g, '1')
        .replace(/[oO]/g, '0')
        .replace(/[zZ]/g, '2');
  };

  // --- OCR VERIFICATION LOGIC ---
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
        console.log("%c=== RAW OCR DATA ===", "color: cyan; font-weight: bold;");
        console.log(text);
        
        const scannedClean = normalizeText(text);
        const enrollmentClean = normalizeText(enrollment);
        const nameParts = fullName.toLowerCase().trim().split(/\s+/);
        const scannedLower = text.toLowerCase(); 

        const nameMatch = nameParts.every(part => scannedLower.includes(part));
        const enrollmentMatch = scannedClean.includes(enrollmentClean);

        console.log("%c=== VERIFICATION DEBUG ===", "color: yellow; font-weight: bold;");
        console.log(`User Enrollment (Clean): ${enrollmentClean} -> Matched? ${enrollmentMatch}`);
        console.log(`Name Matched? ${nameMatch}`);

        if (nameMatch && enrollmentMatch) {
            setVerificationStatus('success');
            setTimeout(() => {
                alert("Login Successful! Welcome to the Marketplace.");
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

  // --- Helper to render button text/state ---
  const getButtonContent = () => {
    if (isProcessing) {
        return (
            <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning ID Card...
            </span>
        );
    }
    if (verificationStatus === 'success') {
        return (
            <span className="flex items-center gap-2 text-emerald-200">
                <Icons.CheckCircle /> Verified! Redirecting...
            </span>
        );
    }
    if (verificationStatus === 'failed') {
        return (
            <span className="flex items-center gap-2 text-red-200">
                <Icons.AlertCircle size={18} /> Verification Failed. Try Again.
            </span>
        );
    }
    return "Submit for Verification";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <style>{modalStyles}</style>
      
      <div 
        className="absolute inset-0 bg-indigo-950/60 dark:bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white/80 dark:bg-slate-900/90 border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-modal-pop backdrop-blur-xl">
        
        {/* Left Side: Aesthetic / USP Highlight */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden p-8 flex flex-col justify-between text-white">
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Top content */}
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
              <Icons.ShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <h2 className="text-3xl font-black leading-tight mb-2">Secure Campus Network</h2>
            <p className="text-indigo-200 text-sm font-medium">
              Join the exclusive marketplace for SGSITS. 
              Verified students only. No dalle.
            </p>
          </div>

          {/* --- CENTERED IMAGE SECTION --- */}
          {/* flex-1 ensures it takes up available vertical space, centering the image */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-6">
             <img 
                src={LoginGraphic} 
                alt="Security Graphic" 
                // Adjusted size for square image, added drop shadow and gentle float animation
                className="w-full max-w-[240px] h-auto object-contain drop-shadow-xl animate-float-slow opacity-90"
             />
          </div>
          {/* ------------------------------ */}

          {/* Bottom content */}
          <div className="relative z-10">
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-cyan-300">SECURED VERIFICATION ACTIVE</span>
              </div>
              <p className="text-xs text-indigo-100/80">
                Our system uses granted access to institute's database to verify your ID card instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: The Form (Unchanged) */}
        <div className="w-full md:w-3/5 p-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 z-20"
          >
            <Icons.X size={20} />
          </button>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-indigo-950 dark:text-white">Connect ID</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Verify your identity to start trading.</p>
          </div>

          {/* Google Toggle Section */}
          <div className="mb-6 relative z-10">
             <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${activeTab === 'google' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('google')}>
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                        <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200">Quick Connect with Google</span>
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ${activeTab === 'google' ? 'max-h-32 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="your.name@sgsits.ac.in"
                            value={googleEmail}
                            onChange={(e) => setGoogleEmail(e.target.value)}
                            className="flex-1 bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:text-white"
                        />
                        <button 
                          onClick={handleGoogleLogin}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            Verify
                        </button>
                    </div>
                    {googleError && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><Icons.AlertCircle size={12}/> {googleError}</p>}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Or Manual Upload</span>
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
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
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Full Name</label>
                    <input 
                        type="text" 
                        disabled={activeTab === 'google'} 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-indigo-500/50 outline-none dark:text-white transition-colors" 
                        placeholder="Rajvir Gautam" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Enrollment No.</label>
                    <input 
                        type="text" 
                        disabled={activeTab === 'google'} 
                        value={enrollment}
                        onChange={(e) => setEnrollment(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-indigo-500/50 outline-none dark:text-white transition-colors" 
                        placeholder="0801..." 
                    />
                </div>
             </div>

             <div 
                className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors
                ${dragActive ? 'border-cyan-500 bg-cyan-50/10' : 'border-gray-300 dark:border-gray-700'}
                ${activeTab === 'manual' ? 'hover:border-indigo-400 cursor-pointer' : ''}`}
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
                    <div className="flex items-center gap-3 text-emerald-500 font-bold">
                        <Icons.CheckCircle />
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-400 font-normal">(Ready for OCR)</span>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-3 text-indigo-500">
                            <Icons.UploadCloud />
                        </div>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            Upload College ID Card
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Drag & drop or click to browse</p>
                    </>
                )}
                
                {dragActive && activeTab === 'manual' && <div className="absolute left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-scan-line pointer-events-none"></div>}
             </div>

             <NeonButton 
                primary={verificationStatus !== 'failed'} // Use primary style unless failed
                className={`w-full justify-center py-4 mt-4 ${verificationStatus === 'failed' ? 'bg-red-900/20 border-red-500 text-red-400 hover:border-red-400' : ''}`}
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