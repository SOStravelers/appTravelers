import AboutEdit from "./AboutEdit";
import EditGallery from "./EditGallery";

function SectionAboutEdit({ about, gallery }) {
  console.log("wena");
  return (
    <div>
      <AboutEdit about={about} />
      <EditGallery images={gallery} />
    </div>
  );
}

export default SectionAboutEdit;
