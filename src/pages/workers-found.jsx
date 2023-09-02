import WorkerCard from "@/components/utils/cards/WorkerCard";

const WORKERS = [
  {
    name: "Juan",
    service: "Corte de cabello",
    score: 4.5,
  },
  {
    name: "Pedro",
    service: "Corte de cabello",
    score: 5,
  },
];

export default function WorkersFound() {
  return (
    <div className="flex flex-col px-10 items-center">
      <h1 className="my-5 text-gris text-center">
        These are the available barbers, select the one that best suits your
        needs.
      </h1>
      <div className="flex flex-col items-center">
        {WORKERS.map((worker, index) => (
          <WorkerCard
            key={index}
            name={worker.name}
            service={worker.service}
            score={worker.score}
            link={"/worker/" + index}
          />
        ))}
      </div>
    </div>
  );
}
