"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

type Blog = {
    id: number
    title: string
    content: string
    coverImage?: string | null
    authorName: string
    authorId: number
    category?: string | null
    tags?: string[] | null
    createdAt: string
    updatedAt: string
}

type Comment = {
    id: number
    content: string
    status: 'approved' | 'hidden'
    userName: string
    createdAt: string
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    })
}

function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

function sensorContent(text: string) {
    const trimmed = text.trim()
    if (trimmed.length <= 3) return "***"
    const visible = trimmed.slice(0, 3)
    const hidden = "*".repeat(trimmed.length - 3)
    return `${visible}${hidden}`
}

function formatDateShort(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric"
    })
}

export default function BlogDetailPage() {
    const params = useParams()
    const [blog, setBlog] = useState<Blog | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [copied, setCopied] = useState(false)
    const [comments, setComments] = useState<Comment[]>([])
    const [commentText, setCommentText] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [submitMsg, setSubmitMsg] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<{ fullName: string } | null>(null)
    const [guestName, setGuestName] = useState("")
    const [guestEmail, setGuestEmail] = useState("")
    const [commentExpanded, setCommentExpanded] = useState(false)

    function getShareUrl() {
        if (typeof window !== "undefined") return window.location.href
        return ""
    }

    function handleCopyLink() {
        navigator.clipboard.writeText(getShareUrl()).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    function handleShareWA() {
        const url = encodeURIComponent(getShareUrl())
        const text = encodeURIComponent(`${blog?.title} - `)
        window.open(`https://wa.me/?text=${text}${url}`, "_blank")
    }

    function handleShareFB() {
        const url = encodeURIComponent(getShareUrl())
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
    }

    function handleShareTwitter() {
        const url = encodeURIComponent(getShareUrl())
        const text = encodeURIComponent(`${blog?.title}`)
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank")
    }

    async function handleSubmitComment() {
        if (!commentText.trim() || !blog) return

        if (!isLoggedIn) {
            if (!guestName.trim() || !guestEmail.trim()) {
                setSubmitMsg("Nama dan email wajib diisi.")
                return
            }
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)
            if (!emailValid) {
                setSubmitMsg("Format email tidak valid.")
                return
            }
        }

        setSubmitting(true)
        setSubmitMsg(null)

        try {
            const token = localStorage.getItem("token")
            const headers: HeadersInit = { "Content-Type": "application/json" }
            if (token) headers["Authorization"] = `Bearer ${token}`

            const body: Record<string, string> = { content: commentText }
            if (!isLoggedIn) {
                body.guestName = guestName.trim()
                body.guestEmail = guestEmail.trim()
            }

            const res = await fetch(`${BASE}/blogs/${blog.id}/comments`, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            })

            if (res.ok) {
                setCommentText("")
                if (!isLoggedIn) { setGuestName(""); setGuestEmail("") }
                setSubmitMsg("Komentar terkirim!")
                setTimeout(() => setSubmitMsg(null), 3000)

                const cmtRes = await fetch(`${BASE}/blogs/${blog.id}/comments`)
                if (cmtRes.ok) {
                    const cmtData = await cmtRes.json()
                    setComments(Array.isArray(cmtData) ? cmtData : [])
                }
            } else {
                const err = await res.json()
                setSubmitMsg(err.message ?? "Gagal mengirim komentar.")
            }
        } catch {
            setSubmitMsg("Gagal mengirim komentar.")
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        setIsLoggedIn(!!token)

        const userData = localStorage.getItem("user")
        if (userData) {
            try { setCurrentUser(JSON.parse(userData)) } catch { }
        }

        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)

        async function fetchBlog() {
            try {
                const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
                const res = await fetch(`${BASE}/blogs/slug/${params.slug}`, { headers })
                if (!res.ok) { setNotFound(true); return }
                const data = await res.json()
                setBlog(data.data || data)
                const blogId = (data.data || data).id
                const cmtRes = await fetch(`${BASE}/blogs/${blogId}/comments`)
                if (cmtRes.ok) {
                    const cmtData = await cmtRes.json()
                    setComments(Array.isArray(cmtData) ? cmtData : [])
                }
            } catch {
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
        return () => window.removeEventListener("scroll", onScroll)
    }, [params.slug])

    const ShareBar = () => (
        <div className="bd-share-bar">
            <span className="bd-share-label">Bagikan</span>
            <div className="bd-share-icons">
                <button className="bd-share-icon-btn" onClick={handleCopyLink} title="Salin Link">
                    {copied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    )}
                </button>
                <button className="bd-share-icon-btn bd-share-icon-btn--wa" onClick={handleShareWA} title="WhatsApp">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.849L.057 24l6.304-1.654A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 0 1-5.001-1.371l-.357-.213-3.744.982 1-3.645-.233-.374A9.79 9.79 0 0 1 2.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z" />
                    </svg>
                </button>
                <button className="bd-share-icon-btn bd-share-icon-btn--fb" onClick={handleShareFB} title="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </button>
                <button className="bd-share-icon-btn bd-share-icon-btn--tw" onClick={handleShareTwitter} title="X / Twitter">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </button>
            </div>
        </div>
    )

    const backUrl = "/articles"
    const backLabel = "Kembali ke Artikel"
    const coverSrc = blog?.coverImage?.replace('/uploads', '/api-uploads') ?? ''

    return (
        <>
            <style>{detailStyles}</style>
            <div className="bd-root">

                <div className={`bd-toast ${copied ? "bd-toast--show" : ""}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Link tersalin!
                </div>

                <nav className={`bd-nav ${scrolled ? "bd-nav--scrolled" : ""}`}>
                    <div className="bd-nav__inner">
                        <Link href={backUrl} className="bd-back-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back
                        </Link>
                        <span className="bd-nav__brand">Nexora<span className="bd-nav__dot">.</span></span>
                    </div>
                </nav>

                <div className="bd-content-wrap">
                    {loading ? (
                        <div className="bd-loading">Memuat artikel...</div>
                    ) : notFound || !blog ? (
                        <div className="bd-notfound">
                            <p>Artikel tidak ditemukan.</p>
                            <Link href={backUrl} className="bd-notfound__btn">{backLabel}</Link>
                        </div>
                    ) : (
                        <div className="bd-container">
                            {blog.coverImage ? (
                                <div className="bd-layout">
                                    <div className="bd-cover-side">
                                        <img src={coverSrc} alt={blog.title} />

                                        {blog.category && (
                                            <div className="bd-sidebar-section">
                                                <span className="bd-sidebar-label">Kategori</span>
                                                <span className="bd-category">{blog.category}</span>
                                            </div>
                                        )}
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="bd-sidebar-section">
                                                <span className="bd-sidebar-label">Tags</span>
                                                <div className="bd-tags">
                                                    {blog.tags.map(tag => (
                                                        <span key={tag} className="bd-tag">#{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <ShareBar />
                                    </div>
                                    <div className="bd-text-side">
                                        <h1 className="bd-title">{blog.title}</h1>
                                        <div className="bd-meta">
                                            <span className="bd-author-avatar">{getInitials(blog.authorName)}</span>
                                            <div>
                                                <p className="bd-author-name">{blog.authorName}</p>
                                                <p className="bd-date">{formatDate(blog.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="bd-body" dangerouslySetInnerHTML={{ __html: blog.content }} />

                                        <div className="bd-comment-section">
                                            <div className="bd-comment-header">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                </svg>
                                                <span>Komentar</span>
                                                <span className="bd-comment-count">{comments.length}</span>
                                            </div>

                                            {comments.length === 0 ? (
                                                <p className="bd-comment-empty">Belum ada komentar. Jadilah yang pertama!</p>
                                            ) : (
                                                <>
                                                    <div
                                                        className="bd-comment-list"
                                                        style={{
                                                            maxHeight: commentExpanded ? 275 : 90,
                                                            overflowY: comments.length > 3 ? "auto" : "visible",
                                                            transition: "max-height 0.35s cubic-bezier(.4,0,.2,1)",
                                                            paddingRight: comments.length > 3 ? 4 : 0,
                                                        }}
                                                    >
                                                        {comments.map(c => (
                                                            <div key={c.id} className="bd-comment-item">
                                                                <div className="bd-comment-avatar">
                                                                    {c.userName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                                                                </div>
                                                                <div className="bd-comment-body">
                                                                    <div className="bd-comment-top">
                                                                        <span className="bd-comment-name">{c.userName}</span>
                                                                        <span className="bd-comment-date">{formatDateShort(c.createdAt)}</span>
                                                                        {c.status === 'hidden' && (
                                                                            <span className="bd-comment-badge">disensor</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="bd-comment-text">
                                                                        {c.status === 'hidden' ? sensorContent(c.content) : c.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {comments.length > 1 && (
                                                        <button
                                                            onClick={() => setCommentExpanded(!commentExpanded)}
                                                            className="bd-comment-expand-btn"
                                                        >
                                                            {commentExpanded ? (
                                                                <>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="18 15 12 9 6 15" />
                                                                    </svg>
                                                                    Sembunyikan
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="6 9 12 15 18 9" />
                                                                    </svg>
                                                                    Tampilkan semua ({comments.length} komentar)
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            <div className={`bd-comment-form-wrap ${!isLoggedIn ? "bd-comment-form-wrap--guest" : ""}`}>

                                                <div className="bd-comment-form-label">
                                                    {isLoggedIn ? (
                                                        <span>Komentar sebagai <strong>{currentUser?.fullName}</strong></span>
                                                    ) : (
                                                        <span className="bd-comment-guest-msg">
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="8" r="4" />
                                                                <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                                                            </svg>
                                                            Komentar sebagai tamu —
                                                            <Link href="/login" className="bd-comment-login-link">Login</Link>
                                                            untuk tidak perlu isi form
                                                        </span>
                                                    )}
                                                </div>

                                                {!isLoggedIn && (
                                                    <div className="bd-comment-guest-fields">
                                                        <input
                                                            className="bd-comment-input"
                                                            type="text"
                                                            placeholder="Nama"
                                                            value={guestName}
                                                            onChange={e => setGuestName(e.target.value)}
                                                            disabled={submitting}
                                                        />
                                                        <input
                                                            className="bd-comment-input"
                                                            type="email"
                                                            placeholder="Email (tidak ditampilkan)"
                                                            value={guestEmail}
                                                            onChange={e => setGuestEmail(e.target.value)}
                                                            disabled={submitting}
                                                        />
                                                    </div>
                                                )}

                                                <textarea
                                                    className="bd-comment-textarea"
                                                    placeholder="Tulis komentar..."
                                                    value={commentText}
                                                    onChange={e => setCommentText(e.target.value)}
                                                    disabled={submitting}
                                                    rows={3}
                                                />

                                                {submitMsg && (
                                                    <p className={`bd-comment-msg ${submitMsg.startsWith("✓")
                                                        ? "bd-comment-msg--ok" : "bd-comment-msg--err"}`}>
                                                        {submitMsg}
                                                    </p>
                                                )}

                                                <button
                                                    className="bd-comment-submit"
                                                    onClick={handleSubmitComment}
                                                    disabled={submitting || !commentText.trim()}
                                                >
                                                    {submitting ? "Mengirim..." : "Kirim Komentar"}
                                                </button>

                                                <p className="bd-comment-note">
                                                    Komentar akan tampil dalam bentuk tersensor.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h1 className="bd-title">{blog.title}</h1>
                                    <div className="bd-meta">
                                        <span className="bd-author-avatar">{getInitials(blog.authorName)}</span>
                                        <div>
                                            <p className="bd-author-name">{blog.authorName}</p>
                                            <p className="bd-date">{formatDate(blog.createdAt)}</p>
                                        </div>
                                    </div>

                                    {(blog.category || (blog.tags && blog.tags.length > 0)) && (
                                        <div className="bd-meta-inline">
                                            {blog.category && (
                                                <span className="bd-category">{blog.category}</span>
                                            )}
                                            {blog.tags && blog.tags.map(tag => (
                                                <span key={tag} className="bd-tag">#{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="bd-body" dangerouslySetInnerHTML={{ __html: blog.content }} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <footer className="bd-footer">
                    <p>© {new Date().getFullYear()} Nexora Management System.</p>
                </footer>
            </div>
        </>
    )
}

const detailStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');

  .bd-root {
    height: 100%;
    background: #f6f5f2;
    display: flex;
    flex-direction: column;
    font-family: "DM Sans", sans-serif;
  }
  .bd-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: #24221b;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 0 48px;
    transition: box-shadow 0.3s;
  }
  .bd-nav--scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
  .bd-nav__inner {
    max-width: 1200px; margin: 0 auto; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .bd-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.45);
    text-decoration: none; transition: color 0.2s;
  }
  .bd-back-btn:hover { color: #f2d04e; }
  .bd-nav__brand {
    font-size: 18px; font-weight: 700; letter-spacing: -0.04em;
    color: #fff; font-family: "DM Serif Display", serif;
  }
  .bd-nav__dot { color: #f2d04e; }

  .bd-content-wrap { flex: 1; padding: 76px 40px 80px; }

  .bd-container { max-width: 1000px; margin: 0 auto; }

  .bd-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 48px;
    align-items: start;
  }

  .bd-cover-side { position: sticky; top: 76px; }
  .bd-cover-side img { width: 100%; height: auto; display: block; border-radius: 12px; }

  .bd-sidebar-section {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .bd-sidebar-label {
    font-size: 10.5px;
    font-weight: 700;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .bd-category {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    background: #24221b;
    color: #f2d04e;
    font-size: 11.5px;
    font-weight: 700;
    border-radius: 20px;
    letter-spacing: 0.03em;
    width: fit-content;
  }
  .bd-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .bd-tag {
    display: inline-flex; align-items: center;
    padding: 3px 10px;
    background: #fff8ec;
    border: 1px solid #f5d89a;
    color: #c8960a;
    font-size: 11.5px; font-weight: 600;
    border-radius: 20px;
  }

  .bd-meta-inline {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-bottom: 24px;
  }

  .bd-title {
    font-size: clamp(22px, 2.8vw, 34px);
    font-weight: 800; color: #1a1a1a;
    letter-spacing: -0.04em; line-height: 1.15;
    margin: 0 0 20px; font-family: "DM Serif Display", serif;
  }
  .bd-meta {
    display: flex; align-items: center; gap: 12px;
    padding-bottom: 20px;
    border-bottom: 1.5px solid #e8e4de;
    margin-bottom: 28px;
  }
  .bd-author-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: #f2d04e; color: #24221b;
    font-size: 14px; font-weight: 800;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .bd-author-name { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0; }
  .bd-date { font-size: 12px; color: #999; margin: 2px 0 0; }

  .bd-body { font-size: 15px; line-height: 1.9; color: #444; }
  .bd-body h2 { font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 32px 0 10px; font-family: "DM Serif Display", serif; }
  .bd-body h3 { font-size: 17px; font-weight: 600; color: #1a1a1a; margin: 24px 0 8px; }
  .bd-body p { margin: 0 0 16px; line-height: 1.9; }
  .bd-body ul, .bd-body ol { padding-left: 22px; margin: 0 0 16px; }
  .bd-body li { margin-bottom: 6px; }
  .bd-body a { color: #c8960a; text-decoration: underline; }
  .bd-body strong { font-weight: 700; color: #1a1a1a; }
  .bd-body em { font-style: italic; }

  .bd-loading { text-align: center; padding: 80px 32px; color: #888; font-size: 15px; }
  .bd-notfound { text-align: center; padding: 80px 32px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .bd-notfound p { color: #888; font-size: 15px; margin: 0; }
  .bd-notfound__btn { background: #f2d04e; color: #24221b; padding: 10px 24px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 8px; }

  .bd-footer {
    background: #24221b; border-top: 1px solid rgba(255,255,255,0.06);
    padding: 20px 32px; text-align: center;
    font-size: 13px; color: rgba(255,255,255,0.28);
    font-family: "DM Sans", sans-serif;
  }

  @media (max-width: 768px) {
    .bd-nav { padding: 0 20px; }
    .bd-content-wrap { padding: 68px 20px 60px; }
    .bd-layout { grid-template-columns: 1fr; gap: 24px; }
    .bd-cover-side { position: static; max-width: 260px; }
    .bd-footer { padding: 20px; }
  }

.bd-comment-section {
  margin-top: 56px; padding-top: 40px;
  border-top: 2px solid #e8e4de;
}
.bd-comment-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 16px; font-weight: 700; color: #1a1a1a;
  margin-bottom: 24px;
}
.bd-comment-count {
  background: #f2d04e; color: #24221b;
  font-size: 11px; font-weight: 800;
  padding: 2px 8px; border-radius: 999px;
}
.bd-comment-empty {
  font-size: 14px; color: #aaa; text-align: center;
  padding: 24px 0; border: 1.5px dashed #e0dbd4;
  border-radius: 12px; margin-bottom: 24px;
}
.bd-comment-list {
  display: flex; flex-direction: column; gap: 16px;
  margin-bottom: 32px;
}
.bd-comment-item {
  display: flex; gap: 12px; background: #fff;
  border: 1.5px solid #eae7e1; border-radius: 12px;
  padding: 14px 16px;
}
.bd-comment-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  flex-shrink: 0; background: #f2d04e; color: #24221b;
  font-size: 11px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.bd-comment-body { flex: 1; min-width: 0; }
.bd-comment-top {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap; margin-bottom: 6px;
}
.bd-comment-name { font-size: 13px; font-weight: 700; color: #1a1a1a; }
.bd-comment-date { font-size: 11px; color: #bbb; }
.bd-comment-badge {
  font-size: 10px; font-weight: 700;
  background: #fff3cd; color: #b8880e;
  border: 1px solid #f0d88a;
  padding: 1px 7px; border-radius: 999px;
}
.bd-comment-text { font-size: 14px; color: #555; line-height: 1.7; margin: 0; }
.bd-comment-form-wrap {
  background: #fff; border: 1.5px solid #e0dbd4;
  border-radius: 14px; padding: 16px;
  transition: border-color 0.2s, background 0.2s;
}
.bd-comment-form-label {
  font-size: 12.5px; color: #888; margin-bottom: 10px;
}
.bd-comment-login-link {
  color: #c8960a; font-weight: 700; text-decoration: none;
  margin-left: 4px; transition: color 0.15s;
}
.bd-comment-login-link:hover { color: #a37208; }
.bd-comment-textarea {
  width: 100%; min-height: 88px;
  border: 1.5px solid #e0dbd4; border-radius: 10px;
  padding: 10px 14px; font-size: 14px;
  font-family: "DM Sans", sans-serif;
  color: #1a1a1a; resize: vertical;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box; outline: none; background: #fff;
}
.bd-comment-textarea:focus { border-color: #f2d04e; }
.bd-comment-form-wrap--locked .bd-comment-textarea {
  border-color: #f5c6c6; background: #fff5f5;
  cursor: not-allowed; color: #ccc;
}
.bd-comment-submit {
  margin-top: 10px; background: #24221b; color: #f2d04e;
  border: none; border-radius: 999px;
  padding: 9px 22px; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: background 0.2s, opacity 0.2s;
  font-family: "DM Sans", sans-serif;
}
.bd-comment-submit:hover:not(:disabled) { background: #363329; }
.bd-comment-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.bd-comment-note {
  font-size: 11.5px; color: #bbb; margin: 8px 0 0;
}
.bd-comment-msg {
  font-size: 13px; font-weight: 600;
  margin: 8px 0 0; padding: 8px 12px; border-radius: 8px;
}
.bd-comment-msg--ok {
  background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;
}
.bd-comment-msg--err {
  background: #fff5f5; color: #e53e3e; border: 1px solid #f5c6c6;
}

.bd-share-bar {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bd-share-label {
  font-size: 10.5px;
  font-weight: 700;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.bd-share-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.bd-share-icon-btn {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: 1.5px solid #e0dbd4;
  background: #fff;
  color: #666;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}
.bd-share-icon-btn:hover { transform: scale(1.1); opacity: 0.85; }
.bd-share-icon-btn--wa  { border-color: #25d36644; color: #128c4a; background: #f0fdf6; }
.bd-share-icon-btn--fb  { border-color: #1877f244; color: #1877f2; background: #eff6ff; }
.bd-share-icon-btn--tw  { border-color: #00000018; color: #1a1a1a; background: #f8f8f8; }

/* Guest form */
.bd-comment-form-wrap--guest {
  border-color: #e8e4de;
  background: #fdfcfa;
}
.bd-comment-guest-msg {
  display: flex; align-items: center; gap: 6px;
  color: #888; font-size: 12.5px; flex-wrap: wrap;
}
.bd-comment-guest-fields {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 8px; margin-bottom: 10px;
}
.bd-comment-input {
  width: 100%; padding: 9px 12px;
  border: 1.5px solid #e0dbd4; border-radius: 10px;
  font-size: 13px; font-family: "DM Sans", sans-serif;
  color: #1a1a1a; outline: none; background: #fff;
  transition: border-color 0.2s; box-sizing: border-box;
}
.bd-comment-input:focus { border-color: #f2d04e; }
.bd-comment-input::placeholder { color: #bbb; }
@media (max-width: 480px) {
  .bd-comment-guest-fields { grid-template-columns: 1fr; }
}

/* Scrollable comment list */
.bd-comment-list {
  scrollbar-width: thin;
  scrollbar-color: #e0dbd4 transparent;
}
.bd-comment-list::-webkit-scrollbar {
  width: 4px;
}
.bd-comment-list::-webkit-scrollbar-track {
  background: transparent;
}
.bd-comment-list::-webkit-scrollbar-thumb {
  background: #e0dbd4;
  border-radius: 999px;
}
.bd-comment-list::-webkit-scrollbar-thumb:hover {
  background: #c8c4bc;
}

.bd-comment-expand-btn {
  display: flex; align-items: center; gap: 6px;
  width: 100%; justify-content: center;
  padding: 9px 0; margin-bottom: 20px;
  background: transparent;
  border: 1.5px dashed #e0dbd4;
  border-radius: 10px;
  font-size: 12.5px; font-weight: 600;
  color: #999; cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.bd-comment-expand-btn:hover {
  border-color: #f2d04e;
  color: #24221b;
  background: #fffdf0;
}

.bd-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(16px);
  background: #24221b;
  color: #f2d04e;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 7px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease;
  z-index: 9999;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
}
.bd-toast--show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
`
