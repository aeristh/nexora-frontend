"use client"

import { Suspense } from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

const CATEGORY_OPTIONS = [
    "Full Stack",
    "Frontend",
    "Backend",
    "UI/UX",
    "Mobile",
    "Rest API",
    "DevOps",
    "Lainnya",
]

function ProjectWriteContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get("id")
    const isEditMode = !!editId

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState("")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState<{ title?: string; category?: string }>({})

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    })

    useEffect(() => {
        if (!editId) return
        async function loadProject() {
            try {
                const res = await fetch(`${API_BASE}/projects/${editId}`, { headers: getHeaders() })
                const data = await res.json()
                const p = data.data || data
                setTitle(p.title || "")
                setCategory(p.category || "")
                setDescription(p.description || "")
                setContent(p.content || "")
                if (p.imagePath) setImagePreview(`${API_BASE}${p.imagePath}`)
            } catch {
                setError("Gagal memuat data project.")
            }
        }
        loadProject()
    }, [editId])

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    async function handleSubmit() {
        const newErrors: { title?: string; category?: string } = {}
        if (!title.trim()) newErrors.title = "Title wajib diisi"
        if (!category.trim()) newErrors.category = "Kategori wajib diisi"
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
        setErrors({})
        setSaving(true)
        setError("")

        try {
            const body = new FormData()
            body.append("title", title)
            body.append("category", category)
            body.append("description", description)
            body.append("content", content)
            if (imageFile) body.append("image", imageFile)

            const url = isEditMode ? `${API_BASE}/projects/${editId}` : `${API_BASE}/projects`
            const method = isEditMode ? "PUT" : "POST"
            const res = await fetch(url, { method, headers: getHeaders(), body })
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData?.message || `Error ${res.status}`)
            }
            setSuccess(true)
            setTimeout(() => { setSuccess(false); router.push("/projects-admin") }, 1800)
        } catch (e: any) {
            setError(e.message || "Terjadi kesalahan")
        }
        setSaving(false)
    }

    function handleReset() {
        setTitle("")
        setCategory("")
        setDescription("")
        setContent("")
        setImageFile(null)
        setImagePreview("")
        setError("")
        setErrors({})
    }

    return (
        <>
            <style>{pageStyles}</style>
            <div className="pw-root">

                <nav className="pw-nav">
                    <div className="pw-nav__left">
                        <button className="pw-nav-back" onClick={() => router.push("/projects-admin")}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                            </svg>
                            Kembali
                        </button>
                        <div className="pw-nav__sep" />
                        <span className="pw-nav__brand">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            {isEditMode ? "Edit Project" : "Tambah Project"}
                        </span>
                    </div>

                    <div className="pw-nav__center">
                        <span className="pw-nav__draft">
                            {title.trim() ? `"${title.slice(0, 32)}${title.length > 32 ? "…" : ""}"` : "Project baru"}
                        </span>
                        <span className="pw-nav__dot" />
                        <span className="pw-nav__saved">Belum disimpan</span>
                    </div>

                    <div className="pw-nav__right">
                        <button className="pw-nav-btn pw-nav-btn--ghost" onClick={handleReset}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                            </svg>
                            Reset
                        </button>
                        <button className="pw-nav-btn pw-nav-btn--save" onClick={handleSubmit} disabled={saving}>
                            {saving ? <span className="pw-spinner" /> : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                            )}
                            {saving ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Simpan Project"}
                        </button>
                    </div>
                </nav>

                {success && (
                    <div className="pw-alert pw-alert--success">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        {isEditMode ? "Project berhasil diperbarui!" : "Project berhasil ditambahkan!"} Mengarahkan kembali...
                    </div>
                )}
                {error && (
                    <div className="pw-alert pw-alert--error">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                        <button className="pw-alert__close" onClick={() => setError("")}>✕</button>
                    </div>
                )}

                <div className="pw-scroll">
                    <div className="pw-doc">

                        <div className="pw-cover">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} className="pw-cover__img" alt="cover" />
                                    <div className="pw-cover__overlay">
                                        <label className="pw-cover__action">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Ganti Gambar
                                            <input type="file" accept="image/*" hidden onChange={handleImage} />
                                        </label>
                                        <button className="pw-cover__action pw-cover__action--remove" onClick={() => { setImageFile(null); setImagePreview("") }}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                            Hapus Gambar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="pw-cover__add">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span>+ Tambah gambar project</span>
                                    <input type="file" accept="image/*" hidden onChange={handleImage} />
                                </label>
                            )}
                        </div>

                        <div className="pw-form">

                            <div className="pw-field">
                                <label className="pw-field__label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="18" y2="18" />
                                    </svg>
                                    Judul Project
                                </label>
                                <input
                                    className={`pw-input${errors.title ? " pw-input--error" : ""}`}
                                    placeholder="Nama project kamu..."
                                    value={title}
                                    onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: undefined })) }}
                                />
                                {errors.title && <p className="pw-field__err">{errors.title}</p>}
                            </div>

                            <div className="pw-field">
                                <label className="pw-field__label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" />
                                    </svg>
                                    Kategori
                                </label>
                                <select
                                    className={`pw-select${errors.category ? " pw-input--error" : ""}`}
                                    value={category}
                                    onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: undefined })) }}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="pw-field__err">{errors.category}</p>}
                            </div>

                            <div className="pw-field">
                                <label className="pw-field__label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
                                    </svg>
                                    Deskripsi Singkat
                                </label>
                                <input
                                    className="pw-input"
                                    placeholder="Ringkasan singkat project..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="pw-field">
                                <label className="pw-field__label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    Detail / Konten Project
                                </label>
                                <textarea
                                    className="pw-textarea"
                                    placeholder="Ceritakan lebih detail tentang project ini: teknologi yang digunakan, tantangan, hasil, dll..."
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    rows={8}
                                />
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default function ProjectWritePage() {
    return (
        <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Memuat form...</div>}>
            <ProjectWriteContent />
        </Suspense>
    )
}

