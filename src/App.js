import "./App.css";
import { useEffect, useReducer } from "react";
import { QUIZZ_QUESTIONS } from "./questions";
import OptionList from "./components/OptionList";
import AppHeader from "./components/AppHeader";
import GameOverScreen from "./components/GameOverScreen";
import AppProgressBar from "./components/AppProgressBar";
import AppTimer from "./components/AppTimer";
import NextButton from "./components/NextButton";
// TODO
// Make smaller and reusable components
// Refactor code better naming and cleaner

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
      <AppHeader />
      {gameOver ? (
        <GameOverScreen points={points} />
      ) : (
        <div className="App-body">
          <AppProgressBar
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
            <AppTimer timer={timer} />
            <NextButton
              disabled={
                selectedOption === null || currentQuestion === questions.length
              }
              onClick={() => {
                if (
                  questions[currentQuestion].correctOption ===
                  questions[currentQuestion].options.indexOf(selectedOption)
                ) {
                  dispatch({
                    type: "SET_POINTS",
                    payload: questions[currentQuestion].points,
                  });
                }
                if (currentQuestion === questions.length - 1) {
                  dispatch({ type: "SET_GAME_OVER" });
                }
                dispatch({ type: "SET_CURRENT_QUESTION" });
                dispatch({ type: "SET_SELECTED_OPTION", payload: null });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
