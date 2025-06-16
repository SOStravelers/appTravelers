import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store";
import languageData from "@/language/subServices.json";

const ServiceDescription = ({ description }) => {
  const { language } = useStore();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const prevExpandedRef = useRef(expanded);

  const detailsHtml =
    typeof description === "object" ? description[language] : "";
  const plainText = detailsHtml.replace(/<[^>]+>/g, " ").trim();
  const words = plainText.split(/\s+/).filter(Boolean);
  const descriptionLimit = 50;
  const shouldShowButton = words.length > descriptionLimit;
  const previewText = words.slice(0, descriptionLimit).join(" ") + "…";

  useEffect(() => {
    const prev = prevExpandedRef.current;
    if (prev && !expanded && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - 270;
      window.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
    prevExpandedRef.current = expanded;
  }, [expanded]);

  const toggleExpand = () => setExpanded((e) => !e);

  return (
    <div ref={containerRef} className="mt-6">
      <h3 className="text-lg font-semibold mb-2">
        {languageData.serviceDescription.title[language]}
      </h3>

      <div
        className="text-gray-700"
        dangerouslySetInnerHTML={{
          __html: expanded || !shouldShowButton ? detailsHtml : previewText,
        }}
      />

      {shouldShowButton && (
        <button
          onClick={toggleExpand}
          className="text-blueBorder hover:underline mt-2 font-bold focus:outline-none"
        >
          {expanded
            ? languageData.serviceDescription.button.showLess[language] + " ▲"
            : languageData.serviceDescription.button.showMore[language] + " ▼"}
        </button>
      )}
    </div>
  );
};

export default ServiceDescription;
