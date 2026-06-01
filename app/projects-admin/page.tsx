"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "../components/ConfirmModal"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

type Project = {
    id: number
    title: string
    slug: string
    category: string
    description: string | null
    content: string | null
    imagePath: string | null
    createdAt: string
    deletedAt?: string | null
    deletedByUser?: { fullName: string | null } | null
}

const PencilIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" /><path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
)

export default function ProjectsAdminPage() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [toast, setToast] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selected, setSelected] = useState<Project | null>(null)
    const [formData, setFormData] = useState({ title: "", category: "", description: "", content: "" })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [errors, setErrors] = useState<{ title?: string; category?: string }>({})

    const [confirm, setConfirm] = useState<{
        open: boolean; title: string; message: string
        confirmLabel: string; cancelLabel: string
        variant: "danger" | "warning" | "success"
        iconType: "alert" | "edit" | "trash" | "logout"
        onConfirm: () => void
    }>({
        open: false, title: "", message: "",
        confirmLabel: "Ya", cancelLabel: "Batal",
        variant: "danger", iconType: "alert", onConfirm: () => { },
    })

    const closeConfirm = () => setConfirm(c => ({ ...c, open: false }))

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    })

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2500)
    }

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/projects`, { headers: getHeaders() })
            const data = await res.json()
            if (Array.isArray(data.data)) setProjects(data.data)
        } catch { }
        setLoading(false)
    }

    useEffect(() => {
        const user = localStorage.getItem("user")
        if (!user) { router.push("/login"); return }
        const parsed = JSON.parse(user)
        if (parsed.role !== "admin") { router.push("/dashboard"); return }
        fetchProjects()
    }, [])

    const openAdd = () => {
        setIsEditing(false)
        setSelected(null)
        setFormData({ title: "", category: "", description: "", content: "" })
        setImageFile(null)
        setError("")
        setErrors({})
        setModalOpen(true)
    }

    const openEdit = (p: Project) => {
        setIsEditing(true)
        setSelected(p)
        setFormData({
            title: p.title,
            category: p.category,
            description: p.description || "",
            content: p.content || "",
        })
        setImageFile(null)
        setError("")
        setErrors({})
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        const newErrors: { title?: string; category?: string } = {}
        if (!formData.title.trim()) newErrors.title = "Title wajib diisi"
        if (!formData.category.trim()) newErrors.category = "Kategori wajib diisi"
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
        setErrors({})
        setSubmitting(true)
        setError("")

        const body = new FormData()
        body.append("title", formData.title)
        body.append("category", formData.category)
        body.append("description", formData.description)
        body.append("content", formData.content)
        if (imageFile) body.append("image", imageFile)

        try {
            const url = isEditing ? `${API_BASE}/projects/${selected!.id}` : `${API_BASE}/projects`
            const method = isEditing ? "PUT" : "POST"
            const res = await fetch(url, { method, headers: getHeaders(), body })
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData?.message || `Error ${res.status}`)
            }
            setModalOpen(false)
            showToast(isEditing ? "Project berhasil diupdate" : "Project berhasil ditambah")
            fetchProjects()
        } catch (e: any) {
            setError(e.message || "Terjadi kesalahan")
        }
        setSubmitting(false)
    }

    const handleDelete = (p: Project) => {
        setConfirm({
            open: true,
            title: "Hapus Project",
            message: `Anda akan menghapus "${p.title}". Data akan dipindahkan ke tong sampah.`,
            confirmLabel: "Ya, Hapus",
            cancelLabel: "Tidak, Batal",
            variant: "danger",
            iconType: "trash",
            onConfirm: async () => {
                closeConfirm()
                await fetch(`${API_BASE}/projects/${p.id}`, { method: "DELETE", headers: getHeaders() })
                showToast("Project berhasil dihapus")
                fetchProjects()
            },
        })
    }

    const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
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
        verticalAlign: "middle" as const,
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
                    Projects
                </h1>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
                <button className="add-btn" onClick={openAdd}>+ Tambah Project</button>
                <input
                    placeholder="Cari title, kategori, atau slug..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, minWidth: 200, margin: 0 }}
                />
            </div>

            {loading ? <p>Loading data...</p> : (
                <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #f0ece6" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#faf8f5", borderBottom: "1px solid #f0ece6" }}>
                                <th style={thStyle}>Gambar</th>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Kategori</th>
                                <th style={thStyle}>Slug</th>
                                <th style={thStyle}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: 14 }}>
                                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                                        Tidak ada data yang ditemukan.
                                    </td>
                                </tr>
                            ) : filtered.map((p, index) => (
                                <tr key={p.id}
                                    style={{ borderBottom: "1px solid #f9f6f2" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fffdf9"}
                                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ""}
                                >
                                    <td style={tdStyle}>
                                        {p.imagePath
                                            ? <img src={`${API_BASE}${p.imagePath}`} alt={p.title}
                                                style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #f0ece6", display: "block", margin: "0 auto" }} />
                                            : <div style={{ width: 64, height: 44, borderRadius: 8, background: "#f3f0ea", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 10, margin: "0 auto" }}>
                                                No img
                                            </div>
                                        }
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 600, color: "#1f2937", textAlign: "left" as const }}>
                                        {p.title}
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            background: "#24221b", color: "#f2d04e",
                                            padding: "3px 10px", borderRadius: 999,
                                            fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                                            whiteSpace: "nowrap" as const,
                                        }}>
                                            {p.category}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12, color: "#9ca3af" }}>
                                        {p.slug}
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                            <button onClick={() => openEdit(p)} title="Edit" style={{
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                width: 32, height: 32, borderRadius: 8,
                                                border: "1px solid #e5e7eb", background: "#fff",
                                                cursor: "pointer", color: "#6b7280", transition: "all 0.15s",
                                            }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb";
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"
                                                }}
                                            >
                                                <PencilIcon />
                                            </button>
                                            <button onClick={() => handleDelete(p)} title="Hapus" style={{
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                width: 32, height: 32, borderRadius: 8,
                                                border: "1px solid #fecaca", background: "#fff5f5",
                                                cursor: "pointer", color: "#ef4444", transition: "all 0.15s",
                                            }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5"
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff5f5";
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#fecaca"
                                                }}
                                            >
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

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content" style={{
                        maxWidth: 480, width: "90%",
                        borderRadius: 24, padding: "24px 28px 20px",
                        background: "rgba(255,255,255,0.97)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                        maxHeight: "90vh", overflowY: "auto",
                    }}>
                        <div style={{ marginBottom: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1c1917", letterSpacing: "-0.4px", margin: "0 0 3px" }}>
                                {isEditing ? "Edit Project" : "Tambah Project"}
                            </h2>
                            <p style={{ fontSize: 13, color: "#78716c", margin: 0 }}>
                                {isEditing ? "Perbarui data project di bawah ini" : "Isi data project baru di bawah ini"}
                            </p>
                        </div>

                        {error && (
                            <div style={{ background: "#fff0f0", border: "1px solid #f5c6c6", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c0392b" }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                            <div>
                                <input
                                    value={formData.title}
                                    onChange={e => { setFormData(f => ({ ...f, title: e.target.value })); setErrors(p => ({ ...p, title: undefined })) }}
                                    placeholder="Title Project *"
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${errors.title ? "#ef4444" : "#e7e5e4"}`,
                                        borderRadius: 10, fontSize: 13.5, color: "#1c1917",
                                        background: errors.title ? "#fff5f5" : "rgba(255,255,255,0.8)",
                                        outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = errors.title ? "#ef4444" : "#f59e0b"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)" }}
                                    onBlur={e => { e.currentTarget.style.borderColor = errors.title ? "#ef4444" : "#e7e5e4"; e.currentTarget.style.boxShadow = "none" }}
                                />
                                {errors.title && <p style={{ color: "#ef4444", fontSize: 11.5, margin: "3px 0 0 4px" }}>{errors.title}</p>}
                            </div>

                            <div>
                                <input
                                    value={formData.category}
                                    onChange={e => { setFormData(f => ({ ...f, category: e.target.value })); setErrors(p => ({ ...p, category: undefined })) }}
                                    placeholder="Kategori * (contoh: Full Stack, UI/UX)"
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${errors.category ? "#ef4444" : "#e7e5e4"}`,
                                        borderRadius: 10, fontSize: 13.5, color: "#1c1917",
                                        background: errors.category ? "#fff5f5" : "rgba(255,255,255,0.8)",
                                        outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = errors.category ? "#ef4444" : "#f59e0b"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)" }}
                                    onBlur={e => { e.currentTarget.style.borderColor = errors.category ? "#ef4444" : "#e7e5e4"; e.currentTarget.style.boxShadow = "none" }}
                                />
                                {errors.category && <p style={{ color: "#ef4444", fontSize: 11.5, margin: "3px 0 0 4px" }}>{errors.category}</p>}
                            </div>

                            <input
                                value={formData.description}
                                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                placeholder="Deskripsi singkat"
                                style={{
                                    width: "100%", padding: "10px 14px",
                                    border: "1.5px solid #e7e5e4", borderRadius: 10, fontSize: 13.5,
                                    color: "#1c1917", background: "rgba(255,255,255,0.8)",
                                    outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)" }}
                                onBlur={e => { e.currentTarget.style.borderColor = "#e7e5e4"; e.currentTarget.style.boxShadow = "none" }}
                            />

                            <textarea
                                value={formData.content}
                                onChange={e => setFormData(f => ({ ...f, content: e.target.value }))}
                                placeholder="Konten / detail project..."
                                rows={4}
                                style={{
                                    width: "100%", padding: "10px 14px",
                                    border: "1.5px solid #e7e5e4", borderRadius: 10, fontSize: 13.5,
                                    color: "#1c1917", background: "rgba(255,255,255,0.8)",
                                    outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
                                    resize: "vertical", minHeight: 100,
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)" }}
                                onBlur={e => { e.currentTarget.style.borderColor = "#e7e5e4"; e.currentTarget.style.boxShadow = "none" }}
                            />

                            <div style={{ padding: "10px 14px", border: "1.5px solid #e7e5e4", borderRadius: 10, background: "rgba(255,255,255,0.8)" }}>
                                <p style={{ fontSize: 11.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "0 0 8px" }}>
                                    Gambar {isEditing ? "(kosongkan jika tidak diganti)" : ""}
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                                    style={{ fontSize: 13, color: "#555", width: "100%" }}
                                />
                                {isEditing && selected?.imagePath && !imageFile && (
                                    <img src={`${API_BASE}${selected.imagePath}`} alt="current"
                                        style={{ marginTop: 8, height: 56, borderRadius: 8, border: "1px solid #e7e5e4" }} />
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                style={{
                                    width: "100%", padding: "10px 0",
                                    background: "#f59e0b", color: "#fff",
                                    border: "none", borderRadius: 10,
                                    fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
                                    opacity: submitting ? 0.7 : 1,
                                    boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
                                    fontFamily: "inherit", transition: "background 0.2s",
                                }}
                                onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = "#d97706" }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f59e0b" }}
                            >
                                {submitting ? "Menyimpan..." : isEditing ? "Update Project" : "Tambah Project"}
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                style={{
                                    width: "100%", padding: "10px 0",
                                    background: "transparent", color: "#78716c",
                                    border: "1.5px solid #e7e5e4", borderRadius: 10,
                                    fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                                    fontFamily: "inherit", transition: "all 0.2s",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f4" }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}