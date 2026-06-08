"use client"

import "./globals.css"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Poppins } from "next/font/google"
import { useEffect, useState } from "react"
import ConfirmModal from "./components/ConfirmModal"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" /><path d="M3 12v9h18V12" />
  </svg>
)
const EmployeesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
  </svg>
)
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
  </svg>
)
const GalleryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const BlogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)
const ProjectsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
)
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 13, height: 13, stroke: "currentColor" }}>
    <polyline points="15 18 9 12 15 6" />
    <line x1="9" y1="12" x2="21" y2="12" />
  </svg>
)
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const ContactIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const AccountIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20v-1a8 8 0 0 1 16 0v1" />
  </svg>
)
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsed = JSON.parse(userData)
      setIsAdmin(parsed.role === "admin")
    } else {
      setIsAdmin(false)
    }
  }, [pathname])

  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/projects/") ||
    pathname === "/articles" ||
    pathname.startsWith("/blog/") ||
    pathname === "/projects-admin/write"

  const navItems = [
    { href: "/dashboard", label: "Home", Icon: HomeIcon },
    { href: "/employees", label: "Employees", Icon: EmployeesIcon },
    { href: "/gallery", label: "Gallery", Icon: GalleryIcon },
    { href: "/blog", label: "Blog", Icon: BlogIcon },
    ...(isAdmin ? [
      { href: "/projects-admin", label: "Projects", Icon: ProjectsIcon },
      { href: "/comments", label: "Comments", Icon: CommentIcon },
      { href: "/contact", label: "Contact", Icon: ContactIcon },
      { href: "/users", label: "Users", Icon: UsersIcon },
    ] : []),
  ]

  const sidebarWidth = collapsed ? 60 : 200

  return (
    <html lang="en">
      <body className={poppins.className}>
        <style>{`
          .sidebar-nav-link { display: flex; align-items: center; gap: 10px; padding: 8px ${collapsed ? "0px" : "10px"}; ${collapsed ? "justify-content: center;" : ""} border-radius: 8px; font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.55); text-decoration: none; transition: all 0.18s; white-space: nowrap; overflow: hidden; }
          .sidebar-nav-link svg { width: 16px; height: 16px; flex-shrink: 0; stroke: currentColor; }
          .sidebar-nav-link:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
          .sidebar-nav-link.active { background: #f2d04e; color: #24221b; font-weight: 700; }
          .sidebar-nav-link.active svg { stroke: #24221b; }
          .sidebar-tooltip { position: relative; }
          .sidebar-tooltip:hover .sidebar-tooltip__label { opacity: 1; pointer-events: auto; transform: translateX(0); }
          .sidebar-tooltip__label { position: absolute; left: calc(100% + 10px); top: 50%; transform: translateX(-6px) translateY(-50%); background: #1a1a1a; color: #fff; font-size: 11.5px; font-weight: 600; padding: 4px 10px; border-radius: 6px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.15s, transform 0.15s; z-index: 999; }
        `}</style>

        <div className="layout" style={{ gridTemplateColumns: `${sidebarWidth}px 1fr`, transition: "grid-template-columns 0.25s ease" }}>

          <ConfirmModal
            isOpen={logoutConfirm}
            title="Keluar dari Aplikasi"
            message="Anda akan logout dari Nexora. Sampai jumpa lagi!"
            confirmLabel="Ya, Logout"
            cancelLabel="Tidak, Tetap di sini"
            variant="warning"
            iconType="logout"
            onConfirm={() => {
              setLogoutConfirm(false)
              localStorage.removeItem("token")
              localStorage.removeItem("user")
              window.location.href = "/"
            }}
            onCancel={() => setLogoutConfirm(false)}
          />

          {!isAuthPage && (
            <aside style={{
              width: sidebarWidth,
              minHeight: "100vh",
              background: "#24221b",
              display: "flex",
              flexDirection: "column",
              padding: "0",
              transition: "width 0.25s ease",
              overflow: "hidden",
              position: "fixed",
              top: 0, left: 0, bottom: 0,
              zIndex: 100,
            }}>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "space-between",
                padding: collapsed ? "14px 0" : "14px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}>
                {!collapsed && (
                  <span style={{
                    fontSize: 15, fontWeight: 700, color: "#fff",
                    letterSpacing: "-0.03em", fontFamily: "Georgia, serif",
                  }}>
                    Nexora<span style={{ color: "#f2d04e" }}>.</span>
                  </span>
                )}
                <button
                  onClick={() => setCollapsed(v => !v)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    padding: 4, borderRadius: 6,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f2d04e")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  {collapsed ? <MenuIcon /> : <CloseIcon />}
                </button>
              </div>

              <nav style={{ flex: 1, padding: collapsed ? "8px 6px" : "8px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", overflowX: "hidden" }}>

                <div className="sidebar-tooltip" style={{ marginBottom: 4 }}>
                  <Link
                    href="/"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: collapsed ? "7px 0" : "7px 10px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                      border: "1px dashed rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.03)",
                      transition: "all 0.18s",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#f2d04e"
                      e.currentTarget.style.borderColor = "rgba(242,208,78,0.35)"
                      e.currentTarget.style.background = "rgba(242,208,78,0.06)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.45)"
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: "rgba(242,208,78,0.1)",
                      border: "1px solid rgba(242,208,78,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <BackIcon />
                    </span>
                    {!collapsed && "Portfolio"}
                  </Link>
                  {collapsed && <span className="sidebar-tooltip__label">Portfolio</span>}
                </div>

                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 0 4px", borderRadius: 1 }} />

                {navItems.map(({ href, label, Icon }) => (
                  <div key={href} className="sidebar-tooltip">
                    <Link href={href} className={`sidebar-nav-link ${pathname === href ? "active" : ""}`}>
                      <Icon />
                      {!collapsed && label}
                    </Link>
                    {collapsed && <span className="sidebar-tooltip__label">{label}</span>}
                  </div>
                ))}

                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0", borderRadius: 1 }} />

                <div className="sidebar-tooltip">
                  <Link href="/profile" className={`sidebar-nav-link ${pathname === "/profile" ? "active" : ""}`}>
                    <AccountIcon />
                    {!collapsed && "Account"}
                  </Link>
                  {collapsed && <span className="sidebar-tooltip__label">Account</span>}
                </div>

              </nav>

              <div style={{
                padding: collapsed ? "10px 6px" : "10px 10px",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}>
                <div className="sidebar-tooltip">
                  <button
                    onClick={() => setLogoutConfirm(true)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "flex-start",
                      gap: 8,
                      padding: collapsed ? "8px 0" : "8px 10px",
                      borderRadius: 8,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#f87171",
                      fontSize: 12.5,
                      fontWeight: 600,
                      fontFamily: "inherit",
                      transition: "background 0.15s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <LogoutIcon />
                    {!collapsed && "Logout"}
                  </button>
                  {collapsed && <span className="sidebar-tooltip__label">Logout</span>}
                </div>
              </div>

            </aside>
          )}

          <main className="main" style={{ marginLeft: isAuthPage ? 0 : sidebarWidth, transition: "margin-left 0.25s ease" }}>
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}