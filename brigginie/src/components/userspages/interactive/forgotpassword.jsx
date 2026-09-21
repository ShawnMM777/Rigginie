import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { authAPI } from '../../../services/api';
import { MdCheckCircle, MdError } from 'react-icons/md';
import logo from '../../../assets/logo.png';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotpassword(email.trim());
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.message ||
        data?.detail ||
        data?.email?.[0] ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-orange-500 px-8 py-6 text-center">
          <button onClick={() => navigate('/')} className="inline-block mb-3">
            <img src={logo} alt="Rigginie PH" className="h-10 mx-auto" />
          </button>
          <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
          <p className="text-orange-100 mt-1 text-sm">
            No worries — we’ll email you a reset link.
          </p>
        </div>

        {success ? (
          <div className="px-8 py-8 space-y-5">
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <MdCheckCircle className="shrink-0" />
              <span>Reset link sent to {email}</span>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Check your inbox and follow the link to reset your password.
            </p>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequestCode} className="px-8 py-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <MdError className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Send Reset Link'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Remembered your password?{' '}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-bold">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
