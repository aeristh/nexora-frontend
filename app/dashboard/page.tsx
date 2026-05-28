"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Employee = {
  id: number
  name: string
  position: string
}

type User = {
  id: number
  fullName: string
  email: string
  role: string
  isActive: boolean
}

const PeopleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary-dark)", marginBottom: 10 }}>
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary-dark)", marginBottom: 10 }}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12" />
    <path d="M8 12h8" />
  </svg>
)

const ServerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary-dark)", marginBottom: 10 }}>
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
)

export default function Home() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [backendOk, setBackendOk] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  const API = "http://localhost:3333"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)) } catch { }
    }
    Promise.all([fetchEmployees(token), fetchUser(token)]).finally(() => setLoading(false))
  }, [])

  const fetchEmployees = async (token: string) => {
    try {
      const res = await fetch(`${API}/employees`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setEmployees(Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [])
      setBackendOk(true)
    } catch {
      setEmployees([])
      setBackendOk(false)
    }
  }

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
    } catch { }
  }

  const latestEmployee = employees.length > 0
    ? employees.reduce((prev, curr) => (curr.id > prev.id ? curr : prev))
    : null

  const latestPosition = latestEmployee?.position ?? "—"
  const statusText = backendOk === null ? "Connecting..." : backendOk ? "Backend Connected" : "Backend Offline"
  const statusColor = backendOk === true ? "var(--primary-dark)" : backendOk === false ? "#e53e3e" : "var(--text-secondary)"
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <h1>Dashboard</h1>
          <p>Manage your employees easily</p>
        </div>
        <div className="profile-box">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <p>Welcome back</p>
            <h4>{loading && !user ? "Loading..." : (user?.fullName ?? "User")}</h4>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card highlight">
          <PeopleIcon />
          <h3>Total Employees</h3>
          <p>{loading ? "—" : employees.length}</p>
        </div>
        <div className="dashboard-card">
          <BriefcaseIcon />
          <h3>Latest Position</h3>
          <p style={{ fontSize: latestPosition.length > 14 ? "16px" : "24px", fontWeight: 600 }}>
            {loading ? "—" : latestPosition}
          </p>
        </div>
        <div className="dashboard-card">
          <ServerIcon />
          <h3>Status</h3>
          <p style={{ fontSize: "16px", fontWeight: 600, color: statusColor }}>
            {loading ? "Connecting..." : statusText}
          </p>
        </div>
      </div>

      <div className="container">
        <h2 style={{ fontSize: 17, marginBottom: 16 }}>Account Info</h2>
        {loading && !user ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Loading account info...</p>
        ) : user ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Full Name</span>
              <span style={{ fontWeight: 600 }}>{user.fullName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Email</span>
              <span style={{ fontWeight: 600 }}>{user.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Role</span>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>
        ) : (
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Gagal memuat data akun.</p>
        )}
      </div>
    </div>
  )
}