import clsx from "clsx";

export default function SwitchTabs({
  options = [],
  actualView,
  setActualView,
  className = "",
  activeClass = "bg-blueBorder text-white",
  inactiveClass = "text-blueBorder",
}) {
  return (
    <div className="w-full flex justify-center">
      <div
        className={clsx(
          "bg-transparentBlue h-10 flex rounded-xl overflow-hidden",
          "w-72 sm:w-full sm:max-w-lg",
          className
        )}
      >
        {options.map((option, index) => (
          <button
            key={option.value || index}
            className={clsx(
              "flex-1 h-full font-semibold transition-colors",
              actualView === option.value ? activeClass : inactiveClass
            )}
            onClick={() => setActualView(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
