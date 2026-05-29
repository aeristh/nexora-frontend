"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
    deletedByUser?: { name: string } | null
}

export default function ProjectsAdminPage() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [trashed, setTrashed] = useState<Project[]>([])
    const [showTrash, setShowTrash] = useState(false)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selected, setSelected] = useState<Project | null>(null)
    const [formData, setFormData] = useState({
        title: "", category: "", description: "", content: ""
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    })

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/projects`, { headers: getHeaders() })
            const data = await res.json()
            if (Array.isArray(data.data)) setProjects(data.data)
        } catch { }
        setLoading(false)
    }

    const fetchTrashed = async () => {
        try {
            const res = await fetch(`${API_BASE}/projects/trashed`, { headers: getHeaders() })
            const data = await res.json()
            if (Array.isArray(data.data)) setTrashed(data.data)
        } catch { }
    }

    useEffect(() => {
        const user = localStorage.getItem("user")
        if (!user) { router.push("/login"); return }
        const parsed = JSON.parse(user)
        if (parsed.role !== "admin") { router.push("/dashboard"); return }
        fetchProjects()
        fetchTrashed()
    }, [])

    const openAdd = () => {
        setIsEditing(false)
        setSelected(null)
        setFormData({ title: "", category: "", description: "", content: "" })
        setImageFile(null)
        setError("")
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
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        if (!formData.title.trim() || !formData.category.trim()) {
            setError("Title dan Kategori wajib diisi.")
            return
        }
        setSubmitting(true)
        setError("")

        const body = new FormData()
        body.append("title", formData.title)
        body.append("category", formData.category)
        body.append("description", formData.description)
        body.append("content", formData.content)
        if (imageFile) body.append("image", imageFile)

        try {
            const url = isEditing
                ? `${API_BASE}/projects/${selected!.id}`
                : `${API_BASE}/projects`
            const method = isEditing ? "PUT" : "POST"
            const res = await fetch(url, { method, headers: getHeaders(), body })
            if (!res.ok) throw new Error("Gagal menyimpan project")
            setModalOpen(false)
            fetchProjects()
        } catch (e: any) {
            setError(e.message || "Terjadi kesalahan")
        }
        setSubmitting(false)
    }

    const handleDelete = async (p: Project) => {
        if (!confirm(`Hapus project "${p.title}"?`)) return
        await fetch(`${API_BASE}/projects/${p.id}`, {
            method: "DELETE", headers: getHeaders()
        })
        fetchProjects()
        fetchTrashed()
    }

    const handleRestore = async (p: Project) => {
        await fetch(`${API_BASE}/projects/${p.id}/restore`, {
            method: "PUT", headers: getHeaders()
        })
        fetchTrashed()
        fetchProjects()
    }

    return (
        <div style={{ padding: "32px 40px", maxWidth: 1100, margin: "0 auto" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#24221b" }}>Projects</h1>
                    <p style={{ color: "#888", fontSize: 14, margin: "4px 0 0" }}>
                        Kelola project portfolio
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={() => { setShowTrash(!showTrash); if (!showTrash) fetchTrashed() }}
                        style={btnOutline}
                    >
                        {showTrash ? "Sembunyikan Trash" : `🗑 Trash (${trashed.length})`}
                    </button>
                    <button onClick={openAdd} style={btnPrimary}>
                        + Tambah Project
                    </button>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #eae7e1", overflow: "hidden", marginBottom: showTrash ? 32 : 0 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f9f7f4", borderBottom: "1px solid #eae7e1" }}>
                            <th style={th}>Gambar</th>
                            <th style={th}>Title</th>
                            <th style={th}>Kategori</th>
                            <th style={th}>Slug</th>
                            <th style={th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={emptyCell}>Loading...</td></tr>
                        ) : projects.length === 0 ? (
                            <tr><td colSpan={5} style={emptyCell}>Belum ada project. Klik "+ Tambah Project" untuk mulai.</td></tr>
                        ) : projects.map(p => (
                            <tr key={p.id} style={{ borderBottom: "1px solid #f0ede8" }}>
                                <td style={td}>
                                    {p.imagePath
                                        ? <img
                                            src={`${API_BASE}${p.imagePath}`}
                                            alt={p.title}
                                            style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #eae7e1", display: "block" }}
                                        />
                                        : <div style={{ width: 64, height: 44, borderRadius: 8, background: "#f3efea", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 10 }}>No img</div>
                                    }
                                </td>
                                <td style={{ ...td, fontWeight: 600, color: "#24221b" }}>{p.title}</td>
                                <td style={td}>
                                    <span style={categoryBadge}>{p.category}</span>
                                </td>
                                <td style={{ ...td, color: "#aaa", fontSize: 12, fontFamily: "monospace" }}>{p.slug}</td>
                                <td style={td}>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => openEdit(p)} style={btnEdit}>Edit</button>
                                        <button onClick={() => handleDelete(p)} style={btnDelete}>Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showTrash && (
                <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #f5c6c6", overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid #f5e0e0", background: "#fff8f8" }}>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#c0392b" }}>🗑 Deleted Projects</h3>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#fff8f8", borderBottom: "1px solid #f5e0e0" }}>
                                <th style={th}>Title</th>
                                <th style={th}>Kategori</th>
                                <th style={th}>Dihapus oleh</th>
                                <th style={th}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trashed.length === 0 ? (
                                <tr><td colSpan={4} style={emptyCell}>Tidak ada project yang dihapus.</td></tr>
                            ) : trashed.map(p => (
                                <tr key={p.id} style={{ borderBottom: "1px solid #f9f0f0" }}>
                                    <td style={{ ...td, fontWeight: 600, color: "#aaa", textDecoration: "line-through" }}>{p.title}</td>
                                    <td style={td}>
                                        <span style={{ ...categoryBadge, background: "#f0ede8", color: "#aaa" }}>{p.category}</span>
                                    </td>
                                    <td style={{ ...td, fontSize: 12, color: "#aaa" }}>
                                        {p.deletedByUser?.name || "-"}
                                    </td>
                                    <td style={td}>
                                        <button onClick={() => handleRestore(p)} style={btnRestore}>Restore</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                        <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#24221b" }}>
                            {isEditing ? "Edit Project" : "Tambah Project"}
                        </h2>

                        {error && (
                            <div style={{ background: "#fff0f0", border: "1px solid #f5c6c6", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c0392b" }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Title *</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Nama project"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Kategori *</label>
                                <input
                                    value={formData.category}
                                    onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                                    placeholder="Contoh: Full Stack, UI/UX, Backend"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Deskripsi Singkat</label>
                                <input
                                    value={formData.description}
                                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Deskripsi singkat project"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Konten / Detail</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Penjelasan lengkap project..."
                                    rows={5}
                                    style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>
                                    Gambar {isEditing ? "(kosongkan jika tidak diganti)" : ""}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                                    style={{ fontSize: 13, color: "#555", width: "100%" }}
                                />
                                {isEditing && selected?.imagePath && !imageFile && (
                                    <img
                                        src={`${API_BASE}${selected.imagePath}`}
                                        alt="current"
                                        style={{ marginTop: 8, height: 64, borderRadius: 8, border: "1px solid #eae7e1" }}
                                    />
                                )}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 28 }}>
                            <button onClick={() => setModalOpen(false)} style={btnOutline}>
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                            >
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const th: React.CSSProperties = {
    padding: "12px 16px", textAlign: "left", fontSize: 12,
    fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em"
}
const td: React.CSSProperties = {
    padding: "12px 16px", fontSize: 14, color: "#555", verticalAlign: "middle"
}
const emptyCell: React.CSSProperties = {
    textAlign: "center", padding: 40, color: "#aaa", fontSize: 13
}
const categoryBadge: React.CSSProperties = {
    background: "#24221b", color: "#f2d04e", fontSize: 10,
    fontWeight: 700, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.05em"
}
const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 700, color: "#555",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em"
}
const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1.5px solid #e0d9d0", fontSize: 14, color: "#24221b",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff"
}
const btnPrimary: React.CSSProperties = {
    padding: "9px 22px", borderRadius: 8, background: "#f2d04e",
    border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#24221b"
}
const btnOutline: React.CSSProperties = {
    padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e0d9d0",
    background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#666"
}
const btnEdit: React.CSSProperties = {
    padding: "6px 14px", borderRadius: 7, background: "#f3efea",
    border: "1px solid #e0d9d0", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#24221b"
}
const btnDelete: React.CSSProperties = {
    padding: "6px 14px", borderRadius: 7, background: "#fff0f0",
    border: "1px solid #f5c6c6", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#c0392b"
}
const btnRestore: React.CSSProperties = {
    padding: "6px 14px", borderRadius: 7, background: "#f0fff4",
    border: "1px solid #b7f5c8", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#27ae60"
}