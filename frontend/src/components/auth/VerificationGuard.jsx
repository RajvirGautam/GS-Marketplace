import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import IdVerificationModal from './IdVerificationModal';

const VerificationGuard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && user && !user.isVerified) {
      console.log('🔍 User needs verification:', user.email);
      setShowVerification(true);
    } else {
      setShowVerification(false);
    }
  }, [user, isAuthenticated, loading]);

  return (
    <IdVerificationModal 
      isOpen={showVerification} 
      onClose={() => {
        // Don't allow closing until verified
        console.log('⚠️  Verification required to continue');
      }}
      userEmail={user?.email}
    />
  );
};

export default VerificationGuard;