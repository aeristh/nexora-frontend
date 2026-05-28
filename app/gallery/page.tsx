"use client"

import { useEffect, useState, useRef } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import Link from "next/link"
import ConfirmModal from "../components/ConfirmModal"

const PencilIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <path stroke="currentColor" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path stroke="currentColor" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 16, height: 16, stroke: "currentColor" }}>
        <polyline stroke="currentColor" points="3 6 5 6 21 6" />
        <path stroke="currentColor" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path stroke="currentColor" d="M10 11v6" /><path stroke="currentColor" d="M14 11v6" />
        <path stroke="currentColor" d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
)

type GalleryItem = {
    id: number
    title: string
    description: string | null
    imagePath: string
    imageName: string
    width: number | null
    height: number | null
    uploadedBy: number
}

const RATIOS = [
    { label: "Bebas", value: null },
    { label: "1:1 (Square)", value: 1 },
    { label: "4:3 (Landscape)", value: 4 / 3 },
    { label: "16:9 (Widescreen)", value: 16 / 9 },
    { label: "3:4 (Portrait)", value: 3 / 4 },
    { label: "9:16 (Story)", value: 9 / 16 },
]

function getRatioLabel(width: number | null, height: number | null): string {
    if (!width || !height) return ""
    const r = width / height
    if (Math.abs(r - 16 / 9) < 0.05) return "16:9"
    if (Math.abs(r - 4 / 3) < 0.05) return "4:3"
    if (Math.abs(r - 1) < 0.05) return "1:1"
    if (Math.abs(r - 3 / 4) < 0.05) return "3:4"
    if (Math.abs(r - 9 / 16) < 0.05) return "9:16"
    return `${width}×${height}`
}

const PER_PAGE = 4

export default function GalleryPage() {
    const [galleries, setGalleries] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
    const [editId, setEditId] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedRatio, setSelectedRatio] = useState<number | null>(null)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<Crop>()
    const [isCropping, setIsCropping] = useState(false)
    const [croppedFile, setCroppedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [originalFileName, setOriginalFileName] = useState("")
    const [croppedWidth, setCroppedWidth] = useState<number | null>(null)
    const [croppedHeight, setCroppedHeight] = useState<number | null>(null)

    const [errors, setErrors] = useState<{ title?: string; image?: string }>({})


    const [confirm, setConfirm] = useState<{
        open: boolean; title: string; message: string
        confirmLabel: string; cancelLabel: string
        variant: "danger" | "warning" | "success"
        iconType: "alert" | "edit" | "trash" | "logout"
        onConfirm: () => void
    }>({ open: false, title: "", message: "", confirmLabel: "OK", cancelLabel: "", variant: "danger", iconType: "alert", onConfirm: () => { } })

    const closeConfirm = () => setConfirm((c) => ({ ...c, open: false }))
    const showAlert = (title: string, message: string, variant: "danger" | "warning" | "success" = "danger") =>
        setConfirm({ open: true, title, message, confirmLabel: "OK", cancelLabel: "", variant, iconType: "alert", onConfirm: closeConfirm })

    const imgRef = useRef<HTMLImageElement>(null)
    const API = "${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

}/gallery"
const BASE = "${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

}"

const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500) }

const fetchGalleries = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    try {
        const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        setGalleries(Array.isArray(data.data) ? data.data : [])
        setCurrentPage(1)
    } catch { setGalleries([]) }
    setLoading(false)
}

useEffect(() => {
    fetchGalleries()
    const userData = localStorage.getItem("user")
    if (userData) {
        const parsed = JSON.parse(userData)
        setIsAdmin(parsed.role === "admin")
    }
}, [])

const resetForm = () => {
    setTitle(""); setDescription(""); setSelectedRatio(null)
    setImageSrc(null); setCrop(undefined); setCompletedCrop(undefined)
    setIsCropping(false); setCroppedFile(null); setPreviewUrl(null)
    setOriginalFileName(""); setEditId(null)
    setCroppedWidth(null); setCroppedHeight(null)
    setErrors({})
}

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOriginalFileName(file.name)
    setCroppedFile(null); setPreviewUrl(null)
    const reader = new FileReader()
    reader.onload = () => { setImageSrc(reader.result as string); setIsCropping(true) }
    reader.readAsDataURL(file)
}

const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    if (selectedRatio) {
        setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 90 }, selectedRatio, width, height), width, height))
    } else {
        setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 })
    }
}

