const PASSWORD_FIELDS = [
  "Current Password",
  "New Password",
  "Confirm New Password",
];

function ChangePassword() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h1>
      <p className="text-sm text-gray-400 mb-6">Keep your account secure</p>
      <div className="flex flex-col gap-4 max-w-md">
        {PASSWORD_FIELDS.map((label) => (
          <div key={label}>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {label}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        ))}
        <button className="mt-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors w-fit">
          Update Password
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
