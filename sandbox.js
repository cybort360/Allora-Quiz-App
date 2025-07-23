'use strict';

const questionDiv = document.querySelector('#question');
const answerBtns = document.querySelectorAll('.answer-btn');
const scoreBoard = document.querySelector('#current-score');
const timerElement = document.querySelector('#time');
const timeUpMsg = document.querySelector('#time-up');

let score = 0;
let timeLeft = 20;
let countdown;

let correctCount = 0;
let wrongCount = 0;

const askName = prompt('Who is taking this quiz?');
const formatName = askName ? askName[0].toUpperCase() + askName.slice(1).toLowerCase() : 'Player';

const questions = [
  {
    question: 'What is the primary goal of the Allora Network?',
    options: [
      'To create a centralized AI controlled by big companies',
      'To build a decentralized machine intelligence network open to everyone',
      'To develop a blockchain only for cryptocurrency trading',
      'To replace all existing machine learning platforms',
    ],
    answer: 'To build a decentralized machine intelligence network open to everyone',
  },
  {
    question: 'What consensus mechanism does Allora Network use?',
    options: ['Proof of Work', 'Proof of Stake', 'Proof of Alpha', 'Proof of Accuracy'],
    answer: 'Proof of Alpha',
  },
  {
    question: 'Which of these is NOT a type of participant in Allora topics?',
    options: [
      'Workers (AI programs generating predictions)',
      'Reputers (verifying accuracy of predictions)',
      'Validators (securing network communication)',
      'Consumers (users who pay for AI insights)',
    ],
    answer: 'Validators (securing network communication)',
  },
  {
    question: 'How does Allora reward Workers?',
    options: [
      'Based on the amount of tokens they stake',
      'Based on their contributions to improving network accuracy',
      'Based on the number of predictions they make',
      'Based on user votes',
    ],
    answer: 'Based on their contributions to improving network accuracy',
  },
  {
    question: 'What unique pricing model does Allora use for consumers buying AI insights?',
    options: [
      'Fixed price per insight',
      'Auction-based pricing',
      'Pay-What-You-Want (PWYW)',
      'Subscription-only access',
    ],
    answer: 'Pay-What-You-Want (PWYW)',
  },
  {
    question: 'What does Allora’s “context-awareness” feature allow workers to do?',
    options: [
      "Predict how accurate other workers' predictions will be under current conditions",
      'Control the entire network’s decision-making process',
      'Adjust the token emission rate dynamically',
      'Encrypt all network data',
    ],
    answer: "Predict how accurate other workers' predictions will be under current conditions",
  },
  {
    question: 'Why does Allora use "adjusted stake" for reputers?',
    options: [
      'To ensure the richest reputers control the network',
      'To cap the influence of very rich reputers and prevent centralization',
      'To increase the rewards for new reputers',
      'To allow reputers to create new topics',
    ],
    answer: 'To cap the influence of very rich reputers and prevent centralization',
  },
  {
    question: 'What is a "topic" in Allora Network?',
    options: [
      'A type of ALLO token',
      'A sub-network focused on solving a specific AI problem',
      'A reputation score system',
      'A voting mechanism',
    ],
    answer: 'A sub-network focused on solving a specific AI problem',
  },
  {
    question: 'How does Allora ensure user data privacy?',
    options: [
      'By centralizing all data in secure servers',
      'By encrypting data before sharing it with all participants',
      'By letting workers contribute AI predictions without revealing underlying data or models',
      'By not storing any user data at all',
    ],
    answer: 'By letting workers contribute AI predictions without revealing underlying data or models',
  },
  {
    question: 'What role do “reputers” play in the Allora Network?',
    options: [
      'They generate AI predictions',
      "They verify the accuracy of workers' predictions and help maintain consensus",
      'They stake ALLO tokens to run the network',
      'They consume AI insights and pay for them',
    ],
    answer: "They verify the accuracy of workers' predictions and help maintain consensus",
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
  `;

  answerBtns.forEach((btn) => (btn.style.display = 'none'));
  timerElement.textContent = '';
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

  questionDiv.textContent = currentQuestion.question;
  answerBtns.forEach((btn, index) => {
    btn.textContent = currentQuestion.options[index];
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

      setTimeout(() => {
        loadNextQuestion();
      }, 1000);
    }
  }, 1000);
}

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
