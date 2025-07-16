import React, { useEffect, useState, useRef } from "react";
import { useStore } from "@/store";
import languageData from "@/language/subServices.json";
import ServiceService from "@/services/ServiceService";
import { TbCheese } from "react-icons/tb";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
const Icons = {
  ...FaIcons,
  ...GiIcons,
  ...MdIcons,
  ...AiIcons,
};

export default function IconCarousel({ onOpenFilter, onFilterChange }) {
  const {
    servicesIndexList,
    setServicesIndexList,
    language,
    filters,
    setFilters,
    indexService,
    setIndexService,
    stickypoint,
  } = useStore();

  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const navRef = useRef(null);
  const scrollRef = useRef(null);

  // Fetch services once
  useEffect(() => {
    // ‼️  Si el store ya tiene datos, no hagas nada
    if (servicesIndexList.length > 0) return;

    ServiceService.list({ isActive: true, page: 1 })
      .then((res) => setServicesIndexList(res.data.docs))
      .catch(console.error);

    // 👉  Dependencias:
    //     — `services.length`  para que sólo vuelva a disparar
    //       si se vacía explícitamente desde otro sitio.
  }, [servicesIndexList.length, setServicesIndexList]);

  // Sticky shadow threshold (accounting for parent top-[58px])
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const threshold = stickypoint;
    // -- Si tu top-bar fija mide 58 px y quieres activar justo cuando el nav
    //    se “pegue” debajo de ella, resta sólo esos 58:
    // const threshold = nav.getBoundingClientRect().top + window.scrollY - 58;

    const onScroll = () => {
      setIsSticky(window.scrollY >= threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll(); // calcula una vez al montar con el valor correcto
    return () => window.removeEventListener("scroll", onScroll);
  }, [stickypoint]);

  // Side‐blurs for horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onSideScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const tolerance = 2;

      setShowLeftBlur(scrollLeft > tolerance);
      setShowRightBlur(
        Math.ceil(scrollLeft + clientWidth) < scrollWidth - tolerance
      );
    };

    el.addEventListener("scroll", onSideScroll);
    window.addEventListener("resize", onSideScroll);
    onSideScroll();

    return () => {
      el.removeEventListener("scroll", onSideScroll);
      window.removeEventListener("resize", onSideScroll);
    };
  }, []);

  const handleIconClick = (svc, idx) => {
    setIndexService(idx);
    const updated = { ...filters, service: svc._id };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleViewMore = () => {
    // if (onViewMoreClick) onViewMoreClick();
    // else router.push(viewMoreLink);
    setIndexService(null);
    const updated = { keyword: null, maxPrice: 0, minPrice: 0, service: null };
    setFilters(updated);
    onFilterChange(updated);
  };

  const IconMapper = ({ name, ...props }) => {
    const Component = Icons[name] || TbCheese;
    return <Component {...props} />;
  };

  // Build filter chips and notify parent
  const { keyword, minPrice, maxPrice, service } = filters;
  const chips = [];

  if (minPrice > 0 && maxPrice > 0) {
    const updated = { ...filters, minPrice: 0, maxPrice: 0 };
    chips.push({
      key: "priceRange",
      label: `$${minPrice} - $${maxPrice}`,
      onClear: () => {
        setFilters(updated);
        onFilterChange && onFilterChange(updated);
      },
    });
  } else {
    if (minPrice > 0) {
      const updated = { ...filters, minPrice: 0 };
      chips.push({
        key: "minPrice",
        label: `Above $${minPrice}`,
        onClear: () => {
          setFilters(updated);
          onFilterChange && onFilterChange(updated);
        },
      });
    }
    if (maxPrice > 0) {
      const updated = { ...filters, maxPrice: 0 };
      chips.push({
        key: "maxPrice",
        label: `$${maxPrice} and below`,
        onClear: () => {
          setFilters(updated);
          onFilterChange && onFilterChange(updated);
        },
      });
    }
  }

  if (keyword) {
    const updated = { ...filters, keyword: "" };
    chips.push({
      key: "keyword",
      label: keyword,
      onClear: () => {
        setFilters(updated);
        onFilterChange && onFilterChange(updated);
      },
    });
  }
  //minicambio
  return (
    <nav
      ref={navRef}
      className={`w-full sticky top-0 z-20 bg-backgroundP  transition-shadow duration-200
    ${
      isSticky
        ? "shadow-lg dark:shadow-darkNav border-b border-gray-200 dark:border-gray-800"
        : ""
    }
  `}
    >
      <div className="min-h-[80px] ">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:justify-start  pt-2 pb-3 ">
          <div className="flex items-center md:mt-4">
            <h2 className="text-md font-semibold text-textColor">
              {languageData.index.explore[language]}
            </h2>
            <span className="ml-3 mr-1 text-sm text-textColor">RJ</span>

            <button className="flex items-center  justify-center  ">
              <FiMapPin className="text-textColor" size={14} />
            </button>
          </div>
          <div className="flex items-center space-x-4 md:mt-4 md:ml-6">
            <button
              onClick={handleViewMore}
              className="text-sm font-semibold text-blueBorder hover:underline"
            >
              {languageData.index.seeAllButton[language]}
            </button>
            <button
              onClick={onOpenFilter}
              className="text-textColor hover:text-gray-700 focus:outline-none"
            >
              <IconMapper name="MdTune" size={24} />
            </button>
          </div>
        </div>

        {/* Services carousel */}
        <div className="relative mx-4">
          <div
            ref={scrollRef}
            className="overflow-x-auto whitespace-nowrap pb-1 "
          >
            {Array.isArray(servicesIndexList) &&
              servicesIndexList.map((service, idx) => (
                <button
                  key={service._id}
                  onClick={() => handleIconClick(service, idx)}
                  className="inline-flex flex-col items-center mx-3 focus:outline-none"
                >
                  <IconMapper
                    name={service.icon}
                    size={24}
                    className={
                      idx === indexService
                        ? "text-textColor"
                        : "text-textColorGray"
                    }
                  />
                  <span
                    className={`mt-1 text-xs border-b-2 pb-1 transition-colors duration-200 ease-in-out ${
                      idx === indexService
                        ? "text-textColor border-blueBorder"
                        : "text-textColorGray border-transparent"
                    }`}
                  >
                    {service.name[language]}
                  </span>
                </button>
              ))}
          </div>
          {showLeftBlur && (
            <div
              className="pointer-events-none absolute inset-y-0 -left-[1px] w-12 z-10
    bg-gradient-to-r from-[rgba(247,247,247,1)] dark:from-[rgba(14,37,45,1)] to-transparent"
              style={{ willChange: "transform" }}
            />
          )}

          {showRightBlur && (
            <div
              className="pointer-events-none absolute inset-y-0 -right-[1px] w-12 z-10
    bg-gradient-to-l from-[rgba(247,247,247,1)] dark:from-[rgba(14,37,45,1)] to-transparent"
              style={{ willChange: "transform" }}
            />
          )}
        </div>

        {/* Filter chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 py-2">
            {chips.map(({ key, label, onClear }) => (
              <div
                key={key}
                onClick={onClear}
                className="flex items-center bg-white border border-black border-opacity-40 rounded-md px-3 py-1 text-xs text-gray-700 cursor-pointer"
              >
                <span>{label}</span>
                <button
                  type="button"
                  className="ml-2 focus:outline-none text-gray-500 hover:text-gray-700"
                >
                  <AiIcons.AiOutlineClose size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
