import React, { useState } from 'react';
import Icons from '../../assets/icons/Icons';
import NeonButton from '../ui/NeonButton';
import GlassCard from '../ui/GlassCard';

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [enrollment, setEnrollment] = useState('');
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdCard(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleGoogleLogin = () => {
    alert('Google Login coming soon – restricted to @sgsits.ac.in');
  };

  const handleSubmit = () => {
    console.log({ enrollment, name, idCard });
    alert('Verification submitted! (Backend pending)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-4">
        <GlassCard className="p-10 !bg-white/95 dark:!bg-slate-900/95 !border-white/50 shadow-2xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-indigo-600 dark:text-cyan-400 hover:scale-110 transition-transform z-10"
          >
            <Icons.X className="w-8 h-8" />
          </button>

          <div className="flex justify-center gap-4 mb-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-12 h-1 rounded-full transition-all duration-500 ${
                  i <= step
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600'
                    : 'bg-white/30 dark:bg-slate-700/50'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-primary mb-4">
              {step === 1 && 'Enter Enrollment No.'}
              {step === 2 && 'Your Name'}
              {step === 3 && 'Upload College ID'}
            </h2>
            <p className="text-secondary text-lg">
              {step === 1 && 'Only SGSITS students allowed – we verify everything.'}
              {step === 2 && 'As mentioned on your college ID card.'}
              {step === 3 && 'We use OCR to auto-verify your details securely.'}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <input
                type="text"
                placeholder="e.g., 0801CS211D01"
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                className="w-full px-6 py-5 text-xl font-bold text-center rounded-2xl bg-white/50 dark:bg-slate-800/70 border border-indigo-200 dark:border-slate-600 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
              />
              <NeonButton primary className="w-full !py-5 !text-xl" onClick={() => setStep(2)} disabled={!enrollment.trim()}>
                Continue <Icons.ChevronRight className="ml-2" />
              </NeonButton>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Full name (as on ID)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-5 text-xl font-bold text-center rounded-2xl bg-white/50 dark:bg-slate-800/70 border border-indigo-200 dark:border-slate-600 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
              />
              <div className="flex gap-4">
                <NeonButton onClick={() => setStep(1)} className="flex-1 !py-4">Back</NeonButton>
                <NeonButton primary className="flex-1 !py-4" onClick={() => setStep(3)} disabled={!name.trim()}>
                  Next <Icons.ChevronRight className="ml-2" />
                </NeonButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="id-upload" />
                <label
                  htmlFor="id-upload"
                  className="block w-full h-64 border-4 border-dashed border-indigo-300/50 dark:border-cyan-600/50 rounded-3xl cursor-pointer hover:border-cyan-500 transition-all flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 dark:from-slate-800/50 dark:to-violet-900/20"
                >
                  {preview ? (
                    <img src={preview} alt="ID Preview" className="w-full h-full object-contain rounded-2xl" />
                  ) : (
                    <>
                      <Icons.Upload className="w-16 h-16 text-cyan-600 dark:text-cyan-400" />
                      <p className="text-xl font-bold text-primary">Click to upload ID card</p>
                      <p className="text-sm text-secondary">Front side clearly visible</p>
                    </>
                  )}
                </label>
              </div>

              <div className="flex gap-4">
                <NeonButton onClick={() => setStep(2)} className="flex-1 !py-4">Back</NeonButton>
                <NeonButton primary className="flex-1 !py-4" onClick={handleSubmit} disabled={!idCard}>
                  Verify & Connect
                </NeonButton>
              </div>
            </div>
          )}

          {(step === 1 || step === 2) && (
            <>
              <div className="my-10 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white/95 dark:bg-slate-900/95 text-secondary font-bold">OR</span>
                </div>
              </div>

              <NeonButton
                onClick={handleGoogleLogin}
                className="w-full !py-5 !bg-white !text-indigo-900 dark:!bg-slate-800 dark:!text-white !border-2 !border-indigo-300 dark:!border-cyan-600 hover:!scale-105 transition-transform flex items-center justify-center gap-4 !font-bold"
              >
                <Icons.Google className="w-8 h-8" />
                Continue with Google (@sgsits.ac.in only)
              </NeonButton>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default AuthModal;