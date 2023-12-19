import logo from "./logo.svg";
import "./App.css";

import { useState, useEffect, useReducer } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { QUIZZ_QUESTIONS } from "./questions";

// TODO
// Refactor code better naming and cleaner
// Make smaller and reusable components

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

const initialState = {
  questions: QUIZZ_QUESTIONS,
  currentQuestion: 0,
  selectedOption: null,
  points: 0,
  gameOver: false,
  timer: 5 * 60,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_OPTION":
      return { ...state, selectedOption: action.payload };
    case "SET_POINTS":
      return { ...state, points: state.points + action.payload };
    case "SET_GAME_OVER":
      return { ...state, gameOver: true };
    case "SET_CURRENT_QUESTION":
      return { ...state, currentQuestion: state.currentQuestion + 1 };
    case "SET_TIMER":
      return { ...state, timer: state.timer - 1 };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "SET_TIMER" });
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []); // Empty dependency array ensures the effect runs once on mount

  useEffect(() => {
    if (state.timer === 0) {
      dispatch({ type: "SET_GAME_OVER" });
    }
  }, [state.timer]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">THE REACT QUIZ</h1>
      </header>
      {state.gameOver ? (
        <h1>GAME OVER - YOU REACHED {state.points} POINTS !</h1>
      ) : (
        <div className="App-body">
          <div className="App-progressbar">
            <ProgressBar
              now={state.currentQuestion}
              max={state.questions.length}
            />
            <div className="App-progress-labels">
              <p>
                Questions {state.currentQuestion + 1}/{state.questions.length}
              </p>
              <p>{state.points} points</p>
            </div>
          </div>
          <div className="App-questions-container">
            <h2
              className="App-question"
              key={state.questions[state.currentQuestion].question}
            >
              {state.questions[state.currentQuestion].question}
            </h2>
            {state.questions[state.currentQuestion].options.map(
              (option, optionIndex) => (
                <button
                  className={`App-option ${
                    state.selectedOption === option
                      ? state.questions[state.currentQuestion].correctOption ===
                        optionIndex
                        ? "App-option-correct-selected"
                        : "App-option-wrong-selected"
                      : ""
                  }`}
                  key={optionIndex}
                  disabled={state.selectedOption !== null}
                  onClick={() => {
                    dispatch({ type: "SET_SELECTED_OPTION", payload: option });
                  }}
                >
                  {option}
                </button>
              )
            )}
          </div>
          <div className="App-bottom">
            <div className="App-timer">
              <p>{formatTime(state.timer)}</p>
            </div>
            <button
              className="App-button-next"
              disabled={
                state.selectedOption === null ||
                state.currentQuestion === state.questions.length
              }
              onClick={() => {
                if (
                  state.questions[state.currentQuestion].correctOption ===
                  state.questions[state.currentQuestion].options.indexOf(
                    state.selectedOption
                  )
                ) {
                  dispatch({
                    type: "SET_POINTS",
                    payload: state.questions[state.currentQuestion].points,
                  });
                }
                if (state.currentQuestion === state.questions.length - 1) {
                  dispatch({ type: "SET_GAME_OVER" });
                }
                dispatch({ type: "SET_CURRENT_QUESTION" });
                dispatch({ type: "SET_SELECTED_OPTION", payload: null });
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
