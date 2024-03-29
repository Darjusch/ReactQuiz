// AppTimer.js
import React from "react";

function Timer({ timer }) {
  return (
    <div className="App-timer">
      <p>{formatTime(timer)}</p>
    </div>
  );
}

export default Timer;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}
