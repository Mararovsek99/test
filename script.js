document.getElementById("start-btn").addEventListener("click", startQuiz);

const questions = [
    { question: "Kaj pride pred številko 10?", answers: ["8", "9", "11", "12"] },
    { question: "Kaj je rezultat 5 + 3 * 2?", answers: ["16", "13", "10", "11"] },
    { question: "Kako se reče kocki v angleščini?", answers: ["Block", "Cube", "Square", "Dice"] },
    { question: "Koliko nog ima pajek?", answers: ["6", "8", "10", "12"] },
    { question: "Koliko črk ima beseda 'programiranje'?", answers: ["11", "12", "13", "14"] }
];

let currentQuestion = 0;
let timeLeft = 30;
let timer;

function startQuiz() {
    document.getElementById("start-btn").classList.add("hidden");
    document.getElementById("timer").classList.remove("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);

    showQuestion();
}

function showQuestion() {
    if (currentQuestion < questions.length) {
        let q = questions[currentQuestion];
        document.getElementById("question").textContent = q.question;
        
        let answersDiv = document.getElementById("answers");
        answersDiv.innerHTML = "";
        
        q.answers.forEach(answer => {
            let btn = document.createElement("button");
            btn.textContent = answer;
            btn.onclick = nextQuestion;
            answersDiv.appendChild(btn);
        });
    } else {
        clearInterval(timer);
        showResult();
    }
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function showResult() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
}
