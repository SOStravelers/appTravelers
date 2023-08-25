import React from "react";

function ServiceCard() {
  return (
    <div
      className="text-negro flex flex-col items-center justify-center bg-blanco w-28 h-28 mx-2"
      style={{
        boxShadow: "2px 2px 21px rgba(0, 0, 0, 0.14)",
        borderRadius: 16,
      }}
    >
      <div className="w-14 h-14 rounded-full bg-azul"></div>
      <h1 className="text-center text-xl mt-2">Servicio</h1>
    </div>
  );
}

export default ServiceCard;
