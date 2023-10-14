import AboutEdit from "./AboutEdit";
import EditGallery from "./EditGallery";

function SectionAboutEdit({ description, gallery }) {
  return (
    <div>
      <AboutEdit description={description} />
      <EditGallery images={gallery} />
    </div>
  );
}

export default SectionAboutEdit;
