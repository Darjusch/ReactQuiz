// NextButton.js
import React from "react";

function NextButton({ disabled, onClick }) {
  return (
    <button className="App-button-next" disabled={disabled} onClick={onClick}>
      Next
    </button>
  );
}

export default NextButton;
