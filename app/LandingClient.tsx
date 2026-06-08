"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"

const IconGraphic = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
)
const IconUI = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
)
const IconCode = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
)
const IconDB = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
)
const IconAuth = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)
const IconRole = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        <polyline points="16 11 18 13 22 9" />
    </svg>
)
const IconWA = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
)
const IconIG = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
)
const IconTiktok = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z" />
    </svg>
)
const IconMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
)

const IconGithub = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
)

const IconFacebook = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
)

const IconTwitter = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

const IconLinkedin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

const IconYoutube = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

const services = [
    { icon: <IconCode />, title: "Full Stack Web", desc: "End-to-end web applications with Next.js frontend and AdonisJS REST API backend." },
    { icon: <IconDB />, title: "Database Design", desc: "Relational schema design and query optimization using PostgreSQL." },
    { icon: <IconAuth />, title: "Authentication", desc: "JWT-based auth systems with secure login, register, and session management." },
    { icon: <IconRole />, title: "Role Management", desc: "Fine-grained role-based access control with admin and user permission layers." },
    { icon: <IconUI />, title: "UI / UX Design", desc: "Clean and modern interfaces with responsive layouts and smooth interactions." },
    { icon: <IconGraphic />, title: "CRUD Systems", desc: "Complete data management systems with real-time feedback and validation." },
]

type GalleryItem = {
    id: number
    title: string
    description: string | null
    imagePath: string
}

type LandingBlog = {
    id: number
    title: string
    slug: string
    content: string
    coverImage?: string | null
    authorName: string
    createdAt: string
    category?: string | null
    tags?: string[] | null
}

type ContactItem = {
    id: number
    platform: string
    label: string
    displayText: string
    url: string
    iconKey: string
    isActive: boolean
    sortOrder: number
}

function stripHtml(html: string) {
    return html
        .replace(/<\/?(h[1-6]|p|div|li|br|tr|td)[^>]*>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

function ServiceCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
    return (
        <div className="lp-service-card" style={{ animationDelay: `${delay}ms` }}>
            <div className="lp-service-card__icon">{icon}</div>
            <h3 className="lp-service-card__title">{title}</h3>
            <p className="lp-service-card__desc">{desc}</p>
        </div>
    )
}

function LandingBlogCard({ blog, index }: { blog: LandingBlog; index: number }) {
    const excerpt = stripHtml(blog.content).slice(0, 110) + "…"
    return (
        <Link href={`/blog/${blog.slug}`} className="lp-blog-card" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="lp-blog-card__img">
                {blog.coverImage ? <img src={blog.coverImage.replace('/uploads', '/api-uploads')} alt={blog.title} /> :
                    <div className="lp-blog-card__img-placeholder">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                }
                {blog.category && (
                    <span className="lp-blog-card__category">{blog.category}</span>
                )}
            </div>
            <div className="lp-blog-card__body">
                <h4 className="lp-blog-card__title">{blog.title}</h4>
                <p className="lp-blog-card__excerpt">{excerpt}</p>
                {blog.tags && blog.tags.length > 0 && (
                    <div className="lp-blog-card__tags">
                        {blog.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="lp-blog-card__tag">#{tag}</span>
                        ))}
                    </div>
                )}
                <div className="lp-blog-card__footer">
                    <div className="lp-blog-card__meta">
                        <span className="lp-blog-card__avatar">{getInitials(blog.authorName)}</span>
                        <div className="lp-blog-card__meta-info">
                            <span className="lp-blog-card__author">{blog.authorName}</span>
                            <span className="lp-blog-card__date">{formatDate(blog.createdAt)}</span>
                        </div>
                    </div>
                    <span className="lp-blog-card__cta">
                        Baca
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    )
}

