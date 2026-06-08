"use client"

import { Suspense } from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type User = {
    id: number
    name: string
    role: "admin" | "user"
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

const CATEGORY_OPTIONS = ["Teknologi", "Bisnis", "Desain", "Pendidikan", "Hiburan", "Lainnya",]

function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

function BlogWriteContent() {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [title, setTitle] = useState("")
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState("")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const searchParams = useSearchParams()
    const editId = searchParams.get("id")
    const [isEditMode, setIsEditMode] = useState(false)
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState("")
    const [savedSelection, setSavedSelection] = useState<Range | null>(null)

    useEffect(() => {
        const raw = localStorage.getItem("user")
        if (raw) {
            try { setCurrentUser(JSON.parse(raw)) } catch { }
        }
    }, [])

    useEffect(() => {
        if (!editId) return
        setIsEditMode(true)
        async function loadBlog() {
            try {
                const token = localStorage.getItem("token")
                const res = await fetch(`${BASE}/blogs/${editId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                const blog = data.data || data
                setTitle(blog.title)
                if (titleRef.current) titleRef.current.innerText = blog.title
                if (editorRef.current) editorRef.current.innerHTML = blog.content
                if (blog.coverImage) {
                    const src = blog.coverImage.startsWith("http")
                        ? blog.coverImage
                        : `${BASE}${blog.coverImage}`
                    setCoverPreview(src)
                }
                if (blog.category) setCategory(blog.category)
                if (blog.tags && Array.isArray(blog.tags)) setTags(blog.tags)
            } catch {
                setError("Gagal memuat artikel.")
            }
        }
        loadBlog()
    }, [editId])

    function execCmd(cmd: string, value?: string) {
        document.execCommand(cmd, false, value)
        editorRef.current?.focus()
    }

    function insertLink(url: string) {
        if (!url) return
        const sel = window.getSelection()
        if (savedSelection) {
            sel?.removeAllRanges()
            sel?.addRange(savedSelection)
        }
        document.execCommand("createLink", false, url)
        setLinkUrl("")
        setShowLinkInput(false)
        setSavedSelection(null)
    }

    function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setCoverFile(file)
        setCoverPreview(URL.createObjectURL(file))
    }

    function handleAddTag() {
        const trimmed = tagInput.trim().toLowerCase()
        if (!trimmed) return
        if (tags.includes(trimmed)) {
            setTagInput("")
            return
        }
        if (tags.length >= 5) {
            setError("Maksimal 5 tag.")
            return
        }
        setTags(prev => [...prev, trimmed])
        setTagInput("")
    }

    function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddTag()
        }
        if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
            setTags(prev => prev.slice(0, -1))
        }
    }

    function handleRemoveTag(tagToRemove: string) {
        setTags(prev => prev.filter(t => t !== tagToRemove))
    }

    async function handlePublish() {
        if (!title.trim()) return setError("Judul tidak boleh kosong.")
        const content = editorRef.current?.innerHTML || ""
        if (!stripHtml(content).trim()) return setError("Konten tidak boleh kosong.")
        setSaving(true)
        setError("")
        try {
            const token = localStorage.getItem("token")
            const formData = new FormData()
            formData.append("title", title)
            formData.append("content", content)
            if (coverFile) formData.append("coverImage", coverFile)

            if (category) formData.append("category", category)
            if (tags.length > 0) {
                formData.append("tags", JSON.stringify(tags))
            }

            const url = isEditMode ? `${BASE}/blogs/${editId}` : `${BASE}/blogs`
            const method = isEditMode ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            if (!res.ok) throw new Error()
            setSuccess(true)
            setTimeout(() => { setSuccess(false); router.push("/blog") }, 1800)
        } catch {
            setError("Gagal mempublikasikan artikel. Coba lagi.")
        } finally {
            setSaving(false)
        }
    }

    function handleReset() {
        setTitle("")
        setCoverFile(null)
        setCoverPreview("")
        setError("")
        setCategory("")
        setTags([])
        setTagInput("")
        if (titleRef.current) titleRef.current.innerText = ""
        if (editorRef.current) editorRef.current.innerHTML = ""
    }

    return (
        <>
            <style>{pageStyles}</style>
            <div className="we-root">
                <nav className="we-nav">
                    <div className="we-nav__left">
                        <button className="we-nav-back" onClick={() => router.push("/blog")}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                            </svg>
                            Kembali
                        </button>
                        <div className="we-nav__sep" />
                        <span className="we-nav__brand">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            {isEditMode ? "Edit Artikel" : "Tulis Artikel"}
                        </span>
                    </div>
                    <div className="we-nav__center">
                        <span className="we-nav__draft">
                            {title.trim() ? `"${title.slice(0, 32)}${title.length > 32 ? "…" : ""}"` : "Draft baru"}
                        </span>
                        <span className="we-nav__dot" />
                        <span className="we-nav__saved">Belum disimpan</span>
                    </div>
                    <div className="we-nav__right">
                        <button className="we-nav-btn we-nav-btn--ghost" onClick={handleReset}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                            </svg>
                            Reset
                        </button>
                        <button className="we-nav-btn we-nav-btn--publish" onClick={handlePublish} disabled={saving}>
                            {saving ? <span className="we-spinner" /> : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            )}
                            {saving ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Publikasikan"}
                        </button>
                    </div>
                </nav>
                <div className="we-toolbar">
                    <div className="we-toolbar__group">
                        <button className="we-tool" title="Bold" onMouseDown={e => { e.preventDefault(); execCmd("bold") }}><span style={{ fontWeight: 700 }}>B</span></button>
                        <button className="we-tool" title="Italic" onMouseDown={e => { e.preventDefault(); execCmd("italic") }}><span style={{ fontStyle: "italic" }}>I</span></button>
                        <button className="we-tool" title="Underline" onMouseDown={e => { e.preventDefault(); execCmd("underline") }}><span style={{ textDecoration: "underline" }}>U</span></button>
                        <button className="we-tool" title="Strikethrough" onMouseDown={e => { e.preventDefault(); execCmd("strikeThrough") }}><span style={{ textDecoration: "line-through" }}>S</span></button>
                    </div>
                    <div className="we-toolbar__sep" />
                    <div className="we-toolbar__group">
                        <button className="we-tool" title="Heading 1" onMouseDown={e => { e.preventDefault(); execCmd("formatBlock", "h1") }}>H1</button>
                        <button className="we-tool" title="Heading 2" onMouseDown={e => { e.preventDefault(); execCmd("formatBlock", "h2") }}>H2</button>
                        <button className="we-tool" title="Heading 3" onMouseDown={e => { e.preventDefault(); execCmd("formatBlock", "h3") }}>H3</button>
                        <button className="we-tool" title="Paragraph" onMouseDown={e => { e.preventDefault(); execCmd("formatBlock", "p") }}>¶</button>
                    </div>
                    <div className="we-toolbar__sep" />
                    <div className="we-toolbar__group">
                        <button className="we-tool" onMouseDown={e => { e.preventDefault(); execCmd("insertUnorderedList") }}>• List</button>
                        <button className="we-tool" onMouseDown={e => { e.preventDefault(); execCmd("insertOrderedList") }}>1. List</button>
                    </div>
                    <div className="we-toolbar__sep" />
                    <div className="we-toolbar__group">
                        <button className="we-tool" onMouseDown={e => { e.preventDefault(); execCmd("formatBlock", "blockquote") }}>❝ Kutip</button>
                        <div style={{ position: "relative", display: "inline-block" }}>
                            <button className="we-tool" onMouseDown={e => {
                                e.preventDefault()
                                const sel = window.getSelection()
                                if (sel && sel.rangeCount > 0) {
                                    setSavedSelection(sel.getRangeAt(0).cloneRange())
                                }
                                setShowLinkInput(v => !v)
                            }}>
                                🔗 Link
                            </button>

                            {showLinkInput && (
                                <div style={{ position: "absolute", top: "110%", left: 0, zIndex: 100, background: "#fff", border: "1.5px solid #e7e5e4", borderRadius: 10, padding: "10px 12px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", display: "flex", gap: 6, alignItems: "center", minWidth: 280, }}>
                                    <input placeholder="https://..." value={linkUrl} onChange={e => setLinkUrl(e.target.value)} onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            insertLink(linkUrl)
                                        }
                                        if (e.key === "Escape") {
                                            setShowLinkInput(false)
                                            setLinkUrl("")
                                        }
                                    }}
                                        style={{ flex: 1, padding: "7px 10px", border: "1.5px solid #e7e5e4", borderRadius: 7, fontSize: 13, outline: "none", fontFamily: "inherit", }}
                                    />
                                    <button onMouseDown={e => {
                                        e.preventDefault()
                                        insertLink(linkUrl)
                                    }}
                                        style={{ padding: "7px 14px", background: "#f59e0b", color: "#24221b", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", }}
                                    >Sisipkan</button>
                                </div>
                            )}
                        </div>
                        <button className="we-tool" onMouseDown={e => { e.preventDefault(); execCmd("removeFormat") }}>✗ Format</button>
                    </div>
                </div>

                {success && (
                    <div className="we-alert we-alert--success">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        {isEditMode ? "Artikel berhasil diperbarui!" : "Artikel berhasil dipublikasikan!"} Mengarahkan ke halaman blog...
                    </div>
                )}
                {error && (
                    <div className="we-alert we-alert--error">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                        <button className="we-alert__close" onClick={() => setError("")}>✕</button>
                    </div>
                )}

                <div className="we-scroll">
                    <div className="we-doc">

                        <div className="we-cover">
                            {coverPreview ? (
                                <>
                                    <img src={coverPreview} className="we-cover__img" alt="cover" />
                                    <div className="we-cover__overlay">
                                        <label className="we-cover__action">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Ganti Cover
                                            <input type="file" accept="image/*" hidden onChange={handleCover} />
                                        </label>
                                        <button className="we-cover__action we-cover__action--remove" onClick={() => { setCoverFile(null); setCoverPreview("") }}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                            Hapus Cover
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="we-cover__add">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span>+ Tambah cover image</span>
                                    <input type="file" accept="image/*" hidden onChange={handleCover} />
                                </label>
                            )}
                        </div>

                        <div
                            ref={titleRef}
                            className="we-title"
                            contentEditable
                            suppressContentEditableWarning
                            data-placeholder="Judul artikel..."
                            onInput={e => setTitle((e.target as HTMLElement).innerText)}
                            onKeyDown={e => {
                                if (e.key === "Enter") { e.preventDefault(); editorRef.current?.focus() }
                            }}
                        />

                        <div className="we-meta">
                            <div className="we-meta__avatar">{getInitials(currentUser?.name || "?")}</div>
                            <div className="we-meta__info">
                                <span className="we-meta__name">{currentUser?.name || "Unknown"}</span>
                                <span className="we-meta__date">
                                    {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                </span>
                            </div>
                        </div>

                        <div className="we-meta-extra">

                            <div className="we-field">
                                <label className="we-field__label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" />
                                    </svg>
                                    Kategori
                                </label>
                                <select className="we-field__select" value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="">Pilih Kategori</option>
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="we-field">
                                <label className="we-field__label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                        <line x1="7" y1="7" x2="7.01" y2="7" />
                                    </svg>
                                    Tags
                                    <span className="we-field__hint">Tekan Enter untuk menambah (maks. 5)</span>
                                </label>
                                <div className="we-tags-input">
                                    {tags.map(tag => (
                                        <span key={tag} className="we-tag">
                                            #{tag}
                                            <button
                                                className="we-tag__remove"
                                                onClick={() => handleRemoveTag(tag)}
                                                type="button"
                                            >×</button>
                                        </span>
                                    ))}
                                    {tags.length < 5 && (
                                        <input className="we-tags-input__field" type="text" placeholder={tags.length === 0 ? "Contoh: anime, review..." : "Tambah tag..."} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} onBlur={handleAddTag} />
                                    )}
                                </div>
                            </div>

                        </div>

                        <div ref={editorRef} className="we-body" contentEditable suppressContentEditableWarning data-placeholder="Mulai menulis di sini..." />
                    </div>
                </div>

            </div>
        </>
    )
}

export default function BlogWritePage() {
    return (
        <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Memuat editor...</div>}>
            <BlogWriteContent />
        </Suspense>
    )
}

const pageStyles = `
  body:has(.we-root) .main { padding: 0 !important; margin: 0 !important; overflow: hidden; }
  .we-root { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #fff; font-family: "Poppins", -apple-system, sans-serif; box-sizing: border-box; }
  .we-nav { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; height: 52px; background: #fff; border-bottom: 1px solid #e6e6e6; gap: 12px; z-index: 10; }
  .we-nav__left  { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .we-nav__sep   { width: 1px; height: 22px; background: #e0e0e0; }
  .we-nav__brand { display: flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.02em; }
  .we-nav__brand svg { color: #c8960a; }
  .we-nav__center { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #aaa; flex: 1; justify-content: center; overflow: hidden; }
  .we-nav__draft  { color: #666; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
  .we-nav__dot    { width: 3px; height: 3px; border-radius: 50%; background: #ccc; flex-shrink: 0; }
  .we-nav__saved  { white-space: nowrap; }
  .we-nav__right  { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .we-nav-back { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; background: #f0f0f0; color: #555; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: background 0.15s; font-family: inherit; }
  .we-nav-back:hover { background: #e4e4e4; }
  .we-nav-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.15s; font-family: inherit; }
  .we-nav-btn--ghost   { background: #f0f0f0; color: #555; }
  .we-nav-btn--ghost:hover { background: #e4e4e4; }
  .we-nav-btn--publish { background: #F5A623; color: #1C1C1E; }
  .we-nav-btn--publish:hover:not(:disabled) { background: #d98e14; }
  .we-nav-btn--publish:disabled { opacity: 0.6; cursor: not-allowed; }
  .we-spinner { width: 13px; height: 13px; border-radius: 50%; border: 2px solid rgba(28,28,30,0.25); border-top-color: #1C1C1E; animation: we-spin 0.7s linear infinite; display: inline-block; }
  @keyframes we-spin { to { transform: rotate(360deg); } }
  .we-toolbar { flex-shrink: 0; display: flex; flex-wrap: wrap; background: #fff; border-bottom: 1px solid #e6e6e6; adding: 5px 16px; gap: 0; z-index: 9; }
  .we-toolbar__group { display: flex; align-items: center; }
  .we-toolbar__sep   { width: 1px; height: 20px; background: #e0e0e0; margin: 0 6px; }
  .we-tool { background: none; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 13px; color: #444; font-family: inherit; transition: all 0.12s; white-space: nowrap; }
  .we-tool:hover  { background: #f2f2f2; }
  .we-tool:active { background: #e8e8e8; transform: scale(0.97); }
  .we-alert { flex-shrink: 0; display:flex; align-items: center; gap: 9px; margin: 10px 20px 0; padding: 10px 14px; border-radius: 8px; font-size:13px; font-weight: 500; }
  .we-alert--success { background: #e8f8f0; color: #1a7a4a; border: 1px solid #a8e6c4; }
  .we-alert--error   { background: #fff0f0; color: #c0392b; border: 1px solid #f5c6c6; }
  .we-alert__close { margin-left: auto; background: none; border: none; cursor: pointer; font-size: 13px; color: inherit; opacity: 0.6; padding: 0 4px; }
  .we-alert__close:hover { opacity: 1; }
  .we-scroll { flex: 1; overflow-y: auto; background: #f5f5f5; padding: 40px 24px 80px; display: flex; justify-content: center; }
  .we-doc { background: #fff; border: 1px solid #e0e0e0; border-radius: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05); width: 100%; max-width: 780px; min-height: 100%; align-self: flex-start; }
  .we-cover { position: relative; min-height: 52px; background: #fafafa; border-bottom: 1px dashed #e8e8e8; overflow: hidden; }
  .we-cover__img { width: 100%; max-height: 360px; object-fit: cover; display: block; }
  .we-cover__overlay { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: flex-end; gap: 8px; padding: 14px; background: linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 55%); opacity: 0; transition: opacity 0.2s; }
  .we-cover:hover .we-cover__overlay { opacity: 1; }
  .we-cover__action { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 7px; background: rgba(255,255,255,0.92); color: #333; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
  .we-cover__action:hover { background: #fff; }
  .we-cover__action--remove { color: #c0392b; }
  .we-cover__add { display: flex; align-items: center; gap: 9px; padding: 14px 28px; cursor: pointer; color: #c8c5be; font-size: 13px; font-weight: 500; transition: color 0.15s; }
  .we-cover__add:hover { color: #999; }
  .we-title { font-size: 38px; font-weight: 800; color: #111; letter-spacing: -0.04em; line-height: 1.15; padding: 40px 52px 14px; outline: none; min-height: 64px; }
  .we-title:empty::before { content: attr(data-placeholder); color: #d8d5ce; pointer-events: none; }
  .we-meta { display: flex; align-items: center; gap: 10px; padding: 0 52px 22px; }
  .we-meta__avatar { width: 32px; height: 32px; border-radius: 50%; background: #F5A623; color: #1C1C1E; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .we-meta__info  { display: flex; flex-direction: column; }
  .we-meta__name  { font-size: 13px; font-weight: 600; color: #333; line-height: 1.2; }
  .we-meta__date  { font-size: 11.5px; color: #bbb; }
  .we-meta-extra { display: flex; flex-direction: column; gap: 16px; padding: 16px 52px 22px; border-top: 1px solid #f0ede8; border-bottom: 1px solid #f0ede8; margin-bottom: 4px; background: #fdfcfb; }
  .we-field { display: flex; flex-direction: column; gap: 7px; }
  .we-field__label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
  .we-field__label svg { color: #c8960a; }
  .we-field__hint { font-size: 11px; font-weight: 400; color: #bbb; text-transform: none; letter-spacing: 0; margin-left: 4px; }
  .we-field__select { appearance: none; padding: 8px 32px 8px 12px; border: 1.5px solid #e8e5e0; border-radius: 8px; font-size: 13px; font-family: inherit; color: #333; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 10px center; cursor: pointer; transition: border-color 0.15s; max-width: 260px; }
  .we-field__select:focus { outline: none; border-color: #F5A623; }
  .we-tags-input { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 7px 10px; border: 1.5px solid #e8e5e0; border-radius: 8px; background: #fff; min-height: 40px; transition: border-color 0.15s; cursor: text; }
  .we-tags-input:focus-within { border-color: #F5A623; }
  .we-tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px 3px 10px; background: #fff8ec; border: 1px solid #f5d89a; border-radius: 20px; font-size: 12px; font-weight: 600; color: #c8960a; }
  .we-tag__remove { background: none; border: none; cursor: pointer; font-size: 14px; color: #c8960a; opacity: 0.6; padding: 0; line-height: 1; display: flex; align-items: center; }
  .we-tag__remove:hover { opacity: 1; }
  .we-tags-input__field { border: none; outline: none; font-size: 13px; font-family: inherit; color: #333; background: transparent; min-width: 140px; flex: 1; padding: 2px 0; }
  .we-tags-input__field::placeholder { color: #ccc; }
  .we-body { padding: 28px 52px 72px; outline: none; font-size: 16.5px; line-height: 1.9; color: #2c2c2c; min-height: 420px; position: relative; }
  .we-body:empty::before { content: attr(data-placeholder); color: #ccc; pointer-events: none; position: absolute; }
  .we-body h1 { font-size: 30px; font-weight: 800; margin: 32px 0 12px; color: #111; letter-spacing: -0.03em; }
  .we-body h2 { font-size: 23px; font-weight: 700; margin: 26px 0 10px; color: #111; letter-spacing: -0.025em; }
  .we-body h3 { font-size: 18px; font-weight: 600; margin: 20px 0 8px; color: #111; }
  .we-body p   { margin: 0 0 16px; }
  .we-body a   { color: #C4801A; text-decoration: underline; }
  .we-body ul, .we-body ol { padding-left: 28px; margin: 8px 0 16px; }
  .we-body li  { margin-bottom: 6px; }
  .we-body blockquote { border-left: 3px solid #F5A623; margin: 20px 0; padding: 4px 0 4px 22px; color: #777; font-style: italic; }
  @media (max-width: 768px) {
    .we-nav__center { display: none; }
    .we-scroll      { padding: 16px 8px 60px; }
    .we-title       { font-size: 26px; padding: 28px 20px 12px; }
    .we-meta        { padding: 0 20px 18px; }
    .we-meta-extra  { padding: 16px 20px 18px; }
    .we-body        { padding: 20px 20px 48px; font-size: 15px; }
    .we-field__select { max-width: 100%; }
  }
`
