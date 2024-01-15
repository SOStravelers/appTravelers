export const fullName = (data) => {
  if (!data) return "";
  const { first, last } = data;
  return first + " " + (last ?? "");
};

export const StatusChip = ({ status, isWorker }) => {
  let color;
  let textColor = "white"; // Define textColor here
  let statusPortugues = status;
  switch (status) {
    case "requested":
      color = "grey";
      statusPortugues = "Solicitado";
      break;
    case "completed":
      color = "green";
      statusPortugues = "Completado";
      break;
    case "canceled":
      color = "#e77b7b";
      statusPortugues = "Cancelado";
      break;
    case "confirmed":
      color = "#92ef72";
      textColor = "black";
      statusPortugues = "Confirmado";
      break;
    default:
      color = "gray";
  }

  const style = {
    display: "inline-block",
    padding: "0.3rem 0.8rem",
    position: "relative",
    transform: "translateY(-2px)",
    borderRadius: "9999px",
    fontSize: "0.85rem",
    fontWeight: "550",
    color: textColor,
    backgroundColor: color,
  };

  return <span style={style}>{isWorker ? statusPortugues : status}</span>;
};
