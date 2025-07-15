export default function PhoneCodeSelector({ phoneCode, error = false }) {
  return (
    <div className="relative w-28 my-1">
      <div
        className={`w-full px-3 py-2 rounded-md text-sm transition duration-200
          ${
            error
              ? "bg-red-100 text-red-800 border border-red-500"
              : "bg-[var(--color-input)] text-[var(--color-text-color)] border border-gray-300"
          }
        `}
      >
        <span>{phoneCode || "--"}</span>
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
