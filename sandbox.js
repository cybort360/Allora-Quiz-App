'use strict';

const supabaseClient = supabase.createClient(
  'https://bldqnvwadicpatlqfphp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZHFudndhZGljcGF0bHFmcGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzc4MDQsImV4cCI6MjA2ODk1MzgwNH0.glaQ9g4MlHmljhD_PGpWog8CxhQ3biCtfu7nxxSjidA'
);

const questionDiv = document.querySelector('#question');
const answerBtns = document.querySelectorAll('.answer-btn');
const scoreBoard = document.querySelector('#current-score');
const timerElement = document.querySelector('#time');
const timeUpMsg = document.querySelector('#time-up');
const progressText = document.querySelector('#progress');

let score = 0;
let timeLeft = 20;
let countdown;

let correctCount = 0;
let wrongCount = 0;

const askName = prompt('Who is taking this quiz?');
const formatName = askName ? askName[0].toUpperCase() + askName.slice(1).toLowerCase() : 'Player';

const questions = [
  {
    question: 'What is Allora’s primary goal?',
    options: [
      'To centralize AI development for enterprise use',
      'To decentralize and democratize machine intelligence',
      'To build a cloud computing service for AI models',
      'To provide high-speed data storage for AI training',
    ],
    answer: 'To decentralize and democratize machine intelligence',
  },
  {
    question: 'What are the three main participant roles in each Allora topic?',
    options: [
      'Miners, Validators, Consumers',
      'Developers, Trainers, Validators',
      'Workers, Reputers, Consumers',
      'Producers, Auditors, Traders',
    ],
    answer: 'Workers, Reputers, Consumers',
  },
  {
    question: 'In Allora, what is a "topic"?',
    options: [
      'A set of coding guidelines',
      'A data structure for indexing files',
      'A problem domain where participants collaborate on inference',
      'A community discussion board',
    ],
    answer: 'A problem domain where participants collaborate on inference',
  },
  {
    question: 'What is the purpose of “forecasted losses” in Allora?',
    options: [
      'To penalize inaccurate workers financially',
      'To estimate the value of stake returns',
      'To predict the likely accuracy of other workers',
      'To measure gas fees for inference submissions',
    ],
    answer: 'To predict the likely accuracy of other workers',
  },
  {
    question: 'How are reputers rewarded in the Allora Network?',
    options: [
      'By solving the most problems first',
      'Based on how closely their reports align with consensus and how much they’ve staked',
      'According to how many topics they create',
      'Through random token distribution',
    ],
    answer: 'Based on how closely their reports align with consensus and how much they’ve staked',
  },
  {
    question: 'What innovation allows Allora to combine AI predictions in a context-aware way?',
    options: [
      'Zero-knowledge Rollups',
      'Inference Mesh Network',
      'Inference Synthesis',
      'Predictive Aggregation Layer',
    ],
    answer: 'Inference Synthesis',
  },
  {
    question: 'What does Allora produce to measure confidence in its predictions?',
    options: ['Trust Scores', 'Reputation Tokens', 'Confidence Intervals', 'Stake Ratios'],
    answer: 'Confidence Intervals',
  },
  {
    question: 'Which of the following is NOT one of Allora’s "secondary predictions"?',
    options: ['Confidence Intervals', 'Forecasted Losses', 'Listening Coefficients', 'Confidence Boost'],
    answer: 'Confidence Boost',
  },
  {
    question: 'How does Allora prevent Sybil attacks in reward distribution?',
    options: [
      'Using a proof-of-work mining algorithm',
      'Requiring face verification and KYC',
      'By using entropy measures that adjust for identity duplication',
      'Manually validating all users',
    ],
    answer: 'By using entropy measures that adjust for identity duplication',
  },
  {
    question: 'What is the function of "Listening Coefficients" in the Allora system?',
    options: [
      'To count how many predictions a reputer has made',
      'To measure a reputer’s ability to predict worker accuracy',
      'To track reputers’ historical accuracy and trustworthiness',
      'To calculate gas efficiency of reputers',
    ],
    answer: 'To track reputers’ historical accuracy and trustworthiness',
  },
  {
    question: 'What kind of pricing model is used when consumers purchase AI insights in Allora?',
    options: [
      'Fixed token fee per request',
      'Pay-What-You-Want (PWYW)',
      'Free for all verified addresses',
      'Gasless micropayments through relayers',
    ],
    answer: 'Pay-What-You-Want (PWYW)',
  },
  {
    question: 'What happens if a reputer’s stake is significantly above average?',
    options: [
      'They are automatically made workers',
      'Their influence in consensus is capped to prevent centralization',
      'They gain admin-level access to the topic',
      'Their rewards are doubled',
    ],
    answer: 'Their influence in consensus is capped to prevent centralization',
  },
  {
    question: 'What determines the “reward weight” of a topic in Allora?',
    options: [
      'The number of consumers using it',
      'The number of predictions per second',
      'Stake by reputers and fee revenue from consumers',
      'The length of time the topic has existed',
    ],
    answer: 'Stake by reputers and fee revenue from consumers',
  },
  {
    question: 'What is Allora’s stance on how workers should be rewarded?',
    options: [
      'Equally, based on participation',
      'Based on how much their work improves prediction accuracy',
      'Based on how often they post',
      'By seniority within the network',
    ],
    answer: 'Based on how much their work improves prediction accuracy',
  },
  {
    question: 'Which core principle allows Allora to adapt its token emissions over time?',
    options: [
      'Elastic Proof-of-Stake',
      'Dynamic Gas Scaling',
      'Target emission rate with APY caps and fee offsets',
      'On-chain DAO voting every epoch',
    ],
    answer: 'Target emission rate with APY caps and fee offsets',
  },
];

