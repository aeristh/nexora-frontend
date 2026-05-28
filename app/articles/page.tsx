"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"

type Blog = {
    id: number
    title: string
    slug: string
    content: string
    coverImage?: string | null
    authorName: string
    authorId: number
    createdAt: string
}

const BASE = "http://localhost:3333"
const ITEMS_PER_PAGE = 3  // Tampil 3 per batch

function stripHtml(html: string) {
    return html
        .replace(/<\/?(h[1-6]|p|div|li|br|tr|td)[^>]*>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
    })
}

function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

const ClockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const UserIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" />
    </svg>
)

function ArticleCard({ blog, index, isNew }: { blog: Blog; index: number; isNew: boolean }) {
    const excerpt = stripHtml(blog.content).slice(0, 130) + "…"
    return (
        <Link
            href={`/blog/${blog.slug}`}
            className={`art-card ${isNew ? "art-card--new" : ""}`}
            style={{ animationDelay: isNew ? `${(index % ITEMS_PER_PAGE) * 80}ms` : "0ms" }}
        >
            <div className="art-card__img">
                {blog.coverImage
                    ? <img src={blog.coverImage.replace('/uploads', '/api-uploads')} alt={blog.title} />
                    : <div className="art-card__img-placeholder"></div>
                }
            </div>
            <div className="art-card__body">
                <h3 className="art-card__title">{blog.title}</h3>
                <p className="art-card__excerpt">{excerpt}</p>
                <div className="art-card__meta">
                    <span className="art-card__avatar">{getInitials(blog.authorName)}</span>
                    <span className="art-card__author"><UserIcon /> {blog.authorName}</span>
                    <span className="art-card__date"><ClockIcon /> {formatDate(blog.createdAt)}</span>
                </div>
                <span className="art-card__cta">Baca Selengkapnya</span>
            </div>
        </Link>
    )
}

