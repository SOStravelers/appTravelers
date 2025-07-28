import Select from "react-select";

export default function CustomSelector({
  options = [],
  value,
  onChange,
  className = "",
  isSearchable = false,
  ...rest
}) {
  return (
    <Select
      className={`w-full max-w-md my-1 mb-3 ${className}`}
      options={options}
      value={value}
      onChange={onChange}
      isSearchable={isSearchable}
      menuPortalTarget={document.body} // Renderiza el menú fuera del flujo normal
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "var(--color-input)",
          color: "var(--color-text-color)",
          borderRadius: "6px",
          borderColor: state.isFocused ? "#00A0D5" : "#ccc",
          boxShadow: "none",
          "&:hover": {
            borderColor: "#00A0D5",
          },
          zIndex: "auto", // Evita z-index elevado en el control
        }),
        singleValue: (base) => ({
          ...base,
          color: "var(--color-text-color)",
        }),
        input: (base) => ({
          ...base,
          color: "var(--color-text-color)",
        }),
        placeholder: (base) => ({
          ...base,
          color: "var(--color-text-color-gray)",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "var(--color-input)",
          borderRadius: "10px",
          marginTop: 4,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "#00A0D5"
            : state.isFocused
            ? "rgba(0, 119, 182, 0.2)"
            : "transparent",
          color: state.isSelected ? "#fff" : "var(--color-text-color)",
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 30, // Solo el menú tiene z-index alto
        }),
      }}
      {...rest}
    />
  );
}
