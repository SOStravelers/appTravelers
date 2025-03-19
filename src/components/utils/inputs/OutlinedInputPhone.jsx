import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function OutlinedInputPhone({ width, value, onChange }) {
  return (
    <div
      className="relative w-full max-w-lg"
      style={{ width: width || "100%" }}
    >
      <PhoneInput
        country={"cl"} // Código del país predeterminado
        // onlyCountries={["cl", "br", "us", "ar", "mx"]} // Lista de países permitidos
        disableDropdown={false} // Permite cambiar el país con la bandera
        enableSearch={true} // Permite buscar en la lista de países
        value={value}
        onChange={(phone, country) => {
          const formattedPhone = `+${country.dialCode} ${phone
            .replace(country.dialCode, "")
            .trim()}`;
          onChange(formattedPhone); // Guarda el número con el `+`
        }}
        containerStyle={{ width: "100%" }}
        inputStyle={{
          width: "100%",
          paddingLeft: "60px", // Espacio suficiente para la bandera
          paddingRight: "15px", // Para alinear el número más a la derecha
          borderRadius: "8px",
          border: "1px solid #00A0D5",
          fontSize: "16px",
        }}
        //holas
        buttonStyle={{
          borderRadius: "8px 0px 0px 8px",
          border: "1px solid #00A0D5",
          backgroundColor: "#fff",
          padding: "5px",
        }}
        dropdownStyle={{
          borderRadius: "8px",
          width: "300px",
        }}
      />
    </div>
  );
}

export default OutlinedInputPhone;