function ProjectCard({ title, tag, img, index, slug }: { title: string; tag: string; img: string; index: number; slug: string }) {
    return (
        <Link href={`/projects/${slug}`} className="lp-proj-card" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="lp-proj-card__img">
                {img ? <img src={img} alt={title} className="lp-proj-card__img-inner" /> : (
                    <div className="lp-proj-card__placeholder">
                        <span className="lp-proj-card__placeholder-icon"><IconCode /></span>
                    </div>
                )
                }
                <span className="lp-proj-card__tag">{tag}</span>
            </div>
            <div className="lp-proj-card__body">
                <h4 className="lp-proj-card__title">{title}</h4>
                <span className="lp-proj-card__arrow">View Project →</span>
            </div>
        </Link>
    )
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null
    let start = Math.max(0, page - 1)
    let end = start + 3
    if (end > total) { end = total; start = Math.max(0, end - 3) }
    const visible = Array.from({ length: end - start }, (_, i) => start + i)

    const colors = [
        { bg: "#f2d04e", color: "#24221b" },
        { bg: "#ff8fab", color: "#fff" },
        { bg: "#a0c4ff", color: "#1a2e4a" },
        { bg: "#b5ead7", color: "#1a3d2e" },
        { bg: "#ffd6a5", color: "#4a2e00" },
        { bg: "#c77dff", color: "#fff" },
        { bg: "#f4a261", color: "#fff" },
        { bg: "#90e0ef", color: "#023e8a" },
    ]

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 36 }}>
            <style>{`
        .pg-btn { transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease, background 0.18s ease !important; }
        .pg-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.12) !important; box-shadow: 0 6px 18px rgba(0,0,0,0.15) !important; }
        .pg-btn:active:not(:disabled) { transform: scale(0.93) !important; }
        .pg-num-active { animation: pg-pop 0.28s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes pg-pop { 0% { transform: scale(0.7) rotate(-8deg); opacity: 0.4; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        .pg-arrow { transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), background 0.18s ease !important; }
        .pg-arrow:hover:not(:disabled) { transform: scale(1.15) !important; }
      `}</style>

            <button
                className="pg-btn pg-arrow"
                onClick={() => onChange(Math.max(0, page - 1))}
                disabled={page === 0}
                style={{
                    width: 36, height: 36, borderRadius: 10,
                    border: "none",
                    background: page === 0 ? "rgba(36,34,27,0.06)" : "#24221b",
                    color: page === 0 ? "rgba(36,34,27,0.25)" : "#f2d04e",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: page === 0 ? "none" : "0 3px 10px rgba(36,34,27,0.18)",
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            {visible.map(i => {
                const c = colors[i % colors.length]
                const isActive = page === i
                return (
                    <button
                        key={i}
                        className={`pg-btn ${isActive ? "pg-num-active" : ""}`}
                        onClick={() => onChange(i)}
                        style={{
                            width: 36, height: 36, borderRadius: 10,
                            border: "none",
                            background: isActive ? c.bg : "rgba(36,34,27,0.06)",
                            color: isActive ? c.color : "rgba(36,34,27,0.4)",
                            fontSize: 13, fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: isActive ? `0 4px 14px ${c.bg}99` : "none",
                            fontFamily: "inherit",
                        }}
                    >
                        {i + 1}
                    </button>
                )
            })}

            <button
                className="pg-btn pg-arrow"
                onClick={() => onChange(Math.min(total - 1, page + 1))}
                disabled={page === total - 1}
                style={{
                    width: 36, height: 36, borderRadius: 10,
                    border: "none",
                    background: page === total - 1 ? "rgba(36,34,27,0.06)" : "#24221b",
                    color: page === total - 1 ? "rgba(36,34,27,0.25)" : "#f2d04e",
                    cursor: page === total - 1 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: page === total - 1 ? "none" : "0 3px 10px rgba(36,34,27,0.18)",
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>
        </div>
    )
}

export default function LandingClient() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [galleries, setGalleries] = useState<GalleryItem[]>([])
    const [latestBlogs, setLatestBlogs] = useState<LandingBlog[]>([])
    const [contacts, setContacts] = useState<ContactItem[]>([])
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
    const [galleryPage, setGalleryPage] = useState(0)
    const [galleryAnimating, setGalleryAnimating] = useState(false)

    const [activeCategory, setActiveCategory] = useState("Semua")
    const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        setMenuOpen(false)
        const id = href.replace("#", "")
        const el = document.getElementById(id)
        if (!el) return
        const navHeight = 64
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight
        window.scrollTo({ top, behavior: "smooth" })
    }, [])
    const [projectPage, setProjectPage] = useState(0)
    const [projects, setProjects] = useState<{
        id: number; title: string; category: string; imagePath: string | null; slug: string
    }[]>([])

    const [currentUser, setCurrentUser] = useState<{
        fullName: string
        email: string
        role: string
    } | null>(null)

    const [profileOpen, setProfileOpen] = useState(false)

    const GALLERY_PER_PAGE = 4

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            try {
                setCurrentUser(JSON.parse(userData))
            } catch { }
        }
        const sections = document.querySelectorAll(".lp-section, .lp-band")
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("lp-revealed")
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        )
        sections.forEach((el) => {
            el.classList.add("lp-reveal-init")
            observer.observe(el)
        })
        return () => observer.disconnect()

    }, [])

    const handleGalleryPageChange = (newPage: number) => {
        setGalleryAnimating(true)
        setTimeout(() => {
            setGalleryPage(newPage)
            setGalleryAnimating(false)
        }, 180)
    }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener("scroll", onScroll)

        fetch(`${API_BASE}/gallery/public`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data.data)) setGalleries(data.data) })
            .catch(() => { })

        fetch(`${API_BASE}/blogs/public?limit=3`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data.data)) setLatestBlogs(data.data) })
            .catch(() => { })

        fetch(`${API_BASE}/projects/public`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data.data)) setProjects(data.data) })
            .catch(() => { })

        fetch(`${API_BASE}/contact/public`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data.data)) setContacts(data.data) })
            .catch(() => { })

        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const navLinks = [
        { href: "#about", label: "About" },
        { href: "#services", label: "Services" },
        { href: "#gallery", label: "Gallery" },
        { href: "#blog", label: "Articles" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" },
    ]

    const iconMap: Record<string, React.ReactNode> = {
        whatsapp: <IconWA />,
        email: <IconMail />,
        instagram: <IconIG />,
        tiktok: <IconTiktok />,
        github: <IconGithub />,
        facebook: <IconFacebook />,
        twitter: <IconTwitter />,
        linkedin: <IconLinkedin />,
        youtube: <IconYoutube />,
    }

    return (
        <>
            <style>{landingStyles}</style>
            <div className="lp-root">

                <nav className={`lp-nav ${scrolled ? "lp-nav--scrolled" : ""}`}>
                    <div className="lp-nav__inner">
                        <div className="lp-nav__brand">
                            Nexora<span className="lp-brand__dot">.</span>
                        </div>
                        <div className={`lp-nav__links ${menuOpen ? "lp-nav__links--open" : ""}`}>
                            {navLinks.map(({ href, label }) => (
                                <a key={href} href={href} className="lp-nav__link" onClick={(e) => handleNavClick(e, href)}>
                                    {label}
                                </a>
                            ))}
                        </div>
                        <div className="lp-nav__actions">
                            {currentUser ? (
                                <>
                                    <div style={{ position: "relative" }}>

                                        <button
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            style={{
                                                width: 36, height: 36, borderRadius: "50%",
                                                background: "#f2d04e", color: "#24221b",
                                                border: "2px solid rgba(255,255,255,0.2)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 12, fontWeight: 700, cursor: "pointer",
                                                transition: "transform 0.2s, box-shadow 0.2s",
                                                boxShadow: profileOpen ? "0 0 0 3px rgba(242,208,78,0.4)" : "none",
                                            }}
                                        >
                                            {currentUser.fullName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                                        </button>

                                        {profileOpen && (
                                            <>
                                                <div
                                                    onClick={() => setProfileOpen(false)}
                                                    style={{
                                                        position: "fixed", inset: 0, zIndex: 98,
                                                    }}
                                                />

                                                <div style={{
                                                    position: "absolute", top: "calc(100% + 12px)", right: 0,
                                                    width: 220, background: "#fff", borderRadius: 14,
                                                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                                                    border: "1px solid rgba(0,0,0,0.08)",
                                                    zIndex: 99, overflow: "hidden",
                                                    animation: "lp-fadein 0.18s ease both",
                                                }}>

                                                    <div style={{
                                                        padding: "14px 16px 12px",
                                                        borderBottom: "1px solid rgba(0,0,0,0.07)",
                                                    }}>
                                                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>
                                                            {currentUser.fullName}
                                                        </div>
                                                        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                                                            {currentUser.email}
                                                        </div>
                                                        <div style={{
                                                            display: "inline-block", marginTop: 6,
                                                            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                                                            background: currentUser.role === "admin" ? "#fff3cd" : "#e8f5e9",
                                                            color: currentUser.role === "admin" ? "#b8880e" : "#2e7d32",
                                                            border: `1px solid ${currentUser.role === "admin" ? "#f0d88a" : "#a5d6a7"}`,
                                                            padding: "2px 8px", borderRadius: 999, textTransform: "uppercase",
                                                        }}>
                                                            {currentUser.role}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href="/dashboard"
                                                        onClick={() => setProfileOpen(false)}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 10,
                                                            padding: "11px 16px", fontSize: 13, fontWeight: 500,
                                                            color: "#1a1a1a", textDecoration: "none",
                                                            transition: "background 0.15s",
                                                        }}
                                                        onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                                            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                                                        </svg>
                                                        Dashboard
                                                    </Link>

                                                    <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "0 12px" }} />

                                                    <button
                                                        onClick={() => {
                                                            setProfileOpen(false)
                                                            localStorage.removeItem("token")
                                                            localStorage.removeItem("user")
                                                            setCurrentUser(null)
                                                        }}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 10, width: "100%",
                                                            padding: "11px 16px", fontSize: 13, fontWeight: 500,
                                                            color: "#e53e3e", background: "transparent",
                                                            border: "none", cursor: "pointer", textAlign: "left",
                                                            transition: "background 0.15s",
                                                        }}
                                                        onMouseEnter={e => (e.currentTarget.style.background = "#fff5f5")}
                                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                            <polyline points="16 17 21 12 16 7" />
                                                            <line x1="21" y1="12" x2="9" y2="12" />
                                                        </svg>
                                                        Logout
                                                    </button>

                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="lp-btn lp-btn--footer-outline lp-btn--sm">Login</Link>
                                    <Link href="/register" className="lp-btn lp-btn--primary lp-btn--sm">Register</Link>
                                </>
                            )}
                        </div>
                        <button className="lp-nav__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                            <span /><span /><span />
                        </button>
                    </div>
                </nav>

                <section className="lp-banner">
                    <div className="lp-banner__bg">
                        <img
                            src="/background.jpg"
                            alt="Banner"
                            className="lp-banner__bgimg"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                        <div className="lp-banner__overlay" />
                    </div>
                    <div className="lp-banner__content">
                        <div className="lp-banner__avatar-wrap">
                            <img
                                src="/taylor.png"
                                alt="Taylor Swift"
                                className="lp-banner__avatar"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                            />
                        </div>
                        <h2 className="lp-banner__name">Taylor Swift</h2>
                        <p className="lp-banner__tagline">Full Stack Developer &amp; System Builder</p>
                    </div>
                </section>

                <section className="lp-section lp-section--about" id="about">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow">About Me</p>
                        <h2 className="lp-section__title">Who I Am</h2>
                        <div className="lp-section__divider" />
                    </div>
                    <div className="lp-about-body">
                        <div className="lp-about__photo-col">
                            <div className="lp-about__photo-frame">
                                <img
                                    src="/taylor.png"
                                    alt="Taylor Swift"
                                    className="lp-about__photo"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                                />
                                <div className="lp-about__photo-ring" />
                            </div>
                        </div>
                        <div className="lp-about__text-col">
                            <p className="lp-about__eyebrow-badge">
                                <span className="lp-badge__dot" />
                                Full Stack Web System
                            </p>
                            <h3 className="lp-about__sub">
                                Web Developer<span className="lp-sep">, </span>
                                <span className="lp-hero__accent">System Builder</span>
                                <span className="lp-sep">, </span>
                                UI Designer<span className="lp-sep">.</span>
                            </h3>
                            <p className="lp-about__desc">
                                Hi, I'm Taylor Swift. Nexora is my professional ecosystem built with Next.js, AdonisJS, and PostgreSQL — featuring full CRUD operations, role-based access control, and a clean, modern UI experience.
                            </p>
                            <div className="lp-about__actions">
                                <a href="#projects" className="lp-btn lp-btn--primary lp-btn--lg">View My Projects</a>
                                <a href="#contact" className="lp-btn lp-btn--outline lp-btn--lg">Contact Me</a>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="lp-band">
                    <div className="lp-band__inner">
                        {["Next.js", "AdonisJS", "PostgreSQL", "REST API", "JWT Auth", "Role-Based Access", "CRUD System"].map((t, i) => (
                            <span key={i} className="lp-band__item">
                                <span className="lp-band__dot" />{t}
                            </span>
                        ))}
                    </div>
                </div>

                <section className="lp-section" id="services">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow">Services</p>
                        <h2 className="lp-section__title">What I Provide</h2>
                        <p className="lp-section__sub">
                            A complete set of capabilities built into this system — from backend APIs to polished frontends.
                        </p>
                        <div className="lp-section__divider" />
                    </div>
                    <div className="lp-services-grid">
                        {services.map((s, i) => <ServiceCard key={i} {...s} delay={i * 80} />)}
                    </div>
                </section>

                <section className="lp-section lp-section--gallery" id="gallery">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow">Gallery</p>
                        <h2 className="lp-section__title">Photo Gallery</h2>
                        <p className="lp-section__sub">A collection of moments and visuals curated from our work.</p>
                        <div className="lp-section__divider" />
                    </div>

                    {galleries.length === 0 ? (
                        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Belum ada foto.</p>
                    ) : (() => {
                        const totalPages = Math.ceil(galleries.length / GALLERY_PER_PAGE)
                        const pageItems = galleries.slice(galleryPage * GALLERY_PER_PAGE, (galleryPage + 1) * GALLERY_PER_PAGE)
                        return (
                            <>
                                <div
                                    className={galleryAnimating ? "gallery-grid-exit" : "gallery-grid-animate"}
                                    style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 1200, margin: "0 auto" }}
                                >
                                    {pageItems.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setLightbox(item)}
                                            className="gallery-card-anim"
                                            style={{
                                                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                                                position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                                                transition: "transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease",
                                                aspectRatio: "4/3",
                                                animationDelay: `${idx * 80}ms`,
                                            }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px) scale(1.01)";
                                                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.18)"
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
                                                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)"
                                            }}
                                        >
                                            <img
                                                src={`${API_BASE}${item.imagePath}`}
                                                alt={item.title}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                                                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"}
                                                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
                                            />
                                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 50%)", pointerEvents: "none" }} />
                                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px" }}>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                                                    {item.title}
                                                </p>
                                                {item.description && (
                                                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Pagination page={galleryPage} total={totalPages} onChange={handleGalleryPageChange} />
                                <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
                                    Menampilkan {pageItems.length} dari {galleries.length} foto
                                </p>
                            </>
                        )
                    })()}
                </section>

                <section className="lp-section lp-section--blog" id="blog">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow">Blog</p>
                        <h2 className="lp-section__title">Artikel Terbaru</h2>
                        <div className="lp-section__divider" />
                    </div>
                    {latestBlogs.length === 0 ? (
                        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Belum ada artikel.</p>
                    ) : (
                        <>
                            <div className="lp-blog-grid">
                                {latestBlogs.map((blog, i) => <LandingBlogCard key={blog.id} blog={blog} index={i} />)}
                            </div>
                            <div style={{ textAlign: "center", marginTop: 36 }}>
                                <Link href="/articles" className="lp-btn lp-btn--dark">Lihat Semua Artikel</Link>
                            </div>
                        </>
                    )}
                </section>

                <section className="lp-section lp-section--projects" id="projects">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow lp-section__eyebrow--projects">Portfolios</p>
                        <h2 className="lp-section__title lp-section__title--projects">Project Gallery</h2>
                        <p className="lp-section__sub lp-section__sub--projects">
                            A collection of modules and features built within this system.
                        </p>
                        <div className="lp-section__divider lp-section__divider--projects" />
                    </div>

                    {projects.length === 0 ? (
                        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                            Belum ada project.
                        </p>
                    ) : (() => {
                        const PROJECT_PER_PAGE = 3
                        const categories = ["Semua", ...Array.from(new Set(projects.map(p => p.category)))]
                        const filtered = activeCategory === "Semua"
                            ? projects
                            : projects.filter(p => p.category === activeCategory)
                        const totalPages = Math.ceil(filtered.length / PROJECT_PER_PAGE)
                        const pageItems = filtered.slice(projectPage * PROJECT_PER_PAGE, (projectPage + 1) * PROJECT_PER_PAGE)

                        return (
                            <>
                                <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setActiveCategory(cat); setProjectPage(0) }}
                                            style={{
                                                padding: "7px 18px",
                                                borderRadius: 999,
                                                border: "1.5px solid",
                                                borderColor: activeCategory === cat ? "var(--earth)" : "rgba(36,34,27,0.15)",
                                                background: activeCategory === cat ? "var(--earth)" : "transparent",
                                                color: activeCategory === cat ? "var(--navy)" : "var(--text-muted)",
                                                fontSize: 12,
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                                letterSpacing: "0.03em",
                                                fontFamily: "inherit",
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="lp-projects-grid">
                                    {pageItems.map((p, i) => (
                                        <ProjectCard
                                            key={p.id}
                                            title={p.title}
                                            tag={p.category}
                                            img={p.imagePath ? `${API_BASE}${p.imagePath}` : ""}
                                            index={i}
                                            slug={p.slug}
                                        />
                                    ))}
                                </div>

                                <Pagination page={projectPage} total={totalPages} onChange={setProjectPage} />
                                <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
                                    Menampilkan {pageItems.length} dari {filtered.length} project
                                </p>
                            </>
                        )
                    })()}
                </section>

                <section className="lp-section" id="hire">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow">Access</p>
                        <h2 className="lp-section__title">Join The System</h2>
                        <p className="lp-section__sub">Create an account to access the full HR management experience — or log in if you already have one.</p>
                        <div className="lp-section__divider" />
                    </div>
                    <div className="lp-hire-grid">
                        <div className="lp-hire-card">
                            <div className="lp-hire-card__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" />
                                    <line x1="12" y1="14" x2="12" y2="20" /><line x1="9" y1="17" x2="15" y2="17" />
                                </svg>
                            </div>
                            <p className="lp-hire-card__platform">New User</p>
                            <p className="lp-hire-card__desc">Start with a fresh account and explore all features.</p>
                            <Link href="/register" className="lp-btn lp-btn--primary">Register Now</Link>
                        </div>
                        <div className="lp-hire-card lp-hire-card--accent">
                            <div className="lp-hire-card__icon lp-hire-card__icon--filled">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <p className="lp-hire-card__platform">Existing User</p>
                            <p className="lp-hire-card__desc">Sign in to your account to manage your team.</p>
                            <Link href="/login" className="lp-btn lp-btn--dark">Login</Link>
                        </div>
                        <div className="lp-hire-card">
                            <div className="lp-hire-card__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                                    <polyline points="16 11 18 13 22 9" />
                                </svg>
                            </div>
                            <p className="lp-hire-card__platform">Admin Access</p>
                            <p className="lp-hire-card__desc">Contact the administrator for elevated permissions.</p>
                            <a href="#contact" className="lp-btn lp-btn--outline">Contact Me</a>
                        </div>
                    </div>
                </section>

                <section className="lp-section lp-section--contact" id="contact">
                    <div className="lp-section__header">
                        <p className="lp-section__eyebrow lp-section__eyebrow--light">Social</p>
                        <h2 className="lp-section__title lp-section__title--light">How To Reach Me</h2>
                        <p className="lp-contact-sub">
                            Reach out through any of the channels below —
                            I&apos;ll get back to you promptly.
                        </p>
                        <div className="lp-section__divider lp-section__divider--earth" />
                    </div>
                    <div className="lp-contact-list">
                        {contacts.length === 0 ? (
                            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                                Belum ada kontak.
                            </p>
                        ) : contacts.map((contact) => (
                            <a key={contact.id} href={contact.url}
                                target={contact.iconKey !== "email" ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="lp-contact-item"
                            >
                                <div className="lp-contact-item__top">
                                    <span className="lp-contact-item__icon">
                                        {iconMap[contact.iconKey] ?? <IconMail />}
                                    </span>
                                    <span className="lp-contact-item__label">{contact.label}</span>
                                </div>
                                <span className="lp-contact-item__text">{contact.displayText}</span>
                            </a>
                        ))}
                    </div>
                </section>


                <footer className="lp-footer">
                    <div className="lp-footer__inner">
                        <span className="lp-footer__brand">Nexora<span className="lp-brand__dot">.</span></span>
                        <p className="lp-footer__copy">© {new Date().getFullYear()} Taylor Swift — Nexora Management System.</p>
                    </div>
                </footer>

                {lightbox && (
                    <div
                        onClick={() => setLightbox(null)}
                        style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 24 }}
                    >
                        <img
                            src={`${API_BASE}${lightbox.imagePath}`}
                            alt={lightbox.title}
                            style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
                            onClick={e => e.stopPropagation()}
                        />
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 16, marginTop: 14 }}>{lightbox.title}</p>
                        {lightbox.description && (
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}>{lightbox.description}</p>
                        )}
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 12 }}>Klik di luar gambar untuk tutup</p>
                    </div>
                )}

            </div>
        </>
    )
}

