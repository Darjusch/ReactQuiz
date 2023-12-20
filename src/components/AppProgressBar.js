// ProgressBar.js
import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

function AppProgressBar({ currentQuestion, totalQuestions, points }) {
  return (
    <div className="App-progressbar">
      <ProgressBar now={currentQuestion} max={totalQuestions} />
      <div className="App-progress-labels">
        <p>
          Questions {currentQuestion + 1}/{totalQuestions}
        </p>
        <p>{points} points</p>
      </div>
    </div>
  );
}

export default AppProgressBar;