const handleCropDone = () => {
    if (!completedCrop || !imgRef.current) return
    const image = imgRef.current
    const canvas = document.createElement("canvas")
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const finalWidth = Math.round(completedCrop.width * scaleX)
    const finalHeight = Math.round(completedCrop.height * scaleY)
    canvas.width = finalWidth; canvas.height = finalHeight
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(image,
        completedCrop.x * scaleX, completedCrop.y * scaleY,
        completedCrop.width * scaleX, completedCrop.height * scaleY,
        0, 0, finalWidth, finalHeight
    )
    canvas.toBlob((blob) => {
        if (!blob) return
        const ext = originalFileName.split(".").pop() || "jpg"
        const file = new File([blob], `cropped.${ext}`, { type: blob.type })
        setCroppedFile(file); setPreviewUrl(URL.createObjectURL(blob))
        setCroppedWidth(finalWidth); setCroppedHeight(finalHeight)
        setIsCropping(false); setImageSrc(null)
    }, "image/jpeg", 0.95)
}

const handleSave = async () => {
    const newErrors: { title?: string; image?: string } = {}
    if (!title) newErrors.title = "Judul wajib diisi"
    if (!editId && !croppedFile) newErrors.image = "Gambar wajib dipilih dan di-crop"
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})

    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    if (croppedWidth) formData.append("width", String(croppedWidth))
    if (croppedHeight) formData.append("height", String(croppedHeight))
    if (croppedFile) formData.append("image", croppedFile)
    const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    })
    if (!res.ok) {
        const err = await res.json()
        showToast(err.message || "Terjadi kesalahan.")
        return
    }
    showToast(editId ? "Gambar berhasil diupdate" : "Gambar berhasil diupload")
    resetForm(); setIsModalOpen(false); fetchGalleries()
}

