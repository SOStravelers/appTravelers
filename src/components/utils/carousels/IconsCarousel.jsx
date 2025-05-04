// Importa los íconos que necesites de react-icons
// Ejemplo: importando íconos de Font Awesome y Material Design
import { FaReact, FaVuejs, FaAngular, FaNodeJs, FaPython } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { SiJavascript, SiTypescript, SiTailwindcss } from 'react-icons/si';
import { MdArrowForward } from "react-icons/md"; // Ícono para el botón

// Datos de ejemplo para los íconos
// En una aplicación real, esto podría venir de props o una API
const defaultIcons = [
  { id: 1, icon: <FaReact size={32} />, label: 'React' },
  { id: 2, icon: <FaVuejs size={32} />, label: 'Vue.js' },
  { id: 3, icon: <FaAngular size={32} />, label: 'Angular' },
  { id: 4, icon: <SiJavascript size={32} />, label: 'JavaScript' },
  { id: 5, icon: <SiTypescript size={32} />, label: 'TypeScript' },
  { id: 6, icon: <FaNodeJs size={32} />, label: 'Node.js' },
  { id: 7, icon: <FaPython size={32} />, label: 'Python' },
  { id: 8, icon: <SiTailwindcss size={32} />, label: 'Tailwind' },
  // Agrega más íconos si lo deseas
];

/**
 * Componente de Carrusel de Íconos con Tailwind CSS.
 *
 * @param {object[]} [icons=defaultIcons] - Array de objetos de íconos. Cada objeto debe tener 'id', 'icon' (componente React del ícono), y 'label' (string).
 * @param {string} [viewMoreLink='#'] - URL a la que dirigirá el botón "Ver más".
 * @param {function} [onIconClick] - Función opcional a ejecutar cuando se hace clic en un ícono. Recibe el objeto del ícono como argumento.
 * @param {function} [onViewMoreClick] - Función opcional a ejecutar cuando se hace clic en "Ver más". Prevalece sobre viewMoreLink si se proporciona.
 */
function IconCarousel({
  icons = defaultIcons,
  viewMoreLink = '#',
  onIconClick,
  onViewMoreClick
}) {
  const router = useRouter();

  const handleIconClick = (iconData) => {
    if (onIconClick) {
      onIconClick(iconData);
    } else {
      console.log('Icon clicked:', iconData.label);
    }
  };

  const handleViewMore = (e) => {
    if (!onViewMoreClick) {
      e.preventDefault();
       // Navega a la página de colecciones
       router.push('/collections');
    }

    if (onViewMoreClick) {
      e.preventDefault(); // Prevenir navegación si hay una función onClick personalizada
      onViewMoreClick();
    }
    // Si no hay onViewMoreClick, el enlace <a> funcionará normalmente con viewMoreLink
  };

  return (
    <div className="w-full max-w-lg py-6">
      {/* Contenedor principal del carrusel con scroll horizontal */}
      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto no-scrollbar py-4 px-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {/* --- Mapeo de los íconos --- */}
          {icons.map((iconData) => (
            <div
              key={iconData.id}
              onClick={() => handleIconClick(iconData)}
              className={`flex flex-col items-center justify-center flex-shrink-0 w-24 h-24 p-3 rounded-lg transition-colors duration-200 ease-in-out ${
                onIconClick
                  ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                  : ''
              } `}
              role={onIconClick ? 'button' : undefined}
              tabIndex={onIconClick ? 0 : undefined}
              aria-label={iconData.label}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleIconClick(iconData); }}
            >
              <div className="text-gray-700 dark:text-gray-300 mb-2">
                {iconData.icon}
              </div>
              <span className="text-xs text-center text-gray-600 dark:text-gray-400">
                {iconData.label}
              </span>
            </div>
          ))}
          {/* --- Fin Mapeo de íconos --- */}

          {/* --- Elemento "Ver más" (como último item del scroll) --- */}
          <a
            href={viewMoreLink}
            onClick={handleViewMore}
            className="flex flex-col items-center justify-center flex-shrink-0 w-24 h-24 p-3 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
            aria-label="Ver más categorías"          
          >
            <MdArrowForward size={32} />
            <span className="text-xs text-center mt-2">Ver más</span>
          </a>
         
         
        </div>
         {/* Indicador visual opcional de que hay más contenido (si se desea) */}
         {/* <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white dark:from-gray-800 pointer-events-none"></div> */}
      </div>

      {/* --- Botón "Ver más" (debajo del carrusel) --- */}
      <div className="flex justify-center mt-6">
      </div> 
    </div>
  );
}

export default IconCarousel;