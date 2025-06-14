import SyncCarousel from "@/components/utils/carousels/SyncCarousel";
import { useRouter } from 'next/router'
import {useState,useEffect} from 'react'
import { getServicesByCategory } from "@/utils/apis";
import ServiceList from "@/components/service/ServiceList";


export default function ServiceCategory() {

    const router = useRouter()
    const { slug } = router.query;

    const [category, setCategory] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            setCategory({ name: slug });
            fetchServices(slug);
        }
    }, [slug]);

    const fetchServices = async (categorySlug) => {
        setLoading(true);
        try {
          const servicesData = await getServicesByCategory(categorySlug);
          setServices(servicesData);
        } catch (error) {
          console.error("Error fetching services:", error);
          setServices([]);
        } finally {
          setLoading(false);
        }
      };

    return (
        <main className="relative flex flex-col w-full  bg-white py-16 lg:py-20 xl:py-20 md:pl-[240px]">
          <h1 className="relative top-6 -mb-10 z-50 bg-[rgba(100,100,100,0.1)] md:bg-[rgba(0,0,0,0)]  text-black flex justify-center items-center w-full text-4xl font-bold" >{category && category.name}</h1>
          {process.env.NEXT_PUBLIC_DEMO == "true" && (
            <div className="flex justify-center mt-1 items-center bg-blueBorder max-w-lg text-white  rounded-md">
              <p className="text-center">Esta é uma versão demo</p>
            </div>
          )}
          <SyncCarousel />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {services.length > 0 ? (

                <ul>{services.map((service) => (<li key={service.id}>{service.name}</li>))}</ul>
              ) : (<p className="mx-auto p-10">No services available in category {category && category.name}</p>)}
              
            </>
          )}
          <ServiceList services={services}></ServiceList>
        </main>   
      );
    }

