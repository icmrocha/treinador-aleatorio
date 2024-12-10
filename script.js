// Carrega os dados do Local Storage (ou inicializa se for a primeira vez)
let exercises = JSON.parse(localStorage.getItem("exercises")) || [
    "Flexões",
    "Agachamentos",
    "Abdominais",
    "Prancha",
    "Burpees",
    "Polichinelos",
    "Corrida no lugar",
    "Pular corda"
];

let exerciseCount = JSON.parse(localStorage.getItem("exerciseCount")) || {};
let totalExercises = parseInt(localStorage.getItem("totalExercises")) || 0;
let totalTime = parseInt(localStorage.getItem("totalTime")) || 0;

// Inicializa contadores dos exercícios se não existirem
exercises.forEach(exercise => {
    if (!exerciseCount[exercise]) {
        exerciseCount[exercise] = 0;
    }
});

let timer;
let seconds = 0;

// Escolhe um exercício aleatório
function getRandomExercise() {
    return exercises[Math.floor(Math.random() * exercises.length)];
}

// Inicia um novo exercício
function startExercise() {
    clearInterval(timer); // Para o timer anterior
    seconds = 0;

    const newExercise = getRandomExercise();
    document.getElementById("exercise").textContent = newExercise;

    // Incrementa contadores
    exerciseCount[newExercise]++;
    totalExercises++;
    saveData(); // Salva os dados no Local Storage
    updateCompletedList();
    startTimer();
}

// Timer para acompanhar o tempo
function startTimer() {
    const timerDisplay = document.getElementById("timer");
    timer = setInterval(() => {
        seconds++;
        totalTime++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `Timer: ${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        saveData(); // Atualiza o tempo total no Local Storage
    }, 1000);
}

// Pula para o próximo exercício
function skipExercise() {
    startExercise(); // Reinicia com um novo exercício
}

// Atualiza a lista de exercícios concluídos na tela
function updateCompletedList() {
    const list = document.getElementById("completed-list");
    list.innerHTML = "<strong>Exercícios Concluídos:</strong><br>";
    for (const [exercise, count] of Object.entries(exerciseCount)) {
        if (count > 0) {
            list.innerHTML += `${exercise}: ${count}<br>`;
        }
    }
    // Adiciona o histórico total
    list.innerHTML += `<br><strong>Histórico:</strong><br>`;
    list.innerHTML += `Total de exercícios: ${totalExercises}<br>`;
    const totalMinutes = Math.floor(totalTime / 60);
    const totalSeconds = totalTime % 60;
    list.innerHTML += `Tempo total: ${totalMinutes} min ${totalSeconds} seg`;
}

// Função para salvar dados no Local Storage
function saveData() {
    localStorage.setItem("exerciseCount", JSON.stringify(exerciseCount));
    localStorage.setItem("totalExercises", totalExercises);
    localStorage.setItem("totalTime", totalTime);
    localStorage.setItem("exercises", JSON.stringify(exercises));
}

// Carrega os dados ao inicializar a página
window.onload = function() {
    updateCompletedList(); // Atualiza a lista ao carregar a página
};

// Adicionar novo exercício
function addNewExercise() {
    const input = document.getElementById("newExerciseInput");
    const newExerciseName = input.value.trim();
    if (newExerciseName !== "") {
        // Verifica se já existe
        if (!exercises.includes(newExerciseName)) {
            exercises.push(newExerciseName);
            exerciseCount[newExerciseName] = 0;
            saveData();
            updateCompletedList();
            input.value = ""; // limpa o campo
            alert(`${newExerciseName} adicionado com sucesso!`);
        } else {
            alert("Este exercício já existe na lista!");
        }
    } else {
        alert("Por favor, insira um nome válido para o exercício.");
    }
}
