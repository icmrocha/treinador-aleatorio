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
        // Adicionamos mais um botão "Atualizar"
        div.innerHTML = `
            <span>${ex}</span>
            <div>
                <button onclick="updateExercise('${ex}')">Atualizar</button>
                <button onclick="removeExercise('${ex}')">Remover</button>
            </div>
        `;
        exerciseListDiv.appendChild(div);
    });
}

// Função para atualizar nome de um exercício
function updateExercise(exerciseName) {
    const newName = prompt("Digite o novo nome para o exercício:", exerciseName);
    if (newName && newName.trim() !== "") {
        const trimmedName = newName.trim();

        // Verifica se o exercício já existe
        if (exercises.includes(trimmedName) && trimmedName !== exerciseName) {
            alert("Já existe um exercício com esse nome!");
            return;
        }

        // Encontra o índice do exercício atual
        const index = exercises.indexOf(exerciseName);
        if (index !== -1) {
            // Atualiza o nome do exercício na lista
            exercises[index] = trimmedName;

            // Atualiza o objeto exerciseCount (transfere o contador)
            exerciseCount[trimmedName] = exerciseCount[exerciseName];
            delete exerciseCount[exerciseName];

            saveData();
            updateCompletedList();
            alert(`Exercício atualizado para: ${trimmedName}`);
        }
    } else {
        alert("Nome inválido! O exercício não foi atualizado.");
    }
}

// Função para remover um exercício
function removeExercise(exerciseName) {
    const index = exercises.indexOf(exerciseName);
    if (index !== -1) {
        exercises.splice(index, 1);
        delete exerciseCount[exerciseName];
        saveData();
        updateCompletedList();
        alert(`${exerciseName} removido!`);
    }
}


// Resetar estatísticas
function resetStats() {
    // Zera as estatísticas
    totalExercises = 0;
    totalTime = 0;
    // Zera os contadores dos exercícios existentes
    for (const ex of exercises) {
        exerciseCount[ex] = 0;
    }
    saveData();
    updateCompletedList();
    alert("Estatísticas resetadas com sucesso!");
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
