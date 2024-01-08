import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import React, { useState, useEffect } from "react";

function TextModal({
  title,
  text,
  buttonText,
  open,
  setOpen,
  onAccept,
  onCancel,
  selectOptions,
}) {
  const [selectedOption, setSelectedOption] = useState();

  useEffect(() => {
    if (selectOptions && selectOptions.length > 0) {
      setSelectedOption(selectOptions[0]);
    }
  }, [selectOptions]);

  const handleAccept = () => {
    onAccept(selectedOption);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className="fixed top-0 z-50 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center md:pl-60">
          <div className="justify-center items-center">
            <button
              className="absolute top-0 right-0 m-4 text-black text-2xl"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <div className="bg-white rounded-2xl w-[90vw] md:w-96 px-10 py-5  max-w-[384px]">
              <div className="p-5">
                <h1 className="text-2xl text-center mb-5">{title}</h1>
                <div className="text-center">
                  {text?.map((line, index) => (
                    <React.Fragment key={index}>
                      {line && <p>{line}</p>}
                      {index < text.length - 1 && <br />}{" "}
                    </React.Fragment>
                  ))}
                </div>
                {selectOptions && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select an option:
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border rounded-md"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      {selectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center items-center">
                {onAccept && (
                  <SolidButton text={buttonText} onClick={handleAccept} />
                )}
                {onCancel && (
                  <OutlinedButton text="Cancel" onClick={() => onCancel()} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TextModal;
