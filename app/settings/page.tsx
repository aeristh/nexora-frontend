"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "../components/ConfirmModal"

const PencilIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <path stroke="currentColor" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path stroke="currentColor" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const ToggleIcon = ({ isActive }: { isActive: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 16, height: 16, stroke: "currentColor" }}>
        {isActive
            ? <><rect stroke="currentColor" x="1" y="5" width="22" height="14" rx="7" /><circle fill="currentColor" stroke="currentColor" cx="16" cy="12" r="3" /></>
            : <><rect stroke="currentColor" x="1" y="5" width="22" height="14" rx="7" /><circle fill="currentColor" stroke="currentColor" cx="8" cy="12" r="3" /></>
        }
    </svg>
)

const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 14, height: 14, stroke: "currentColor" }}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 14, height: 14, stroke: "currentColor" }}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)

type User = {
    id: number
    fullName: string
    email: string
    role: 'admin' | 'user'
    isActive: boolean
}

export default function SettingsPage() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [editForm, setEditForm] = useState({ fullName: "", email: "" })
    const [editLoading, setEditLoading] = useState(false)

    const [confirm, setConfirm] = useState<{
        open: boolean; title: string; message: string
        confirmLabel: string; cancelLabel: string
        variant: "danger" | "warning" | "success"
        iconType: "alert" | "edit" | "trash" | "logout"  // ← TAMBAH
        onConfirm: () => void
    }>({ open: false, title: "", message: "", confirmLabel: "OK", cancelLabel: "", variant: "warning", iconType: "alert", onConfirm: () => { } })

    const closeConfirm = () => setConfirm((c) => ({ ...c, open: false }))

    const showAlert = (title: string, message: string, variant: "danger" | "warning" | "success" = "danger") =>
        setConfirm({ open: true, title, message, confirmLabel: "OK", cancelLabel: "", variant, iconType: "alert", onConfirm: closeConfirm })

    const API = "http://localhost:3333"

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2000)
    }

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (!userData) { router.push("/login"); return }
        const parsed = JSON.parse(userData)
        if (parsed.role !== "admin") { router.push("/"); return }
        setIsAdmin(true)
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) { router.push("/"); return }
        const data = await res.json()
        setUsers(data)
        setLoading(false)
    }

    const handleRoleChange = (user: User, newRole: string) => {
        setConfirm({
            open: true,
            title: "Ubah Role",
            message: `Ubah role "${user.fullName}" menjadi ${newRole}?`,
            confirmLabel: "Ya, Ubah",
            cancelLabel: "Batal",
            variant: "warning",
            iconType: "alert",
            onConfirm: async () => {
                closeConfirm()
                const token = localStorage.getItem("token")
                const res = await fetch(`${API}/users/${user.id}/role`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ role: newRole })
                })
                if (!res.ok) {
                    const err = await res.json()
                    showAlert("Gagal", err.message || "Gagal mengubah role.")
                    fetchUsers(); return
                }
                showToast("Role berhasil diubah"); fetchUsers()
            },
        })
    }

    const handleToggleActive = async (user: User) => {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/users/${user.id}/toggle-active`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
            const err = await res.json()
            showAlert("Gagal", err.message || "Gagal mengubah status.")
            return
        }
        showToast(`Akun berhasil ${user.isActive ? "dinonaktifkan" : "diaktifkan"}`)
        fetchUsers()
    }

    const openEdit = (user: User) => {
        setEditingUser(user)
        setEditForm({ fullName: user.fullName || "", email: user.email })
    }

    const handleEditSubmit = async () => {
        if (!editingUser) return
        setEditLoading(true)
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/users/${editingUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(editForm)
        })
        setEditLoading(false)
        if (!res.ok) {
            const err = await res.json()
            showAlert("Gagal", err.message || "Gagal mengedit user.")
            return
        }
        showToast("User berhasil diperbarui")
        setEditingUser(null); fetchUsers()
    }

    if (loading) return <p style={{ padding: "20px" }}>Memuat data...</p>
    if (!isAdmin) return null

    const thStyle: React.CSSProperties = {
        textAlign: "left",
        padding: "12px 16px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#9ca3af",
    }

    const tdStyle: React.CSSProperties = {
        padding: "14px 16px",
        fontSize: 13,
        color: "#374151",
        textAlign: "left",
    }

    return (
        <div className="container">
            {toast && <div className="toast">{toast}</div>}

            <ConfirmModal
                isOpen={confirm.open}
                title={confirm.title}
                message={confirm.message}
                confirmLabel={confirm.confirmLabel}
                cancelLabel={confirm.cancelLabel}
                variant={confirm.variant}
                iconType={confirm.iconType}
                onConfirm={confirm.onConfirm}
                onCancel={closeConfirm}
            />

            {editingUser && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
                }}>
                    <div style={{
                        maxWidth: 420, width: "90%",
                        borderRadius: 24, padding: "24px 28px 20px",
                        background: "rgba(255,255,255,0.97)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                    }}>
                        {/* Header */}
                        <div style={{ marginBottom: 14 }}>
                            <h2 style={{
                                fontSize: 20, fontWeight: 800, color: "#1c1917",
                                letterSpacing: "-0.4px", margin: "0 0 3px",
                            }}>
                                Edit User
                            </h2>
                            <p style={{ fontSize: 13, color: "#78716c", margin: 0 }}>
                                Perbarui data pengguna di bawah ini
                            </p>
                        </div>

                        {/* Field Nama Lengkap */}
                        <div style={{ position: "relative", marginBottom: 6 }}>
                            <svg style={{
                                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                                width: 15, height: 15, stroke: "#a8a29e",
                                fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
                                pointerEvents: "none",
                            }} viewBox="0 0 24 24">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Nama Lengkap"
                                value={editForm.fullName}
                                onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                                style={{
                                    width: "100%", padding: "10px 14px 10px 40px",
                                    border: "1.5px solid #e7e5e4", borderRadius: 10,
                                    fontSize: 13.5, color: "#1c1917",
                                    background: "rgba(255,255,255,0.8)",
                                    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = "#f59e0b"
                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)"
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.borderColor = "#e7e5e4"
                                    e.currentTarget.style.boxShadow = "none"
                                }}
                            />
                        </div>

                        {/* Field Email */}
                        <div style={{ position: "relative", marginBottom: 16 }}>
                            <svg style={{
                                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                                width: 15, height: 15, stroke: "#a8a29e",
                                fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
                                pointerEvents: "none",
                            }} viewBox="0 0 24 24">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                type="email"
                                placeholder="Email"
                                value={editForm.email}
                                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                                style={{
                                    width: "100%", padding: "10px 14px 10px 40px",
                                    border: "1.5px solid #e7e5e4", borderRadius: 10,
                                    fontSize: 13.5, color: "#1c1917",
                                    background: "rgba(255,255,255,0.8)",
                                    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = "#f59e0b"
                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)"
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.borderColor = "#e7e5e4"
                                    e.currentTarget.style.boxShadow = "none"
                                }}
                            />
                        </div>

                        {/* Tombol */}
                        <button
                            onClick={handleEditSubmit}
                            disabled={editLoading}
                            style={{
                                width: "100%", padding: "10px 0",
                                background: editLoading ? "#fcd34d" : "#f59e0b", color: "#fff",
                                border: "none", borderRadius: 10,
                                fontSize: 14, fontWeight: 700,
                                cursor: editLoading ? "not-allowed" : "pointer", marginBottom: 6,
                                boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
                                fontFamily: "inherit", transition: "background 0.2s, transform 0.1s",
                            }}
                            onMouseEnter={e => {
                                if (!editLoading) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "#d97706"
                                        ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
                                }
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = editLoading ? "#fcd34d" : "#f59e0b"
                                    ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                            }}
                        >
                            {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>

                        <button
                            onClick={() => setEditingUser(null)}
                            style={{
                                width: "100%", padding: "10px 0",
                                background: "transparent", color: "#78716c",
                                border: "1.5px solid #e7e5e4", borderRadius: 10,
                                fontSize: 13.5, fontWeight: 600,
                                cursor: "pointer", fontFamily: "inherit",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f4"
                                    ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#d6d3d1"
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                                    ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e7e5e4"
                            }}
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>
                    User Management
                </h1>
                <p style={{ fontSize: 13, color: "#9ca3af" }}>
                    Kelola role dan status akun pengguna.
                </p>
            </div>

            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #f0ece6" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "28%" }} />
                        <col style={{ width: "18%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "14%" }} />
                    </colgroup>
                    <thead>
                        <tr style={{ background: "#faf8f5", borderBottom: "1px solid #f0ece6" }}>
                            <th style={{ ...thStyle, textAlign: "center" }}>Nama</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>Email</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>Role</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{
                                    textAlign: "center", padding: "40px",
                                    color: "#9ca3af", fontSize: 14,
                                }}>
                                    Tidak ada user
                                </td>
                            </tr>
                        ) : users.map((user) => {
                            const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
                            const isSelf = user.id === currentUser.id
                            return (
                                <tr key={user.id}
                                    style={{ borderBottom: "1px solid #f9f6f2" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fffdf9"}
                                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ""}
                                >
                                    <td style={{
                                        padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#1f2937",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                        textAlign: "center", verticalAlign: "middle",
                                    }}>
                                        {user.fullName || "-"}
                                    </td>
                                    <td style={{
                                        padding: "14px 16px", fontSize: 13, color: "#6b7280",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                        textAlign: "center", verticalAlign: "middle",
                                    }}>
                                        {user.email}
                                    </td>
                                    <td style={{
                                        padding: "14px 16px", fontSize: 13, color: "#374151",
                                        textAlign: "center", verticalAlign: "middle",
                                    }}>
                                        {isSelf ? (
                                            <span style={{
                                                padding: "4px 12px", background: "#e0e7ff",
                                                borderRadius: 999, fontSize: 12,
                                                color: "#4338ca", fontWeight: 600,
                                            }}>
                                                {user.role}
                                            </span>
                                        ) : (
                                            <select value={user.role}
                                                onChange={(e) => handleRoleChange(user, e.target.value)}
                                                style={{
                                                    padding: "5px 10px", borderRadius: 8,
                                                    border: "1px solid #e5e7eb", cursor: "pointer",
                                                    fontSize: 12, background: "#fff",
                                                    width: "100%", maxWidth: 110,
                                                    display: "block", margin: "0 auto",
                                                }}>
                                                <option value="user">user</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        )}
                                    </td>
                                    <td style={{
                                        padding: "14px 16px", fontSize: 13, color: "#374151",
                                        textAlign: "center", verticalAlign: "middle",
                                    }}>
                                        <button
                                            onClick={() => !isSelf && handleToggleActive(user)}
                                            title={isSelf ? undefined : user.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                                            style={{
                                                display: "inline-flex", alignItems: "center", gap: 5,
                                                padding: "4px 12px", borderRadius: 999,
                                                fontSize: 12, fontWeight: 600, border: "none",
                                                cursor: isSelf ? "default" : "pointer",
                                                transition: "opacity 0.2s",
                                                background: user.isActive ? "#dcfce7" : "#f3f4f6",
                                                color: user.isActive ? "#16a34a" : "#6b7280",
                                            }}
                                            onMouseEnter={e => { if (!isSelf) (e.currentTarget as HTMLButtonElement).style.opacity = "0.75" }}
                                            onMouseLeave={e => { if (!isSelf) (e.currentTarget as HTMLButtonElement).style.opacity = "1" }}
                                        >
                                            {user.isActive ? <EyeIcon /> : <EyeOffIcon />}
                                            {user.isActive ? "Aktif" : "Nonaktif"}
                                        </button>
                                    </td>
                                    <td style={{
                                        padding: "14px 16px", fontSize: 13,
                                        textAlign: "center", verticalAlign: "middle",
                                    }}>
                                        {isSelf ? (
                                            <span style={{
                                                color: "#9ca3af", fontSize: 12,
                                                background: "#f3f4f6", padding: "4px 10px",
                                                borderRadius: 6,
                                            }}>
                                                akun Anda
                                            </span>
                                        ) : (
                                            <button onClick={() => openEdit(user)} title="Edit" style={{
                                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                width: 32, height: 32, borderRadius: 8,
                                                border: "1px solid #e5e7eb", background: "#fff",
                                                cursor: "pointer", color: "#6b7280",
                                                transition: "all 0.15s",
                                            }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb"
                                                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff"
                                                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"
                                                }}
                                            >
                                                <PencilIcon />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}