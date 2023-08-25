import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex flex-col bg-blanco px-5 ${inter.className}`}
    >
      <BookingCard />

      <section>
        <h1 className="text-negro text-2xl font-semibold mt-10 mb-5">Services</h1>
        <div className="flex overflow-x-auto py-2">
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
        </div>
      </section>

      <section>
        <h1 className="text-negro text-2xl font-semibold mt-10 mb-5">Recommended for you</h1>
        <div className="flex overflow-x-auto py-2">
          <RecomendationCard />
          <RecomendationCard />

        </div>
      </section>
    </main>
  );
}
