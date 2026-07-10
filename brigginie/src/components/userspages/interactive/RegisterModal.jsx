import { useState } from 'react';
import { authAPI, storeAuthData } from '../../../services/api';
import EmailVerificationModal from './emailverificatrion';
import { MdError } from 'react-icons/md';

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError]                       = useState('');
    const [loading, setLoading]                   = useState(false);
    const [isVerificationOpen, setIsVerificationOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await authAPI.register({
                firstName: formData.firstName,
                lastName:  formData.lastName,
                email:     formData.email,
                password:  formData.password,
            });
            setIsVerificationOpen(true);
        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data?.email?.[0]
                || 'Registration failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSuccess = (data) => {
        storeAuthData(data.access, data.user, data.refresh);
        setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
        setIsVerificationOpen(false);
        onClose();
        setTimeout(() => window.location.reload(), 500);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Register</h2>
                        <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">✕</button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-3">
                            <MdError className="text-xl flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    placeholder="John" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    placeholder="Doe" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                placeholder="your@email.com" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                placeholder="••••••••" required />
                            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                placeholder="••••••••" required />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-4">
                        Already have an account?{' '}
                        <button onClick={() => { onClose(); onSwitchToLogin(); }}
                            className="text-orange-500 font-semibold hover:underline">
                            Login here
                        </button>
                    </p>
                </div>
            </div>

            <EmailVerificationModal
                isOpen={isVerificationOpen}
                onClose={() => { setIsVerificationOpen(false); onClose(); }}
                email={formData.email}
                onVerificationSuccess={handleVerificationSuccess}
            />
        </>
    );
}

export default RegisterModal;