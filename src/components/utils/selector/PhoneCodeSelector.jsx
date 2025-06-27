// components/PhoneCodeSelector.jsx
import { useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import countries from "@/utils/countries.json";

export default function PhoneCodeSelector({
  phoneCode,
  setPhoneCode,
  dropdownOpen,
  setDropdownOpen,
  inputClass,
}) {
  const codeRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (codeRef.current && !codeRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={codeRef} className="relative w-28">
      <div
        onClick={() => setDropdownOpen((prev) => !prev)}
        className={`relative ${inputClass} cursor-pointer flex items-center justify-between`}
      >
        <span>{phoneCode}</span>
        <FaChevronDown className="text-xs" />
      </div>
      {dropdownOpen && (
        <div className="absolute z-20 w-full max-h-60 overflow-auto mt-1 bg-white border border-gray-300 rounded-md shadow">
          {countries.map((c) => (
            <div
              key={c.code}
              onClick={() => {
                setPhoneCode(c.dial_code);
                setDropdownOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              <span>{c.emoji}</span>
              <span>{c.dial_code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
