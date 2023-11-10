import React from "react";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";

function TextModal({
  title,
  text,
  buttonText,
  open,
  setOpen,
  onAccept,
  onCancel,
}) {
  return (
    <>
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative">
            <button
              className="absolute top-0 right-0 m-4 text-black text-2xl"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <div className="bg-white rounded-2xl w-[90vw] md:w-96 px-10 py-5">
              <div className="p-5">
                <h1 className="text-2xl text-center mb-5">{title}</h1>
                <div className="text-justify text-center">
                  {text.map((line, index) => (
                    <React.Fragment key={index}>
                      {line && <p>{line}</p>}
                      {index < text.length - 1 && <br />}{" "}
                      {/* Agrega un <br /> excepto después de la última línea */}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {onAccept && <SolidButton text={buttonText} onClick={onAccept} />}
              {onCancel && <OutlinedButton text="Cancel" onClick={onCancel} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TextModal;
