'use client';

import { useState } from 'react';
import { loginAdmin } from '@/actions/admin-auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await loginAdmin(null, formData);

        if (result) {
            setError(result);
            setLoading(false);
        }
        // Jika null = sukses, next-auth redirect otomatis ke /admin/dashboard
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-uskGreen via-uskGreen/90 to-[#063A1E] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-uskYellow shadow-lg mb-4">
                        <span className="text-2xl font-extrabold text-uskGreen">RA</span>
                    </div>
                    <h1 className="text-xl font-bold text-white">Rumah Amal USK</h1>
                    <p className="text-sm text-white/60 mt-1">Panel Admin</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-base font-bold text-gray-800 mb-6 text-center">Masuk ke Akun Admin</h2>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 flex items-center gap-2">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-uskGreen/40 focus:border-uskGreen"
                                    placeholder="Masukkan Email Admin"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-uskGreen/40 focus:border-uskGreen"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    title={showPassword ? "Sembunyikan password" : "Lihat password"}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-uskYellow hover:bg-uskYellow-hover text-uskGreen font-bold py-2.5 rounded-lg text-sm transition-smooth disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm mt-2"
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-white/40 mt-6">
                    © {new Date().getFullYear()} Rumah Amal Masjid Jamik USK
                </p>
            </div>
        </div>
    );
}