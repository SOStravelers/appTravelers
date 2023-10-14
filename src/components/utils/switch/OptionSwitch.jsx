import { useState } from "react";

function OptionSwitch({
  title,
  onFunction,
  offFunction,
  initialState = false,
}) {
  const [isOn, setIsOn] = useState(initialState);

  const handleSwitch = () => {
    setIsOn(!isOn);
    if (isOn) offFunction();
    else onFunction();
  };

  return (
    <div className="flex items-center justify-between my-3">
      <h1>{title}</h1>
      <div className="flex">
        <div
          className={`w-12 h-6 flex items-center rounded-full ${
            isOn ? "bg-blueBorder" : "bg-lightGrey"
          }`}
          onClick={handleSwitch}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
              isOn ? "translate-x-6" : "translate-x-1"
            }`}
          ></div>
        </div>
        <h1 className="ml-4">{isOn ? "On" : "Off"}</h1>
      </div>
    </div>
  );
}

export default OptionSwitch;
