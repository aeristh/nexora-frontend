"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

type Project = {
    title: string
    category: string
    description: string | null
    content: string | null
    imagePath: string | null
    createdAt: string
}

export default function ProjectArticlePage() {
    const params = useParams()
    const slug = params?.slug as string
    const [project, setProject] = useState<Project | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        if (!slug) return
        fetch(`${API_BASE}/projects/slug/${slug}`)
            .then(res => { if (!res.ok) throw new Error(); return res.json() })
            .then(data => setProject(data.data))
            .catch(() => setNotFound(true))
    }, [slug])

    if (notFound) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", background: "#f6f5f2" }}>
            <p style={{ color: "#888" }}>Project tidak ditemukan.</p>
        </div>
    )

    if (!project) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", background: "#f6f5f2" }}>
            <p style={{ color: "#aaa" }}>Loading...</p>
        </div>
    )

    const formattedDate = new Date(project.createdAt).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
    })

    return (
        <>
            <style>{articleStyles}</style>
            <div className="art-root">

                <nav className={`art-nav ${scrolled ? "art-nav--scrolled" : ""}`}>
                    <div className="art-nav__inner">
                        <Link href="/#projects" className="art-back">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back
                        </Link>
                        <span className="art-nav__brand">Nexora<span className="art-nav__dot">.</span></span>
                    </div>
                </nav>

                <main className="art-main">
                    <div className="art-container">

                        <div className="art-meta">
                            <span className="art-tag">{project.category}</span>
                            <span className="art-date">{formattedDate}</span>
                        </div>

                        <h1 className="art-title">{project.title}</h1>
                        <div className="art-divider" />

                        {project.description && (
                            <p style={{ fontSize: 16, color: "#888", marginBottom: 32, lineHeight: 1.7 }}>
                                {project.description}
                            </p>
                        )}

                        {project.imagePath && (
                            <div className="art-cover">
                                <img src={`${API_BASE}${project.imagePath}`} alt={project.title} />
                            </div>
                        )}

                        {project.content && (
                            <div className="art-body">
                                {project.content.split("\n").filter(Boolean).map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        )}

                    </div>
                </main>

                <footer className="art-footer">
                    <p>© {new Date().getFullYear()} Nexora Management System.</p>
                </footer>

            </div>
        </>
    )
}

const articleStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&display=swap');
  :root {
    --navy: #24221b; --earth: #f2d04e; --earth-dark: #d6b436;
    --ash-dark: #a8a8a8; --off-white: #f6f5f2; --white: #ffffff;
    --text: #24221b; --text-muted: rgba(36,34,27,0.55);
  }
  .art-root { min-height: 100vh; background: var(--off-white); color: var(--text); font-family: "DM Sans", sans-serif; display: flex; flex-direction: column; }
  .art-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: var(--navy); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0 48px; transition: box-shadow 0.3s; }
  .art-nav--scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
  .art-nav__inner { max-width: 1200px; margin: 0 auto; height: 56px; display: flex; align-items: center; justify-content: space-between; }
  .art-back { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
  .art-back:hover { color: var(--earth); }
  .art-nav__brand { font-size: 18px; font-weight: 700; letter-spacing: -0.04em; color: var(--white); font-family: "DM Serif Display", serif; }
  .art-nav__dot { color: var(--earth); }
  .art-main { padding: 80px 32px 96px; flex: 1; }
  .art-container { max-width: 720px; margin: 0 auto; }
  .art-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .art-tag { background: rgba(36,34,27,0.08); color: var(--navy); border: 1px solid rgba(36,34,27,0.15); font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase; }
  .art-date { font-size: 13px; color: var(--text-muted); }
  .art-title { font-size: clamp(26px, 5vw, 42px); font-weight: 700; letter-spacing: -0.04em; line-height: 1.12; color: var(--navy); margin-bottom: 20px; font-family: "DM Serif Display", serif; }
  .art-divider { width: 40px; height: 3px; background: linear-gradient(90deg, var(--earth), var(--earth-dark)); border-radius: 3px; margin-bottom: 32px; }
  .art-cover { border-radius: 16px; overflow: hidden; margin-bottom: 40px; border: 1px solid var(--ash-dark); box-shadow: 0 4px 24px rgba(0,47,69,0.08); }
  .art-cover img { width: 100%; display: block; height: 400px; object-fit: cover; }
  .art-body { font-size: 15px; color: var(--text-muted); line-height: 1.9; }
  .art-body p { margin-bottom: 24px; }
  .art-body p:last-child { margin-bottom: 0; }
  .art-footer { background: var(--navy); border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 32px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.28); }
  @media (max-width: 768px) {
    .art-nav { padding: 0 20px; }
    .art-main { padding: 72px 20px 64px; }
    .art-cover img { height: 240px; }
  }
`