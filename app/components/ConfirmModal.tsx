
type ConfirmModalProps = {
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "danger" | "warning" | "success"
    iconType?: "alert" | "edit" | "trash" | "logout"
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({
    isOpen, title, message,
    confirmLabel = "Ya, Lanjutkan",
    cancelLabel = "Batal",
    variant = "danger",
    iconType = "alert",
    onConfirm, onCancel,
}: ConfirmModalProps) {
    if (!isOpen) return null

    const confirmColor = variant === "danger" ? "#e24b4a"
        : variant === "success" ? "#16a34a"
            : "#f59e0b"

    const iconColor = variant === "danger" ? "#e24b4a"
        : variant === "success" ? "#16a34a"
            : "#f59e0b"

    const iconBg = variant === "danger" ? "#fff0f0"
        : variant === "success" ? "#f0fdf4"
            : "#fffbeb"

    const icons: Record<"alert" | "edit" | "trash" | "logout", React.ReactElement> = {
        trash: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ width: 20, height: 20, stroke: iconColor }}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
        ),
        edit: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ width: 20, height: 20, stroke: iconColor }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        ),
        logout: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ width: 20, height: 20, stroke: iconColor }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
        ),
        alert: (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ width: 20, height: 20, stroke: iconColor }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    }

    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 200, padding: 20,
        }}>
            <div style={{
                background: "#fff", borderRadius: 16,
                padding: "20px", maxWidth: 280, width: "100%",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 8, border: "1px solid #e5e7eb",
            }}>
                <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {icons[iconType]}
                </div>

                <p style={{ fontWeight: 600, fontSize: 14, color: "#1C1C1E", textAlign: "center", margin: 0 }}>
                    {title}
                </p>
                <p style={{ fontSize: 12, color: "#6B6B72", textAlign: "center", lineHeight: 1.5, margin: 0 }}>
                    {message}
                </p>

                <div style={{ display: "flex", gap: 8, marginTop: 4, width: "100%" }}>
                    {cancelLabel && (
                        <button onClick={onCancel} style={{
                            flex: 1, padding: "8px", borderRadius: 10,
                            background: "#F5F0E8", color: "#1C1C1E",
                            border: "none", fontWeight: 500, fontSize: 13,
                            cursor: "pointer", fontFamily: "Poppins, sans-serif",
                        }}>
                            {cancelLabel}
                        </button>
                    )}
                    <button onClick={onConfirm} style={{
                        flex: 1, padding: "8px", borderRadius: 10,
                        background: confirmColor, color: "#fff",
                        border: "none", fontWeight: 500, fontSize: 13,
                        cursor: "pointer", fontFamily: "Poppins, sans-serif",
                    }}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}