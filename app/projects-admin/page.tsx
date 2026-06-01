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
                <button className="add-btn" onClick={() => router.push("/projects-admin/write")}>+ Tambah Project</button>
                <input
                    placeholder="Cari title, atau kategori..."
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
                                <th style={thStyle}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: 14 }}>
                                        <div style={{ fontSize: 32, marginBottom: 8 }}></div>
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
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                            <button onClick={() => router.push(`/projects-admin/write?id=${p.id}`)} title="Edit" style={{
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

        </div>
    )
}