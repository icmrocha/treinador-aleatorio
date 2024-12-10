// Carrega dados do Local Storage ou inicializa
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

// Inicializa contadores se não existirem
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
    clearInterval(timer);
    seconds = 0;

    const newExercise = getRandomExercise();
    document.getElementById("exercise").textContent = newExercise;

    // Incrementa contadores
    exerciseCount[newExercise]++;
    totalExercises++;
    saveData();
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
        saveData();
    }, 1000);
}

// Pular para o próximo exercício
function skipExercise() {
    startExercise();
}

// Atualiza a lista de exercícios concluídos
function updateCompletedList() {
    const list = document.getElementById("completed-list");
    list.innerHTML = "<strong>Exercícios Concluídos:</strong><br>";
    for (const [exercise, count] of Object.entries(exerciseCount)) {
        if (count > 0) {
            list.innerHTML += `${exercise}: ${count}<br>`;
        }
    }
    list.innerHTML += `<br><strong>Histórico:</strong><br>`;
    list.innerHTML += `Total de exercícios: ${totalExercises}<br>`;
    const totalMinutes = Math.floor(totalTime / 60);
    const totalSeconds = totalTime % 60;
    list.innerHTML += `Tempo total: ${totalMinutes} min ${totalSeconds} seg`;

    updateExerciseList();
}

// Atualiza a lista de exercícios disponíveis
function updateExerciseList() {
    const exerciseListDiv = document.getElementById("exercise-list");
    exerciseListDiv.innerHTML = ""; 
    exercises.forEach(ex => {
        const div = document.createElement("div");
        div.className = "exercise-item";
        div.innerHTML = `<span>${ex}</span> <button onclick="removeExercise('${ex}')">Remover</button>`;
        exerciseListDiv.appendChild(div);
    });
}

// Adicionar um novo exercício
function addNewExercise() {
    const input = document.getElementById("newExerciseInput");
    const newExerciseName = input.value.trim();
    if (newExerciseName !== "") {
        if (!exercises.includes(newExerciseName)) {
            exercises.push(newExerciseName);
            exerciseCount[newExerciseName] = 0;
            saveData();
            updateCompletedList();
            input.value = "";
            alert(`${newExerciseName} adicionado com sucesso!`);
        } else {
            alert("Este exercício já existe na lista!");
        }
    } else {
        alert("Por favor, insira um nome válido para o exercício.");
    }
}

// Remover um exercício
function removeExercise(exerciseName) {
    // Remove do array exercises
    const index = exercises.indexOf(exerciseName);
    if (index !== -1) {
        exercises.splice(index, 1);
        // Remove do objeto exerciseCount
        delete exerciseCount[exerciseName];
        saveData();
        updateCompletedList();
        alert(`${exerciseName} removido!`);
    }
}

// Salva dados no Local Storage
function saveData() {
    localStorage.setItem("exerciseCount", JSON.stringify(exerciseCount));
    localStorage.setItem("totalExercises", totalExercises);
    localStorage.setItem("totalTime", totalTime);
    localStorage.setItem("exercises", JSON.stringify(exercises));
}

// Carrega dados ao iniciar
window.onload = function() {
    updateCompletedList();
};
