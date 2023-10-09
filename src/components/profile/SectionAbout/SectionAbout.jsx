import About from "./About";
import Gallery from "./Gallery";

function SectionAbout({ description, gallery }) {
  return (
    <div>
      <About description={description} />
      <Gallery images={gallery} />
    </div>
  );
}

export default SectionAbout;
