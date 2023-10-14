function About({ description }) {
  return (
    <div className="my-5">
      <h1
        className="mb-5 underline font-semibold underline-offset-8"
        style={{ textDecorationColor: "#00A0D5", textDecorationThickness: 2 }}
      >
        About
      </h1>
      <p className="text-blackText">
        {description?.length > 0 ? description : "No description"}
      </p>
    </div>
  );
}

export default About;
