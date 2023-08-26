import React from "react";

function RecomendationCard() {
  return (
    <div
      className="text-negro flex flex-col bg-blanco w-40 h-60 mx-2 rounded-2xl shadow-xl"
    >
      <div className="w-full h-40 bg-azul rounded-tr-2xl rounded-tl-2xl"></div>
      <div className="px-2">
        <h1 className="text-md font-bold mt-2">Nombre Servicio</h1>
        <p className="text-negroTexto text-sm">Nombre proveedor</p>
      </div>
    </div>
  );
}

export default RecomendationCard;
