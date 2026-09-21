import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authAPI, getUser, clearAuthData } from '../../../services/api';
import { MdLogout, MdEdit, MdSave, MdClose, MdLock, MdPhotoCamera } from 'react-icons/md';

const inputClass = 'w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10';

const USER_TYPE_STYLES = {
    gamer: 'from-red-500 via-green-500 to-blue-500',
    working: 'from-black via-green-500 to-violet-600',
    student: 'from-blue-500 via-green-500 to-white',
    enthusiast: 'from-orange-500 via-yellow-400 to-red-500',
};

function Info({ label, value, wide = false }) {
    return <div className={wide ? 'sm:col-span-2' : ''}><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p><p className="wrap-break-word font-semibold text-gray-950">{value || 'Not provided'}</p></div>;
}

function PasswordInput({ label, value, onChange }) {
    return <label className="block text-sm font-medium text-gray-700">{label}<input type="password" value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-1`} placeholder="••••••••" required /></label>;
}

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ firstName: '', lastName: '', contact: '', addresses: '', userType: '', picture: null });
    const [picturePreview, setPicturePreview] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        if (!getUser()) {
            navigate('/');
            return;
        }
        const fetchProfile = async () => {
            try {
                const { data } = await authAPI.getProfile();
                setProfile(data);
                setEditData({ firstName: data.first_name || '', lastName: data.last_name || '', contact: data.contact || '', addresses: data.addresses || '', userType: data.user_type || '', picture: null }); } catch { setError('Failed to load profile.'); } finally { setLoading(false); } }; fetchProfile(); }, [navigate]);

    const profilePicture = picturePreview || profile?.picture;
    const profilePictureUrl = profilePicture ? (profilePicture.startsWith('http') ? profilePicture : `http://localhost:8000${profilePicture}`) : '';

    const handlePictureChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Profile pictures must be 5 MB or smaller.');
            return;
        }
        setError('');
        setEditData((previous) => ({ ...previous, picture: file }));
        setPicturePreview(URL.createObjectURL(file));
    };

    const handleSaveProfile = async () => {
        setSaveLoading(true);
        setError('');
        try {
            const { data } = await authAPI.updateProfile(editData);
            setProfile(data);
            setIsEditing(false);
            setSaveSuccess('Profile updated successfully!');
            const stored = getUser();
            localStorage.setItem('user', JSON.stringify({ ...stored, firstName: editData.firstName, lastName: editData.lastName, userType: editData.userType, contact: data.contact, addresses: data.addresses, picture: data.picture }));
            setPicturePreview('');
            setTimeout(() => setSaveSuccess(''), 3000);
        } catch {
            setError('Failed to update profile.');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();
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
            setPasswordError(err.response?.data?.error || 'Failed to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

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

    const togglePasswordForm = () => {
        setShowPasswordForm((visible) => !visible);
        setPasswordError('');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-500">Loading profile...</p></div></div>;

    const initials = `${profile?.first_name?.charAt(0) || ''}${profile?.last_name?.charAt(0) || ''}` || '?';
    const userTypeKey = (profile?.user_type || 'enthusiast').toLowerCase();
    const userTypeStyle = USER_TYPE_STYLES[userTypeKey] || USER_TYPE_STYLES.enthusiast;

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-orange-50">
            <style>{`@keyframes profile-type-gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
            <header className="bg-gray-950 py-5 px-5 md:px-10 shadow-lg"><div className="max-w-4xl mx-auto flex items-center justify-between gap-4"><button onClick={() => navigate('/')} className="text-gray-300 font-semibold hover:text-orange-400 transition-colors">← Back to Home</button><h1 className="text-white text-lg md:text-xl font-bold">My Profile</h1><button onClick={handleLogout} className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-600 hover:-translate-y-0.5 transition-all text-sm"><MdLogout /> Logout</button></div></header>
            <main className="max-w-4xl mx-auto px-5 md:px-8 py-8 space-y-6">
                {saveSuccess && <div role="status" className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">{saveSuccess}</div>}
                {passwordSuccess && <div role="status" className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">{passwordSuccess}</div>}
                {error && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>}
                <section className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <label onClick={() => setIsEditing(true)} className={`relative h-18 w-18 shrink-0 cursor-pointer rounded-2xl bg-linear-to-r ${userTypeStyle} bg-size-[220%_100%] p-1 text-white shadow-lg transition-all duration-500 animate-[profile-type-gradient_4s_ease_infinite]`}>
                            <input type="file" accept="image/*" onChange={handlePictureChange} className="sr-only" />
                            <span className="relative block h-full w-full overflow-hidden rounded-[0.7rem] bg-orange-500">
                                {profilePictureUrl ? <img src={profilePictureUrl} alt="Profile" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-2xl font-bold">{initials}</span>}
                                <span className="absolute inset-x-0 bottom-0 flex justify-center bg-black/55 py-1"><MdPhotoCamera /></span>
                            </span>
                        </label>
                        <div className="min-w-0">
                            <h2 className="truncate text-xl font-bold text-gray-950">{profile?.first_name} {profile?.last_name}</h2>
                            <p className="truncate text-sm text-gray-500">{profile?.email}</p>
                            <p className={`mt-1 inline-flex bg-linear-to-r ${userTypeStyle} bg-size-[220%_100%] animate-[profile-type-gradient_4s_ease_infinite] rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm`}>{profile?.user_type_display}</p>
                            <p className="mt-1 text-xs text-gray-400">Click the photo to upload a new one</p>
                        </div>
                        <button onClick={() => setIsEditing(!isEditing)} className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-100 sm:ml-auto">
                            {isEditing ? <><MdClose /> Cancel</> : <><MdEdit /> Edit</>}
                        </button>
                    </div>
                    {!isEditing ? <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-sm sm:grid-cols-2"><Info label="First Name" value={profile?.first_name} /><Info label="Last Name" value={profile?.last_name} /><Info label="Email" value={profile?.email} wide /><Info label="User Type" value={profile?.user_type_display} wide /><Info label="Contact Number" value={profile?.contact} wide /><Info label="Address" value={profile?.addresses} wide /></div> : <div className="space-y-4"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">First Name<input type="text" value={editData.firstName} onChange={(event) => setEditData((previous) => ({ ...previous, firstName: event.target.value }))} className={`${inputClass} mt-1`} /></label><label className="text-sm font-medium text-gray-700">Last Name<input type="text" value={editData.lastName} onChange={(event) => setEditData((previous) => ({ ...previous, lastName: event.target.value }))} className={`${inputClass} mt-1`} /></label><label className="text-sm font-medium text-gray-700">Contact Number<input type="tel" value={editData.contact} onChange={(event) => setEditData((previous) => ({ ...previous, contact: event.target.value.replace(/[^0-9+\- ]/g, '') }))} maxLength={15} placeholder="09XXXXXXXXX" className={`${inputClass} mt-1`} /></label><label className="text-sm font-medium text-gray-700 sm:col-span-2">Address<textarea value={editData.addresses} onChange={(event) => setEditData((previous) => ({ ...previous, addresses: event.target.value }))} rows={3} placeholder="House number, street, barangay, city, province" className={`${inputClass} mt-1 h-auto resize-none py-3`} /></label></div><button onClick={handleSaveProfile} disabled={saveLoading} className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-0.5 transition-all disabled:opacity-50"><MdSave />{saveLoading ? 'Saving...' : 'Save Changes'}</button></div>}
                </section>
                <section className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8"><div className="flex items-center justify-between gap-4 mb-4"><div className="flex items-center gap-2"><MdLock className="text-orange-500 text-xl" /><h3 className="text-lg font-bold text-gray-950">Password</h3></div><button onClick={togglePasswordForm} className="text-orange-600 border border-orange-200 bg-orange-50 px-4 py-2.5 rounded-xl hover:bg-orange-100 transition-colors text-sm font-semibold flex items-center gap-2">{showPasswordForm ? <><MdClose /> Cancel</> : <><MdEdit /> Change Password</>}</button></div>{!showPasswordForm ? <p className="text-gray-500 text-sm">••••••••••••</p> : <form onSubmit={handleChangePassword} className="space-y-4">{passwordError && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{passwordError}</div>}<PasswordInput label="Current Password" value={passwordData.oldPassword} onChange={(value) => setPasswordData((previous) => ({ ...previous, oldPassword: value }))} /><PasswordInput label="New Password" value={passwordData.newPassword} onChange={(value) => setPasswordData((previous) => ({ ...previous, newPassword: value }))} /><PasswordInput label="Confirm New Password" value={passwordData.confirmPassword} onChange={(value) => setPasswordData((previous) => ({ ...previous, confirmPassword: value }))} /><button type="submit" disabled={passwordLoading} className="w-full h-12 bg-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-0.5 transition-all disabled:opacity-50">{passwordLoading ? 'Changing...' : 'Change Password'}</button></form>}</section>
            </main>
        </div>
    );
};

export default UserProfile;
