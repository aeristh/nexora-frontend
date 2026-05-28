"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ConfirmModal from "../components/ConfirmModal"

type Employee = {
    id: number
    name: string
    position: string
    email: string
    phone: string
    status: string
}

const PencilIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <path stroke="currentColor" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path stroke="currentColor" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <polyline stroke="currentColor" points="3 6 5 6 21 6" />
        <path stroke="currentColor" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path stroke="currentColor" d="M10 11v6" />
        <path stroke="currentColor" d="M14 11v6" />
        <path stroke="currentColor" d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [name, setName] = useState("")
    const [position, setPosition] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [status, setStatus] = useState("aktif")
    const [editId, setEditId] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; position?: string }>({})

    const [confirm, setConfirm] = useState<{
        open: boolean
        title: string
        message: string
        confirmLabel: string
        cancelLabel: string
        variant: "danger" | "warning" | "success"
        iconType: "alert" | "edit" | "trash" | "logout"
        onConfirm: () => void
    }>({
        open: false, title: "", message: "",
        confirmLabel: "Ya", cancelLabel: "Batal",
        variant: "danger", onConfirm: () => { },
        iconType: "alert",
    })

    const closeConfirm = () => setConfirm((c) => ({ ...c, open: false }))

    const API = "${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

}/employees"

const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2000)
}

const fetchEmployees = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (Array.isArray(data)) setEmployees(data)
    else if (Array.isArray(data.data)) setEmployees(data.data)
    else { setEmployees([]); console.error("Format data tidak dikenali:", data) }
    setLoading(false)
}

useEffect(() => {
    fetchEmployees()
    const userData = localStorage.getItem("user")
    if (userData) {
        const parsed = JSON.parse(userData)
        setIsAdmin(parsed.role === "admin")
    }
}, [])

const resetForm = () => {
    setName(""); setPosition(""); setEmail("")
    setPhone(""); setStatus("aktif"); setEditId(null)
    setErrors({})
}

const handleEdit = (emp: Employee) => {
    setEditId(emp.id); setName(emp.name); setPosition(emp.position)
    setEmail(emp.email ?? ""); setPhone(emp.phone ?? "")
    setStatus(emp.status ?? "aktif")
    setIsModalOpen(true)
}

const handleSave = async () => {
    const newErrors: { name?: string; position?: string } = {}
    if (!name) newErrors.name = "Nama wajib diisi"
    if (!position) newErrors.position = "Posisi wajib diisi"
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})

    const token = localStorage.getItem("token")
    const payload = { name, position, email, phone, status }
    const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    })
    if (!res.ok) { const err = await res.json(); showToast(err.message || "Gagal menyimpan"); return }
    showToast(editId ? "Pegawai berhasil diupdate" : "Pegawai berhasil ditambah")
    resetForm(); setIsModalOpen(false); fetchEmployees()
}

