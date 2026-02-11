import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      setTimeout(() => {
        navigate('/?error=google_auth_failed');
      }, 2000);
      return;
    }

    if (accessToken && refreshToken) {
      // Save tokens
      Cookies.set('accessToken', accessToken, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });

      console.log('✅ Google OAuth successful! Tokens saved.');

      // Redirect to marketplace
      setTimeout(() => {
        navigate('/marketplace');
      }, 1000);
    } else {
      // No tokens found
      console.error('No tokens received from OAuth callback');
      setTimeout(() => {
        navigate('/?error=auth_failed');
      }, 2000);
    }
  }, [searchParams, navigate]);

  const hasError = searchParams.get('error');

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center max-w-md px-6">
        {!hasError ? (
          <>
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2 font-mono">
              Setting Up Your Account
            </h2>
            <p className="text-sm text-white/60 font-mono">
              Please wait while we complete your authentication...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2 font-mono text-red-500">
              Authentication Failed
            </h2>
            <p className="text-sm text-white/60 font-mono mb-4">
              Something went wrong. Redirecting you back...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
