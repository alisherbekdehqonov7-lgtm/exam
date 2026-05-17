import { useState, useRef, ChangeEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileForm {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  country: string;
}

interface UpdateProfilePayload {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  country: string;
}

interface UpdateProfileResponse {
  message?: string;
}

type ToastStatus = "success" | "error" | null;

interface ToastState {
  status: ToastStatus;
  message: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function updateProfile(payload: UpdateProfilePayload): Promise<void> {
  const response = await fetch("/api/users/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`, // token kerak bo'lsa qo'shing
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data: UpdateProfileResponse = await response.json().catch(() => ({}));
    throw new Error(data.message ?? `Error: ${response.status}`);
  }
}

// ─── Initial Values ───────────────────────────────────────────────────────────

const INITIAL_FORM: ProfileForm = {
  fullName: "Zayniddin",
  username: "zayniddin_dev",
  email: "zayniddin@example.com",
  phone: "+998 90 123 4567",
  bio: "JavaScript instructor passionate about teaching and building web applications.",
  country: "Uzbekistan",
};

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastProps {
  status: ToastStatus;
  message: string;
  onClose: () => void;
}

function Toast({ status, message, onClose }: ToastProps) {
  if (!status) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium bg-gray-900 min-w-[240px]">
      <span className="text-base">{status === "success" ? "✅" : "❌"}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white ml-1 text-base leading-none"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Photo Upload ─────────────────────────────────────────────────────────────

interface PhotoUploadProps {
  preview: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function PhotoUpload({ preview, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <span className="text-2xl">📷</span>
            <span className="text-xs text-gray-400 mt-1">Upload photo</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  name: keyof ProfileForm;
  value: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  rows?: number;
}

function FormField({
  label,
  name,
  value,
  type = "text",
  onChange,
  textarea = false,
  rows = 4,
}: FormFieldProps) {
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-300 transition";

  return (
    <div>
      <label htmlFor={name} className="block text-sm text-gray-600 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={inputClass}
        />
      )}
    </div>
  );
}

// ─── EditProfile Component ────────────────────────────────────────────────────

export default function EditProfile() {
  const [form, setForm] = useState<ProfileForm>(INITIAL_FORM);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ status: null, message: "" });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const showToast = (status: ToastStatus, message: string) => {
    setToast({ status, message });
    setTimeout(() => setToast({ status: null, message: "" }), 4000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ ...form });
      showToast("success", "Profile updated successfully!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setPhotoPreview(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
      <p className="text-sm text-gray-400 mt-1 mb-6">
        Update your personal information
      </p>

      {/* Photo */}
      <PhotoUpload preview={photoPreview} onChange={handlePhotoChange} />

      {/* Form */}
      <div className="flex flex-col gap-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Full name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
          <FormField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <FormField
            label="Phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* Bio */}
        <FormField
          label="Bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          textarea
          rows={4}
        />

        {/* Country */}
        <div className="max-w-xs">
          <FormField
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        status={toast.status}
        message={toast.message}
        onClose={() => setToast({ status: null, message: "" })}
      />
    </div>
  );
}