let currentQuestion = {};
let availableQuestions = [...questions];

function resetButtons() {
  answerBtns.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove('correct', 'wrong');
  });
}

function saveResults() {
  localStorage.setItem('quizScore', score);
  localStorage.setItem('quizCorrectCount', correctCount);
  localStorage.setItem('quizWrongCount', wrongCount);
  localStorage.setItem('quizPlayerName', formatName);
}

function displaySummary() {
  const percentage = Math.round((correctCount / questions.length) * 100);
  const tweetText = `I am ${formatName}, and I am ${percentage}% allora pilled after taking the @AlloraNetwork Quiz.\nTry it here: https://allora-quiz-app.vercel.app`;
  const quoteTweetId = '1947927503735021885';
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=https://x.com/OctaneXyz/status/${quoteTweetId}`;

  questionDiv.innerHTML = `
    <h2>Quiz Complete, ${formatName}!</h2>
    <br>
    <p><strong>Final Score:</strong> ${score}</p>
    <p><strong>Correct Answers:</strong> ${correctCount}</p>
    <p><strong>Wrong Answers:</strong> ${wrongCount}</p>
    <br>
    <p style="font-size: 1.3em; margin-top: 10px;">
      <em>${formatName}, you are ${percentage}% allora pilled.</em>
    </p>
    <a id="twitter-share-btn" href="${tweetUrl}" target="_blank" style="display:inline-block;margin-top:20px;padding:8px 14px;background:#1da1f2;color:#fff;border-radius:6px;text-decoration:none;font-weight:normal;font-size:1rem">
      Share on Twitter
    </a>
    <br><br>
      <div class="leaderboard-section">
      <h2>🏆 Leaderboard</h2>
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody id="leaderboard-list"></tbody>
      </table>
    </div>
  `;

  answerBtns.forEach((btn) => (btn.style.display = 'none'));
  timerElement.textContent = '';

  submitScoreToSupabase(formatName, score).then(() => {
    loadLeaderboard();
  });
}

function updateProgress() {
  const current = questions.length - availableQuestions.length;
  const total = questions.length;
  progressText.textContent = `Question ${current} of ${total}`;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadNextQuestion() {
  clearInterval(countdown);
  resetButtons();
  timeUpMsg.style.display = 'none';

  if (availableQuestions.length === 0) {
    saveResults();
    displaySummary();
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[randomIndex];
  availableQuestions.splice(randomIndex, 1);

  const shuffledOptions = shuffleArray([...currentQuestion.options]);
  questionDiv.textContent = currentQuestion.question;
  answerBtns.forEach((btn, index) => {
    btn.textContent = shuffledOptions[index];
  });

  timeLeft = 20;
  timerElement.textContent = timeLeft;
  countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      answerBtns.forEach((btn) => (btn.disabled = true));
      timeUpMsg.style.display = 'block';
      setTimeout(() => loadNextQuestion(), 1000);
    }
  }, 1000);

  updateProgress();
}

const toggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const logo = document.getElementById('logo');
const storedTheme = localStorage.getItem('theme') || 'light';

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === 'dark' ? '🌞' : '🌙';
  if (logo) {
    logo.src = theme === 'dark' ? 'images/allora.png' : 'images/logo-allora.png';
  }
}

if (storedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  updateThemeIcon('dark');
} else {
  updateThemeIcon('light');
}

toggleButton.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  const newTheme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

answerBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    clearInterval(countdown);
    const selected = btn.textContent.trim();
    const correctAnswer = currentQuestion.answer.trim();

    answerBtns.forEach((b) => {
      b.disabled = true;
      const answerText = b.textContent.trim();

      if (answerText === correctAnswer) {
        b.classList.add('correct');
      } else if (b === btn) {
        b.classList.add('wrong');
      }
    });

    if (selected === correctAnswer) {
      score++;
      correctCount++;
    } else {
      wrongCount++;
    }

    setTimeout(() => {
      loadNextQuestion();
    }, 1000);
  });
});

loadNextQuestion();

async function submitScoreToSupabase(name, score) {
  const { data, error } = await supabaseClient.from('leaderboard').insert([{ name, score }]).select();

  if (error) {
    console.error('❌ Error submitting score:', error.message);
  } else {
    console.log('✅ Score submitted successfully:', data);
  }
}

async function loadLeaderboard() {
  const { data, error } = await supabaseClient
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error loading leaderboard:', error.message);
    return;
  }

  const tbody = document.getElementById('leaderboard-list');
  tbody.innerHTML = '';

  data.forEach((entry, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
    `;

    tbody.appendChild(row);
  });
}
