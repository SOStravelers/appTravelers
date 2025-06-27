export default function PhoneCodeSelector({ phoneCode, inputClass }) {
  return (
    <div className="relative w-28">
      <div
        className={`relative ${inputClass} flex items-center justify-center`}
      >
        <span>{phoneCode}</span>
      </div>
    </div>
  );
}
