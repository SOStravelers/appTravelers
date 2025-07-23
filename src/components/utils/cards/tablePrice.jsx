import { useStore } from "@/store";
import languageData from "@/language/purchase.json";
import { formatPrice } from "@/utils/format";
export default function tablePrice({ confirmed, price }) {
  const { language, currency } = useStore();
  return (
    <div className="mt-6 bg-backgroundModal border dark:border-gray-500 rounded-lg p-5 text-sm text-textColor">
      <p className="font-semibold text-base mb-4">
        {confirmed
          ? languageData.priceTab.title.confirmed[language]
          : languageData.priceTab.title.pending[language]}
      </p>

      <div className="flex text-textColorGray justify-between py-1 border-b border-dashed border-gray-300">
        <span>{languageData.priceTab.table.section1[language]}</span>
        <span> {formatPrice(price?.netAmount || null, currency)}</span>
      </div>
      <div className="flex justify-between items-end py-1 border-b border-dashed border-gray-300 text-textColorGray">
        <div className="w-[70%]">
          {languageData.priceTab.table.section2[language]}
          <span className="text-gray-400 text-xs ml-1">
            ({price.percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="w-[30%] text-right">
          {formatPrice(price?.taxes || null, currency)}
        </div>
      </div>

      <div className="flex justify-between py-2 mt-2 font-bold text-base text-textColorGray">
        <span>
          {confirmed
            ? languageData.priceTab.table.total.confirmed[language]
            : languageData.priceTab.table.total.pending[language]}
        </span>
        <span>{formatPrice(price?.grossAmount || null, currency)}</span>
      </div>
    </div>
  );
}
