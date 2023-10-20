import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";

function ServiceHistory() {
  return (
    <div className="flex flex-col py-28 px-5 md:pl-80">
      <h1 className="text-xl text-center my-8 max-w-lg">Last service</h1>
      <WorkerCardBooking
        link={"/"}
        name={"John Doe"}
        location={"124 street Miro Hotel, Ubud"}
        showArrow={false}
      />

      <h1 className="text-xl text-center my-8 max-w-lg">Previous</h1>
      <WorkerCardBooking
        link={"/"}
        name={"John Doe"}
        location={"124 street Miro Hotel, Ubud"}
        showArrow={false}
      />
      <WorkerCardBooking
        link={"/"}
        name={"John Doe"}
        location={"124 street Miro Hotel, Ubud"}
        showArrow={false}
      />
    </div>
  );
}

export default ServiceHistory;
