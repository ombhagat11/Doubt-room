import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.put('/auth/updateprofile', formData);
            updateUser(response.data.data);
            setSuccess('Profile updated successfully!');
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-700';
            case 'mentor':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    };

    const getReputationLevel = (reputation) => {
        if (reputation >= 1000) return { level: 'Expert', color: 'text-purple-600' };
        if (reputation >= 500) return { level: 'Advanced', color: 'text-blue-600' };
        if (reputation >= 100) return { level: 'Intermediate', color: 'text-green-600' };
        if (reputation >= 10) return { level: 'Beginner', color: 'text-yellow-600' };
        return { level: 'Newbie', color: 'text-slate-600' };
    };

    const reputationLevel = getReputationLevel(user?.reputation || 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            <div className="container-custom py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
                            My Profile
                        </h1>
                        <p className="text-lg text-slate-600">
                            Manage your account and view your activity
                        </p>
                    </div>

                    {error && (
                        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg mb-6">
                            {success}
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <div className="md:col-span-1">
                            <div className="card p-6 text-center">
                                {/* Avatar */}
                                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>

                                {/* Name */}
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    {user?.name}
                                </h2>

                                {/* Role Badge */}
                                <span className={`badge ${getRoleBadgeColor(user?.role)} mb-4`}>
                                    {user?.role?.toUpperCase()}
                                </span>

                                {/* Reputation */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-3xl font-bold text-slate-900">
                                            {user?.reputation || 0}
                                        </span>
                                    </div>
                                    <div className={`text-sm font-medium ${reputationLevel.color}`}>
                                        {reputationLevel.level}
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className="btn btn-outline w-full"
                                >
                                    {editing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Edit Form */}
                            {editing ? (
                                <div className="card p-6">
                                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                        Edit Profile
                                    </h3>
                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="input"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                className="input"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditing(false);
                                                    setFormData({ name: user?.name || '', email: user?.email || '' });
                                                }}
                                                className="btn btn-ghost flex-1"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn btn-primary flex-1"
                                            >
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    {/* Statistics */}
                                    <div className="card p-6">
                                        <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                            Activity Statistics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-primary-50 rounded-lg p-4">
                                                <div className="text-3xl font-bold text-primary-600 mb-1">
                                                    {user?.questionsAsked || 0}
                                                </div>
                                                <div className="text-sm text-slate-600">Questions Asked</div>
                                            </div>

                                            <div className="bg-success-50 rounded-lg p-4">
                                                <div className="text-3xl font-bold text-success-600 mb-1">
                                                    {user?.questionsResolved || 0}
                                                </div>
                                                <div className="text-sm text-slate-600">Questions Resolved</div>
                                            </div>

                                            <div className="bg-secondary-50 rounded-lg p-4">
                                                <div className="text-3xl font-bold text-secondary-600 mb-1">
                                                    {user?.answersGiven || 0}
                                                </div>
                                                <div className="text-sm text-slate-600">Answers Given</div>
                                            </div>

                                            <div className="bg-yellow-50 rounded-lg p-4">
                                                <div className="text-3xl font-bold text-yellow-600 mb-1">
                                                    {user?.reputation || 0}
                                                </div>
                                                <div className="text-sm text-slate-600">Total Reputation</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Info */}
                                    <div className="card p-6">
                                        <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                            Account Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-600">Name</label>
                                                <div className="text-lg text-slate-900">{user?.name}</div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-slate-600">Email</label>
                                                <div className="text-lg text-slate-900">{user?.email}</div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-slate-600">Role</label>
                                                <div className="text-lg text-slate-900 capitalize">{user?.role}</div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-slate-600">Member Since</label>
                                                <div className="text-lg text-slate-900">
                                                    {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Achievements */}
                                    <div className="card p-6">
                                        <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                            Achievements
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {user?.questionsAsked >= 10 && (
                                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">Curious Mind</div>
                                                        <div className="text-xs text-slate-600">Asked 10+ questions</div>
                                                    </div>
                                                </div>
                                            )}

                                            {user?.answersGiven >= 5 && (
                                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">Helpful</div>
                                                        <div className="text-xs text-slate-600">Gave 5+ answers</div>
                                                    </div>
                                                </div>
                                            )}

                                            {user?.questionsResolved >= 5 && (
                                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">Problem Solver</div>
                                                        <div className="text-xs text-slate-600">Resolved 5+ questions</div>
                                                    </div>
                                                </div>
                                            )}

                                            {user?.reputation >= 100 && (
                                                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                                    <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">Rising Star</div>
                                                        <div className="text-xs text-slate-600">Earned 100+ reputation</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {user?.questionsAsked < 10 && user?.answersGiven < 5 && user?.questionsResolved < 5 && user?.reputation < 100 && (
                                            <div className="text-center py-8 text-slate-600">
                                                <p>Start participating to earn achievements!</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
