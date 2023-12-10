import React from "react";

function OutlinedTextArea({ ...props }) {
  return (
    <div className="relative">
      <textarea
        className={`border-grey border w-full max-w-lg rounded-xl p-3 my-1 h-40 resize-none`}
        {...props}
      />
    </div>
  );
}

export default OutlinedTextArea;