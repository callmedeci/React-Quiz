import App from './components/App';
import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { QuizProvider } from './context/QuizContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QuizProvider>
      <App />
    </QuizProvider>
  </React.StrictMode>
);
