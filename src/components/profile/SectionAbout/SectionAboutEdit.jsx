import AboutEdit from "./AboutEdit";
import EditGallery from "./EditGallery";

function SectionAboutEdit({ about, gallery }) {
  return (
    <div>
      <AboutEdit about={about} />
      <EditGallery images={gallery} />
    </div>
  );
}

export default SectionAboutEdit;
