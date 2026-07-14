// Questions configuration
const questions = [
    {
        id: 1,
        type: 'choice',
        question: 'Qual é seu principal objetivo?',
        options: ['Emagrecer', 'Ganhar massa muscular', 'Definir o corpo', 'Melhorar condicionamento físico', 'Melhorar saúde']
    },
    {
        id: 2,
        type: 'choice',
        question: 'Qual sua idade?',
        options: ['18 a 35 anos', '36 a 50 anos', 'Acima de 50 anos']
    },
    {
        id: 3,
        type: 'choice',
        question: 'Qual seu sexo?',
        options: ['Masculino', 'Feminino']
    },
    {
        id: 4,
        type: 'choice',
        question: 'Como você se considera hoje?',
        options: [
            'Nunca treinei musculação.',
            'Sou iniciante e ainda estou aprendendo os exercícios.',
            'Já treino regularmente e conheço praticamente todos os aparelhos.',
            'Treino há anos, domino os exercícios e utilizo técnicas avançadas.'
        ],
        scores: [0, 1, 2, 3]
    },
    {
        id: 5,
        type: 'choice',
        question: 'Você consegue executar corretamente exercícios como: Agachamento, Supino, Levantamento Terra, Desenvolvimento?',
        options: [
            'Nunca fiz.',
            'Tenho dificuldade.',
            'Faço corretamente.',
            'Domino todos.'
        ],
        scores: [0, 1, 2, 3]
    },
    {
        id: 6,
        type: 'choice',
        question: 'Quantos dias por semana consegue treinar?',
        options: ['3 dias', '4 dias', '5 dias']
    },
    {
        id: 7,
        type: 'choice',
        question: 'Quanto tempo consegue treinar por dia?',
        options: ['Até 45 minutos', 'Entre 45 e 60 minutos', 'Mais de 60 minutos']
    },
    {
        id: 8,
        type: 'choice',
        question: 'Você possui alguma limitação?',
        options: ['Não', 'Joelho', 'Coluna', 'Ombro', 'Quadril', 'Outra']
    },
    {
        id: 9,
        type: 'numeric',
        question: 'Informe seu peso.',
        placeholder: 'Ex: 75',
        suffix: 'kg'
    },
    {
        id: 10,
        type: 'numeric',
        question: 'Informe sua altura.',
        placeholder: 'Ex: 175',
        suffix: 'cm'
    }
];

// App State
let currentQuestionIndex = 0;
let userAnswers = {};

// DOM Elements
const landingView = document.getElementById('landing-view');
const quizView = document.getElementById('quiz-view');
const loadingView = document.getElementById('loading-view');
const resultView = document.getElementById('result-view');

const btnStartQuiz = document.getElementById('btn-start-quiz');
const btnStartQuizTriggers = document.querySelectorAll('.btn-start-quiz-trigger');
const btnQuizPrev = document.getElementById('btn-quiz-prev');
const btnQuizNext = document.getElementById('btn-quiz-next');

const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const numericContainer = document.getElementById('numeric-container');
const numericInput = document.getElementById('numeric-input');
const inputSuffixText = document.getElementById('input-suffix-text');

const quizQuestionCounter = document.getElementById('quiz-question-counter');
const quizPercentage = document.getElementById('quiz-percentage');
const quizProgressFill = document.getElementById('quiz-progress-fill');

const quizBodyContainer = document.getElementById('quiz-body-container');
const loadingMessage = document.getElementById('loading-message');

// Navigation functions
function showView(view) {
    [landingView, quizView, loadingView, resultView].forEach(v => v.classList.remove('active'));
    view.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event Listeners for Start
btnStartQuiz.addEventListener('click', startQuiz);
btnStartQuizTriggers.forEach(btn => btn.addEventListener('click', startQuiz));

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = {};
    showView(quizView);
    renderQuestion();
}

// Render question based on current index
function renderQuestion() {
    quizBodyContainer.classList.add('fade-hidden');
    
    setTimeout(() => {
        const questionData = questions[currentQuestionIndex];
        
        // Update progress
        const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
        quizQuestionCounter.textContent = `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`;
        quizPercentage.textContent = `${progressPercent}%`;
        quizProgressFill.style.width = `${progressPercent}%`;
        
        // Set title
        questionTitle.textContent = questionData.question;
        
        // Reset/Toggle Container Visibility
        if (questionData.type === 'choice') {
            optionsContainer.style.display = 'flex';
            numericContainer.style.display = 'none';
            renderOptions(questionData);
        } else {
            optionsContainer.style.display = 'none';
            numericContainer.style.display = 'block';
            renderNumeric(questionData);
        }

        // Toggle back button visibility
        if (currentQuestionIndex === 0) {
            btnQuizPrev.style.visibility = 'hidden';
        } else {
            btnQuizPrev.style.visibility = 'visible';
        }
        
        // Fade in
        quizBodyContainer.classList.remove('fade-hidden');
    }, 250);
}

// Render multiple choice options
function renderOptions(questionData) {
    optionsContainer.innerHTML = '';
    
    questionData.options.forEach((option, idx) => {
        const card = document.createElement('div');
        card.className = 'option-card';
        if (userAnswers[questionData.id] === option) {
            card.classList.add('selected');
        }
        
        card.innerHTML = `
            <div class="option-check"></div>
            <span>${option}</span>
        `;
        
        card.addEventListener('click', () => {
            // Unselect all
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Save answer
            userAnswers[questionData.id] = option;
            
            // Auto advance on choice selection after a tiny delay for feel
            setTimeout(() => {
                handleNext();
            }, 300);
        });
        
        optionsContainer.appendChild(card);
    });
}

