import About from "./About";
import Gallery from "./Gallery";

function SectionAbout({ description, gallery }) {
  return (
    <div>
      <Gallery images={gallery} />
      <About description={description} />
    </div>
  );
}

export default SectionAbout;
