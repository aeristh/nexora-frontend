"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "../components/ConfirmModal"

type User = {
    id: number
    name: string
    role: "admin" | "user"
}

type Blog = {
    id: number
    title: string
    content: string
    coverImage?: string | null
    authorName: string
    authorId: number
    createdAt: string
}

const BASE = "http://localhost:3333"
const ITEMS_PER_PAGE = 2  // 2 post per batch

function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
    })
}

const PenIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
)

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const ArticlesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

export default function BlogPage() {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [allBlogs, setAllBlogs] = useState<Blog[]>([])       // semua data dari server
    const [visibleBlogs, setVisibleBlogs] = useState<Blog[]>([]) // yang ditampilkan
    const [newStartIndex, setNewStartIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [deleting, setDeleting] = useState(false)
    const showMoreRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) setCurrentUser(JSON.parse(userData))
        fetchBlogs()
    }, [])

    async function fetchBlogs() {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${BASE}/blogs`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            const fetched: Blog[] = data.data || []
            setAllBlogs(fetched)
            // Tampilkan hanya ITEMS_PER_PAGE pertama
            setVisibleBlogs(fetched.slice(0, ITEMS_PER_PAGE))
            setNewStartIndex(0)
        } catch {
            setAllBlogs([])
            setVisibleBlogs([])
        } finally {
            setLoading(false)
        }
    }

    function handleShowMore() {
        const currentCount = visibleBlogs.length
        const nextSlice = allBlogs.slice(currentCount, currentCount + ITEMS_PER_PAGE)
        if (nextSlice.length === 0) return

        setLoadingMore(true)
        setNewStartIndex(currentCount)

        // Simulasi delay kecil agar skeleton terasa
        setTimeout(() => {
            setVisibleBlogs(prev => [...prev, ...nextSlice])
            setLoadingMore(false)
            setTimeout(() => {
                showMoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
            }, 80)
        }, 300)
    }

    async function handleDelete() {
        if (!deleteId) return
        setDeleting(true)
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${BASE}/blogs/${deleteId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error()
            setDeleteId(null)
            fetchBlogs()
        } catch {
            alert("Gagal menghapus artikel.")
        } finally {
            setDeleting(false)
        }
    }

    const isAdmin = currentUser?.role === "admin"
    const pageTitle = isAdmin ? "Semua Artikel" : "Artikel Saya"
    const pageSubtitle = isAdmin ? "Kelola semua artikel yang telah dipublikasikan" : "Artikel yang telah kamu publikasikan"
    const hasMore = visibleBlogs.length < allBlogs.length

    return (
        <>
            <style>{pageStyles}</style>
            <div className="bp-page">

                <div className="bp-header">
                    <div className="bp-header__left">
                        <div className="bp-header__icon"><ArticlesIcon /></div>
                        <div>
                            <h1 className="bp-header__title">{pageTitle}</h1>
                            <p className="bp-header__sub">{pageSubtitle}</p>
                        </div>
                    </div>
                    <button className="bp-write-btn" onClick={() => router.push("/blog/write")}>
                        <PenIcon />
                        Tulis Artikel
                    </button>
                </div>

                <div className="bp-stats">
                    <span className="bp-stats__count">
                        <strong>{allBlogs.length}</strong> artikel
                        {!isAdmin && " ditulis oleh kamu"}
                        {allBlogs.length > ITEMS_PER_PAGE && (
                            <span className="bp-stats__showing">
                                &nbsp;· menampilkan {Math.min(visibleBlogs.length, allBlogs.length)} dari {allBlogs.length}
                            </span>
                        )}
                    </span>
                </div>

                {loading ? (
                    <div className="bp-grid">
                        {[1, 2].map(i => <div key={i} className="bp-skeleton" />)}
                    </div>
                ) : allBlogs.length === 0 ? (
                    <div className="bp-empty">
                        <h3>Belum ada artikel</h3>
                        <p>Mulai tulis artikel pertamamu sekarang!</p>
                        <button className="bp-write-btn" onClick={() => router.push("/blog/write")}>
                            <PenIcon />
                            Tulis Artikel Pertama
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bp-grid">
                            {visibleBlogs.map((blog, i) => (
                                <div
                                    key={blog.id}
                                    className={`bp-card ${i >= newStartIndex && newStartIndex > 0 ? "bp-card--new" : ""}`}
                                    style={{
                                        animationDelay: (i >= newStartIndex && newStartIndex > 0)
                                            ? `${(i - newStartIndex) * 80}ms`
                                            : "0ms"
                                    }}
                                >
                                    <div className="bp-card__img">
                                        {blog.coverImage
                                            ? <img src={blog.coverImage.startsWith("http") ? blog.coverImage : `${BASE}${blog.coverImage}`} alt={blog.title} />
                                            : <div className="bp-card__img-empty">✍️</div>
                                        }
                                    </div>
                                    <div className="bp-card__body">
                                        <h3 className="bp-card__title">{blog.title}</h3>
                                        <p className="bp-card__excerpt">{stripHtml(blog.content).slice(0, 110)}…</p>
                                        <div className="bp-card__footer">
                                            <div className="bp-card__meta">
                                                <span className="bp-card__avatar">{getInitials(blog.authorName)}</span>
                                                <div className="bp-card__meta-text">
                                                    <span className="bp-card__author">{blog.authorName}</span>
                                                    <span className="bp-card__date">{formatDate(blog.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div className="bp-card__actions">
                                                <button className="bp-icon-btn bp-icon-btn--edit" onClick={() => router.push(`/blog/write?id=${blog.id}`)} title="Edit">
                                                    <EditIcon />
                                                </button>
                                                <button className="bp-icon-btn bp-icon-btn--delete" onClick={() => setDeleteId(blog.id)} title="Hapus">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Skeleton saat load more */}
                            {loadingMore && [1, 2].map(i => (
                                <div key={`sk-${i}`} className="bp-skeleton bp-skeleton--inline" />
                            ))}
                        </div>

                        {/* Show More area */}
                        <div ref={showMoreRef} className="bp-showmore-wrap">
                            {hasMore && !loadingMore && (
                                <button className="bp-showmore-btn" onClick={handleShowMore}>
                                    <span className="bp-showmore-line" />
                                    <span className="bp-showmore-text">
                                        Tampilkan lebih banyak
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </span>
                                    <span className="bp-showmore-line" />
                                </button>
                            )}
                            {!hasMore && allBlogs.length > ITEMS_PER_PAGE && (
                                <p className="bp-showmore-end">
                                    Menampilkan semua {allBlogs.length} artikel
                                </p>
                            )}
                            {loadingMore && (
                                <p className="bp-showmore-loading">
                                    <span className="bp-dot-pulse" />
                                    Memuat artikel...
                                </p>
                            )}
                        </div>
                    </>
                )}

                <ConfirmModal
                    isOpen={!!deleteId}
                    title="Hapus Artikel?"
                    message="Artikel yang dihapus tidak bisa dikembalikan."
                    confirmLabel={deleting ? "Menghapus..." : "Ya, Hapus"}
                    cancelLabel="Batal"
                    variant="danger"
                    iconType="trash"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            </div>
        </>
    )
}

const pageStyles = `
.bp-page {
    padding: 32px 32px 64px;
    max-width: 960px;
    margin: 0 auto;
}

.bp-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; gap: 16px; flex-wrap: wrap;
}
.bp-header__left { display: flex; align-items: center; gap: 14px; }
.bp-header__icon {
    width: 44px; height: 44px; background: #f59e0b; color: #24221b;
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
}
.bp-header__title { font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 0 0 2px; letter-spacing: -0.03em; }
.bp-header__sub { font-size: 13px; color: #888; margin: 0; }

.bp-write-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; border-radius: 100px;
    background: #f59e0b; color: #24221b;
    font-size: 14px; font-weight: 700; border: none; cursor: pointer;
    box-shadow: 0 2px 12px rgba(245,158,11,0.35);
    transition: all 0.18s; font-family: inherit; letter-spacing: -0.01em;
}
.bp-write-btn:hover { background: #d97706; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(245,158,11,0.45) }

.bp-stats {
    margin-bottom: 24px; padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
}
.bp-stats__count { font-size: 13px; color: #888; }
.bp-stats__count strong { color: #1a1a1a; }
.bp-stats__showing { color: #bbb; }

.bp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
}

.bp-card {
    background: #fff; border: 1.5px solid rgba(0,0,0,0.07);
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; flex-direction: column;
}
.bp-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.10); }
/* Hanya card baru yang animasi */
.bp-card--new {
    animation: bp-fadein 0.5s ease both;
}
@keyframes bp-fadein {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
}

.bp-card__img {
    height: 160px; overflow: hidden; background: #f5f5f5; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
}
.bp-card__img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bp-card__img-empty { font-size: 36px; }

.bp-card__body { padding: 16px 18px; display: flex; flex-direction: column; flex: 1; }
.bp-card__title {
    font-size: 15px; font-weight: 700; color: #1a1a1a;
    margin: 0 0 8px; line-height: 1.35; letter-spacing: -0.02em;
}
.bp-card__excerpt { font-size: 12.5px; color: #888; line-height: 1.65; margin: 0 0 14px; flex: 1; }
.bp-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.bp-card__meta { display: flex; align-items: center; gap: 8px; }
.bp-card__avatar {
    width: 22px; height: 22px; border-radius: 50%;
    background: #f59e0b; color: #24221b;
    font-size: 8px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.bp-card__meta-text { display: flex; flex-direction: column; }
.bp-card__author { font-size: 11.5px; font-weight: 600; color: #444; line-height: 1.2; }
.bp-card__date { font-size: 10.5px; color: #bbb; }
.bp-card__actions { display: flex; gap: 6px; flex-shrink: 0; }

.bp-icon-btn {
    width: 30px; height: 30px; border-radius: 8px; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s;
}
.bp-icon-btn--edit { background: #f0f0f0; color: #555; }
.bp-icon-btn--edit:hover { background: #f59e0b; color: #24221b; }
.bp-icon-btn--delete { background: #fff0f0; color: #e74c3c; }
.bp-icon-btn--delete:hover { background: #e74c3c; color: #fff; }

.bp-skeleton {
    height: 260px; border-radius: 18px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: bp-shimmer 1.5s infinite;
}
.bp-skeleton--inline {
    animation: bp-shimmer 1.5s infinite, bp-fadein 0.4s ease both;
}
@keyframes bp-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.bp-empty {
    text-align: center; padding: 80px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.bp-empty h3 { font-size: 18px; font-weight: 700; color: #1a1a1a; margin: 0; }
.bp-empty p { color: #888; font-size: 14px; margin: 0 0 8px; }

/* ── Show More ── */
.bp-showmore-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    min-height: 32px;
}

.bp-showmore-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 0;
    font-family: inherit;
    width: 100%;
    max-width: 420px;
}
.bp-showmore-btn:hover .bp-showmore-text { color: #d97706; }
.bp-showmore-btn:hover .bp-showmore-line { background: #f59e0b; }

.bp-showmore-line {
    flex: 1;
    height: 1px;
    background: #e8e8e8;
    transition: background 0.2s;
}

.bp-showmore-text {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 600;
    color: #aaa;
    transition: color 0.2s;
    letter-spacing: 0.01em;
}
.bp-showmore-text svg { transition: transform 0.2s; }
.bp-showmore-btn:hover .bp-showmore-text svg { transform: translateY(2px); }

.bp-showmore-end {
    font-size: 12px;
    color: #bbb;
    margin: 0;
}

.bp-showmore-loading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #aaa;
    margin: 0;
}
.bp-dot-pulse {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #f59e0b;
    display: inline-block;
    animation: dot-pulse 1s ease-in-out infinite;
}
@keyframes dot-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.6); opacity: 0.5; }
}

@media (max-width: 768px) {
    .bp-page { padding: 20px 16px 48px; }
    .bp-header { flex-direction: column; align-items: flex-start; }
    .bp-grid { grid-template-columns: 1fr; }
    .bp-showmore-btn { max-width: 100%; }
}
`
