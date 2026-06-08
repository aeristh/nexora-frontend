"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/app/components/ConfirmModal"

const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 15, height: 15, stroke: "currentColor" }}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 15, height: 15, stroke: "currentColor" }}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)

const ExternalLinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 15, height: 15, stroke: "currentColor" }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
)

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 15, height: 15, stroke: "currentColor" }}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" /><path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
)

type Comment = {
    id: number
    blogId: number
    blogSlug: string
    blogTitle: string | null
    content: string
    status: 'approved' | 'hidden'
    userName: string
    createdAt: string
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

function sensorContent(text: string) {
    const words = text.trim().split(/\s+/)
    if (words.length <= 3) return words.join(" ") + " ***"
    const visible = words.slice(0, 3).join(" ")
    const hidden = words.slice(3).map(() => "***").join(" ")
    return `${visible} ${hidden}`
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    })
}

export default function AdminCommentsPage() {
    const router = useRouter()
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'new' | 'all' | 'approved' | 'hidden'>('new')
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
    const [seenIds, setSeenIds] = useState<Set<number>>(new Set())

    const [toast, setToast] = useState("")
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 2500)
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")
        if (!token || !user) { router.push("/"); return }
        const parsed = JSON.parse(user)
        if (parsed.role !== "admin") { router.push("/dashboard"); return }

        const stored = localStorage.getItem("nexora_seen_comment_ids")
        if (stored) setSeenIds(new Set(JSON.parse(stored)))

        fetchComments(token)
    }, [])

    async function fetchComments(token?: string) {
        const t = token || localStorage.getItem("token") || ""
        try {
            const res = await fetch(`${BASE}/admin/comments`, {
                headers: { Authorization: `Bearer ${t}` }
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            console.log(data[0])
            setComments(Array.isArray(data) ? data : [])
        } catch {
            setComments([])
        } finally {
            setLoading(false)
        }
    }

    async function handleStatus(id: number, status: 'approved' | 'hidden') {
        const token = localStorage.getItem("token") || ""
        setActionLoading(id)
        try {
            const res = await fetch(`${BASE}/comments/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            })
            if (res.ok) {
                setComments(prev =>
                    prev.map(c => c.id === id ? { ...c, status } : c)
                )
                showToast(status === 'approved' ? "Komentar ditampilkan" : "Komentar disensor")
            }
        } finally {
            setActionLoading(null)
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return
        const token = localStorage.getItem("token") || ""
        setActionLoading(deleteTarget)
        try {
            const res = await fetch(`${BASE}/comments/${deleteTarget}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                setComments(prev => prev.filter(c => c.id !== deleteTarget))
                showToast("Komentar berhasil dihapus")
            }
        } finally {
            setActionLoading(null)
            setDeleteTarget(null)
        }
    }

    function markAllAsSeen() {
        const allIds = comments.map(c => c.id)
        const updated = new Set([...seenIds, ...allIds])
        setSeenIds(updated)
        localStorage.setItem("nexora_seen_comment_ids", JSON.stringify([...updated]))
        setFilter('all')
        showToast("Semua komentar sudah ditandai dilihat")
    }

    const countNew = comments.filter(c => !seenIds.has(c.id)).length
    const countAll = comments.length
    const countApproved = comments.filter(c => c.status === 'approved').length
    const countHidden = comments.filter(c => c.status === 'hidden').length

    const filtered = filter === 'new'
        ? comments.filter(c => !seenIds.has(c.id))
        : filter === 'all'
            ? comments
            : comments.filter(c => c.status === filter)

    return (
        <div>
            {toast && <div className="toast">{toast}</div>}
            <ConfirmModal
                isOpen={deleteTarget !== null}
                title="Hapus Komentar"
                message="Komentar akan dihapus permanen. Lanjutkan?"
                confirmLabel="Ya, Hapus"
                cancelLabel="Batal"
                variant="danger"
                iconType="trash"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
            <div className="topbar">
                <div className="topbar-left">
                    <h1>Komentar</h1>
                    <p>Kelola komentar dari semua artikel</p>
                </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
                {[
                    { label: "Baru", value: countNew, key: "new", color: "#e0e7ff", text: "#3730a3" },
                    { label: "Semua", value: countAll, key: "all", color: "#f2d04e", text: "#24221b" },
                    { label: "Tampil", value: countApproved, key: "approved", color: "#d1fae5", text: "#065f46" },
                    { label: "Tersensor", value: countHidden, key: "hidden", color: "#fee2e2", text: "#991b1b" },
                ].map(s => (
                    <button
                        key={s.key}
                        onClick={() => setFilter(s.key as typeof filter)}
                        style={{
                            padding: "10px 20px", borderRadius: 12,
                            border: `2px solid ${filter === s.key ? s.color : "transparent"}`,
                            background: filter === s.key ? s.color : "var(--bg-card, #fff)",
                            color: filter === s.key ? s.text : "var(--text-secondary, #888)",
                            fontWeight: 700, fontSize: 13, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 8,
                            fontFamily: "inherit",
                            boxShadow: filter === s.key ? `0 2px 12px ${s.color}88` : "none",
                            transition: "all 0.18s",
                            position: "relative",
                        }}
                    >
                        {s.label}
                        {s.key === "new" && countNew > 0 && (
                            <span style={{
                                position: "absolute", top: 6, right: 6,
                                width: 7, height: 7, borderRadius: "50%",
                                background: "#ef4444",
                            }} />
                        )}
                        <span style={{
                            background: filter === s.key ? "rgba(0,0,0,0.12)" : "var(--border, #eee)",
                            padding: "1px 8px", borderRadius: 999, fontSize: 12,
                        }}>
                            {s.value}
                        </span>
                    </button>
                ))}

                {filter === 'new' && countNew > 0 && (
                    <button
                        onClick={markAllAsSeen}
                        style={{
                            marginLeft: "auto",
                            padding: "10px 16px", borderRadius: 12,
                            border: "1.5px solid #c7d2fe",
                            background: "#f5f3ff", color: "#4338ca",
                            fontWeight: 600, fontSize: 12, cursor: "pointer",
                            fontFamily: "inherit", transition: "all 0.18s",
                        }}
                    >
                        Tandai Sudah Dilihat
                    </button>
                )}
            </div>

            <div className="container">
                {loading ? (
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "24px 0" }}>
                        Memuat komentar...
                    </p>
                ) : filtered.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "24px 0", textAlign: "center" }}>
                        Tidak ada komentar.
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {filtered.map(c => (
                            <div key={c.id} style={{
                                background: "var(--bg-card, #fff)",
                                border: "0.5px solid var(--border, #e8e8e8)",
                                borderLeft: `3px solid ${c.status === 'hidden' ? "#E24B4A" : "#639922"}`,
                                borderRadius: "0 12px 12px 0",
                                padding: "14px 16px",
                                display: "flex", gap: 12, alignItems: "center",
                            }}>
                                <div style={{ position: "relative" }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                        background: "#f2d04e", color: "#24221b",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 11, fontWeight: 700,
                                    }}>
                                        {c.userName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                                    </div>
                                    {!seenIds.has(c.id) && (
                                        <span style={{
                                            position: "absolute", top: 0, right: 0,
                                            width: 10, height: 10, borderRadius: "50%",
                                            background: "#3b82f6", border: "2px solid white",
                                        }} />
                                    )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                        <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary, #1a1a1a)" }}>{c.userName}</span>
                                        <span style={{ fontSize: 11, color: "var(--text-tertiary, #bbb)" }}>{formatDate(c.createdAt)}</span>
                                        <span style={{ fontSize: 11, color: "var(--text-tertiary, #bbb)" }}>· {c.blogTitle}</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: "var(--text-secondary, #555)", margin: 0, lineHeight: 1.6 }}>
                                        {c.content}
                                    </p>
                                </div>

                                <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center", minWidth: 160, justifyContent: "flex-end" }}>

                                    <button
                                        onClick={() => handleStatus(c.id, c.status === 'hidden' ? 'approved' : 'hidden')}
                                        disabled={actionLoading === c.id}
                                        title={c.status === 'hidden' ? "Klik untuk tampilkan" : "Klik untuk sensor"}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                            padding: "5px 12px", borderRadius: 999, border: "none",
                                            cursor: "pointer", transition: "opacity 0.2s", fontFamily: "inherit",
                                            fontSize: 12, fontWeight: 600,
                                            background: c.status === 'approved' ? "#EAF3DE" : "#FCEBEB",
                                            color: c.status === 'approved' ? "#27500A" : "#791F1F",
                                            opacity: actionLoading === c.id ? 0.5 : 1,
                                        }}
                                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.75"}
                                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = actionLoading === c.id ? "0.5" : "1"}
                                    >
                                        {c.status === 'approved' ? <EyeIcon /> : <EyeOffIcon />}
                                        {c.status === 'approved' ? "Tampil" : "Tersensor"}
                                    </button>

                                    <button
                                        onClick={() => router.push(`/blog/${c.blogSlug}`)}
                                        title="Lihat Artikel"
                                        style={{
                                            width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            border: "1px solid #e5e7eb", background: "#fff",
                                            color: "#6b7280", transition: "all 0.15s",
                                        }}
                                    >
                                        <ExternalLinkIcon />
                                    </button>

                                    <button
                                        onClick={() => setDeleteTarget(c.id)}
                                        disabled={actionLoading === c.id}
                                        title="Hapus"
                                        style={{
                                            width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            border: "1px solid #fecaca", background: "#fff5f5",
                                            color: "#ef4444",
                                            opacity: actionLoading === c.id ? 0.5 : 1,
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}