// Render numeric fields
function renderNumeric(questionData) {
    numericInput.value = userAnswers[questionData.id] || '';
    numericInput.placeholder = questionData.placeholder;
    inputSuffixText.textContent = questionData.suffix;
    numericInput.focus();
}

// Navigation Controls
btnQuizPrev.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
});

btnQuizNext.addEventListener('click', handleNext);

function handleNext() {
    const questionData = questions[currentQuestionIndex];
    
    // Verify answer
    if (questionData.type === 'numeric') {
        const val = numericInput.value.trim();
        if (!val || isNaN(val) || Number(val) <= 0) {
            alert('Por favor, insira um valor válido.');
            return;
        }
        userAnswers[questionData.id] = Number(val);
    } else {
        // If not selected, alert
        if (!userAnswers[questionData.id]) {
            alert('Por favor, selecione uma opção para continuar.');
            return;
        }
    }
    
    // Check if end
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        processQuizResults();
    }
}

// Process results & run scoring algorithm
function processQuizResults() {
    showView(loadingView);
    
    // 4-second loading message animation steps
    const loadingSteps = [
        "Analisando seu perfil…",
        "Identificando seu nível…",
        "Comparando suas respostas…",
        "Encontrando o melhor protocolo…",
        "Gerando sua recomendação personalizada…"
    ];
    
    let step = 0;
    const interval = setInterval(() => {
        step++;
        if (step < loadingSteps.length) {
            loadingMessage.textContent = loadingSteps[step];
        }
    }, 800);
    
    setTimeout(() => {
        clearInterval(interval);
        showResults();
    }, 4000);
}

// Core Scoring Algorithm and UI Update
function showResults() {
    // 1. Calculate Score (Q4 + Q5)
    // Q4 is question index 3 (id: 4)
    // Q5 is question index 4 (id: 5)
    const q4Answer = userAnswers[4];
    const q5Answer = userAnswers[5];
    
    const q4Data = questions[3];
    const q5Data = questions[4];
    
    const q4Idx = q4Data.options.indexOf(q4Answer);
    const q5Idx = q5Data.options.indexOf(q5Answer);
    
    const scoreQ4 = q4Data.scores[q4Idx];
    const scoreQ5 = q5Data.scores[q5Idx];
    
    const totalScore = scoreQ4 + scoreQ5;
    
    // Decide level (BRONZE, PRATA, OURO)
    let level = 'BRONZE';
    let levelDesc = 'Ideal para quem está construindo sua base, aprendendo técnica e buscando evolução com segurança.';
    
    if (totalScore >= 3 && totalScore <= 4) {
        level = 'PRATA';
        levelDesc = 'Ideal para quem já possui experiência e deseja acelerar os resultados com uma estrutura mais completa.';
    } else if (totalScore >= 5) {
        level = 'OURO';
        levelDesc = 'Ideal para praticantes avançados que já dominam os exercícios e buscam máxima performance.';
    }
    
    // Gender & Frequency details
    const gender = userAnswers[3]; // Masculino/Feminino
    const frequency = userAnswers[6]; // 3 dias, 4 dias, 5 dias
    
    // Final protocol name
    const finalProtocol = `Método Prata: ${level} ${gender} (${frequency})`;
    
    // Update Results UI
    document.getElementById('res-objective').textContent = userAnswers[1];
    document.getElementById('res-age').textContent = userAnswers[2];
    document.getElementById('res-sex').textContent = gender;
    document.getElementById('res-level').textContent = level;
    document.getElementById('res-days').textContent = frequency;
    document.getElementById('res-time').textContent = userAnswers[7];
    
    document.getElementById('res-protocol-name').textContent = finalProtocol;
    document.getElementById('res-protocol-desc').textContent = levelDesc;
    
    // Customise card accent glow / border color based on category
    const protocolCard = document.getElementById('protocol-card-element');
    if (level === 'OURO') {
        protocolCard.style.borderColor = '#ffd700'; // Gold border
        document.querySelector('.protocol-badge').style.backgroundColor = '#ffd700';
    } else if (level === 'PRATA') {
        protocolCard.style.borderColor = '#c0c0c0'; // Silver border
        document.querySelector('.protocol-badge').style.backgroundColor = '#c0c0c0';
    } else {
        protocolCard.style.borderColor = '#cd7f32'; // Bronze border
        document.querySelector('.protocol-badge').style.backgroundColor = '#cd7f32';
    }
    
    // 2. Save submission to local storage (our local DB)
    const submission = {
        timestamp: new Date().toISOString(),
        objective: userAnswers[1],
        age: userAnswers[2],
        sex: gender,
        level: level,
        frequency: frequency,
        time: userAnswers[7],
        limitations: userAnswers[8],
        weight: userAnswers[9],
        height: userAnswers[10],
        recommendedProtocol: finalProtocol
    };
    
    saveSubmissionToDB(submission);
    
    showView(resultView);
}

// Database helper (Save locally, with custom API extension placeholder)
function saveSubmissionToDB(submission) {
    // Save to localStorage for admin panel compatibility out-of-the-box
    let submissions = JSON.parse(localStorage.getItem('quiz_submissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('quiz_submissions', JSON.stringify(submissions));
    
    // EXTREMELY EASY INTEGRATION EXTENSION:
    // If you want to connect to a real database (e.g., Supabase, Google Sheets Webhook, etc.),
    // you can insert a fetch call right here:
    /*
    fetch('YOUR_WEBHOOK_OR_API_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
    }).catch(err => console.log('Database sync offline/placeholder:', err));
    */
}

// Checkout Button functionality
document.getElementById('btn-checkout').addEventListener('click', () => {
    // Change this URL to your hotmart / checkout link. 
    // You can also append details as query parameters to customize the cart!
    const checkoutUrl = 'https://pay.hotmart.com/YOUR_PRODUCT_ID';
    window.location.href = checkoutUrl;
});
