export function Option({
  selectedOption,
  correctOption,
  option,
  optionIndex,
  dispatch,
}) {
  return (
    <button
      className={`App-option ${
        selectedOption === option
          ? correctOption === optionIndex
            ? "App-option-correct-selected"
            : "App-option-wrong-selected"
          : ""
      }`}
      key={optionIndex}
      disabled={selectedOption !== null}
      onClick={() => {
        dispatch({ type: "SET_SELECTED_OPTION", payload: option });
      }}
    >
      {option}
    </button>
  );
}

export default Option;
