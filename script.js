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
  const codeSnippetElement = document.getElementById('code-snippet');
  const optionsElement = document.getElementById('options');
  const feedbackElement = document.createElement('div');
  const nextButton = document.getElementById('next-button');
  feedbackElement.id = 'feedback';

  nextButton.classList.add('hidden');

  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  const correctAnswerValue = question.options[question.answer];

  const options = [...question.options];
  shuffleArray(options);

  const correctIndexAfterShuffle = options.indexOf(correctAnswerValue);

  questionElement.textContent = question.question;
  optionsElement.innerHTML = '';

  if (question.code_snippet) {
    codeSnippetElement.classList.remove('hidden');
    codeSnippetElement.textContent = question.code_snippet;
  } else {
    codeSnippetElement.classList.add('hidden');
    codeSnippetElement.textContent = '';
  }
  
  options.forEach((option, newIndex) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option-button');
    button.addEventListener('click', () =>
      handleAnswer(newIndex === correctIndexAfterShuffle, button, feedbackElement, correctIndexAfterShuffle)
    );
    optionsElement.appendChild(button);
  });

  if (!document.getElementById('feedback')) {
    optionsElement.appendChild(feedbackElement);
  }
}

function handleAnswer(isCorrect, button, feedbackElement, index) {
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

    allOptions[index].classList.add('correct');
  }

  document.getElementById('score_current').innerHTML = `Correct: <strong>${score}</strong>, Wrong: <strong>${wrongAnswers}</strong>`;

  const nextButton = document.getElementById('next-button');
  nextButton.classList.remove('hidden');
  nextButton.onclick = () => {
    currentQuestion++;
    if (currentQuestion < maxQuestions) {
      displayQuestion();
    } else {
      showResults();
    }
  };
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
