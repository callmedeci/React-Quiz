import { useQuiz } from '../context/QuizContext';

function StartScreen() {
  const { dispatch, numQuestions } = useQuiz();

  return (
    <div className='start'>
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numQuestions} question to test your React mastery</h3>
      <button
        onClick={() => dispatch({ type: 'start' })}
        className='btn btn-ui'
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
