"use client"

import { useEffect, useState } from "react"
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

const services = [
  { icon: <IconCode />, title: "Full Stack Web", desc: "End-to-end web applications with Next.js frontend and AdonisJS REST API backend." },
  { icon: <IconDB />, title: "Database Design", desc: "Relational schema design and query optimization using PostgreSQL." },
  { icon: <IconAuth />, title: "Authentication", desc: "JWT-based auth systems with secure login, register, and session management." },
  { icon: <IconRole />, title: "Role Management", desc: "Fine-grained role-based access control with admin and user permission layers." },
  { icon: <IconUI />, title: "UI / UX Design", desc: "Clean and modern interfaces with responsive layouts and smooth interactions." },
  { icon: <IconGraphic />, title: "CRUD Systems", desc: "Complete data management systems with real-time feedback and validation." },
]

const projects = [
  { title: "Nexora HR System", tag: "Full Stack", img: "/projects/hr-system.jpg", slug: "nexora-hr-system" },
  { title: "Admin Dashboard", tag: "UI / UX", img: "/projects/adm-dashboard.jpg", slug: "admin-dashboard" },
  { title: "Auth Module", tag: "Backend", img: "/projects/auth-module.jpg", slug: "auth-module" },
  { title: "REST API Design", tag: "Backend", img: "/projects/rest-api.jpg", slug: "rest-api-design" },
  { title: "Employee Portal", tag: "Full Stack", img: "/projects/employee-portal.jpg", slug: "employee-portal" },
  { title: "Role-Based CMS", tag: "Full Stack", img: "/projects/role.jpg", slug: "role-based-cms" },
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
  const BASE = "${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

} "
const excerpt = stripHtml(blog.content).slice(0, 120) + "…"

return (
  <Link href={`/blog/${blog.slug}`} className="lp-blog-card" style={{ animationDelay: `${index * 100}ms` }}>
    <div className="lp-blog-card__img">
      {blog.coverImage
        ? <img src={blog.coverImage.replace('/uploads', '/api-uploads')} alt={blog.title} />
        : <div className="lp-blog-card__img-placeholder"></div>
      }
    </div>
    <div className="lp-blog-card__body">
      <h4 className="lp-blog-card__title">{blog.title}</h4>
      <p className="lp-blog-card__excerpt">{excerpt}</p>
      <div className="lp-blog-card__meta">
        <span className="lp-blog-card__avatar">{getInitials(blog.authorName)}</span>
        <span className="lp-blog-card__author">{blog.authorName}</span>
        <span className="lp-blog-card__date">{formatDate(blog.createdAt)}</span>
      </div>
      <span className="lp-blog-card__cta">Baca Selengkapnya</span>
    </div>
  </Link>
)
}

