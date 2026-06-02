"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/app/components/ConfirmModal"

type Comment = {
    id: number
    blogId: number
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
    const [filter, setFilter] = useState<'all' | 'approved' | 'hidden'>('all')
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")
        if (!token || !user) { router.push("/"); return }
        const parsed = JSON.parse(user)
        if (parsed.role !== "admin") { router.push("/dashboard"); return }
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
            }
        } finally {
            setActionLoading(null)
            setDeleteTarget(null)
        }
    }

    const filtered = filter === 'all'
        ? comments
        : comments.filter(c => c.status === filter)

    const countAll = comments.length
    const countApproved = comments.filter(c => c.status === 'approved').length
    const countHidden = comments.filter(c => c.status === 'hidden').length

    return (
        <div>
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

            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                {[
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
                        }}
                    >
                        {s.label}
                        <span style={{
                            background: filter === s.key ? "rgba(0,0,0,0.12)" : "var(--border, #eee)",
                            padding: "1px 8px", borderRadius: 999,
                            fontSize: 12,
                        }}>
                            {s.value}
                        </span>
                    </button>
                ))}
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
                                background: "var(--bg, #fff)",
                                border: `1.5px solid ${c.status === 'hidden' ? "#fde8e8" : "#e8f5e9"}`,
                                borderRadius: 12, padding: "14px 16px",
                                display: "flex", gap: 14, alignItems: "flex-start",
                                transition: "border-color 0.2s",
                            }}>

                                <div style={{
                                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                                    background: "#f2d04e", color: "#24221b",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 12, fontWeight: 800,
                                }}>
                                    {c.userName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                                        <span style={{ fontWeight: 700, fontSize: 13 }}>{c.userName}</span>
                                        <span style={{ fontSize: 11, color: "#bbb" }}>{formatDate(c.createdAt)}</span>
                                        <span style={{ fontSize: 11, color: "#aaa" }}>· Blog #{c.blogId}</span>

                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                                            background: c.status === 'approved' ? "#d1fae5" : "#fee2e2",
                                            color: c.status === 'approved' ? "#065f46" : "#991b1b",
                                            border: `1px solid ${c.status === 'approved' ? "#6ee7b7" : "#fca5a5"}`,
                                        }}>
                                            {c.status === 'approved' ? "Tampil" : "Tersensor"}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: 14, color: "#444", margin: "0 0 10px", lineHeight: 1.6 }}>
                                        {c.content}
                                    </p>

                                    {c.status === 'hidden' && (
                                        <p style={{
                                            fontSize: 12, color: "#aaa", margin: "0 0 10px",
                                            fontStyle: "italic", background: "#fafafa",
                                            padding: "6px 10px", borderRadius: 8,
                                            border: "1px dashed #eee",
                                        }}>
                                            Tampilan pengunjung: "{sensorContent(c.content)}"
                                        </p>
                                    )}

                                    {/* Tombol aksi */}
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        {c.status === 'hidden' ? (
                                            <button
                                                onClick={() => handleStatus(c.id, 'approved')}
                                                disabled={actionLoading === c.id}
                                                style={{
                                                    padding: "6px 14px", borderRadius: 999, border: "none",
                                                    background: "#d1fae5", color: "#065f46",
                                                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                                                    fontFamily: "inherit", opacity: actionLoading === c.id ? 0.5 : 1,
                                                }}
                                            >
                                                Tampilkan
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatus(c.id, 'hidden')}
                                                disabled={actionLoading === c.id}
                                                style={{
                                                    padding: "6px 14px", borderRadius: 999, border: "none",
                                                    background: "#fee2e2", color: "#991b1b",
                                                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                                                    fontFamily: "inherit", opacity: actionLoading === c.id ? 0.5 : 1,
                                                }}
                                            >
                                                Sensor
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeleteTarget(c.id)}
                                            disabled={actionLoading === c.id}
                                            style={{
                                                padding: "6px 14px", borderRadius: 999,
                                                border: "1.5px solid #eee", background: "transparent",
                                                color: "#999", fontSize: 12, fontWeight: 600,
                                                cursor: "pointer", fontFamily: "inherit",
                                                opacity: actionLoading === c.id ? 0.5 : 1,
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}