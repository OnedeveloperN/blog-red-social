'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2"
                >
                    <span className="text-xl md:text-2xl">🌐</span> SocialBlog
                </Link>

                {/* Sección de Usuario / Auth */}
                <nav className="flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            {/* Botón de usuario (clic para abrir/cerrar menú) */}
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-cyan-400 font-medium px-3 py-1.5 rounded-xl border border-slate-700 transition text-sm"
                            >
                                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span>@{user.username}</span>
                                <span className="text-xs text-slate-400">▾</span>
                            </button>

                            {/* Menú Dropdown para Cerrar Sesión */}
                            {showMenu && (
                                <>
                                    {/* Backdrop transparente para cerrar al hacer clic afuera */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />

                                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-20">
                                        <div className="px-4 py-2 border-b border-slate-800/60">
                                            <p className="text-xs text-slate-400">Sesión iniciada como</p>
                                            <p className="text-sm font-semibold text-slate-200 truncate">
                                                {user.email}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setShowMenu(false);
                                                logout();
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 font-medium"
                                        >
                                            <span>🚪</span> Cerrar sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-xs md:text-sm px-3 py-1.5 text-slate-300 hover:text-white transition"
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/register"
                                className="text-xs md:text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition shadow-lg shadow-cyan-950/50"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}