let tasks = [];

const taskList = document.getElementById("taskList");
const newTaskBtn = document.getElementById("newTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModalBtn");

const createTaskBtn = document.getElementById("createTaskBtn");

const modalTitle = document.getElementById("modalTitle");
const modalProject = document.getElementById("modalProject");
const modalCategory = document.getElementById("modalCategory");
const modalPriority = document.getElementById("modalPriority");
const modalStatus = document.getElementById("modalStatus");
const modalDeadline = document.getElementById("modalDeadline");
const modalStartTime = document.getElementById("modalStartTime");
const modalEndTime = document.getElementById("modalEndTime");
const modalNotes = document.getElementById("modalNotes");

newTaskBtn.addEventListener("click", () => {
    taskModal.style.display = "flex";
});
closeModalBtn.addEventListener("click", () => {
    taskModal.style.display = "none";
});
window.addEventListener("click", event => {
    if (event.target === taskModal) {
        taskModal.style.display = "none";
    }
});

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const taskRow = document.createElement("div");
        taskRow.className = "task-row";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
            updateStats();
        });
        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;
        if (task.completed) {
            title.style.textDecoration = "line-through";
            title.style.opacity = "0.6";
        }
        const category = document.createElement("span");
        category.className = "task-category";
        category.textContent = task.category;
        const priority = document.createElement("span");
        priority.className = `priority-dot ${task.priority.toLowerCase()}`;
        const deadline = document.createElement("span");
        deadline.className = "task-deadline";
        deadline.textContent =
            task.deadline || "--";
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑";
        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
            updateStats();
            updateEmptyMessage();
        });
        taskRow.appendChild(checkbox);
        taskRow.appendChild(title);
        taskRow.appendChild(category);
        taskRow.appendChild(priority);
        taskRow.appendChild(deadline);
        taskRow.appendChild(deleteBtn);
        taskList.appendChild(taskRow);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

const hour = new Date().getHours();

let greeting = "";

if (hour < 12) {
    greeting = "Good Morning, Fahad 🌅";
} else if (hour < 16) {
    greeting = "Good Afternoon, Fahad 🌞";
} else if (hour < 19) {
    greeting = "Good Evening, Fahad 🌇";
} else {
    greeting = "Good Night, Fahad 🌛";
}

document.getElementById("greeting").textContent = greeting;

function updateStats() {
    document.getElementById("totalTasks").textContent = tasks.length;

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);

    document.getElementById("completedTasks").textContent = completedTasks.length;
    document.getElementById("pendingTasks").textContent = pendingTasks.length;
    document.getElementById("inProgressTasks").textContent = pendingTasks.length;

    const progressPercent =
        tasks.length === 0
            ? 0
            : Math.round((completedTasks.length / tasks.length) * 100);

    document.getElementById("progressPercent").textContent =
        `${progressPercent}%`;
}

function updateEmptyMessage() {
    const emptyMessage = document.getElementById("emptyMessage");

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";
}

document.getElementById("todayDate").textContent =
    new Date().toDateString();

createTaskBtn.addEventListener("click", () => {
    if (!modalTitle.value.trim()) return;
    const task = {
        id: Date.now(),
        title: modalTitle.value.trim(),
        project: modalProject.value,
        category: modalCategory.value,
        priority: modalPriority.value,
        status: modalStatus.value,
        deadline: modalDeadline.value,
        startTime: modalStartTime.value,
        endTime: modalEndTime.value,
        notes: modalNotes.value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    updateEmptyMessage();
    taskModal.style.display = "none";
    console.log(task);
});

loadTasks();
renderTasks();
updateStats();
updateEmptyMessage();