export default function ArticlesPage() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const [newStartIndex, setNewStartIndex] = useState(0)
    const showMoreRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)
        fetchInitial()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    async function fetchInitial() {
        setLoading(true)
        try {
            const res = await fetch(`${BASE}/blogs/public?page=1&limit=${ITEMS_PER_PAGE}`)
            const data = await res.json()
            setBlogs(data.data || [])
            setTotal(data.meta?.total || 0)
            setPage(1)
            setNewStartIndex(0)
        } catch {
            setBlogs([])
        } finally {
            setLoading(false)
        }
    }

    async function handleShowMore() {
        const nextPage = page + 1
        setLoadingMore(true)
        try {
            const res = await fetch(`${BASE}/blogs/public?page=${nextPage}&limit=${ITEMS_PER_PAGE}`)
            const data = await res.json()
            const newBlogs = data.data || []
            setNewStartIndex(blogs.length) // mark where new ones start
            setBlogs(prev => [...prev, ...newBlogs])
            setPage(nextPage)

            setTimeout(() => {
                showMoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
            }, 100)
        } catch {
        } finally {
            setLoadingMore(false)
        }
    }

    const hasMore = blogs.length < total

    return (
        <>
            <style>{articlesStyles}</style>
            <div className="art-root">

                <nav className={`art-nav ${scrolled ? "art-nav--scrolled" : ""}`}>
                    <div className="art-nav__inner">
                        <Link href="/" className="art-back-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back
                        </Link>
                        <span className="art-nav__brand">Nexora<span className="art-nav__dot">.</span></span>
                    </div>
                </nav>

                <div className="art-content">
                    <div className="art-header">
                        <h1 className="art-header__title">Semua Artikel</h1>
                        <p className="art-header__sub">{total} artikel tersedia</p>
                    </div>

                    {loading ? (
                        <div className="art-grid">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="art-skeleton" />
                            ))}
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="art-empty">
                            <p>Belum ada artikel yang dipublikasikan.</p>
                        </div>
                    ) : (
                        <>
                            <div className="art-grid">
                                {blogs.map((blog, i) => (
                                    <ArticleCard
                                        key={blog.id}
                                        blog={blog}
                                        index={i}
                                        isNew={i >= newStartIndex && newStartIndex > 0}
                                    />
                                ))}

                                {loadingMore && [1, 2, 3].map(i => (
                                    <div key={`sk-${i}`} className="art-skeleton art-skeleton--inline" />
                                ))}
                            </div>

                            <div ref={showMoreRef} className="art-showmore-wrap">
                                {hasMore && !loadingMore && (
                                    <button className="art-showmore-btn" onClick={handleShowMore}>
                                        <span className="art-showmore-line" />
                                        <span className="art-showmore-text">
                                            Tampilkan lebih banyak
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </span>
                                        <span className="art-showmore-line" />
                                    </button>
                                )}
                                {!hasMore && blogs.length > ITEMS_PER_PAGE && (
                                    <p className="art-showmore-end">
                                        Menampilkan semua {total} artikel
                                    </p>
                                )}
                                {loadingMore && (
                                    <p className="art-showmore-loading">
                                        <span className="art-dot-pulse" />
                                        Memuat artikel...
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <footer className="art-footer">
                    <p>© {new Date().getFullYear()} Nexora Management System.</p>
                </footer>

            </div>
        </>
    )
}

const articlesStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');

  .art-root {
    min-height: 100vh;
    background: #f6f5f2;
    display: flex;
    flex-direction: column;
    font-family: "DM Sans", sans-serif;
  }

  .art-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: #24221b;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 0 48px;
    transition: box-shadow 0.3s;
  }
  .art-nav--scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
  .art-nav__inner {
    max-width: 1200px; margin: 0 auto; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .art-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.45);
    text-decoration: none; transition: color 0.2s;
  }
  .art-back-btn:hover { color: #f2d04e; }
  .art-nav__brand {
    font-size: 18px; font-weight: 700; letter-spacing: -0.04em;
    color: #fff; font-family: "DM Serif Display", serif;
  }
  .art-nav__dot { color: #f2d04e; }

  .art-content {
    flex: 1;
    padding: 88px 32px 80px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  .art-header { margin-bottom: 36px; }
  .art-header__title {
    font-size: 28px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.03em; margin: 0 0 4px;
  }
  .art-header__sub { font-size: 13px; color: #888; margin: 0; }

  .art-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .art-card {
    background: #fff;
    border: 1.5px solid rgba(0,0,0,0.07);
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  .art-card--new {
    animation: art-fadein 0.55s ease both;
  }
  .art-card:hover { transform: translateY(-4px); box-shadow: 0 10px 32px rgba(0,0,0,0.10); }

  @keyframes art-fadein {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .art-card__img {
    height: 180px; overflow: hidden; background: #f0ede8;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .art-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .art-card:hover .art-card__img img { transform: scale(1.05); }
  .art-card__img-placeholder { font-size: 36px; }
  .art-card__body { padding: 18px 18px 16px; display: flex; flex-direction: column; flex: 1; }
  .art-card__title { font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 0 0 8px; line-height: 1.35; letter-spacing: -0.02em; }
  .art-card__excerpt { font-size: 13px; color: #666; line-height: 1.7; margin: 0 0 14px; flex: 1; }
  .art-card__meta { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #999; margin-bottom: 12px; flex-wrap: wrap; }
  .art-card__avatar { width: 20px; height: 20px; border-radius: 50%; background: #f2d04e; color: #24221b; font-size: 8px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .art-card__author { display: flex; align-items: center; gap: 4px; }
  .art-card__date { display: flex; align-items: center; gap: 4px; }
  .art-card__cta { font-size: 12px; font-weight: 700; color: #c8960a; margin-top: auto; }

  .art-skeleton {
    height: 280px; border-radius: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .art-skeleton--inline {
    animation: shimmer 1.5s infinite, art-fadein 0.4s ease both;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .art-empty { text-align: center; padding: 80px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .art-empty p { color: #888; font-size: 15px; margin: 0; }

  .art-showmore-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    min-height: 36px;
  }

  .art-showmore-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 0;
    font-family: inherit;
    width: 100%;
    max-width: 480px;
  }
  .art-showmore-btn:hover .art-showmore-text { color: #c8960a; }
  .art-showmore-btn:hover .art-showmore-line { background: #c8960a; }

  .art-showmore-line {
    flex: 1;
    height: 1px;
    background: #d8d5cf;
    transition: background 0.2s;
  }

  .art-showmore-text {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
    font-size: 12.5px;
    font-weight: 600;
    color: #888;
    transition: color 0.2s;
    letter-spacing: 0.01em;
  }
  .art-showmore-text svg {
    transition: transform 0.2s;
  }
  .art-showmore-btn:hover .art-showmore-text svg {
    transform: translateY(2px);
  }

  .art-showmore-end {
    font-size: 12px;
    color: #aaa;
    margin: 0;
  }

  .art-showmore-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #888;
    margin: 0;
  }
  .art-dot-pulse {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #f2d04e;
    display: inline-block;
    animation: dot-pulse 1s ease-in-out infinite;
  }
  @keyframes dot-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
  }

  .art-footer { background: #24221b; border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 32px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.28); font-family: "DM Sans", sans-serif; }

  @media (max-width: 768px) {
    .art-nav { padding: 0 20px; }
    .art-content { padding: 76px 16px 60px; }
    .art-grid { grid-template-columns: 1fr; }
    .art-footer { padding: 20px; }
    .art-showmore-btn { max-width: 100%; }
  }
`
