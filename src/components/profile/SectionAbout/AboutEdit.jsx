import { useEffect, useState } from "react";
import { useStore } from "@/store";
import UserService from "@/services/UserService";
import { EditIcon, CheckIconBlack } from "@/constants/icons";

function AboutEdit({ about }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about); // Agregar un estado para el valor editado
  const { user, setUser } = useStore();

  useEffect(() => {
    setEditedAbout(about);
  }, [about]);

  const handleEdit = async () => {
    const data = {
      about: editedAbout,
    };

    const response = await UserService.updateDataUser(data);
    if (response.data) {
      setIsEditing(false);
      setUser(response.data);
    }
  };

  return (
    <div className="my-5">
      <div className="flex justify-between max-w-lg">
        <h1
          className="mb-5 underline font-semibold underline-offset-8"
          style={{ textDecorationColor: "#00A0D5", textDecorationThickness: 2 }}
        >
          About
        </h1>
        {isEditing ? (
          <CheckIconBlack onClick={handleEdit} />
        ) : (
          <EditIcon onClick={() => setIsEditing(true)} />
        )}
      </div>

      {isEditing ? (
        <textarea
          className="w-full max-w-lg h-40 p-3 rounded-xl bg-blueBorderTransparent  border-2 border-newBlue"
          value={editedAbout} // Usar editedAbout para reflejar el valor editado
          onChange={(e) => setEditedAbout(e.target.value)} // Actualizar editedAbout cuando se edite el textarea
        />
      ) : (
        <p className="text-blackText" style={{ whiteSpace: "pre-wrap" }}>
          {about ? about : "Without description"}
        </p>
      )}
    </div>
  );
}

export default AboutEdit;
