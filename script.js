let currentQuestion = 0;
let score = 0;
let questions = [];

// Load questions from JSON file
fetch('questions.json')
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    document.getElementById('start-button').addEventListener('click', startQuiz);
  });

function startQuiz() {
  document.getElementById('home').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  displayQuestion();
}

function displayQuestion() {
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const nextButton = document.getElementById('next-button');

  const question = questions[currentQuestion];
  questionElement.textContent = question.question;
  optionsElement.innerHTML = '';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(index === question.answer));
    optionsElement.appendChild(button);
  });

  nextButton.classList.add('hidden');
}

function handleAnswer(isCorrect) {
  if (isCorrect) score++;
  document.getElementById('next-button').classList.remove('hidden');
  document.getElementById('next-button').onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      showResults();
    }
  };
}

function showResults() {
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('score').textContent = `${score} / ${questions.length}`;
  document.getElementById('restart-button').onclick = restartQuiz;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById('result').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
}