const landingStyles = `
  :root {
    --ash:      #e4dfd8;
    --ash-light: #f3efea;
    --ash-dark: #a8a8a8;
    --navy:     #24221b;
    --navy-mid: #363329;
    --navy-dim: rgba(36,34,27,0.65);
    --earth:    #f2d04e;
    --earth-dim: rgba(242,208,78,0.18);
    --earth-dark: #d6b436;
    --white:    #ffffff;
    --off-white: #f4f8f7;
    --text:     #24221b;
    --text-muted: rgba(36,24,27,0.55);
    --text-faint: rgba(30,24,27,0.35);
    --radius-card: 18px;
    --radius-pill: 100px;
    --shadow-card: 0 2px 20px rgba(36,24,27,0.06);
    --shadow-hover: 0 10px 36px rgba(36,24,27,0.12);
    --transition: 0.22s ease;
  }
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
  .lp-root { min-height: 100vh; background: var(--off-white); color: var(--text); font-family: "DM Sans", sans-serif; overflow-x: hidden; }
  .lp-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 0 40px; background: var(--navy); transition: box-shadow 0.3s; }
  .lp-nav--scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.25); }
  .lp-nav__inner { max-width: 1200px; margin: 0 auto; height: 64px; display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 16px; }
  .lp-nav__brand { font-size: 20px; font-weight: 800; letter-spacing: -0.04em; color: var(--white); text-decoration: none; flex-shrink: 0; margin-right: auto; font-family: "DM Serif Display", serif; }
  .lp-brand__dot { color: var(--earth); }
  .lp-nav__links { display: flex; gap: 36px; justify-content: center; }
  .lp-nav__link { font-size: 14px; color: rgba(255,255,255,0.5); font-weight: 500; text-decoration: none; transition: color var(--transition); position: relative; letter-spacing: 0.01em; }
  .lp-nav__link::after { content: ""; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: var(--earth); border-radius: 2px; transition: width var(--transition); }
  .lp-nav__link:hover { color: var(--white); }
  .lp-nav__link:hover::after { width: 100%; }
  .lp-nav__actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
  .lp-btn--sm { padding: 7px 18px; font-size: 13px; }
  .lp-nav__hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; margin-left: 20px; }
  .lp-nav__hamburger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,0.55); border-radius: 2px; }
  .lp-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border-radius: var(--radius-pill); font-size: 14px; font-weight: 600; font-family: "DM Sans", sans-serif; text-decoration: none; cursor: pointer; border: none; transition: all var(--transition); white-space: nowrap; letter-spacing: 0.01em; }
  .lp-btn--primary { background: var(--earth); color: var(--navy); box-shadow: 0 2px 14px rgba(227,167,80,0.35); }
  .lp-btn--primary:hover { background: var(--earth-dark); transform: translateY(-1px); box-shadow: 0 6px 22px rgba(227,167,80,0.4); }
  .lp-btn--outline { background: transparent; color: var(--navy); border: 1.5px solid rgba(0,47,69,0.3); }
  .lp-btn--outline:hover { background: rgba(0,47,69,0.06); border-color: var(--navy); }
  .lp-btn--dark { background: var(--navy); color: var(--white); border: 1.5px solid var(--navy); }
  .lp-btn--dark:hover { background: var(--navy-mid); }
  .lp-btn--lg { padding: 13px 30px; font-size: 15px; }
  .lp-btn--footer-outline { background: transparent; color: rgba(255,255,255,0.6); border: 1.5px solid rgba(255,255,255,0.2); }
  .lp-btn--footer-outline:hover { border-color: var(--earth); color: var(--earth); }
  .lp-banner { position: relative; width: 100%; height: 440px; margin-top: 64px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .lp-banner__bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy), #001b28); }
  .lp-banner__bgimg { width: 100%; height: 100%; object-fit: cover; opacity: 0.45; mix-blend-mode: luminosity; }
  .lp-banner__overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,47,69,0.3) 0%, rgba(0,47,69,0.75) 100%); }
  .lp-banner__content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
  .lp-banner__avatar-wrap { width: 124px; height: 124px; border-radius: 50%; border: 3px solid var(--earth); overflow: hidden; box-shadow: 0 0 0 8px rgba(227,167,80,0.15), 0 12px 40px rgba(0,0,0,0.35); background: var(--navy-mid); }
  .lp-banner__avatar { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .lp-banner__name { font-size: 30px; font-weight: 700; color: var(--white); letter-spacing: -0.03em; margin: 0; font-family: "DM Serif Display", serif; }
  .lp-banner__tagline { font-size: 14px; color: var(--ash); margin: 0; font-weight: 400; letter-spacing: 0.02em; }
  .lp-section { padding: 96px 40px; position: relative; background: var(--off-white); }
  .lp-section--about { background: var(--white); }
  .lp-section--gallery { background: var(--ash); border-top: 1px solid var(--ash-dark); border-bottom: 1px solid var(--ash-dark); }
  .lp-section--contact { background: var(--navy); }
  .lp-section__header { max-width: 1200px; margin: 0 auto 56px; text-align: center; }
  .lp-section__eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--earth-dark); margin-bottom: 10px; }
  .lp-section__eyebrow--light { color: var(--ash); }
  .lp-section__eyebrow--projects { color: var(--navy-dim); }
  .lp-section__title { font-size: clamp(28px, 4vw, 46px); font-weight: 700; letter-spacing: -0.04em; color: var(--navy); margin-bottom: 14px; font-family: "DM Serif Display", serif; line-height: 1.1; }
  .lp-section__title--light { color: var(--white); }
  .lp-section__title--projects { color: var(--navy); }
  .lp-section__sub { font-size: 15px; color: var(--text-muted); max-width: 480px; margin: 0 auto; line-height: 1.75; }
  .lp-section__sub--light { color: rgba(188,212,204,0.7); }
  .lp-section__sub--projects { color: var(--navy-dim); }
  .lp-section__divider { width: 40px; height: 3px; background: linear-gradient(90deg, var(--earth), var(--earth-dark)); border-radius: 3px; margin: 20px auto 0; }
  .lp-section__divider--earth { background: linear-gradient(90deg, var(--earth), var(--earth-dark)); }
  .lp-section__divider--projects { background: linear-gradient(90deg, var(--navy), var(--navy-mid)); }
  .lp-about-body { max-width: 860px; margin: 0 auto; display: flex; align-items: center; gap: 56px; }
  .lp-about__photo-col { flex-shrink: 0; }
  .lp-about__photo-frame { width: 256px; height: 316px; border-radius: 20px; overflow: hidden; position: relative; background: var(--ash-light); border: 1.5px solid var(--ash-dark); box-shadow: var(--shadow-card); display: flex; align-items: center; justify-content: center; }
  .lp-about__photo { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .lp-about__photo-ring { position: absolute; inset: -10px; border-radius: 26px; border: 1.5px solid rgba(0,47,69,0.08); pointer-events: none; }
  .lp-about__text-col { flex: 1; min-width: 0; }
  .lp-about__eyebrow-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--earth-dim); border: 1px solid rgba(227,167,80,0.3); color: var(--earth-dark); font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: var(--radius-pill); margin-bottom: 18px; letter-spacing: 0.08em; text-transform: uppercase; }
  .lp-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--earth); flex-shrink: 0; }
  .lp-about__sub { font-size: clamp(14px, 1.8vw, 18px); font-weight: 500; color: var(--text-muted); margin-bottom: 20px; letter-spacing: -0.01em; line-height: 1.5; }
  .lp-hero__accent { color: var(--earth-dark); }
  .lp-sep { color: var(--text-faint); }
  .lp-about__desc { font-size: 15px; color: var(--text-muted); max-width: 440px; line-height: 1.8; margin-bottom: 32px; }
  .lp-about__actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .lp-band { border-top: 1px solid var(--ash-dark); border-bottom: 1px solid var(--ash-dark); background: var(--ash); overflow: hidden; }
  .lp-band__inner { display: flex; flex-wrap: wrap; justify-content: center; padding: 14px 40px; max-width: 1200px; margin: 0 auto; }
  .lp-band__item { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: var(--navy); text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 20px; border-right: 1px solid var(--ash-dark); white-space: nowrap; }
  .lp-band__item:last-child { border-right: none; }
  .lp-band__dot { width: 4px; height: 4px; border-radius: 50%; background: var(--earth); flex-shrink: 0; }
  .lp-services-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
  .lp-service-card { background: var(--white); border: 1.5px solid rgba(0,47,69,0.08); border-radius: var(--radius-card); padding: 28px 24px; transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition); animation: lp-fadein 0.7s ease both; cursor: default; box-shadow: var(--shadow-card); }
  .lp-service-card:hover { border-color: var(--ash-dark); transform: translateY(-4px); box-shadow: var(--shadow-hover); }
  .lp-service-card__icon { width: 48px; height: 48px; border-radius: 12px; background: var(--ash-light); border: 1px solid var(--ash-dark); display: flex; align-items: center; justify-content: center; color: var(--navy); margin-bottom: 18px; }
  .lp-service-card__title { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 8px; letter-spacing: -0.02em; }
  .lp-service-card__desc { font-size: 13px; color: var(--text-muted); line-height: 1.75; }
  .lp-section--projects { background: var(--ash); border-top: 1px solid var(--ash-dark); border-bottom: 1px solid var(--ash-dark); }
  .lp-projects-grid { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .lp-proj-card { border-radius: var(--radius-card); overflow: hidden; background: var(--white); border: 1.5px solid rgba(0,47,69,0.07); box-shadow: var(--shadow-card); transition: transform 0.25s ease, box-shadow 0.25s ease; animation: lp-fadein 0.7s ease both; cursor: pointer; text-decoration: none; display: flex; flex-direction: column; color: inherit; }
  .lp-proj-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); }
  .lp-proj-card__img { position: relative; height: 155px; overflow: hidden; background: var(--ash-light); flex-shrink: 0; }
  .lp-proj-card__img-inner { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
  .lp-proj-card:hover .lp-proj-card__img-inner { transform: scale(1.06); }
  .lp-proj-card__placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--ash); }
  .lp-proj-card__placeholder-icon { color: var(--ash-dark); transform: scale(1.8); }
  .lp-proj-card__tag { position: absolute; top: 10px; right: 10px; background: var(--navy); color: var(--earth); font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; border-radius: var(--radius-pill); }
  .lp-proj-card__body { padding: 12px 14px 14px; background: var(--white); display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .lp-proj-card__title { font-size: 13px; font-weight: 700; color: var(--navy); letter-spacing: -0.01em; line-height: 1.35; }
  .lp-proj-card__arrow { font-size: 11px; color: var(--earth-dark); font-weight: 600; margin-top: auto; padding-top: 6px; display: inline-flex; align-items: center; gap: 3px; transition: gap 0.2s; }
  .lp-proj-card:hover .lp-proj-card__arrow { gap: 7px; }
  .lp-hire-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .lp-hire-card { border-radius: 20px; padding: 28px 22px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition); border: 1.5px solid rgba(0,47,69,0.1); background: var(--white); box-shadow: var(--shadow-card); }
  .lp-hire-card--accent { background: var(--navy); border-color: var(--navy); }
  .lp-hire-card--accent .lp-hire-card__platform { color: var(--white); }
  .lp-hire-card--accent .lp-hire-card__desc { color: rgba(188,212,204,0.65); }
  .lp-hire-card--accent .lp-btn--dark { background: var(--earth); color: var(--navy); border-color: var(--earth); box-shadow: 0 2px 14px rgba(227,167,80,0.3); }
  .lp-hire-card--accent .lp-btn--dark:hover { background: var(--earth-dark); }
  .lp-hire-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
  .lp-hire-card__icon { width: 50px; height: 50px; border-radius: 14px; background: var(--ash-light); border: 1px solid var(--ash-dark); display: flex; align-items: center; justify-content: center; color: var(--navy); }
  .lp-hire-card__icon--filled { background: var(--earth); border-color: var(--earth); color: var(--navy); }
  .lp-hire-card__platform { font-size: 17px; font-weight: 700; color: var(--navy); letter-spacing: -0.03em; font-family: "DM Serif Display", serif; }
  .lp-hire-card__desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

  .lp-contact-list {
  max-width: 780px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.lp-contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 16px;
  min-width: 120px;
  flex: 1;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.lp-contact-item:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(242,208,78,0.18);
  transform: translateY(-2px);
}
.lp-contact-item__top {
  display: flex;
  align-items: center;
  gap: 7px;
}
.lp-contact-item__icon {
  width: 26px; height: 26px;
  border-radius: 7px;
  background: rgba(242,208,78,0.08);
  border: 1px solid rgba(242,208,78,0.12);
  color: var(--earth);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.lp-contact-item__icon svg { width: 14px; height: 14px; }
.lp-contact-item__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}
.lp-contact-item__text {
  font-size: 10.5px;
  font-weight: 400;
  color: rgba(255,255,255,0.28);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
}
.lp-contact-item__arrow { display: none; }


.lp-contact-sub {
  max-width: 420px;
  margin: 0 auto;

  font-size: 14px;
  line-height: 1.8;

  color: rgba(188,212,204,0.65);
}
  .lp-footer { background: var(--navy); border-top: 1px solid rgba(255,255,255,0.06); padding: 24px 40px; }
  .lp-footer__inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .lp-footer__brand { font-size: 18px; font-weight: 700; letter-spacing: -0.04em; color: var(--white); font-family: "DM Serif Display", serif; }
  .lp-footer__copy { font-size: 13px; color: rgba(255,255,255,0.28); }
  @keyframes lp-fadein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .lp-section--blog { background: var(--white); }
  .lp-blog-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .lp-blog-card { border-radius: 16px; overflow: hidden; background: #fff; border: 1.5px solid #eae7e1; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; animation: lp-fadein 0.7s ease both; text-decoration: none; color: inherit; display: flex; flex-direction: column; }
  .lp-blog-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.08); border-color: #ddd9d2; }
  .lp-blog-card__img { position: relative; height: 175px; overflow: hidden; background: #f2efe9; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #ccc8c0; }
  .lp-blog-card__category { position: absolute; top: 10px; left: 10px; background: rgba(30,28,22,0.7); color: #edc84a; font-size: 9.5px; font-weight: 700; padding: 3px 9px; border-radius: 100px; letter-spacing: 0.05em; text-transform: uppercase; backdrop-filter: blur(6px); }
  .lp-blog-card__tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 11px; }
  .lp-blog-card__tag { font-size: 10px; font-weight: 600; color: #b8880e; background: #fdf3dc; border: 1px solid #f0d88a; padding: 2px 7px; border-radius: 100px; }
  .lp-blog-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
  .lp-blog-card:hover .lp-blog-card__img img { transform: scale(1.04); }
  .lp-blog-card__img-placeholder { color: #ccc8c0; }
  .lp-blog-card__body { padding: 14px 15px 13px; display: flex; flex-direction: column; flex: 1; }
  .lp-blog-card__title { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 6px; line-height: 1.38; letter-spacing: -0.02em; }
  .lp-blog-card__excerpt { font-size: 12px; color: #777; line-height: 1.7; margin: 0 0 12px; flex: 1; }
  .lp-blog-card__footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .lp-blog-card__meta { display: flex; align-items: center; gap: 7px; }
  .lp-blog-card__avatar { width: 20px; height: 20px; border-radius: 50%; background: #edc84a; color: #1e1c16; font-size: 7px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .lp-blog-card__meta-info { display: flex; flex-direction: column; gap: 1px; }
  .lp-blog-card__author { font-size: 10.5px; font-weight: 600; color: #555; line-height: 1.2; }
  .lp-blog-card__date { font-size: 10.5px; color: #aaa; }
  .lp-blog-card__cta { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #b8880e; transition: gap 0.15s; }
  .lp-blog-card:hover .lp-blog-card__cta { gap: 7px; }
  @media (max-width: 900px) {
    .lp-gallery-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
    .lp-projects-grid { grid-template-columns: repeat(2, 1fr); }
    .lp-hire-grid { grid-template-columns: 1fr; max-width: 400px; }
    .lp-about-body { flex-direction: column; text-align: center; gap: 36px; }
    .lp-about__actions { justify-content: center; }
    .lp-about__desc { margin-left: auto; margin-right: auto; }
    .lp-blog-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .lp-nav { padding: 0 20px; }
    .lp-nav__links { display: none; position: fixed; top: 64px; left: 0; right: 0; background: var(--navy); flex-direction: column; padding: 24px 28px; gap: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .lp-nav__links--open { display: flex; }
    .lp-nav__hamburger { display: flex; }
    .lp-banner { height: 320px; }
    .lp-section { padding: 72px 20px; }
    .lp-services-grid { grid-template-columns: 1fr; }
    .lp-projects-grid { grid-template-columns: 1fr; max-width: 360px; margin: 0 auto; }
    .lp-band__inner { padding: 12px 20px; }
    .lp-band__item { padding: 4px 12px; font-size: 10px; }
    .lp-footer { padding: 24px 20px; }
    .lp-footer__inner { justify-content: center; text-align: center; }
    .lp-about__photo-frame { width: 200px; height: 240px; }
    .lp-blog-grid { grid-template-columns: 1fr; }
  }

    @keyframes gallery-fadein {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
    .gallery-grid-animate {
    animation: gallery-fadein 0.32s cubic-bezier(.34,1.56,.64,1) both;
  }
    .gallery-grid-exit {
    opacity: 0;
    transform: translateY(-10px) scale(0.97);
    transition: opacity 0.18s ease, transform 0.18s ease;
  }

    .gallery-card-anim {
    animation: lp-fadein 0.5s cubic-bezier(.34,1.2,.64,1) both;
  }

  html { scroll-behavior: smooth; }

  @keyframes section-flash {
    0%   { box-shadow: inset 0 0 0 0px rgba(242,208,78,0); }
    30%  { box-shadow: inset 0 0 0 3px rgba(242,208,78,0.55); }
    100% { box-shadow: inset 0 0 0 0px rgba(242,208,78,0); }
  }
  .lp-section--flash {
    animation: section-flash 0.9s cubic-bezier(.22,.68,0,1.2) both;
  }
`