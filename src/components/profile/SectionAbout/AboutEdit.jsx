import { useState } from "react";
import { EditIcon, CheckIconBlack } from "@/constants/icons";
function AboutEdit({ description }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(false);
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
          className="w-full h-28 p-3 rounded-xl bg-transparentBlue"
          defaultValue={description}
        />
      ) : (
        <p className="text-blackText">
          {description?.length > 0 ? description : "No description yet"}
        </p>
      )}
    </div>
  );
}

export default AboutEdit;
