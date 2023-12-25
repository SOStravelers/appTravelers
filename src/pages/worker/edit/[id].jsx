import { useEffect, useState } from "react";
import WorkerProfileCardEdit from "@/components/utils/cards/WorkerProfileCardEdit";
import SectionAboutEdit from "@/components/profile/SectionAbout/SectionAboutEdit";
import UserService from "@/services/UserService";
import { useRouter } from "next/router";
import { useStore } from "@/store";

export default function WorkerEdit() {
  const router = useRouter();
  const { user: cachedUser, setUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [isActiveInitial, setIsActiveInitial] = useState(null);
  const id = router.query.id;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await UserService.get(id);
        if (response) {
          setUser(response.data);
          setIsActiveInitial(response.data?.workerData?.isActive);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };

    getData();
  }, [id, setUser]);

  useEffect(() => {
    if (!loading) {
      const fetchUser = async () => {
        let lGallery =
          cachedUser?.img?.gallery.filter((item) => item !== null).length >= 3;
        if (cachedUser?.about !== "" && lGallery && isActiveInitial) {
          await UserService.readyToWork({
            isAboutmeOk: true,
            isActive: true,
          });
        } else if (cachedUser?.about !== "" && lGallery) {
          await UserService.readyToWork({ isAboutmeOk: true });
        } else {
          await UserService.readyToWork({
            isAboutmeOk: false,
            isActive: false,
          });
        }
      };

      fetchUser();
    }
  }, [cachedUser, loading]);

  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <WorkerProfileCardEdit
        name={cachedUser?.personalData?.name?.first}
        lastName={cachedUser?.personalData?.name?.last}
        services={cachedUser?.workerData?.services}
        score={5}
        avatar={cachedUser?.img?.imgUrl}
      />
      <SectionAboutEdit
        about={cachedUser?.about}
        gallery={cachedUser?.img?.gallery}
      />
    </div>
  );
}