const pageStyles = `
body:has(.pw-root) .main {
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden;
}

.pw-root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: #fff;
    font-family: "Poppins", -apple-system, sans-serif;
    box-sizing: border-box;
}

.pw-nav {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 52px;
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
    gap: 12px;
    z-index: 10;
}
.pw-nav__left  { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.pw-nav__sep   { width: 1px; height: 22px; background: #e0e0e0; }
.pw-nav__brand {
    display: flex; align-items: center; gap: 7px;
    font-size: 14px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.02em;
}
.pw-nav__brand svg { color: #c8960a; }
.pw-nav__center {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; color: #aaa;
    flex: 1; justify-content: center; overflow: hidden;
}
.pw-nav__draft  { color: #666; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
.pw-nav__dot    { width: 3px; height: 3px; border-radius: 50%; background: #ccc; flex-shrink: 0; }
.pw-nav__saved  { white-space: nowrap; }
.pw-nav__right  { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.pw-nav-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: #f0f0f0; color: #555;
    font-size: 13px; font-weight: 600; border: none; cursor: pointer;
    transition: background 0.15s; font-family: inherit;
}
.pw-nav-back:hover { background: #e4e4e4; }

.pw-nav-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 8px;
    font-size: 13px; font-weight: 600; border: none; cursor: pointer;
    transition: all 0.15s; font-family: inherit;
}
.pw-nav-btn--ghost { background: #f0f0f0; color: #555; }
.pw-nav-btn--ghost:hover { background: #e4e4e4; }
.pw-nav-btn--save { background: #f59e0b; color: #24221b; box-shadow: 0 2px 10px rgba(245,158,11,0.3); }
.pw-nav-btn--save:hover:not(:disabled) { background: #d97706; }
.pw-nav-btn--save:disabled { opacity: 0.6; cursor: not-allowed; }

.pw-spinner {
    width: 13px; height: 13px; border-radius: 50%;
    border: 2px solid rgba(28,28,30,0.25); border-top-color: #1C1C1E;
    animation: pw-spin 0.7s linear infinite; display: inline-block;
}
@keyframes pw-spin { to { transform: rotate(360deg); } }

.pw-alert {
    flex-shrink: 0;
    display: flex; align-items: center; gap: 9px;
    margin: 10px 20px 0; padding: 10px 14px;
    border-radius: 8px; font-size: 13px; font-weight: 500;
}
.pw-alert--success { background: #e8f8f0; color: #1a7a4a; border: 1px solid #a8e6c4; }
.pw-alert--error   { background: #fff0f0; color: #c0392b; border: 1px solid #f5c6c6; }
.pw-alert__close {
    margin-left: auto; background: none; border: none; cursor: pointer;
    font-size: 13px; color: inherit; opacity: 0.6; padding: 0 4px;
}
.pw-alert__close:hover { opacity: 1; }

.pw-scroll {
    flex: 1;
    overflow-y: auto;
    background: #f5f5f5;
    padding: 40px 24px 80px;
    display: flex;
    justify-content: center;
}

.pw-doc {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 3px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05);
    width: 100%;
    max-width: 680px;
    align-self: flex-start;
}

.pw-cover {
    position: relative; min-height: 52px;
    background: #fafafa; border-bottom: 1px dashed #e8e8e8; overflow: hidden;
}
.pw-cover__img { width: 100%; max-height: 300px; object-fit: cover; display: block; }
.pw-cover__overlay {
    position: absolute; inset: 0;
    display: flex; align-items: flex-end; justify-content: flex-end;
    gap: 8px; padding: 14px;
    background: linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%);
    opacity: 0; transition: opacity 0.2s;
}
.pw-cover:hover .pw-cover__overlay { opacity: 1; }
.pw-cover__action {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 7px;
    background: rgba(255,255,255,0.92); color: #333;
    font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: inherit;
}
.pw-cover__action:hover { background: #fff; }
.pw-cover__action--remove { color: #c0392b; }
.pw-cover__add {
    display: flex; align-items: center; gap: 9px;
    padding: 14px 28px; cursor: pointer;
    color: #c8c5be; font-size: 13px; font-weight: 500; transition: color 0.15s;
}
.pw-cover__add:hover { color: #999; }

.pw-form {
    padding: 32px 52px 52px;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.pw-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.pw-field__label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.pw-field__label svg { color: #c8960a; }
.pw-field__req { color: #ef4444; font-size: 13px; }
.pw-field__err { color: #ef4444; font-size: 11.5px; margin: 2px 0 0 2px; }

.pw-input {
    padding: 10px 14px;
    border: 1.5px solid #e7e5e4;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    color: #1c1917;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    box-sizing: border-box;
}
.pw-input:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
}
.pw-input--error {
    border-color: #ef4444 !important;
    background: #fff5f5;
}

.pw-select {
    appearance: none;
    padding: 10px 36px 10px 14px;
    border: 1.5px solid #e7e5e4;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    color: #1c1917;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 12px center;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    max-width: 280px;
    box-sizing: border-box;
}
.pw-select:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
}

.pw-textarea {
    padding: 12px 14px;
    border: 1.5px solid #e7e5e4;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    color: #1c1917;
    background: #fff;
    outline: none;
    resize: vertical;
    min-height: 160px;
    line-height: 1.7;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    box-sizing: border-box;
}
.pw-textarea:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
}

@media (max-width: 768px) {
    .pw-nav__center { display: none; }
    .pw-scroll { padding: 16px 8px 60px; }
    .pw-form { padding: 24px 20px 40px; }
    .pw-select { max-width: 100%; }
}
`
