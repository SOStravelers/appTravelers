import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { QuestionPicture } from "@/constants/icons";
import SubServiceCard from "@/components/utils/cards/SubServiceCard";
import SubserviceService from "@/services/SubserviceService";
import { Rings } from "react-loader-spinner";
export default function Subservices() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subServices, setSubservices] = useState([]);

  useEffect(() => {
    document.title = "Choose subservice | SOS Travelers";
    const fromFavorite = localStorage.getItem("fromFavorite");
    if (fromFavorite === true) {
      getDataFav();
    } else {
      getData();
    }
  }, []);

  const getData = async () => {
    const id = router.query.id;
    SubserviceService.list({ id: id }).then((response) => {
      setSubservices(response.data.docs);
      setLoading(false);
    });
  };

  const getDataFav = async () => {
    const subServices = JSON.parse(router.query.subservices);
    setSubservices(subServices);
    setLoading(false);
  };

  return (
    <div className="p-10 pb-20 flex flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-3 font-semibold text-center max-w-lg">
        Subservices availables
      </h1>
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Searching...</p>
        </div>
      ) : subServices && subServices.length > 0 ? (
        <div className="flex max-w-lg flex-wrap">
          {subServices?.map((s, index) => (
            <div className="w-1/2" key={index}>
              <SubServiceCard
                id={s._id}
                duration={s.duration}
                price={s.price}
                link={`/select-hostel/${s.id}`}
                name={s.name}
                icon={s.coverImg}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-center text-greyText max-w-lg mt-6  lg:my-4 xl:my-4 mb-2">
            No services available
          </p>
          <QuestionPicture />
        </div>
      )}
    </div>
  );
}
