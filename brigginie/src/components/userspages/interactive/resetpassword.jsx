import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { authAPI } from '../../../services/api';
import logo from '../../../assets/logo.png';

function ResetPassword() {
  const navigate = useNavigate();
  const { usid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!usid || !token) {
      setError('This reset link is incomplete. Please request a new one.');
      return;
    }
    if (newPassword.length < 9) {
      setError('Password must be at least 9 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({ usid, token, newPassword });
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.token?.[0] ||
        data?.new_password?.[0] ||
        data?.detail ||
        data?.message ||
        'This reset link is invalid or expired. Please request a new one.'
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
          <h2 className="text-2xl font-bold text-white">Reset Your Password</h2>
          <p className="text-orange-100 mt-1 text-sm">Choose a new password for your account.</p>
        </div>

        {success ? (
          <div className="px-8 py-8 space-y-5">
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <MdCheckCircle className="shrink-0" />
              <span>Your password has been reset successfully.</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Continue to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <MdError className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 9 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Confirm your new password"
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
              ) : 'Reset Password'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Need a new link?{' '}
              <Link to="/ForgotPassword" className="text-orange-600 hover:text-orange-700 font-bold">
                Request reset link
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
