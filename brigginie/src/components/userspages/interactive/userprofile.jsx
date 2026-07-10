import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, getUser, clearAuthData } from '../../../services/api';
import { FaUser } from 'react-icons/fa';
import { MdLogout, MdEdit, MdSave, MdClose, MdLock } from 'react-icons/md';

const UserProfile = () => {
    const navigate = useNavigate();

    // Profile state
    const [profile, setProfile]     = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');

    // Edit profile state
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData]   = useState({ firstName: '', lastName: '' });
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState('');

    // Change password state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '', newPassword: '', confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError]     = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Fetch profile on mount
    useEffect(() => {
        const localUser = getUser();
        if (!localUser) {
            navigate('/');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await authAPI.getProfile();
                const data = response.data;
                setProfile(data);
                setEditData({
                    firstName: data.first_name,
                    lastName:  data.last_name,
                });
            } catch (err) {
                // If 401, getUser will be cleared by the axios interceptor
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Save profile changes
    const handleSaveProfile = async () => {
        setSaveLoading(true);
        setSaveSuccess('');
        setError('');
        try {
            const response = await authAPI.updateProfile(editData);
            setProfile(response.data);
            setSaveSuccess('Profile updated successfully!');
            setIsEditing(false);

            // Update localStorage too
            const stored = getUser();
            localStorage.setItem('user', JSON.stringify({
                ...stored,
                firstName: editData.firstName,
                lastName:  editData.lastName,
            }));

            setTimeout(() => setSaveSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update profile.');
        } finally {
            setSaveLoading(false);
        }
    };

    // Change password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            return;
        }

        setPasswordLoading(true);
        try {
            await authAPI.changePassword(passwordData);
            setPasswordSuccess('Password changed successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
            setTimeout(() => setPasswordSuccess(''), 3000);
        } catch (err) {
            setPasswordError(
                err.response?.data?.error || 'Failed to change password.'
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            clearAuthData();
            navigate('/');
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            </div>
        );
    }

    const initials = profile
        ? `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`
        : '?';

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-orange-500 py-6 px-6 md:px-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="text-white font-semibold hover:text-orange-200 transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <h1 className="text-white text-xl font-bold">My Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white text-orange-500 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm"
                    >
                        <MdLogout /> Logout
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

                {/* Success / error banners */}
                {saveSuccess && (
                    <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                        ✅ {saveSuccess}
                    </div>
                )}
                {passwordSuccess && (
                    <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                        ✅ {passwordSuccess}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                        ❌ {error}
                    </div>
                )}

                {/* Profile card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {initials || <FaUser />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {profile?.first_name} {profile?.last_name}
                            </h2>
                            <p className="text-gray-500 text-sm">{profile?.email}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="ml-auto flex items-center gap-2 text-orange-500 border border-orange-500 px-4 py-2 rounded hover:bg-orange-50 transition-colors text-sm font-semibold"
                        >
                            {isEditing ? <><MdClose /> Cancel</> : <><MdEdit /> Edit</>}
                        </button>
                    </div>

                    {/* View mode */}
                    {!isEditing ? (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400 font-medium mb-1">First Name</p>
                                <p className="text-gray-800 font-semibold">{profile?.first_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 font-medium mb-1">Last Name</p>
                                <p className="text-gray-800 font-semibold">{profile?.last_name}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-400 font-medium mb-1">Email</p>
                                <p className="text-gray-800 font-semibold">{profile?.email}</p>
                            </div>
                            {profile?.contact && (
                                <div className="col-span-2">
                                    <p className="text-gray-400 font-medium mb-1">Contact</p>
                                    <p className="text-gray-800 font-semibold">{profile.contact}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Edit mode */
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={editData.firstName}
                                        onChange={(e) => setEditData(p => ({ ...p, firstName: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={editData.lastName}
                                        onChange={(e) => setEditData(p => ({ ...p, lastName: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saveLoading}
                                className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                <MdSave />
                                {saveLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Change password card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <MdLock className="text-orange-500 text-xl" />
                            <h3 className="text-lg font-bold text-gray-800">Password</h3>
                        </div>
                        <button
                            onClick={() => {
                                setShowPasswordForm(!showPasswordForm);
                                setPasswordError('');
                                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                            }}
                            className="text-orange-500 border border-orange-500 px-4 py-2 rounded hover:bg-orange-50 transition-colors text-sm font-semibold flex items-center gap-2"
                        >
                            {showPasswordForm ? <><MdClose /> Cancel</> : <><MdEdit /> Change Password</>}
                        </button>
                    </div>

                    {!showPasswordForm ? (
                        <p className="text-gray-500 text-sm">••••••••••••</p>
                    ) : (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            {passwordError && (
                                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                                    ❌ {passwordError}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData(p => ({ ...p, oldPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {passwordLoading ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UserProfile;

