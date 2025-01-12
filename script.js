let currentQuestion = 0;
let score = 0;
let wrongAnswers = 0;
let questions = [];
let maxQuestions = 0;
const wrongQuestions = [];

fetch('questions.json')
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    document.getElementById('start-button').addEventListener('click', setupQuiz);
  });

function setupQuiz() {
  const questionInput = prompt('Enter the number of questions you want to answer:');
  maxQuestions = parseInt(questionInput);

  if (isNaN(maxQuestions) || maxQuestions <= 0 || maxQuestions > questions.length) {
    alert(`Please enter a valid number between 1 and ${questions.length}.`);
    return;
  }

  startQuiz();
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  wrongAnswers = 0;
  wrongQuestions.length = 0;
  document.getElementById('home').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  document.getElementById('score_current').innerHTML = `Correct: <strong>0</strong>, Wrong: <strong>0</strong>`;
  displayQuestion();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayQuestion() {
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const feedbackElement = document.createElement('div');
  feedbackElement.id = 'feedback';

  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  const options = question.options.map((option, index) => ({ option, index }));
  shuffleArray(options);

  questionElement.textContent = question.question;
  optionsElement.innerHTML = '';

  options.forEach(({ option, index }) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option-button');
    button.addEventListener('click', () => handleAnswer(index === question.answer, button, feedbackElement));
    optionsElement.appendChild(button);
  });

  if (!document.getElementById('feedback')) {
    optionsElement.appendChild(feedbackElement);
  }
}

function handleAnswer(isCorrect, button, feedbackElement) {
  const allOptions = document.querySelectorAll('.option-button');
  allOptions.forEach((btn) => btn.disabled = true);

  if (isCorrect) {
    score++;
    button.classList.add('correct');
    feedbackElement.textContent = 'Correct!';
    feedbackElement.style.color = 'green';
  } else {
    wrongAnswers++;
    button.classList.add('wrong');
    feedbackElement.textContent = 'Wrong! The correct answer was highlighted.';
    feedbackElement.style.color = 'red';

    const correctIndex = questions[currentQuestion].answer;
    allOptions[correctIndex].classList.add('correct');
  }

  document.getElementById('score_current').innerHTML = `Correct: <strong>${score}</strong>, Wrong: <strong>${wrongAnswers}</strong>`;

  currentQuestion++;
  if (currentQuestion < maxQuestions) {
    setTimeout(displayQuestion, 1000);
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('score_final').innerHTML = `Final Score: Correct: <strong>${score}</strong>, Wrong: <strong>${wrongAnswers}</strong> out of <strong>${maxQuestions}</strong>`;
  document.getElementById('restart-button').onclick = restartQuiz;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  wrongAnswers = 0;
  maxQuestions = 0;
  document.getElementById('result').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .option-button {
      background-color: white;
      color: black;
      border: 1px solid #ccc;
      padding: 10px 20px;
      margin: 5px;
      cursor: pointer;
      border-radius: 5px;
      font-size: 16px;
    }
    .option-button:hover {
      background-color: lightgray;
    }
    .option-button.selected {
      background-color: gray;
      color: white;
    }
    .option-button.correct {
      background-color: green;
      color: white;
    }
    .option-button.wrong {
      background-color: red;
      color: white;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
});
