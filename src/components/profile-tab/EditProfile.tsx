interface FieldConfig {
  label: string;
  defaultValue: string;
  textarea?: boolean;
}

const PROFILE_FIELDS: FieldConfig[] = [
  { label: "Full Name", defaultValue: "Zayniddin" },
  { label: "Email", defaultValue: "zayniddin@example.com" },
  { label: "Bio", defaultValue: "Avid reader since 2024", textarea: true },
];

function EditProfile() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Profile</h1>
      <p className="text-sm text-gray-400 mb-6">
        Update your personal information
      </p>
      <div className="flex flex-col gap-4 max-w-md">
        {PROFILE_FIELDS.map(({ label, defaultValue, textarea }) => (
          <div key={label}>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {label}
            </label>
            {textarea ? (
              <textarea
                defaultValue={defaultValue}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
              />
            ) : (
              <input
                defaultValue={defaultValue}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            )}
          </div>
        ))}
        <button className="mt-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors w-fit">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
