import "./App.css";
import React, { useEffect, useReducer } from "react";
import { QUIZZ_QUESTIONS } from "./questions";
import OptionList from "./components/OptionList";
import QuizzHeader from "./components/QuizzHeader";
import GameOverScreen from "./components/GameOverScreen";
import ProgressIndicator from "./components/ProgressIndicator";
import Timer from "./components/Timer";
import NextButton from "./components/NextButton";

// Action Types
const SET_SELECTED_OPTION = "SET_SELECTED_OPTION";
const SET_POINTS = "SET_POINTS";
const SET_GAME_OVER = "SET_GAME_OVER";
const SET_CURRENT_QUESTION = "SET_CURRENT_QUESTION";
const SET_TIMER = "SET_TIMER";

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
    case SET_SELECTED_OPTION:
      return { ...state, selectedOption: action.payload };
    case SET_POINTS:
      return { ...state, points: state.points + action.payload };
    case SET_GAME_OVER:
      return { ...state, gameOver: true };
    case SET_CURRENT_QUESTION:
      return { ...state, currentQuestion: state.currentQuestion + 1 };
    case SET_TIMER:
      return { ...state, timer: state.timer - 1 };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: SET_TIMER });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (state.timer === 0) {
      dispatch({ type: SET_GAME_OVER });
    }
  }, [state.timer]);

  const {
    questions,
    currentQuestion,
    selectedOption,
    points,
    gameOver,
    timer,
  } = state;

  return (
    <div className="App">
      <QuizzHeader />
      {gameOver ? (
        <GameOverScreen points={points} />
      ) : (
        <div className="App-body">
          <ProgressIndicator
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            points={points}
          />
          <div className="App-questions-container">
            <h2
              className="App-question"
              key={questions[currentQuestion].question}
            >
              {questions[currentQuestion].question}
            </h2>
            <OptionList
              options={questions[currentQuestion].options}
              selectedOption={selectedOption}
              questions={questions}
              currentQuestion={currentQuestion}
              dispatch={dispatch}
            />
          </div>
          <div className="App-bottom">
            <Timer timer={timer} />
            <NextButton
              disabled={
                selectedOption === null || currentQuestion === questions.length
              }
              onClick={() => {
                const currentOptionIndex =
                  questions[currentQuestion].options.indexOf(selectedOption);

                if (
                  questions[currentQuestion].correctOption ===
                  currentOptionIndex
                ) {
                  dispatch({
                    type: SET_POINTS,
                    payload: questions[currentQuestion].points,
                  });
                }
                if (currentQuestion === questions.length - 1) {
                  dispatch({ type: SET_GAME_OVER });
                }
                dispatch({ type: SET_CURRENT_QUESTION });
                dispatch({ type: SET_SELECTED_OPTION, payload: null });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
