let currentQuestion = 0;
let score = 0;
let wrongAnswers = 0;
let questions = [];
let maxQuestions = 0;

const DATASET_DEFAULT = 'idm-questions.json';

const els = {
  datasetSelect: document.getElementById('dataset-select'),
  loadBtn: document.getElementById('load-button'),
  datasetStatus: document.getElementById('dataset-status'),
  startBtn: document.getElementById('start-button'),
  loadHint: document.getElementById('load-hint'),

  home: document.getElementById('home'),
  quiz: document.getElementById('quiz'),
  result: document.getElementById('result'),

  question: document.getElementById('question'),
  codeSnippet: document.getElementById('code-snippet'),
  options: document.getElementById('options'),
  explanation: document.getElementById('explanation-display'),
  nextBtn: document.getElementById('next-button'),

  scoreCurrent: document.getElementById('score_current'),
  scoreFinal: document.getElementById('score_final'),
  restartBtn: document.getElementById('restart-button'),
  questionCount: document.getElementById('question-count'),
  startPanel: document.getElementById('start-panel'),
  loadPanel: document.getElementById('load-panel'),
};

function normalizeQuestions(raw) {
  // Acceptă:
  // - array direct: [{question, options, answer, ...}]
  // - sau obiect cu .tests etc (în caz că ai alt export)
  let arr = Array.isArray(raw) ? raw : (raw?.questions || []);
  arr = arr.filter(q =>
    q &&
    typeof q.question === 'string' &&
    Array.isArray(q.options) &&
    q.options.length >= 2 &&
    Number.isInteger(q.answer) &&
    q.answer >= 0 &&
    q.answer < q.options.length
  );
  return arr;
}

async function loadDataset(fileName) {
  els.startBtn.disabled = true;
  els.loadHint.textContent = 'Loading…';
  els.datasetStatus.textContent = `Dataset: ${fileName} (loading…)`;

  const res = await fetch(fileName, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${fileName} (${res.status})`);

  const data = await res.json();
  const normalized = normalizeQuestions(data);

  if (normalized.length === 0) {
    throw new Error(`No valid questions found in ${fileName}.`);
  }

  questions = normalized;

  els.questionCount.max = String(questions.length);
  if (!els.questionCount.value) els.questionCount.value = String(Math.min(10, questions.length));

  els.datasetStatus.textContent = `Dataset: ${fileName} (${questions.length} întrebări)`;
  els.loadHint.textContent = `Loaded: ${questions.length} întrebări.`;

  els.startPanel.classList.remove('hidden');
  els.loadPanel.classList.add('hidden');

  els.startBtn.disabled = false;
}

function setupQuiz() {
  const raw = (els.questionCount.value || '').trim();

  // default: dacă nu completează, facem 10 (sau ce vrei)
  let n = raw ? parseInt(raw, 10) : 10;

  if (!Number.isInteger(n) || n <= 0) {
    els.loadHint.textContent = 'Te rog introdu un număr valid de întrebări (>=1).';
    return;
  }

  if (n > questions.length) n = questions.length;

  maxQuestions = n;
  startQuiz();
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  wrongAnswers = 0;

  els.home.classList.add('hidden');
  els.result.classList.add('hidden');
  els.quiz.classList.remove('hidden');

  els.scoreCurrent.innerHTML = `Correct: <strong>0</strong>, Wrong: <strong>0</strong>`;
  displayQuestion();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayQuestion() {
  els.explanation.classList.add('hidden');
  els.nextBtn.classList.add('hidden');

  // random question (cum ai acum) :contentReference[oaicite:3]{index=3}
  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  const correctAnswerValue = question.options[question.answer];

  const options = [...question.options];
  shuffleArray(options);

  const correctIndexAfterShuffle = options.indexOf(correctAnswerValue);

  els.question.textContent = question.question;
  els.options.innerHTML = '';

  if (question.code_snippet) {
    els.codeSnippet.classList.remove('hidden');
    els.codeSnippet.textContent = question.code_snippet;
  } else {
    els.codeSnippet.classList.add('hidden');
    els.codeSnippet.textContent = '';
  }

  const feedback = document.createElement('div');
  feedback.id = 'feedback';
  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  feedback.removeAttribute('data-type');

  options.forEach((option, newIndex) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = option;
    btn.classList.add('option-button');
    btn.addEventListener('click', () => handleAnswer(newIndex === correctIndexAfterShuffle, btn, feedback, correctIndexAfterShuffle, question));
    els.options.appendChild(btn);
  });

  els.options.appendChild(feedback);
}

function handleAnswer(isCorrect, clickedButton, feedbackEl, correctIndexAfterShuffle, question) {
  const allButtons = document.querySelectorAll('.option-button');
  allButtons.forEach((b) => b.disabled = true);

  if (isCorrect) {
    score++;
    clickedButton.classList.add('correct');
    feedbackEl.textContent = 'Corect!';
    feedbackEl.dataset.type = 'ok';
  } else {
    wrongAnswers++;
    clickedButton.classList.add('wrong');
    feedbackEl.textContent = 'Greșit. Răspunsul corect a fost evidențiat.';
    feedbackEl.dataset.type = 'bad';
    allButtons[correctIndexAfterShuffle]?.classList.add('correct');
  }

  els.scoreCurrent.innerHTML = `Correct: <strong>${score}</strong>, Wrong: <strong>${wrongAnswers}</strong>`;

  // ✅ Explanation doar dacă există
  if (question.explanation) {
    els.explanation.textContent = question.explanation;
    els.explanation.classList.remove('hidden');
  } else {
    els.explanation.classList.add('hidden');
    els.explanation.textContent = '';
  }

  els.nextBtn.classList.remove('hidden');
  els.nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < maxQuestions) displayQuestion();
    else showResults();
  };
}

function showResults() {
  els.quiz.classList.add('hidden');
  els.result.classList.remove('hidden');
  els.scoreFinal.innerHTML = `Final Score: Correct: <strong>${score}</strong>, Wrong: <strong>${wrongAnswers}</strong> out of <strong>${maxQuestions}</strong>`;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  wrongAnswers = 0;
  maxQuestions = 0;

  els.result.classList.add('hidden');
  els.quiz.classList.add('hidden');
  els.home.classList.remove('hidden');
  els.home.loadPanel.classList.remove('hidden');
  els.startPanel.classList.add('hidden');
  els.loadPanel.classList.remove('hidden');
}

// Wire UI
els.startBtn.addEventListener('click', setupQuiz);
els.restartBtn.addEventListener('click', restartQuiz);

els.loadBtn.addEventListener('click', async () => {
  try {
    await loadDataset(els.datasetSelect.value);
  } catch (e) {
    console.error(e);
    els.datasetStatus.textContent = `Dataset: error`;
    els.loadHint.textContent = `Eroare: ${e.message}`;
    els.startBtn.disabled = true;
    els.startPanel.classList.add('hidden');

  }
});

// Auto-select default + show
els.datasetSelect.value = DATASET_DEFAULT;
els.datasetStatus.textContent = `Dataset: ${DATASET_DEFAULT} (not loaded)`;