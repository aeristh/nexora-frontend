"use client"

import { useEffect, useState } from "react"
import ConfirmModal from "../components/ConfirmModal"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

type ContactItem = {
    id: number
    label: string
    displayText: string
    url: string
    iconKey: string
    isActive: boolean
    sortOrder: number
}

type FormData = {
    label: string
    display_text: string
    url: string
    icon_key: string
    sort_order: number
}

const emptyForm: FormData = {
    label: "",
    display_text: "",
    url: "",
    icon_key: "",
    sort_order: 0,
}

const ICON_OPTIONS = ["whatsapp", "email", "instagram", "tiktok", "twitter", "linkedin", "github", "youtube", "facebook"]

const PencilIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
)

const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, stroke: "currentColor" }}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, stroke: "currentColor" }}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)

export default function ContactPage() {
    const [contacts, setContacts] = useState<ContactItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editTarget, setEditTarget] = useState<ContactItem | null>(null)
    const [form, setForm] = useState<FormData>(emptyForm)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState("")
    const [errors, setErrors] = useState<{ label?: string; url?: string }>({})

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
        iconType: "trash",
    })

    const closeConfirm = () => setConfirm(c => ({ ...c, open: false }))

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2500)
    }

    const fetchContacts = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/contact`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (Array.isArray(data.data)) setContacts(data.data)
        } catch {
            showToast("Gagal memuat data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchContacts() }, [])

    const resetForm = () => {
        setForm(emptyForm)
        setEditTarget(null)
        setErrors({})
    }

    const openCreate = () => {
        resetForm()
        setShowModal(true)
    }

    const openEdit = (contact: ContactItem) => {
        setEditTarget(contact)
        setForm({
            label: contact.label,
            display_text: contact.displayText,
            url: contact.url,
            icon_key: contact.iconKey,
            sort_order: contact.sortOrder,
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        const newErrors: typeof errors = {}
        if (!form.label) newErrors.label = "Label wajib diisi"
        if (!form.url) newErrors.url = "URL wajib diisi"
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
        setErrors({})

        setSaving(true)
        try {
            const url = editTarget ? `${API_BASE}/contact/${editTarget.id}` : `${API_BASE}/contact`
            const method = editTarget ? "PUT" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error()
            showToast(editTarget ? "Kontak berhasil diperbarui" : "Kontak berhasil ditambahkan")
            setShowModal(false)
            resetForm()
            fetchContacts()
        } catch {
            showToast("Gagal menyimpan data")
        } finally {
            setSaving(false)
        }
    }

    const handleToggleActive = async (contact: ContactItem) => {
        try {
            const res = await fetch(`${API_BASE}/contact/${contact.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ is_active: !contact.isActive }),
            })
            if (!res.ok) throw new Error()
            showToast(`Kontak berhasil ${contact.isActive ? "dinonaktifkan" : "diaktifkan"}`)
            fetchContacts()
        } catch {
            showToast("Gagal mengubah status")
        }
    }

    const handleDelete = (contact: ContactItem) => {
        setConfirm({
            open: true,
            title: "Hapus Kontak",
            message: `Anda akan menghapus kontak "${contact.label}". Data tidak dapat dikembalikan.`,
            confirmLabel: "Ya, Hapus",
            cancelLabel: "Tidak, Batal",
            variant: "danger",
            iconType: "trash",
            onConfirm: async () => {
                closeConfirm()
                const res = await fetch(`${API_BASE}/contact/${contact.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) { showToast("Gagal menghapus"); return }
                showToast("Kontak berhasil dihapus")
                fetchContacts()
            },
        })
    }

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
                    Contact
                </h1>
                <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
                    Kelola informasi kontak
                </p>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                <button className="add-btn" onClick={openCreate}>
                    + Tambah Kontak
                </button>
            </div>

            {loading ? (<p style={{ color: "#888", fontSize: 14 }}>Loading data...</p>) : (
                <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #f0ece6" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#faf8f5", borderBottom: "1px solid #f0ece6" }}>
                                <th style={thStyle}>No</th>
                                <th style={thStyle}>Label</th>
                                <th style={thStyle}>Display Text</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Urutan</th>
                                <th style={thStyle}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "60px 20px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f2efe9", display: "flex", alignItems: "center", justifyContent: "center", }}>
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                                    stroke="#c5c0b6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            </div>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", margin: 0 }}>
                                                Belum ada kontak
                                            </p>
                                            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                                                Klik tombol Tambah Kontak untuk memulai.
                                            </p>
                                        </div>
                                    </td>
                                </tr>) : contacts.map((c, index) => (
                                    <tr key={c.id} style={{ borderBottom: "1px solid #f9f6f2" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fffdf9"}
                                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ""}>
                                        <td style={tdStyle}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                width: 24, height: 24, borderRadius: "50%",
                                                background: "#f3f0ea", fontSize: 11, fontWeight: 700, color: "#9ca3af",
                                            }}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: 600, color: "#1f2937" }}>{c.label}</td>
                                        <td style={{ ...tdStyle, color: "#6b7280" }}>{c.displayText}</td>

                                        <td style={tdStyle}>
                                            <button onClick={() => handleToggleActive(c)} title={c.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                                                style={{
                                                    display: "inline-flex", alignItems: "center", gap: 5,
                                                    padding: "4px 12px", borderRadius: 999,
                                                    fontSize: 12, fontWeight: 600, border: "none",
                                                    cursor: "pointer",
                                                    transition: "opacity 0.2s",
                                                    background: c.isActive ? "#dcfce7" : "#f3f4f6",
                                                    color: c.isActive ? "#16a34a" : "#6b7280",
                                                }}
                                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.75"}
                                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}>
                                                {c.isActive ? <EyeIcon /> : <EyeOffIcon />}
                                                {c.isActive ? "Aktif" : "Nonaktif"}
                                            </button>
                                        </td>

                                        <td style={tdStyle}>{c.sortOrder}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                                <button onClick={() => openEdit(c)} title="Edit" style={{
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    width: 32, height: 32, borderRadius: 8,
                                                    border: "1px solid #e5e7eb", background: "#fff",
                                                    cursor: "pointer", color: "#6b7280", transition: "all 0.15s",
                                                }} onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb";
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"
                                                }} onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"
                                                }}>
                                                    <PencilIcon />
                                                </button>
                                                <button onClick={() => handleDelete(c)} title="Hapus" style={{
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    width: 32, height: 32, borderRadius: 8,
                                                    border: "1px solid #fecaca", background: "#fff5f5",
                                                    cursor: "pointer", color: "#ef4444", transition: "all 0.15s",
                                                }} onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5"
                                                }} onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff5f5";
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#fecaca"
                                                }}>
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content" style={{ maxWidth: 440, width: "90%", borderRadius: 24, background: "rgba(255,255,255,0.97)", boxShadow: "0 8px 40px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", maxHeight: "85vh", }}>
                        <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #f0ece6", flexShrink: 0 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1c1917", letterSpacing: "-0.4px", margin: "0 0 3px" }}>
                                {editTarget ? "Edit Kontak" : "Tambah Kontak"}
                            </h2>
                            <p style={{ fontSize: 13, color: "#78716c", margin: 0 }}>
                                {editTarget ? "Perbarui data kontak di bawah ini" : "Isi data kontak baru di bawah ini"}
                            </p>
                        </div>

                        <div style={{ padding: "16px 28px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Label</label>
                                <input placeholder="WhatsApp" value={form.label} onChange={e => { setForm({ ...form, label: e.target.value }); setErrors(p => ({ ...p, label: undefined })) }} style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${errors.label ? "#ef4444" : "#e7e5e4"}`, borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: errors.label ? "#fff5f5" : "#fff", }} />
                                {errors.label && <p style={{ color: "#ef4444", fontSize: 11, margin: "2px 0 0 2px" }}>{errors.label}</p>}
                            </div>

                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Display Text</label>
                                <input placeholder="+62 812-xxxx" value={form.display_text} onChange={e => setForm({ ...form, display_text: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e7e5e4", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                            </div>

                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>URL</label>
                                <input placeholder="https://wa.me/62..." value={form.url} onChange={e => { setForm({ ...form, url: e.target.value }); setErrors(p => ({ ...p, url: undefined })) }} style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${errors.url ? "#ef4444" : "#e7e5e4"}`, borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: errors.url ? "#fff5f5" : "#fff", }} />
                                {errors.url && <p style={{ color: "#ef4444", fontSize: 11, margin: "2px 0 0 2px" }}>{errors.url}</p>}
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Icon Key</label>
                                    <select value={form.icon_key} onChange={e => setForm({ ...form, icon_key: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e7e5e4", borderRadius: 10, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}>
                                        <option value="">Pilih Icon</option>
                                        {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Urutan Tampil</label>
                                    <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e7e5e4", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: "14px 28px", borderTop: "1px solid #f0ece6", flexShrink: 0, display: "flex", gap: 8 }}>
                            <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "10px 0", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
                                {saving ? "Menyimpan..." : editTarget ? "Update Kontak" : "Tambah Kontak"}
                            </button>
                            <button onClick={() => { resetForm(); setShowModal(false) }} style={{ padding: "10px 18px", background: "transparent", color: "#78716c", border: "1.5px solid #e7e5e4", borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
