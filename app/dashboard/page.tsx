"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function ChangePasswordForm({ apiUrl }: { apiUrl: string }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const [btnPressed, setBtnPressed] = useState(false)

  const inputWrapStyle: React.CSSProperties = {
    position: "relative",
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 36px 9px 12px", borderRadius: 8, fontSize: 13,
    border: "1.5px solid var(--border)", outline: "none",
    fontFamily: "inherit", background: "#fff", color: "#1a1a1a",
    boxSizing: "border-box", transition: "border-color 0.2s",
  }

  const eyeBtnStyle: React.CSSProperties = {
    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", padding: 0,
    display: "flex", alignItems: "center", color: "#a8a29e",
  }

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "currentColor", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "currentColor", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

  async function handleSubmit() {
    setMsg(null)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ text: "Semua field wajib diisi.", ok: false }); return
    }
    if (newPassword.length < 6) {
      setMsg({ text: "Password baru minimal 6 karakter.", ok: false }); return
    }
    if (newPassword !== confirmPassword) {
      setMsg({ text: "Konfirmasi password tidak cocok.", ok: false }); return
    }
    const token = localStorage.getItem("token") || ""
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/me/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.ok) {
        setMsg({ text: "✓ Password berhasil diubah. Anda akan logout dalam 3 detik...", ok: true })
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
        setTimeout(() => {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          window.location.href = "/"
        }, 3000)
      } else {
        const err = await res.json()
        setMsg({ text: err.message ?? "Gagal mengubah password.", ok: false })
      }
    } catch {
      setMsg({ text: "Gagal terhubung ke server.", ok: false })
    } finally {
      setLoading(false)
    }
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 5
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>

      <div>
        <label style={labelStyle}>Password Saat Ini</label>
        <div style={inputWrapStyle}>
          <input
            type={showCurrent ? "text" : "password"}
            style={inputStyle} value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Masukkan password lama"
            onFocus={e => e.target.style.borderColor = "var(--primary-dark)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
          <button style={eyeBtnStyle} onClick={() => setShowCurrent(v => !v)} type="button">
            {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Password Baru</label>
        <div style={inputWrapStyle}>
          <input
            type={showNew ? "text" : "password"}
            style={inputStyle} value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            onFocus={e => e.target.style.borderColor = "var(--primary-dark)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
          <button style={eyeBtnStyle} onClick={() => setShowNew(v => !v)} type="button">
            {showNew ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Konfirmasi Password Baru</label>
        <div style={inputWrapStyle}>
          <input
            type={showConfirm ? "text" : "password"}
            style={inputStyle} value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password baru"
            onFocus={e => e.target.style.borderColor = "var(--primary-dark)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
          <button style={eyeBtnStyle} onClick={() => setShowConfirm(v => !v)} type="button">
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {msg && (
        <p style={{
          fontSize: 13, fontWeight: 600, padding: "8px 12px", borderRadius: 8, margin: 0,
          background: msg.ok ? "#f0fdf4" : "#fff5f5",
          color: msg.ok ? "#166534" : "#e53e3e",
          border: `1px solid ${msg.ok ? "#bbf7d0" : "#f5c6c6"}`,
        }}>
          {msg.text}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => { setBtnHovered(false); setBtnPressed(false) }}
        onMouseDown={() => setBtnPressed(true)}
        onMouseUp={() => setBtnPressed(false)}
        style={{
          padding: "9px 22px", borderRadius: 999, border: "none",
          background: loading ? "#555" : btnPressed ? "#f2d04e" : btnHovered ? "#3a3729" : "var(--primary-dark, #24221b)",
          color: btnPressed ? "#24221b" : "#f2d04e",
          fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          transform: btnPressed ? "scale(0.97)" : btnHovered ? "translateY(-1px)" : "none",
          boxShadow: btnHovered && !btnPressed ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
          transition: "background 0.18s, transform 0.12s, box-shadow 0.18s, color 0.18s",
          alignSelf: "flex-start",
        }}
      >
        {loading ? "Menyimpan..." : "Simpan Password"}
      </button>
    </div>
  )
}

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

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"



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

      <div className="container" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, marginBottom: 16 }}>Ganti Password</h2>
        <ChangePasswordForm apiUrl={API} />
      </div>
    </div>
  )
}