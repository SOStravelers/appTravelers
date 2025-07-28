import { useStore } from "@/store";
import languageData from "@/language/purchase.json";
import { formatPrice } from "@/utils/format";

export default function TablePriceSummary({ status, price }) {
  const { language, currency } = useStore();

  // Colores según estado de pago
  const statusBgColor = {
    unpaid: "bg-yellow-50",
    refund: "bg-purple-50",
    paid: "bg-green-50",
  };

  return (
    <div
      className={`mt-6 border dark:border-gray-500 rounded-lg p-5 text-sm text-textColor ${
        statusBgColor[status] || "bg-backgroundModal"
      }`}
    >
      <p className="font-semibold text-base mb-4">
        {status ? languageData.priceTab.title[status][language] : ""}
      </p>

      <div className="flex text-textColorGray justify-between py-1 border-b border-dashed border-gray-300">
        <span className="font-bold underline">
          {languageData.priceTab.table.section1[language]}
        </span>
        <span>{formatPrice(price?.netAmount || null, currency)}</span>
      </div>

      <div className="flex justify-between items-end py-1 border-b border-dashed border-gray-300 text-textColorGray">
        <div className="w-[70%] font-bold underline">
          {languageData.priceTab.table.section2[language]}
          <span className="text-gray-400 text-xs ml-1">
            ({price?.percentage?.toFixed(1)}%)
          </span>
        </div>
        <div className="w-[30%] text-right">
          {formatPrice(price?.taxes || null, currency)}
        </div>
      </div>

      <div className="flex justify-between py-2 mt-2 font-bold text-base text-textColorGray">
        <span className="underline">
          {status ? languageData.priceTab.table.total[status][language] : ""}
        </span>
        {status == "refund" ? (
          <span>{formatPrice(price?.netAmount || null, currency)}</span>
        ) : (
          <span>{formatPrice(price?.grossAmount || null, currency)}</span>
        )}
      </div>
    </div>
  );
}
