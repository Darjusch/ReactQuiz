import logo from "./logo.svg";
import "./App.css";

import { useState, useEffect, useReducer } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { QUIZZ_QUESTIONS } from "./questions";

// TODO
// Refactor to use reducer instead of useState
// Refactor code better naming and cleaner
// Make smaller and reusable components

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "next":
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        selectedOption: null,
      };
    case "select":
      return {
        ...state,
        selectedOption: action.payload,
      };
    case "gameOver":
      return {
        ...state,
        gameOver: true,
      };
    case "timer":
      return {
        ...state,
        timer: state.timer - 1,
      };
    case "points":
      return {
        ...state,
        points: state.points + action.payload,
      };
    default:
      throw new Error();
  }
}

function App() {
  const [questions, setQuestions] = useState(QUIZZ_QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // const [questions, dispatch] = useReducer(reducer, QUIZZ_QUESTIONS);

  const [selectedOption, setSelectedOption] = useState(null);
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const initialTimerValue = 5 * 60; // 5 minutes in seconds

  const [timer, setTimer] = useState(initialTimerValue);

  console.log(questions);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalId); // Stop the countdown when it reaches zero
          handleTimerEnd(); // Trigger an event when the timer reaches 0
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []); // Empty dependency array ensures the effect runs once on mount

  const handleTimerEnd = () => {
    setGameOver(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">THE REACT QUIZ</h1>
      </header>
      {gameOver ? (
        <h1>GAME OVER - YOU REACHED {points} POINTS !</h1>
      ) : (
        <div className="App-body">
          <div className="App-progressbar">
            <ProgressBar now={currentQuestion} max={questions.length} />
            <div className="App-progress-labels">
              <p>
                Questions {currentQuestion + 1}/{questions.length}
              </p>
              <p>{points} points</p>
            </div>
          </div>
          <div className="App-questions-container">
            <h2
              className="App-question"
              key={questions[currentQuestion].question}
            >
              {questions[currentQuestion].question}
            </h2>
            {questions[currentQuestion].options.map((option, optionIndex) => (
              <button
                className={`App-option ${
                  selectedOption === option
                    ? questions[currentQuestion].correctOption === optionIndex
                      ? "App-option-correct-selected"
                      : "App-option-wrong-selected"
                    : ""
                }`}
                key={optionIndex}
                disabled={selectedOption !== null}
                onClick={() => {
                  setSelectedOption(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="App-bottom">
            <div className="App-timer">
              <p>{formatTime(timer)}</p>
            </div>
            <button
              className="App-button-next"
              disabled={
                selectedOption === null || currentQuestion === questions.length
              }
              onClick={() => {
                if (
                  questions[currentQuestion].correctOption ===
                  questions[currentQuestion].options.indexOf(selectedOption)
                ) {
                  setPoints(points + questions[currentQuestion].points);
                }
                if (currentQuestion === questions.length - 1) {
                  setGameOver(true);
                }
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