const handleDelete = (item: GalleryItem) => {
    setConfirm({
        open: true, title: "Hapus Gambar",
        message: `Anda akan menghapus "${item.title}". Gambar akan dipindahkan ke tong sampah.`,
        confirmLabel: "Ya, Hapus", cancelLabel: "Tidak, Batal", variant: "danger", iconType: "trash",
        onConfirm: async () => {
            closeConfirm()
            const token = localStorage.getItem("token")
            const res = await fetch(`${API}/${item.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
            if (!res.ok) { showAlert("Gagal", "Gagal menghapus gambar."); return }
            showToast("Gambar berhasil dihapus"); fetchGalleries()
        },
    })
}

const openEditModal = (item: GalleryItem) => {
    setEditId(item.id); setTitle(item.title)
    setDescription(item.description ?? "")
    setPreviewUrl(`${BASE}${item.imagePath}`)
    setIsCropping(false); setIsModalOpen(true)
}

const totalPages = Math.ceil(galleries.length / PER_PAGE)
const paginated = galleries.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
}

return (
    <div className="container">
        {toast && <div className="toast">{toast}</div>}

        <ConfirmModal
            isOpen={confirm.open} title={confirm.title} message={confirm.message}
            confirmLabel={confirm.confirmLabel} cancelLabel={confirm.cancelLabel}
            variant={confirm.variant}
            iconType={confirm.iconType}
            onConfirm={confirm.onConfirm} onCancel={closeConfirm}
        />
        <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 28,
            paddingBottom: 20,
            borderBottom: "1px solid #f0ece6",
        }}>
            <div>
                <h1 style={{
                    fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em",
                    color: "#1c1917", margin: "0 0 6px", lineHeight: 1,
                }}>
                    Gallery
                </h1>
                <p style={{ fontSize: 13, color: "#a8a29e", margin: 0, fontWeight: 400 }}>
                    {galleries.length} foto · halaman {currentPage} dari {totalPages || 1}
                </p>
            </div>

            <button
                onClick={() => { resetForm(); setIsModalOpen(true) }}
                style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 18px", borderRadius: 12,
                    background: "#f59e0b", color: "#1a1a1a",
                    border: "none", fontWeight: 700, fontSize: 13,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 4px 14px rgba(245,158,11,0.25)",
                    transition: "all 0.2s", flexShrink: 0,
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#d97706"
                        ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#f59e0b"
                        ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ width: 14, height: 14, stroke: "currentColor" }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Gambar
            </button>
        </div>

        {loading ? (
            <p>Loading...</p>
        ) : galleries.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>Belum ada gambar.</p>
        ) : (
            <>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16,
                }}>
                    {paginated.map((item) => {
                        const ratioLabel = getRatioLabel(item.width, item.height)
                        return (
                            <div key={item.id} style={{
                                borderRadius: 12,
                                overflow: "hidden",
                                background: "#fff",
                                border: "1px solid #f0ece6",
                                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"
                                        ; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
                                        ; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)"
                                }}
                            >
                                {/* Image */}
                                <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setLightbox(item)}>
                                    <img
                                        src={`${BASE}${item.imagePath}`}
                                        alt={item.title}
                                        style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                                    />
                                    {ratioLabel && (
                                        <span style={{
                                            position: "absolute", top: 7, left: 7,
                                            background: "rgba(0,0,0,0.45)", color: "#fff",
                                            fontSize: 9, fontWeight: 700,
                                            padding: "2px 7px", borderRadius: 999,
                                            letterSpacing: "0.05em",
                                        }}>
                                            {ratioLabel}
                                        </span>
                                    )}
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: "rgba(0,0,0,0)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "background 0.2s",
                                        fontSize: 12, color: "#fff", fontWeight: 600, opacity: 0,
                                    }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.28)"
                                                ; (e.currentTarget as HTMLDivElement).style.opacity = "1"
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0)"
                                                ; (e.currentTarget as HTMLDivElement).style.opacity = "0"
                                        }}
                                    >
                                        Lihat
                                    </div>
                                </div>

                                {/* Info */}
                                <div style={{ padding: "10px 12px 12px" }}>
                                    <p style={{
                                        fontWeight: 700, fontSize: 12,
                                        margin: "0 0 2px", letterSpacing: "-0.01em",
                                        color: "#1c1917",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                    }}>
                                        {item.title}
                                    </p>
                                    <p style={{
                                        fontSize: 11, color: "#a8a29e",
                                        margin: "0 0 10px",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                        fontStyle: item.description ? "normal" : "italic",
                                    }}>
                                        {item.description ?? "Tidak ada deskripsi"}
                                    </p>

                                    <div style={{
                                        display: "flex", gap: 6,
                                        borderTop: "1px solid #f0ece6", paddingTop: 8,
                                    }}>
                                        <button
                                            onClick={() => openEditModal(item)}
                                            style={{
                                                flex: 1, display: "flex", alignItems: "center",
                                                justifyContent: "center", gap: 4,
                                                padding: "5px 0", borderRadius: 7,
                                                border: "1px solid #e5e7eb", background: "transparent",
                                                cursor: "pointer", fontSize: 11, fontWeight: 500,
                                                color: "#6b7280", transition: "all 0.15s",
                                            }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"
                                                    ; (e.currentTarget as HTMLButtonElement).style.color = "#111"
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                                                    ; (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"
                                            }}
                                        >
                                            <PencilIcon /> Edit
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(item)}
                                                style={{
                                                    flex: 1, display: "flex", alignItems: "center",
                                                    justifyContent: "center", gap: 4,
                                                    padding: "5px 0", borderRadius: 7,
                                                    border: "1px solid #fecaca", background: "transparent",
                                                    cursor: "pointer", fontSize: 11, fontWeight: 500,
                                                    color: "#ef4444", transition: "all 0.15s",
                                                }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff5f5"
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                                                }}
                                            >
                                                <TrashIcon /> Hapus
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {totalPages > 1 && (
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 8, marginTop: 36,
                    }}>
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                border: "1.5px solid #e5e7eb",
                                background: currentPage === 1 ? "#f9fafb" : "#fff",
                                color: currentPage === 1 ? "#d1d5db" : "#374151",
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                transition: "all 0.15s", fontFamily: "inherit",
                            }}
                            onMouseEnter={e => {
                                if (currentPage !== 1) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "#f59e0b"
                                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#f59e0b"
                                        ; (e.currentTarget as HTMLButtonElement).style.color = "#fff"
                                }
                            }}
                            onMouseLeave={e => {
                                if (currentPage !== 1) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff"
                                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"
                                        ; (e.currentTarget as HTMLButtonElement).style.color = "#374151"
                                }
                            }}
                        >
                            Prev
                        </button>

                        <span style={{
                            fontSize: 12, fontWeight: 600, color: "#9ca3af",
                            padding: "0 4px", minWidth: 48, textAlign: "center",
                        }}>
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                border: "1.5px solid #e5e7eb",
                                background: currentPage === totalPages ? "#f9fafb" : "#fff",
                                color: currentPage === totalPages ? "#d1d5db" : "#374151",
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                transition: "all 0.15s", fontFamily: "inherit",
                            }}
                            onMouseEnter={e => {
                                if (currentPage !== totalPages) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "#f59e0b"
                                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#f59e0b"
                                        ; (e.currentTarget as HTMLButtonElement).style.color = "#fff"
                                }
                            }}
                            onMouseLeave={e => {
                                if (currentPage !== totalPages) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "#fff"
                                        ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"
                                        ; (e.currentTarget as HTMLButtonElement).style.color = "#374151"
                                }
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}

                <p style={{
                    textAlign: "center", fontSize: 12,
                    color: "var(--text-secondary)", marginTop: 10,
                }}>
                    Menampilkan {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, galleries.length)} dari {galleries.length} foto
                </p>
            </>
        )}

        {lightbox && (
            <div onClick={() => setLightbox(null)} style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(0,0,0,0.88)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: "zoom-out", padding: 24,
            }}>
                <img
                    src={`${BASE}${lightbox.imagePath}`}
                    alt={lightbox.title}
                    style={{
                        maxWidth: "90vw", maxHeight: "80vh",
                        objectFit: "contain", borderRadius: 12,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
                <p style={{ color: "#fff", fontWeight: 600, fontSize: 16, marginTop: 14 }}>
                    {lightbox.title}
                </p>
                {lightbox.description && (
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}>
                        {lightbox.description}
                    </p>
                )}
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 14 }}>
                    Klik di luar gambar untuk tutup
                </p>
            </div>
        )}

        {isModalOpen && (
            <div className="modal">
                <div className="modal-content" style={{
                    maxWidth: 440, width: "90%",
                    borderRadius: 24, padding: "24px 28px 20px",
                    background: "rgba(255,255,255,0.97)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                    maxHeight: "90vh", overflowY: "auto",
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 14 }}>
                        <h2 style={{
                            fontSize: 20, fontWeight: 800, color: "#1c1917",
                            letterSpacing: "-0.4px", margin: "0 0 3px",
                        }}>
                            {editId ? "Edit Gambar" : "Upload Gambar"}
                        </h2>
                        <p style={{ fontSize: 13, color: "#78716c", margin: 0 }}>
                            {editId ? "Perbarui data gambar di bawah ini" : "Isi detail gambar yang akan diupload"}
                        </p>
                    </div>

                    <div style={{ position: "relative", marginBottom: errors.title ? 2 : 6 }}>
                        <svg style={{
                            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                            width: 15, height: 15, stroke: errors.title ? "#ef4444" : "#a8a29e",
                            fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
                            pointerEvents: "none",
                        }} viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <input
                            placeholder="Judul"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setErrors(p => ({ ...p, title: undefined })) }}
                            style={{
                                width: "100%", padding: "10px 14px 10px 40px",
                                border: `1.5px solid ${errors.title ? "#ef4444" : "#e7e5e4"}`,
                                borderRadius: 10, fontSize: 13.5, color: "#1c1917",
                                background: errors.title ? "#fff5f5" : "rgba(255,255,255,0.8)",
                                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = errors.title ? "#ef4444" : "#f59e0b"
                                e.currentTarget.style.boxShadow = errors.title
                                    ? "0 0 0 3px rgba(239,68,68,0.12)"
                                    : "0 0 0 3px rgba(245,158,11,0.12)"
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = errors.title ? "#ef4444" : "#e7e5e4"
                                e.currentTarget.style.boxShadow = "none"
                            }}
                        />
                    </div>
                    {errors.title && (
                        <p style={{ color: "#ef4444", fontSize: 11.5, margin: "0 0 6px 4px" }}>{errors.title}</p>
                    )}

                    <div style={{ position: "relative", marginBottom: 6 }}>
                        <svg style={{
                            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                            width: 15, height: 15, stroke: "#a8a29e",
                            fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
                            pointerEvents: "none",
                        }} viewBox="0 0 24 24">
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                        <input
                            placeholder="Deskripsi (opsional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 14px 10px 40px",
                                border: "1.5px solid #e7e5e4", borderRadius: 10,
                                fontSize: 13.5, color: "#1c1917",
                                background: "rgba(255,255,255,0.8)",
                                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = "#f59e0b"
                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)"
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = "#e7e5e4"
                                e.currentTarget.style.boxShadow = "none"
                            }}
                        />
                    </div>

                    {/* Select Ratio */}
                    <div style={{ position: "relative", marginBottom: 6 }}>
                        <svg style={{
                            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                            width: 15, height: 15, stroke: "#a8a29e",
                            fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
                            pointerEvents: "none",
                        }} viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 21V9" />
                        </svg>
                        <select
                            value={selectedRatio ?? ""}
                            onChange={(e) => {
                                const val = e.target.value === "" ? null : parseFloat(e.target.value)
                                setSelectedRatio(val)
                                if (imageSrc) setCrop(undefined)
                            }}
                            style={{
                                width: "100%", padding: "10px 14px 10px 40px",
                                border: "1.5px solid #e7e5e4", borderRadius: 10,
                                fontSize: 13.5, color: "#1c1917",
                                background: "rgba(255,255,255,0.8)",
                                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                                appearance: "none", transition: "border-color 0.2s, box-shadow 0.2s",
                                cursor: "pointer",
                            }}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = "#f59e0b"
                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)"
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = "#e7e5e4"
                                e.currentTarget.style.boxShadow = "none"
                            }}
                        >
                            {RATIOS.map((r) => (
                                <option key={r.label} value={r.value ?? ""}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: errors.image ? 2 : 6 }}>
                        <label style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 14px",
                            border: `1.5px dashed ${errors.image ? "#ef4444" : "#e7e5e4"}`,
                            borderRadius: 10, cursor: "pointer",
                            background: errors.image ? "#fff5f5" : "#fafaf9",
                            transition: "border-color 0.2s",
                        }}>
                            <svg style={{
                                width: 15, height: 15, stroke: errors.image ? "#ef4444" : "#a8a29e",
                                fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", flexShrink: 0,
                            }} viewBox="0 0 24 24">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span style={{ fontSize: 13.5, color: errors.image ? "#ef4444" : "#78716c" }}>
                                {croppedFile ? croppedFile.name : "Pilih gambar (jpg, png, webp)"}
                            </span>
                            <input
                                type="file"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                onChange={(e) => { handleImageChange(e); setErrors(p => ({ ...p, image: undefined })) }}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>
                    {errors.image && (
                        <p style={{ color: "#ef4444", fontSize: 11.5, margin: "0 0 6px 4px" }}>{errors.image}</p>
                    )}

                    {/* Crop Area */}
                    {isCropping && imageSrc && (
                        <div style={{ marginBottom: 10 }}>
                            <p style={{ fontSize: 12, color: "#78716c", marginBottom: 6 }}>
                                Sesuaikan area crop → klik "Selesai Crop"
                            </p>
                            <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)} aspect={selectedRatio ?? undefined}>
                                    <img ref={imgRef} src={imageSrc} onLoad={onImageLoad}
                                        style={{ maxWidth: "100%", maxHeight: 220, display: "block" }} alt="crop" />
                                </ReactCrop>
                                <button onClick={handleCropDone} style={{
                                    position: "absolute", bottom: 10, right: 10,
                                    padding: "6px 14px", borderRadius: 8,
                                    background: "#f59e0b", color: "#fff",
                                    border: "none", cursor: "pointer", fontSize: 12,
                                    fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                }}>
                                    Selesai Crop
                                </button>
                            </div>
                        </div>
                    )}

                    {previewUrl && !isCropping && (
                        <img src={previewUrl} alt="Preview" style={{
                            width: "100%", maxHeight: 160, objectFit: "contain",
                            borderRadius: 8, marginBottom: 10, background: "#f3f4f6",
                        }} />
                    )}
                    {editId && !isCropping && (
                        <p style={{ fontSize: 12, color: "#78716c", marginBottom: 10 }}>
                            Pilih file baru di atas untuk ganti gambar (opsional)
                        </p>
                    )}

                    <button
                        onClick={handleSave}
                        style={{
                            width: "100%", padding: "10px 0",
                            background: "#f59e0b", color: "#fff",
                            border: "none", borderRadius: 10,
                            fontSize: 14, fontWeight: 700,
                            cursor: "pointer", marginBottom: 6,
                            boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
                            fontFamily: "inherit", transition: "background 0.2s, transform 0.1s",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#d97706"
                                ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#f59e0b"
                                ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                        }}
                    >
                        {editId ? "Update Gambar" : "Upload Gambar"}
                    </button>

                    <button
                        onClick={() => { resetForm(); setIsModalOpen(false) }}
                        style={{
                            width: "100%", padding: "10px 0",
                            background: "transparent", color: "#78716c",
                            border: "1.5px solid #e7e5e4", borderRadius: 10,
                            fontSize: 13.5, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f4"
                                ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#d6d3d1"
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                                ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e7e5e4"
                        }}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        )}
    </div>
)
}