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
    category?: string | null
    tags?: string[] | null
    createdAt: string
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"
const ITEMS_PER_PAGE = 3

const CATEGORY_OPTIONS = [
    "Teknologi",
    "Bisnis",
    "Desain",
    "Pendidikan",
    "Hiburan",
    "Lainnya",
]

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
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const UserIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" />
    </svg>
)
const SearchIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)
const XIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const EmptyIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
)
const ChevronDown = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)
const ArrowRight = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
)

function ArticleCard({ blog, isNew, cardRef }: {
    blog: Blog
    isNew?: boolean
    cardRef?: React.Ref<HTMLAnchorElement>
}) {
    const excerpt = stripHtml(blog.content).slice(0, 110) + "…"
    return (
        <Link
            href={`/blog/${blog.slug}`}
            className={`art-card${isNew ? " art-card--new" : ""}`}
            ref={cardRef}
        >
            <div className="art-card__img">
                {blog.coverImage
                    ? <img src={blog.coverImage.replace('/uploads', '/api-uploads')} alt={blog.title} />
                    : <div className="art-card__img-placeholder">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                }
                {blog.category && (
                    <span className="art-card__category">{blog.category}</span>
                )}
            </div>
            <div className="art-card__body">
                <h3 className="art-card__title">{blog.title}</h3>
                <p className="art-card__excerpt">{excerpt}</p>
                {blog.tags && blog.tags.length > 0 && (
                    <div className="art-card__tags">
                        {blog.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="art-card__tag">#{tag}</span>
                        ))}
                    </div>
                )}
                <div className="art-card__footer">
                    <div className="art-card__meta">
                        <span className="art-card__avatar">{getInitials(blog.authorName)}</span>
                        <div className="art-card__meta-info">
                            <span className="art-card__author"><UserIcon /> {blog.authorName}</span>
                            <span className="art-card__date"><ClockIcon /> {formatDate(blog.createdAt)}</span>
                        </div>
                    </div>
                    <span className="art-card__cta">
                        Baca <ArrowRight />
                    </span>
                </div>
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
    const showMoreRef = useRef<HTMLDivElement>(null)

    const [search, setSearch] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [activeCategory, setActiveCategory] = useState("")
    const [activeTag, setActiveTag] = useState("")
    const [allTags, setAllTags] = useState<string[]>([])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        fetchBlogs(1, true)
    }, [search, activeCategory, activeTag])

    function buildUrl(pageNum: number) {
        const params = new URLSearchParams()
        params.set("page", String(pageNum))
        params.set("limit", String(ITEMS_PER_PAGE))
        if (search) params.set("search", search)
        if (activeCategory) params.set("category", activeCategory)
        if (activeTag) params.set("tag", activeTag)
        return `${BASE}/blogs/public?${params.toString()}`
    }

    const [newBlogIds, setNewBlogIds] = useState<Set<number>>(new Set())
    const firstNewCardRef = useRef<HTMLAnchorElement | null>(null)

    async function fetchBlogs(pageNum: number, reset: boolean) {
        if (reset) setLoading(true)
        else setLoadingMore(true)
        try {
            const res = await fetch(buildUrl(pageNum))
            const data = await res.json()
            const newBlogs: Blog[] = data.data || []
            if (reset) {
                setBlogs(newBlogs)
                setNewBlogIds(new Set())
            } else {
                setNewBlogIds(new Set(newBlogs.map(b => b.id)))
                setBlogs(prev => [...prev, ...newBlogs])
            }
            setTotal(data.meta?.total || 0)
            setPage(pageNum)
            setAllTags(prev => {
                const combined = new Set([...prev])
                newBlogs.forEach(b => { if (b.tags) b.tags.forEach(t => combined.add(t)) })
                return Array.from(combined)
            })
        } catch {
            if (reset) setBlogs([])
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    async function handleShowMore() {
        await fetchBlogs(page + 1, false)
        setTimeout(() => {
            firstNewCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 100)
    }

    const searchTimeout = useRef<NodeJS.Timeout | null>(null)
    function handleSearchInput(val: string) {
        setSearchInput(val)
        if (searchTimeout.current) clearTimeout(searchTimeout.current)
        searchTimeout.current = setTimeout(() => setSearch(val), 400)
    }

    function handleClearFilters() {
        setSearch(""); setSearchInput(""); setActiveCategory(""); setActiveTag("")
    }

    const hasFilters = !!(search || activeCategory || activeTag)
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

                    <div className="art-hero">
                        <div className="art-hero__left">
                            <div className="art-hero__eyebrow">
                                <span className="art-hero__eyebrow-dot" />
                                Jelajahi tulisan
                            </div>
                            <h1 className="art-hero__title">Semua Artikel</h1>
                            <div className="art-hero__sub">
                                <span className="art-hero__badge">
                                    {hasFilters ? `${total}` : total}
                                </span>
                                {hasFilters ? "artikel ditemukan" : "artikel tersedia"}
                            </div>
                        </div>

                        <div className="art-search">
                            <span className="art-search__icon"><SearchIcon /></span>
                            <input
                                className="art-search__input"
                                type="text"
                                placeholder="Cari artikel..."
                                value={searchInput}
                                onChange={e => handleSearchInput(e.target.value)}
                            />
                            {searchInput && (
                                <button className="art-search__clear" onClick={() => { setSearchInput(""); setSearch("") }}>
                                    <XIcon />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="art-filterbar">
                        <div className="art-filter-row">
                            <span className="art-filter-label">Kategori</span>
                            <div className="art-chips">
                                <button
                                    className={`art-chip ${activeCategory === "" ? "art-chip--on" : ""}`}
                                    onClick={() => setActiveCategory("")}
                                >Semua</button>
                                {CATEGORY_OPTIONS.map(cat => (
                                    <button
                                        key={cat}
                                        className={`art-chip ${activeCategory === cat ? "art-chip--on" : ""}`}
                                        onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
                                    >{cat}</button>
                                ))}
                            </div>
                        </div>

                        {hasFilters && (
                            <div className="art-filter-row">
                                <button className="art-clear-btn" onClick={handleClearFilters}>
                                    <XIcon /> Hapus semua filter
                                </button>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="art-grid">
                            {[1, 2, 3].map(i => <div key={i} className="art-skeleton" />)}
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="art-empty">
                            <div className="art-empty__icon"><EmptyIcon /></div>
                            <p className="art-empty__title">Tidak ada artikel ditemukan</p>
                            <p className="art-empty__sub">
                                {hasFilters
                                    ? "Coba ubah filter atau kata kunci pencarian."
                                    : "Belum ada artikel yang dipublikasikan."}
                            </p>
                            {hasFilters && (
                                <button className="art-clear-btn" onClick={handleClearFilters}>
                                    <XIcon /> Hapus filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="art-grid">
                                {blogs.map((blog, i) => {
                                    const isNew = newBlogIds.has(blog.id)
                                    const isFirstNew = isNew && i === blogs.findIndex(b => newBlogIds.has(b.id))
                                    return (
                                        <ArticleCard
                                            key={blog.id}
                                            blog={blog}
                                            isNew={isNew}
                                            cardRef={isFirstNew ? firstNewCardRef : undefined}
                                        />
                                    )
                                })}
                                {loadingMore && [1, 2, 3].map(i => <div key={`sk-${i}`} className="art-skeleton" />)}
                            </div>

                            <div ref={showMoreRef} className="art-more-wrap">
                                {hasMore && !loadingMore && (
                                    <button className="art-more-btn" onClick={handleShowMore}>
                                        <span className="art-more-line" />
                                        <span className="art-more-text">
                                            Tampilkan lebih banyak <ChevronDown />
                                        </span>
                                        <span className="art-more-line" />
                                    </button>
                                )}
                                {!hasMore && blogs.length > ITEMS_PER_PAGE && (
                                    <p className="art-more-end">Menampilkan semua {total} artikel</p>
                                )}
                                {loadingMore && (
                                    <p className="art-more-loading">
                                        <span className="art-pulse" />
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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .art-root {
    min-height: 100vh;
    background: #f7f6f3;
    display: flex;
    flex-direction: column;
    font-family: "DM Sans", sans-serif;
  }

  .art-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: #1e1c16;
    padding: 0 32px;
    transition: box-shadow 0.3s;
  }
  .art-nav--scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.25); }
  .art-nav__inner {
    max-width: 1120px; margin: 0 auto;
    height: 54px; display: flex; align-items: center; justify-content: space-between;
  }
  .art-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.4);
    text-decoration: none; transition: color 0.2s;
  }
  .art-back-btn:hover { color: #edc84a; }
  .art-nav__brand {
    font-family: "Playfair Display", serif;
    font-size: 18px; color: #fff;
  }
  .art-nav__dot { color: #edc84a; }

  .art-content {
    flex: 1;
    padding: 70px 32px 80px;
    max-width: 1120px;
    margin: 0 auto;
    width: 100%;
  }

  .art-hero {
    padding: 24px 0 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    border-bottom: 1.5px solid #e8e5df;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .art-hero__eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #b8880e;
    margin-bottom: 8px;
  }
  .art-hero__eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #edc84a; display: inline-block;
  }
  .art-hero__title {
    font-family: "Playfair Display", serif;
    font-size: 38px; color: #1a1a1a;
    line-height: 1.1; letter-spacing: -0.02em;
    margin-bottom: 8px;
  }
  .art-hero__sub {
    font-size: 12.5px; color: #aaa;
    display: flex; align-items: center; gap: 7px;
  }
  .art-hero__badge {
    background: #edc84a; color: #1e1c16;
    font-size: 10.5px; font-weight: 700;
    padding: 2px 9px; border-radius: 100px;
  }

  .art-search { position: relative; width: 200px; flex-shrink: 0; }
  .art-search__icon {
    position: absolute; left: 9px; top: 50%; transform: translateY(-50%);
    color: #bbb; pointer-events: none; display: flex;
  }
  .art-search__input {
    width: 100%; padding: 8px 30px 8px 30px;
    border: 1.5px solid #e4e1db; border-radius: 10px;
    font-size: 12.5px; font-family: inherit;
    background: #fff; color: #333; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .art-search__input:focus {
    border-color: #edc84a;
    box-shadow: 0 0 0 3px rgba(237,200,74,0.1);
  }
  .art-search__input::placeholder { color: #c5c2bb; }
  .art-search__clear {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #bbb;
    display: flex; align-items: center; padding: 2px;
    border-radius: 4px; transition: color 0.15s;
  }
  .art-search__clear:hover { color: #666; }

  .art-filterbar {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .art-filter-row {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .art-filter-label {
    font-size: 9.5px; font-weight: 700; color: #c5c1b8;
    text-transform: uppercase; letter-spacing: 0.09em;
    white-space: nowrap; min-width: 52px;
  }
  .art-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .art-chip {
    padding: 3px 11px; border-radius: 100px;
    font-size: 12px; font-weight: 500;
    border: 1.5px solid #e4e1db;
    background: transparent; color: #777;
    cursor: pointer; transition: all 0.14s; font-family: inherit;
  }
  .art-chip:hover { border-color: #d4a818; color: #b8880e; background: #fdf8ec; }
  .art-chip--on { background: #edc84a; border-color: #edc84a; color: #1e1c16; font-weight: 700; }
  .art-chip--on:hover { background: #d9b53e; border-color: #d9b53e; color: #1e1c16; }
  .art-chip--tag { color: #999; font-size: 11.5px; }
  .art-chip--tag-on { background: #fdf3dc; border-color: #edc84a; color: #b8880e; font-weight: 700; }
  .art-chip--tag-on:hover { background: #faecc6; }
  .art-clear-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 100px;
    font-size: 11.5px; font-weight: 600;
    border: 1.5px solid #f0c4c4; background: #fdf0f0; color: #b83232;
    cursor: pointer; font-family: inherit; transition: all 0.14s;
  }
  .art-clear-btn:hover { background: #fce0e0; border-color: #e8aaaa; }

  .art-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .art-card {
    background: #fff;
    border: 1.5px solid #eae7e1;
    border-radius: 16px; overflow: hidden;
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .art-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.08);
    border-color: #ddd9d2;
  }

  .art-card__img {
    height: 175px; overflow: hidden; background: #f2efe9;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; position: relative;
  }
  .art-card__img img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.35s ease;
  }
  .art-card:hover .art-card__img img { transform: scale(1.04); }
  .art-card__img-placeholder { color: #ccc8c0; }

  .art-card__category {
    position: absolute; top: 10px; left: 10px;
    background: rgba(30,28,22,0.7);
    color: #edc84a;
    font-size: 9.5px; font-weight: 700;
    padding: 3px 9px; border-radius: 100px;
    letter-spacing: 0.05em; text-transform: uppercase;
    backdrop-filter: blur(6px);
  }

  .art-card__body {
    padding: 14px 15px 13px;
    display: flex; flex-direction: column; flex: 1;
  }
  .art-card__title {
    font-size: 14px; font-weight: 700; color: #1a1a1a;
    margin: 0 0 6px; line-height: 1.38; letter-spacing: -0.02em;
  }
  .art-card__excerpt {
    font-size: 12px; color: #777; line-height: 1.7;
    margin: 0 0 10px; flex: 1;
  }
  .art-card__tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 11px; }
  .art-card__tag {
    font-size: 10px; font-weight: 600; color: #b8880e;
    background: #fdf3dc; border: 1px solid #f0d88a;
    padding: 2px 7px; border-radius: 100px;
  }
  .art-card__footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: auto;
  }
  .art-card__meta { display: flex; align-items: center; gap: 7px; }
  .art-card__avatar {
    width: 20px; height: 20px; border-radius: 50%;
    background: #edc84a; color: #1e1c16;
    font-size: 7px; font-weight: 700;
    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .art-card__meta-info { display: flex; flex-direction: column; gap: 1px; }
  .art-card__author {
    display: flex; align-items: center; gap: 3px;
    font-size: 10.5px; color: #888;
  }
  .art-card__date {
    display: flex; align-items: center; gap: 3px;
    font-size: 10.5px; color: #aaa;
  }
  .art-card__cta {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 700; color: #b8880e;
    transition: gap 0.15s;
  }
  .art-card:hover .art-card__cta { gap: 7px; }

  .art-skeleton {
    height: 290px; border-radius: 16px;
    background: linear-gradient(90deg, #eeebe5 25%, #e6e3dd 50%, #eeebe5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .art-card--new {
    animation: fadeSlideUp 0.4s ease forwards;
    opacity: 0;
  }
  .art-card--new:nth-child(3n+1) { animation-delay: 0ms; }
  .art-card--new:nth-child(3n+2) { animation-delay: 60ms; }
  .art-card--new:nth-child(3n+3) { animation-delay: 120ms; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .art-empty {
    text-align: center; padding: 72px 20px 80px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .art-empty__icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: #f2efe9;
    display: flex; align-items: center; justify-content: center;
    color: #c5c0b6; margin-bottom: 4px;
  }
  .art-empty__title { font-size: 15px; font-weight: 700; color: #444; margin: 0; }
  .art-empty__sub {
    font-size: 13px; color: #aaa; margin: 0;
    max-width: 280px; line-height: 1.6;
  }

  .art-more-wrap {
    display: flex; align-items: center; justify-content: center;
    margin-top: 32px; min-height: 32px;
  }
  .art-more-btn {
    display: flex; align-items: center; gap: 12px;
    background: none; border: none; cursor: pointer;
    padding: 6px 0; font-family: inherit;
    width: 100%; max-width: 420px;
  }
  .art-more-btn:hover .art-more-text { color: #d97706; }
  .art-more-btn:hover .art-more-line { background: #edc84a; }
  .art-more-line {
    flex: 1; height: 1px; background: #e8e8e8;
    transition: background 0.2s;
  }
  .art-more-text {
    display: inline-flex; align-items: center; gap: 5px;
    white-space: nowrap; font-size: 12px; font-weight: 600;
    color: #aaa; transition: color 0.2s; letter-spacing: 0.01em;
  }
  .art-more-text svg { transition: transform 0.2s; }
  .art-more-btn:hover .art-more-text svg { transform: translateY(2px); }
  .art-more-end { font-size: 12px; color: #bbb; margin: 0; }
  .art-more-loading {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: #aaa; margin: 0;
  }
  .art-pulse {
    width: 7px; height: 7px; border-radius: 50%;
    background: #edc84a; display: inline-block;
    animation: pulse 1s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.6); opacity: 0.4; }
  }

  .art-footer {
    background: #1e1c16;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 20px 32px; text-align: center;
    font-size: 12px; color: rgba(255,255,255,0.2);
    font-family: "DM Sans", sans-serif;
  }

  @media (max-width: 900px) {
    .art-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .art-nav { padding: 0 20px; }
    .art-content { padding: 72px 16px 60px; }
    .art-hero { padding: 36px 0 24px; flex-direction: column; align-items: flex-start; }
    .art-hero__title { font-size: 30px; }
    .art-search { width: 100%; }
    .art-grid { grid-template-columns: 1fr; }
    .art-footer { padding: 18px; }
  }
`
