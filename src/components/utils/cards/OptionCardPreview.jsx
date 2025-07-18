import * as MdIcons from "react-icons/md";
import { MdHelpOutline } from "react-icons/md"; // fallback si no existe el icono

function OptionCardPreview({
  title,
  subtitle,
  description,
  subDescription,
  iconName, // nombre del icono como string para el subtitle
  ...props
}) {
  // Obtener el ícono dinámicamente desde react-icons/md
  const Icon = iconName && MdIcons[iconName] ? MdIcons[iconName] : null;

  return (
    <div
      className="flex w-full items-start my-2 py-2 px-4 bg-backgroundCard rounded-xl border border-textColorGray dark:border-none cursor-pointer"
      {...props}
    >
      <div className="flex flex-col flex-1">
        <h1 className="text-textColor text-xxs font-medium">{title}</h1>

        {(subtitle || Icon) && (
          <div className="flex items-center gap-2 mt-1">
            {Icon && <Icon className="text-textColor text-xl" />}
            <h2 className="text-textColor text-md font-semibold">{subtitle}</h2>
          </div>
        )}

        {description && (
          <p className="text-textColor mt-1 text-xs font-semibold">
            {description}
          </p>
        )}

        {subDescription && (
          <p className="text-textColor text-sm font-semibold">
            {subDescription}
          </p>
        )}
      </div>
    </div>
  );
}

export default OptionCardPreview;
