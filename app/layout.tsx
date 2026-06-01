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
    <path d="M3 12L12 3l9 9" />
    <path d="M9 21V12h6v9" />
    <path d="M3 12v9h18V12" />
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
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)

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
      { href: "/settings", label: "Users", Icon: UsersIcon },
    ] : []),
  ]

  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="layout">

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
            <aside className="sidebar">
              <h2>Nexora</h2>
              <nav>
                {navItems.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className={pathname === href ? "active" : ""}>
                    <Icon />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="sidebar-bottom">
                <button className="logout-btn" onClick={() => setLogoutConfirm(true)}>
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            </aside>
          )}

          <main className="main">{children}</main>

        </div>
      </body>
    </html>
  )
}