function ProjectCard({ title, tag, img, index, slug }: { title: string; tag: string; img: string; index: number; slug: string }) {
  return (
    <Link href={`/projects/${slug}`} className="lp-proj-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="lp-proj-card__img">
        {img
          ? <img src={img} alt={title} className="lp-proj-card__img-inner" />
          : (
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

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [galleries, setGalleries] = useState<GalleryItem[]>([])
  const [latestBlogs, setLatestBlogs] = useState<LandingBlog[]>([])
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
  const [galleryPage, setGalleryPage] = useState(0)

  const GALLERY_PER_PAGE = 4
  const BASE = "${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

} "

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 40)
  window.addEventListener("scroll", onScroll)

  fetch(`${BASE}/gallery/public`)
    .then(res => res.json())
    .then(data => { if (Array.isArray(data.data)) setGalleries(data.data) })
    .catch(() => { })

  fetch(`${BASE}/blogs/public?limit=3`)
    .then(res => res.json())
    .then(data => { if (Array.isArray(data.data)) setLatestBlogs(data.data) })
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
              <a key={href} href={href} className="lp-nav__link" onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
          </div>
          <div className="lp-nav__actions">
            <Link href="/login" className="lp-btn lp-btn--footer-outline lp-btn--sm">Login</Link>
            <Link href="/register" className="lp-btn lp-btn--primary lp-btn--sm">Register</Link>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 1200, margin: "0 auto" }}>
                {pageItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLightbox(item)}
                    style={{
                      borderRadius: 16, overflow: "hidden", cursor: "pointer",
                      position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                      transition: "transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease",
                      aspectRatio: "4/3",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px) scale(1.01)"
                        ; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.18)"
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)"
                        ; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)"
                    }}
                  >
                    <img
                      src={`${BASE}${item.imagePath}`}
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

              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 36 }}>
                  <button
                    onClick={() => setGalleryPage(p => Math.max(0, p - 1))}
                    disabled={galleryPage === 0}
                    style={{ padding: "10px 28px", borderRadius: 999, background: galleryPage === 0 ? "rgba(0,0,0,0.08)" : "var(--navy)", color: galleryPage === 0 ? "var(--text-muted)" : "var(--earth)", border: "none", fontSize: 14, fontWeight: 700, cursor: galleryPage === 0 ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                  >Prev</button>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{galleryPage + 1} / {totalPages}</span>
                  <button
                    onClick={() => setGalleryPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={galleryPage === totalPages - 1}
                    style={{ padding: "10px 28px", borderRadius: 999, background: galleryPage === totalPages - 1 ? "rgba(0,0,0,0.08)" : "var(--navy)", color: galleryPage === totalPages - 1 ? "var(--text-muted)" : "var(--earth)", border: "none", fontSize: 14, fontWeight: 700, cursor: galleryPage === totalPages - 1 ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                  >Next</button>
                </div>
              )}
              <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
                Menampilkan {pageItems.length} dari {galleries.length} foto &nbsp;·&nbsp; Halaman {galleryPage + 1} dari {totalPages}
              </p>
            </>
          )
        })()}
      </section>

      <section className="lp-section lp-section--blog" id="blog">
        <div className="lp-section__header">
          <p className="lp-section__eyebrow">Blog</p>
          <h2 className="lp-section__title">Artikel Terbaru</h2>
          <p className="lp-section__sub">Insight, cerita, dan update terbaru dari tim kami.</p>
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
          <p className="lp-section__sub lp-section__sub--projects">A collection of modules and features built within this system.</p>
          <div className="lp-section__divider lp-section__divider--projects" />
        </div>
        <div className="lp-projects-grid">
          {projects.map((p, i) => <ProjectCard key={i} {...p} index={i} />)}
        </div>
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
          <p className="lp-section__eyebrow lp-section__eyebrow--light">Contact</p>
          <h2 className="lp-section__title lp-section__title--light">How To Reach Me</h2>
          <p className="lp-section__sub lp-section__sub--light">Reach out through any of the channels below — I'll get back to you promptly.</p>
          <div className="lp-section__divider lp-section__divider--earth" />
        </div>
        <div className="lp-contact-list">
          <a href="https://wa.me/6285807254735" target="_blank" rel="noopener noreferrer" className="lp-contact-item">
            <span className="lp-contact-item__icon"><IconWA /></span>
            <span className="lp-contact-item__label">WhatsApp</span>
            <span className="lp-contact-item__text">+62 858-0725-4735</span>
            <span className="lp-contact-item__arrow">→</span>
          </a>
          <a href="mailto:xciaaan@email.com" className="lp-contact-item">
            <span className="lp-contact-item__icon"><IconMail /></span>
            <span className="lp-contact-item__label">Email</span>
            <span className="lp-contact-item__text">xciaaan@email.com</span>
            <span className="lp-contact-item__arrow">→</span>
          </a>
          <a href="https://instagram.com/secrett_zn" target="_blank" rel="noopener noreferrer" className="lp-contact-item">
            <span className="lp-contact-item__icon"><IconIG /></span>
            <span className="lp-contact-item__label">Instagram</span>
            <span className="lp-contact-item__text">@secrett_zn</span>
            <span className="lp-contact-item__arrow">→</span>
          </a>
          <a href="https://tiktok.com/@aeristh4u" target="_blank" rel="noopener noreferrer" className="lp-contact-item">
            <span className="lp-contact-item__icon"><IconTiktok /></span>
            <span className="lp-contact-item__label">TikTok</span>
            <span className="lp-contact-item__text">@aeristh4u</span>
            <span className="lp-contact-item__arrow">→</span>
          </a>
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
            src={`${BASE}${lightbox.imagePath}`}
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
  .lp-contact-list { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
  .lp-contact-item { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px 18px; text-decoration: none; color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 500; transition: all var(--transition); }
  .lp-contact-item:hover { background: rgba(255,255,255,0.12); color: var(--white); transform: translateX(4px); border-color: rgba(227,167,80,0.35); }
  .lp-contact-item__icon { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; background: rgba(227,167,80,0.15); border: 1px solid rgba(227,167,80,0.25); display: flex; align-items: center; justify-content: center; color: var(--earth); }
  .lp-contact-item__label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(188,212,204,0.55); min-width: 70px; }
  .lp-contact-item__text { flex: 1; }
  .lp-contact-item__arrow { color: rgba(227,167,80,0.4); font-size: 16px; }
  .lp-footer { background: var(--navy); border-top: 1px solid rgba(255,255,255,0.06); padding: 24px 40px; }
  .lp-footer__inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .lp-footer__brand { font-size: 18px; font-weight: 700; letter-spacing: -0.04em; color: var(--white); font-family: "DM Serif Display", serif; }
  .lp-footer__copy { font-size: 13px; color: rgba(255,255,255,0.28); }
  @keyframes lp-fadein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .lp-section--blog { background: var(--white); }
  .lp-blog-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .lp-blog-card { border-radius: 18px; overflow: hidden; background: var(--white); border: 1.5px solid rgba(0,47,69,0.07); box-shadow: var(--shadow-card); transition: transform 0.25s ease, box-shadow 0.25s ease; animation: lp-fadein 0.7s ease both; text-decoration: none; color: inherit; display: flex; flex-direction: column; }
  .lp-blog-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); }
  .lp-blog-card__img { height: 180px; overflow: hidden; background: var(--ash-light); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .lp-blog-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .lp-blog-card:hover .lp-blog-card__img img { transform: scale(1.06); }
  .lp-blog-card__img-placeholder { font-size: 36px; }
  .lp-blog-card__body { padding: 18px 18px 20px; display: flex; flex-direction: column; flex: 1; }
  .lp-blog-card__title { font-size: 15px; font-weight: 700; color: var(--navy); margin: 0 0 8px; line-height: 1.35; letter-spacing: -0.02em; }
  .lp-blog-card__excerpt { font-size: 13px; color: var(--text-muted); line-height: 1.7; margin: 0 0 14px; flex: 1; }
  .lp-blog-card__meta { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--text-muted); margin-bottom: 12px; }
  .lp-blog-card__avatar { width: 20px; height: 20px; border-radius: 50%; background: var(--earth); color: var(--navy); font-size: 8px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .lp-blog-card__author { font-weight: 600; color: var(--navy); }
  .lp-blog-card__date::before { content: "·"; margin-right: 7px; }
  .lp-blog-card__cta { font-size: 12px; font-weight: 700; color: var(--earth-dark); margin-top: auto; }
  .lp-blog-card:hover .lp-blog-card__cta { letter-spacing: 0.02em; }
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
`