import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { adminUploadImage } from "@/lib/api";

const ACCEPTED = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";

export function ImageUpload({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [previewErr, setPreviewErr] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setErr("Please choose an image file");
      return;
    }
    setBusy(true);
    setErr(null);
    const res = await adminUploadImage(file);
    setBusy(false);
    if (res.error || !res.url) {
      setErr(res.error || "Upload failed");
      return;
    }
    setPreviewErr(false);
    onChange(res.url);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDrag(false);
    void handleFiles(e.dataTransfer.files);
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    void handleFiles(e.target.files);
    e.target.value = "";
  }

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      <div
        className={
          "admin-image-upload" +
          (drag ? " is-drag" : "") +
          (value ? " has-image" : "")
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {value && !previewErr ? (
          <>
            <img
              src={value}
              alt=""
              className="admin-image-preview"
              onError={() => setPreviewErr(true)}
            />
            <div className="admin-image-overlay">
              <span>
                <i className="fa-solid fa-arrows-rotate" /> Replace image
              </span>
            </div>
          </>
        ) : value && previewErr ? (
          <div className="admin-image-empty">
            <i className="fa-solid fa-circle-exclamation" style={{ color: "#f97316" }} />
            <p>Image saved but can't preview URL</p>
            <p className="muted" style={{ fontSize: "0.72rem", wordBreak: "break-all" }}>{value}</p>
          </div>
        ) : (
          <div className="admin-image-empty">
            <i className="fa-solid fa-cloud-arrow-up" />
            <p>
              <strong>Click to upload</strong> or drag &amp; drop
            </p>
            <p className="muted">PNG, JPG, WEBP, GIF or SVG · up to 10 MB</p>
          </div>
        )}
        {busy && (
          <div className="admin-image-busy">
            <div className="admin-spinner" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        onChange={onPick}
        style={{ display: "none" }}
      />
      <div className="admin-image-actions">
        {value && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onChange("")}
          >
            <i className="fa-solid fa-trash" /> Remove
          </button>
        )}
        {hint && <span className="admin-image-hint">{hint}</span>}
        {err && <span className="admin-image-error">{err}</span>}
      </div>
    </div>
  );
}
