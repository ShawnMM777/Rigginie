import { useState } from 'react';
import { authAPI } from '../../../services/api';
import { MdCheckCircle, MdError } from 'react-icons/md';

function EmailVerificationModal({ isOpen, onClose, email, onVerificationSuccess }) {
    const [code, setCode]                   = useState(['', '', '', '', '', '']);
    const [error, setError]                 = useState('');
    const [loading, setLoading]             = useState(false);
    const [success, setSuccess]             = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) document.getElementById(`code-${index + 1}`)?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0)
            document.getElementById(`code-${index - 1}`)?.focus();
    };

    const handleVerifyEmail = async (e) => { e.preventDefault(); const fullCode = code.join('');
    if (fullCode.length !== 6) { setError('Please enter all 6 digits'); return; }
    setError('');
    setLoading(true);
    try { const response = await authAPI.verifyEmail({ email, code: fullCode });
        setSuccess(true);
        setTimeout(() => {
            onVerificationSuccess({ access:  response.data.access,  refresh: response.data.refresh, user:    response.data.user, });
            onClose();
        }, 1500); // wait 1.5s so user sees "Email verified successfully!"

        } catch (err) {
        const msg = err.response?.data?.message || 'Verification failed';
        setError(msg);
        setCode(['', '', '', '', '', '']);
        } finally {
        setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendLoading(true);
        setError('');
        try {
            await authAPI.resendVerificationCode({ email });
            setCode(['', '', '', '', '', '']);
            setResendCooldown(60);
            const interval = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) { clearInterval(interval); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code');
        } finally {
            setResendLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                    <p className="text-gray-600 text-sm">
                        We sent a verification code to<br />
                        <span className="font-semibold text-gray-800">{email}</span>
                    </p>
                </div>

                {success && (
                    <div className="bg-green-50 border border-green-400 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <MdCheckCircle className="text-green-600 text-2xl" />
                        <p className="text-green-700 font-medium">Email verified successfully!</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-400 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <MdError className="text-red-600 text-2xl" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleVerifyEmail} className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Enter 6-Digit Code</label>
                        <div className="flex justify-between gap-2">
                            {code.map((digit, index) => (
                                <input key={index} id={`code-${index}`}
                                    type="text" inputMode="numeric" maxLength="1" value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="0" disabled={success} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 text-center">⏱️ Code expires in 15 minutes</p>
                    </div>

                    <button type="submit"
                        disabled={loading || success || code.join('').length !== 6}
                        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Verifying...' : success ? 'Verified!' : 'Verify Email'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center mb-3">Didn't receive the code?</p>
                    <button onClick={handleResendCode}
                        disabled={resendLoading || resendCooldown > 0}
                        className="w-full px-4 py-2 text-orange-600 font-semibold hover:bg-orange-50 rounded-lg transition-colors disabled:text-gray-400 disabled:cursor-not-allowed">
                        {resendCooldown > 0
                            ? `Resend Code in ${resendCooldown}s`
                            : resendLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmailVerificationModal;