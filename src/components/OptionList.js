import Option from "./Option";

export function OptionList({
  options,
  selectedOption,
  questions,
  currentQuestion,
  dispatch,
}) {
  return options.map((option, optionIndex) => (
    <Option
      selectedOption={selectedOption}
      correctOption={questions[currentQuestion].correctOption}
      option={option}
      optionIndex={optionIndex}
      dispatch={dispatch}
      key={option}
    />
  ));
}

export default OptionList;