const handleDelete = (emp: Employee) => {
    setConfirm({
        open: true,
        title: "Hapus Pegawai",
        message: `Anda akan menghapus "${emp.name}". Data akan dipindahkan ke tong sampah.`,
        confirmLabel: "Ya, Hapus",
        cancelLabel: "Tidak, Batal",
        variant: "danger",
        iconType: "trash",
        onConfirm: async () => {
            closeConfirm()
            const token = localStorage.getItem("token")
            const res = await fetch(`${API}/${emp.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) { showToast("Gagal menghapus"); return }
            showToast("Pegawai berhasil dihapus"); fetchEmployees()
        },
    })
}

const handleToggleStatus = (emp: Employee) => {
    const newStatus = emp.status === "aktif" ? "nonaktif" : "aktif"
    const toggle = async () => {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/${emp.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...emp, status: newStatus }),
        })
        if (!res.ok) { showToast("Gagal mengubah status"); return }
        showToast(`Status berhasil diubah menjadi ${newStatus}`)
        fetchEmployees()
    }
    toggle()
}

const filtered = employees.filter(
    (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.position.toLowerCase().includes(search.toLowerCase()) ||
        (emp.phone ?? "").includes(search)
)

const thStyle = {
    textAlign: "center" as const,
    padding: "12px 16px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#9ca3af",
}

const tdStyle = {
    padding: "14px 16px",
    fontSize: 13,
    color: "#374151",
    textAlign: "center" as const,
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

        <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>
                List Pegawai
            </h1>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
            {isAdmin && (
                <button className="add-btn" onClick={() => { resetForm(); setIsModalOpen(true) }}>
                    + Tambah Pegawai
                </button>
            )}
            <input
                placeholder="Cari nama, posisi, atau nomor telepon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: 200, margin: 0 }}
            />
        </div>

        {loading ? <p>Loading data...</p> : (
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #f0ece6" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#faf8f5", borderBottom: "1px solid #f0ece6" }}>
                            <th style={thStyle}>No</th>
                            <th style={thStyle}>Nama</th>
                            <th style={thStyle}>Posisi</th>
                            <th style={thStyle}>No. Telepon</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Status</th>
                            {isAdmin && <th style={thStyle}>Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 6} style={{
                                    textAlign: "center", padding: "40px 20px",
                                    color: "#9ca3af", fontSize: 14,
                                }}>
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                                    Tidak ada data yang ditemukan.
                                </td>
                            </tr>
                        ) : filtered.map((emp, index) => (
                            <tr key={emp.id} style={{ borderBottom: "1px solid #f9f6f2" }}
                                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fffdf9"}
                                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ""}
                            >
                                <td style={tdStyle}>
                                    <span style={{
                                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 24, height: 24, borderRadius: "50%",
                                        background: "#f3f0ea", fontSize: 11, fontWeight: 700,
                                        color: "#9ca3af",
                                    }}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, fontWeight: 600, color: "#1f2937" }}>
                                    {emp.name}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{
                                        background: "#f3f4f6", color: "#374151",
                                        padding: "3px 10px", borderRadius: 6,
                                        fontSize: 12, fontWeight: 500,
                                    }}>
                                        {emp.position}
                                    </span>
                                </td>
                                <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13 }}>
                                    {emp.phone || "—"}
                                </td>
                                <td style={{ ...tdStyle, color: "#6b7280", fontSize: 13 }}>
                                    {emp.email || "—"}
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => isAdmin ? handleToggleStatus(emp) : undefined}
                                        title={isAdmin ? "Klik untuk ubah status" : emp.status}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                            padding: "4px 12px", borderRadius: 999,
                                            fontSize: 12, fontWeight: 600, border: "none",
                                            cursor: isAdmin ? "pointer" : "default",
                                            transition: "all 0.2s",
                                            background: emp.status === "aktif" ? "#d1fae5" : "#f3f4f6",
                                            color: emp.status === "aktif" ? "#065f46" : "#6b7280",
                                        }}
                                        onMouseEnter={e => {
                                            if (isAdmin) (e.currentTarget as HTMLButtonElement).style.opacity = "0.75"
                                        }}
                                        onMouseLeave={e => {
                                            if (isAdmin) (e.currentTarget as HTMLButtonElement).style.opacity = "1"
                                        }}
                                    >
                                        {emp.status === "aktif" ? <EyeIcon /> : <EyeOffIcon />}
                                        {emp.status || "—"}
                                    </button>
                                </td>
                                {isAdmin && (
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                            <button onClick={() => handleEdit(emp)} title="Edit" style={{
                                                display: "flex", alignItems: "center", justifyContent: "center",
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
                                            <button onClick={() => handleDelete(emp)} title="Hapus" style={{
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                width: 32, height: 32, borderRadius: 8,
                                                border: "1px solid #fecaca", background: "#fff5f5",
                                                cursor: "pointer", color: "#ef4444",
                                                transition: "all 0.15s",
                                            }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2"
                                                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5"
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff5f5"
                                                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#fecaca"
                                                }}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {isModalOpen && (
            <div className="modal">
                <div className="modal-content" style={{
                    maxWidth: 420, width: "90%",
                    borderRadius: 24, padding: "24px 28px 20px",
                    background: "rgba(255,255,255,0.97)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 12 }}>
                        <h2 style={{
                            fontSize: 20, fontWeight: 800, color: "#1c1917",
                            letterSpacing: "-0.4px", margin: "0 0 3px",
                        }}>
                            {editId ? "Edit Pegawai" : "Tambah Pegawai"}
                        </h2>
                        <p style={{ fontSize: 13, color: "#78716c", margin: 0 }}>
                            {editId ? "Perbarui data pegawai di bawah ini" : "Isi data pegawai baru di bawah ini"}
                        </p>
                    </div>

                    {/* Field Nama */}
                    <div style={{ position: "relative", marginBottom: errors.name ? 2 : 6 }}>
                        <svg style={{
                            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                            width: 15, height: 15, stroke: errors.name ? "#ef4444" : "#a8a29e",
                            fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
                            pointerEvents: "none",
                        }} viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                            placeholder="Nama"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                            style={{
                                width: "100%", padding: "10px 14px 10px 40px",
                                border: `1.5px solid ${errors.name ? "#ef4444" : "#e7e5e4"}`,
                                borderRadius: 10, fontSize: 13.5, color: "#1c1917",
                                background: errors.name ? "#fff5f5" : "rgba(255,255,255,0.8)",
                                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = errors.name ? "#ef4444" : "#f59e0b"
                                e.currentTarget.style.boxShadow = errors.name
                                    ? "0 0 0 3px rgba(239,68,68,0.12)"
                                    : "0 0 0 3px rgba(245,158,11,0.12)"
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = errors.name ? "#ef4444" : "#e7e5e4"
                                e.currentTarget.style.boxShadow = "none"
                            }}
                        />
                    </div>
                    {errors.name && (
                        <p style={{ color: "#ef4444", fontSize: 11.5, margin: "0 0 6px 4px" }}>{errors.name}</p>
                    )}

                    {/* Field Posisi */}
                    <div style={{ position: "relative", marginBottom: errors.position ? 2 : 6 }}>
                        <svg style={{
                            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                            width: 15, height: 15, stroke: errors.position ? "#ef4444" : "#a8a29e",
                            fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
                            pointerEvents: "none",
                        }} viewBox="0 0 24 24">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        </svg>
                        <input
                            placeholder="Posisi"
                            value={position}
                            onChange={(e) => { setPosition(e.target.value); setErrors(p => ({ ...p, position: undefined })) }}
                            style={{
                                width: "100%", padding: "10px 14px 10px 40px",
                                border: `1.5px solid ${errors.position ? "#ef4444" : "#e7e5e4"}`,
                                borderRadius: 10, fontSize: 13.5, color: "#1c1917",
                                background: errors.position ? "#fff5f5" : "rgba(255,255,255,0.8)",
                                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = errors.position ? "#ef4444" : "#f59e0b"
                                e.currentTarget.style.boxShadow = errors.position
                                    ? "0 0 0 3px rgba(239,68,68,0.12)"
                                    : "0 0 0 3px rgba(245,158,11,0.12)"
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = errors.position ? "#ef4444" : "#e7e5e4"
                                e.currentTarget.style.boxShadow = "none"
                            }}
                        />
                    </div>
                    {errors.position && (
                        <p style={{ color: "#ef4444", fontSize: 11.5, margin: "0 0 6px 4px" }}>{errors.position}</p>
                    )}

                    {/* Field No. Telepon */}
                    <div style={{ position: "relative", marginBottom: 6 }}>
                        <svg style={{
                            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                            width: 15, height: 15, stroke: "#a8a29e",
                            fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
                            pointerEvents: "none",
                        }} viewBox="0 0 24 24">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l1.27-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <input
                            placeholder="No. Telepon"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        onClick={handleSave}
                        style={{
                            width: "100%", padding: "10px 0",
                            background: "#f59e0b", color: "#fff",
                            border: "none", borderRadius: 10,
                            fontSize: 14, fontWeight: 700,
                            cursor: "pointer", marginBottom: 6,
                            boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
                            fontFamily: "inherit",
                            transition: "background 0.2s, transform 0.1s",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#d97706"
                                ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#f59e0b"
                                ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                        }}
                    >
                        {editId ? "Update Pegawai" : "Tambah Pegawai"}
                    </button>

                    <button
                        onClick={() => { resetForm(); setIsModalOpen(false) }}
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
                        Tutup
                    </button>
                </div>
            </div>
        )}
    </div>
)
}