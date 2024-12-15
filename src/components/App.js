import { useEffect, useReducer } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import Question from "./Question";
import StartScreen from "./StartScreen";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],

  // Loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        status: "ready",
        questions: action.payload,
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        status: "active",
      };

    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, status: "ready", questions: state.questions };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action Unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, next) => (prev += next.points),
    0
  );

  useEffect(function () {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "dataReceived", payload: data.questions })
      )
      .catch((_) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen dispatch={dispatch} numQuestions={numQuestions} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
              points={points}
              answer={answer}
            />

            <Question
              answer={answer}
              dispatch={dispatch}
              question={questions[index]}
            />

            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />

              <NextButton
                index={index}
                numQuestions={numQuestions}
                dispatch={dispatch}
                answer={answer}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            highscore={highscore}
            maxPossiblePoints={maxPossiblePoints}
            points={points}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
