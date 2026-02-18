import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';

const Sidebar = ({ onNewChat, onOpenHistory, onSaveChat, isOpen, onClose }) => {
    const { user, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Auto-collapse on desktop if screen is small, but on mobile we use isOpen prop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                setIsCollapsed(true);
            } else if (window.innerWidth >= 1024) {
                setIsCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSignOut = async () => {
        await signOut();
    };

    const userEmail = user?.email || 'student@kca.ac.ke';
    const userName = user?.user_metadata?.full_name || 'KCA Student';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const isAdmin = user?.user_metadata?._admin === true;

    const themes = [
        { id: 'light', name: 'Light', icon: '☀️' },
        { id: 'dark', name: 'Dark', icon: '🌙' },
        { id: 'premium', name: 'Premium AI', icon: '✨' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <div className={`${isCollapsed ? 'w-16 md:w-20' : 'w-64'} ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-bg-secondary border-r border-border-primary flex flex-col transition-transform md:transition-all duration-300 h-full fixed md:relative z-40`}>
                {/* Collapse/Expand Toggle (Subtle) */}
                <div className="p-2 flex justify-end">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-md hover:bg-bg-primary transition-colors text-text-secondary hover:text-text-primary"
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="px-3 pb-4">
                    <div
                        className={`flex ${isCollapsed ? 'justify-center' : 'items-center gap-3'} hover:bg-bg-primary p-2 rounded-xl transition-colors cursor-pointer`}
                        onClick={() => setIsProfileOpen(true)}
                    >
                        {user?.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt={userName}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full premium-gradient-bg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {initials}
                            </div>
                        )}
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate">{userName}</p>
                                <p className="text-[10px] text-text-secondary truncate">{userEmail}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Sidebar Content */}
                <div className="px-3 flex-1 overflow-y-auto space-y-6">
                    {!isCollapsed ? (
                        <>
                            {/* Theme Selection */}
                            <div>
                                <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2 px-2">Theme</h3>
                                <div className="space-y-1">
                                    {themes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${theme === t.id
                                                ? 'bg-accent-primary/10 text-accent-primary font-medium'
                                                : 'text-text-primary hover:bg-bg-primary'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{t.icon}</span>
                                                {t.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-2 px-2">Actions</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={onNewChat}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-bg-primary transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        New Chat
                                    </button>
                                    <button
                                        onClick={onOpenHistory}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-bg-primary transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        History
                                    </button>
                                    <button
                                        onClick={onSaveChat}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-bg-primary transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        Save Chat
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => navigate('/admin')}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-bg-primary transition-colors mt-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Admin
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Collapsed Mode */
                        <div className="flex flex-col items-center gap-4">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`p-2 rounded-lg transition-all duration-200 ${theme === t.id ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'}`}
                                    title={t.name}
                                >
                                    <span className="text-lg">{t.icon}</span>
                                </button>
                            ))}
                            <div className="h-px w-8 bg-border-primary"></div>
                            <button onClick={onNewChat} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors" title="New Chat">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                            <button onClick={onOpenHistory} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors" title="History">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </button>
                            <button onClick={onSaveChat} className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors" title="Save Chat">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors"
                                    title="Admin Dashboard"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="p-4 border-t border-border-primary/50">
                    <button
                        onClick={handleSignOut}
                        className={`w-full flex ${isCollapsed ? 'justify-center' : 'items-center gap-3'} px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors`}
                        title="Sign Out"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </div>

            {/* Modals */}
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />
        </>
    );
};

export default Sidebar;
