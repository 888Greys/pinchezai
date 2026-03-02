import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Settings from './Settings';
import kcaLogo from '../assets/kca-logo.png';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const { theme } = useTheme();
    const { updatePassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error } = await updatePassword(password);
            if (error) throw error;

            setSuccess('Password updated successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/auth');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isPremium = theme === 'premium';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary relative overflow-hidden">
            {/* Background Radial Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-0 opacity-20 bg-radial-glow`} />

            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 p-4 md:p-8 flex items-center justify-between z-20 pointer-events-none">
                <div
                    className="flex items-center gap-2 cursor-pointer pointer-events-auto"
                    onClick={() => navigate('/')}
                >
                    <img src={kcaLogo} alt="KCA University Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-full border-2 border-border-primary" />
                    <span className={`text-lg md:text-xl font-bold tracking-tight ${isPremium ? 'premium-gradient-text' : ''}`}>
                        KCA Connect AI
                    </span>
                </div>
            </div>

            <div className={`max-w-md w-full bg-bg-secondary/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-border-primary z-10 relative animate-fadeIn ${isPremium ? 'premium-glow' : ''}`}>
                <div className="text-center mb-8">
                    <h2 className={`text-4xl font-extrabold mb-2 ${isPremium ? 'premium-gradient-text' : ''}`}>
                        Set New Password
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Enter a secure new password for your account
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-xs font-semibold text-center italic">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-2xl text-green-500 text-xs font-semibold text-center italic">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 rounded-2xl border border-border-primary bg-bg-primary/50 text-text-primary focus:outline-none focus:border-accent-primary transition-all backdrop-blur-sm pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-4 rounded-2xl border border-border-primary bg-bg-primary/50 text-text-primary focus:outline-none focus:border-accent-primary transition-all backdrop-blur-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl hover:shadow-2xl transform transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 ${isPremium ? 'premium-gradient-bg' : 'bg-blue-600'
                            } ${loading || success ? 'opacity-70 cursor-not-allowed scale-[0.98]' : ''}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/auth')}
                        className="w-full text-xs font-bold text-text-secondary hover:text-text-primary uppercase tracking-widest mt-4"
                    >
                        Back to Login
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border-primary text-center">
                    <div className="flex items-center justify-center gap-4">
                        <Settings />
                        <span className="text-xs text-text-secondary opacity-50">Theme Settings</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
