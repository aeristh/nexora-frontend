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

export default function BlogDetailPage() {
    const params = useParams()
    const [blog, setBlog] = useState<Blog | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        setIsLoggedIn(!!token)

        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)

        async function fetchBlog() {
            try {
                const headers: HeadersInit = token
                    ? { Authorization: `Bearer ${token}` }
                    : {}
                const res = await fetch(`${BASE}/blogs/slug/${params.slug}`, { headers })
                if (!res.ok) { setNotFound(true); return }
                const data = await res.json()
                setBlog(data.data || data)
            } catch {
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
        return () => window.removeEventListener("scroll", onScroll)
    }, [params.slug])

    const backUrl = isLoggedIn ? "/blog" : "/articles"
    const backLabel = isLoggedIn ? "Kembali ke Blog" : "Kembali ke Artikel"
    const coverSrc = blog?.coverImage?.replace('/uploads', '/api-uploads') ?? ''

    return (
        <>
            <style>{detailStyles}</style>
            <div className="bd-root">

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
`
