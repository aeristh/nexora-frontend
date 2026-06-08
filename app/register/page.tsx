"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: "success" | "danger" | "warning" } | null>(null)

    const showToast = (message: string, type: "success" | "danger" | "warning", onDone?: () => void) => {
        setToast({ message, type })
        setTimeout(() => {
            setToast(null)
            onDone?.()
        }, 2000)
    }

    const handleRegister = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
            })
            const data = await res.json()

            if (!res.ok) {
                showToast(data.errors?.[0]?.message || "Registrasi gagal, coba lagi.", "danger")
                return
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            showToast("Akun berhasil dibuat! Mengalihkan ke dashboard...", "success", () => router.push("/dashboard"))
        } catch {
            showToast("Tidak dapat terhubung ke server. Coba lagi.", "danger")
        } finally {
            setLoading(false)
        }
    }

    const toastBg: Record<string, string> = {
        success: "#16a34a",
        danger: "#dc2626",
        warning: "#d97706",
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .auth-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #FAF7F2 0%, #FFF4E0 40%, #FDDFA0 75%, #F5A623 100%);
                    position: relative;
                    overflow: hidden;
                    padding: 24px;
                }

                .auth-root::before {
                    content: '';
                    position: absolute;
                    top: -120px;
                    right: -120px;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(245,166,35,0.3) 0%, transparent 70%);
                    border-radius: 50%;
                }

                .auth-root::after {
                    content: '';
                    position: absolute;
                    bottom: -100px;
                    left: -80px;
                    width: 350px;
                    height: 350px;
                    background: radial-gradient(circle, rgba(253,223,160,0.5) 0%, transparent 70%);
                    border-radius: 50%;
                }

                .auth-card {
                    position: relative;
                    z-index: 1;
                    background: rgba(255, 255, 255, 0.88);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.9);
                    border-radius: 24px;
                    padding: 36px 36px 32px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 8px 40px rgba(234, 88, 12, 0.12), 0 2px 8px rgba(0,0,0,0.06);
                }

                .brand-row {
                    margin-bottom: 28px;
                }

                .brand-name {
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 26px;
                    font-weight: 700;
                    color: #1c1917;
                    letter-spacing: -0.3px;
                }

                .brand-name::after {
                    content: '.';
                    color: #f59e0b;
                }

                .auth-title {
                    font-size: 21px;
                    font-weight: 800;
                    color: #1c1917;
                    margin: 0 0 5px;
                    letter-spacing: -0.4px;
                }

                .auth-subtitle {
                    font-size: 13.5px;
                    color: #78716c;
                    margin: 0 0 24px;
                    line-height: 1.5;
                }

                .input-group {
                    position: relative;
                    margin-bottom: 12px;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px;
                    height: 16px;
                    stroke: #a8a29e;
                    fill: none;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    pointer-events: none;
                }

                .auth-input {
                    width: 100%;
                    padding: 13px 14px 13px 42px;
                    border: 1.5px solid #e7e5e4;
                    border-radius: 12px;
                    font-size: 14px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: #1c1917;
                    background: rgba(255,255,255,0.8);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }

                .auth-input::placeholder {
                    color: #a8a29e;
                }

                .auth-input:focus {
                    border-color: #f59e0b;
                    box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
                    background: white;
                }

                .eye-btn {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                }

                .eye-btn svg {
                    width: 16px;
                    height: 16px;
                    stroke: #a8a29e;
                    fill: none;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .auth-btn {
                    width: 100%;
                    padding: 14px;
                    background: #f59e0b;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 700;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
                    box-shadow: 0 4px 16px rgba(245,158,11,0.35);
                    letter-spacing: 0.1px;
                    margin-top: 8px;
                    margin-bottom: 18px;
                }

                .auth-btn:hover:not(:disabled) {
                    background: #d97706;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(245,158,11,0.4);
                }

                .auth-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .auth-btn:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .auth-switch {
                    text-align: center;
                    font-size: 13px;
                    color: #78716c;
                    margin: 0;
                }

                .auth-switch span {
                    color: #f59e0b;
                    font-weight: 600;
                    cursor: pointer;
                }

                .auth-switch span:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="auth-root">
                {toast && (
                    <div style={{
                        position: "fixed", top: 20, right: 20, zIndex: 9999,
                        background: toastBg[toast.type], color: "#fff",
                        padding: "12px 24px", borderRadius: 10,
                        fontWeight: 500, fontSize: 14,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        {toast.message}
                    </div>
                )}

                <div className="auth-card">
                    <div className="brand-row">
                        <span className="brand-name">Nexora</span>
                    </div>

                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Register to get started with Nexora</p>

                    <div className="input-group">
                        <svg className="input-icon" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                            className="auth-input"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <svg className="input-icon" viewBox="0 0 24 24">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <input
                            className="auth-input"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <svg className="input-icon" viewBox="0 0 24 24">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                            className="auth-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} type="button">
                            {showPassword ? (
                                <svg viewBox="0 0 24 24">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button className="auth-btn" onClick={handleRegister} disabled={loading}>
                        {loading ? "Loading..." : "Register"}
                    </button>

                    <p className="auth-switch">
                        Sudah punya akun?{" "}
                        <span onClick={() => router.push("/login")}>Login</span>
                    </p>
                </div>
            </div>
        </>
    )
}
