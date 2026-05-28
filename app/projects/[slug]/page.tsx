"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const projectData: Record<string, {
    title: string; tag: string; date: string; img: string; content: string[]
}> = {
    "nexora-hr-system": {
        title: "Nexora HR System",
        tag: "Full Stack",
        date: "01/05/2026",
        img: "/projects/hr-system.jpg",
        content: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
        ]
    },
    "admin-dashboard": {
        title: "Admin Dashboard",
        tag: "UI / UX",
        date: "10/04/2026",
        img: "/projects/adm-dashboard.jpg",
        content: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
        ]
    },
    "auth-module": {
        title: "Auth Module",
        tag: "Backend",
        date: "05/04/2026",
        img: "/projects/auth-module.jpg",
        content: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
        ]
    },
    "rest-api-design": {
        title: "REST API Design",
        tag: "Backend",
        date: "20/03/2026",
        img: "/projects/rest-api.jpg",
        content: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
        ]
    },
    "employee-portal": {
        title: "Employee Portal",
        tag: "Full Stack",
        date: "15/03/2026",
        img: "/projects/employee-portal.jpg",
        content: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
        ]
    },
    "role-based-cms": {
        title: "Role-Based CMS",
        tag: "Full Stack",
        date: "01/03/2026",
        img: "/projects/role.jpg",
        content: [
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quidem consectetur perferendis quis, magni sapiente eum veritatis culpa aut doloribus temporibus cupiditate dicta, nihil dolore nesciunt consequuntur voluptatibus nostrum commodi hic vel sit, ullam reiciendis a! Unde laborum maxime dolor culpa aliquam quisquam ratione eos nihil suscipit, tenetur sit incidunt minus commodi voluptates dignissimos alias illo quis, eveniet aspernatur ex voluptatem vero? Expedita, perferendis? Veniam ex, consectetur modi et nam architecto quas ratione nobis. Deserunt dolores nobis harum optio. Itaque?",
        ]
    },
}

export default function ProjectArticlePage() {
    const params = useParams()
    const slug = params?.slug as string
    const project = projectData[slug]
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    if (!project) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", background: "#f6f5f2", color: "#24221b" }}>
                <p>Project tidak ditemukan.</p>
            </div>
        )
    }

    return (
        <>
            <style>{articleStyles}</style>
            <div className="art-root">

                {/* ── Navbar — sama persis dengan BlogDetailPage ── */}
                <nav className={`art-nav ${scrolled ? "art-nav--scrolled" : ""}`}>
                    <div className="art-nav__inner">
                        <Link href="/" className="art-back">
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
                            <span className="art-tag">{project.tag}</span>
                            <span className="art-date">{project.date}</span>
                        </div>

                        <h1 className="art-title">{project.title}</h1>
                        <div className="art-divider" />

                        {project.img && (
                            <div className="art-cover">
                                <img src={project.img} alt={project.title} />
                            </div>
                        )}

                        <div className="art-body">
                            {project.content.map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>

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
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');

  :root {
    --ash:        #e4dfd8;
    --ash-light:  #f3efea;
    --ash-dark:   #a8a8a8;
    --navy:       #24221b;
    --navy-mid:   #363329;
    --earth:      #f2d04e;
    --earth-dark: #d6b436;
    --off-white:  #f6f5f2;
    --white:      #ffffff;
    --text:       #24221b;
    --text-muted: rgba(36,34,27,0.55);
  }

  .art-root {
    min-height: 100vh;
    background: var(--off-white);
    color: var(--text);
    font-family: "DM Sans", sans-serif;
    display: flex; flex-direction: column;
  }

  /* ── Navbar — identik dengan bd-nav di BlogDetailPage ── */
  .art-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: var(--navy);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 0 48px;
    transition: box-shadow 0.3s;
  }
  .art-nav--scrolled {
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }
  .art-nav__inner {
    max-width: 1200px;
    margin: 0 auto;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Back button — sama dengan .bd-back-btn */
  .art-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    text-decoration: none;
    transition: color 0.2s;
  }
  .art-back:hover { color: var(--earth); }

  /* Brand — sama dengan .bd-nav__brand */
  .art-nav__brand {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: var(--white);
    font-family: "DM Serif Display", serif;
  }
  .art-nav__dot { color: var(--earth); }

  /* ── Content ── */
  .art-main { padding: 80px 32px 96px; flex: 1; }
  .art-container { max-width: 720px; margin: 0 auto; }

  .art-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .art-tag {
    background: rgba(36,34,27,0.08); color: var(--navy);
    border: 1px solid rgba(36,34,27,0.15);
    font-size: 11px; font-weight: 700; padding: 4px 14px;
    border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .art-date { font-size: 13px; color: var(--text-muted); }

  .art-title {
    font-size: clamp(26px, 5vw, 42px); font-weight: 700;
    letter-spacing: -0.04em; line-height: 1.12;
    color: var(--navy); margin-bottom: 20px;
    font-family: "DM Serif Display", serif;
  }
  .art-divider {
    width: 40px; height: 3px;
    background: linear-gradient(90deg, var(--earth), var(--earth-dark));
    border-radius: 3px; margin-bottom: 32px;
  }

  .art-cover {
    border-radius: 16px; overflow: hidden; margin-bottom: 40px;
    border: 1px solid var(--ash-dark);
    box-shadow: 0 4px 24px rgba(0,47,69,0.08);
  }
  .art-cover img {
    width: 100%; display: block;
    height: 400px; object-fit: cover; object-position: center;
  }

  .art-body {
    font-size: 15px; color: var(--text-muted);
    line-height: 1.9;
  }
  .art-body p { margin-bottom: 24px; }
  .art-body p:last-child { margin-bottom: 0; }

  .art-footer {
    background: var(--navy);
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 20px 32px;
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.28);
    font-family: "DM Sans", sans-serif;
  }

  @media (max-width: 768px) {
    .art-nav { padding: 0 20px; }
    .art-main { padding: 72px 20px 64px; }
    .art-cover img { height: 240px; }
    .art-footer { padding: 20px; }
  }
`
