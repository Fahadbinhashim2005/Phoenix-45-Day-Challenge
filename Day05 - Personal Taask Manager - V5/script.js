// =========================
// GLOBAL STATE
// =========================
let tasks = [];
let projects = [];
let selectedDate = null;

// =========================
// TASK DOM ELEMENTS
// =========================

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

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

const searchTask = document.getElementById("searchTask");
const projectFilter = document.getElementById("projectFilter");

// =========================
// PROJECT DOM ELEMENTS
// =========================

const projectContainer =
    document.getElementById("projectContainer");

const projectModal =
    document.getElementById("projectModal");

const newProjectBtn =
    document.getElementById("newProjectBtn");

const closeProjectModal =
    document.getElementById("closeProjectModal");

const createProjectBtn =
    document.getElementById("createProjectBtn");

const projectName =
    document.getElementById("projectName");

const projectDescription =
    document.getElementById("projectDescription");

const sidebarProjectsList =
    document.getElementById(
        "sidebarProjectsList"
    );

    // =========================
// DASHBOARD DOM ELEMENTS
// =========================

const totalTasksElement =
    document.getElementById("totalTasks");

const completedTasksElement =
    document.getElementById("completedTasks");

const pendingTasksElement =
    document.getElementById("pendingTasks");

const inProgressTasksElement =
    document.getElementById("inProgressTasks");

const greeting =
    document.getElementById("greeting");

// =========================
// STORAGE
// =========================

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function loadTasks() {
    tasks =
        JSON.parse(
            localStorage.getItem("tasks")
        ) || [];
}

function saveProjects() {
    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );
}

function loadProjects() {
    projects =
        JSON.parse(
            localStorage.getItem("projects")
        ) || [];
}

// =========================
// GREETING
// =========================

function updateGreeting() {

    const hour =
        new Date().getHours();

    let message =
        "Good Evening";

    if (hour < 12) {
        message =
            "Good Morning";
    } else if (hour < 17) {
        message =
            "Good Afternoon";
    }

    greeting.textContent =
        `${message}, Fahad 🐦‍🔥`;
}

// =========================
// PROJECT DROPDOWNS
// =========================

function updateProjectDropdowns() {

    modalProject.innerHTML =
        `
        <option value="General">
            General
        </option>
    `;

    projectFilter.innerHTML =
        `
        <option value="all">
            All Projects
        </option>
    `;

    projects.forEach(project => {

        modalProject.innerHTML += `
            <option value="${project.name}">
                ${project.name}
            </option>
        `;

        projectFilter.innerHTML += `
            <option value="${project.name}">
                ${project.name}
            </option>
        `;

    });
}

// =========================
// SIDEBAR PROJECTS
// =========================

function renderSidebarProjects() {

    sidebarProjectsList.innerHTML =
        "";

    projects.forEach(project => {

        const li =
            document.createElement("li");

        li.textContent =
            project.name;

        sidebarProjectsList.appendChild(
            li
        );

    });

}

// =========================
// PROJECT RENDERING
// =========================

function renderProjects() {

    projectContainer.innerHTML =
        "";

    if (projects.length === 0) {

        projectContainer.innerHTML =
            "<p>No projects created yet.</p>";

        updateProjectDropdowns();
        renderSidebarProjects();

        return;
    }

    projects.forEach(project => {

        const projectTasks =
            tasks.filter(
                task =>
                    task.project ===
                    project.name
            );

        const totalTasks =
            projectTasks.length;

        const completedTasks =
            projectTasks.filter(
                task =>
                    task.completed
            ).length;

        const pendingTasks =
            totalTasks -
            completedTasks;

        const progressPercent =
            totalTasks === 0
                ? 0
                : Math.round(
                    (
                        completedTasks /
                        totalTasks
                    ) * 100
                );

        const card =
            document.createElement("div");

        card.className =
            "project-card";

        card.innerHTML = `
            <h3>
                💻 ${project.name}
            </h3>

            <p>
                ${project.description ||
                "No Description"}
            </p>

            <div class="project-stats">
                <span>📋 ${totalTasks}</span>
                <span>✅ ${completedTasks}</span>
                <span>⏳ ${pendingTasks}</span>
                <span>📈 ${progressPercent}%</span>
            </div>

            <div class="project-progress">
                <div
                    class="project-progress-fill"
                    style="width:${progressPercent}%"
                ></div>
            </div>

            <button
                class="delete-project-btn">

                🗑 Delete

            </button>
        `;

        projectContainer.appendChild(
            card
        );

    });

    updateProjectDropdowns();
    renderSidebarProjects();

}

// =========================
// TASK RENDERING
// =========================

function renderTasks(filteredTasks = tasks) {

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        updateEmptyMessage();
        return;
    }

    filteredTasks.forEach(task => {

        const taskRow =
            document.createElement("div");

        taskRow.className =
            "task-row";

        taskRow.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">

                <div class="task-main">

                    <span class="task-title">
                        ${task.title}
                    </span>

                    <div class="task-badges">

                        <span class="project-badge">
                            📁 ${task.project}
                        </span>

                        <span class="category-badge">
                            🏷 ${task.category}
                        </span>

                        <span class="priority-badge priority-${task.priority.toLowerCase()}">
                            ${task.priority}
                        </span>

                    </div>

                </div>

            </div>

            <div class="task-meta">

                <span class="task-date">
                    📅 ${task.deadline || "--"}
                </span>

                <button
                    class="delete-btn">

                    🗑

                </button>

            </div>
        `;

        const checkbox =
            taskRow.querySelector(
                ".task-checkbox"
            );

        checkbox.addEventListener(
            "change",
            () => {

                task.completed =
                    checkbox.checked;

                saveTasks();

                renderTasks();

                renderProjects();

                updateStats();

            }
        );

        const deleteBtn =
            taskRow.querySelector(
                ".delete-btn"
            );

        deleteBtn.addEventListener(
            "click",
            () => {

                tasks =
                    tasks.filter(
                        t => t.id !== task.id
                    );

                saveTasks();

                renderTasks();

                renderProjects();

                updateStats();

                updateEmptyMessage();

            }
        );

        taskList.appendChild(
            taskRow
        );

    });

}

// =========================
// TASK CREATION
// =========================

function createTask() {

    if (
        !modalTitle.value.trim()
    ) {
        return;
    }

    const task = {

        id: Date.now(),

        title:
            modalTitle.value.trim(),

        project:
            modalProject.value,

        category:
            modalCategory.value,

        priority:
            modalPriority.value,

        status:
            modalStatus.value,

        deadline:
            modalDeadline.value,

        startTime:
            modalStartTime.value,

        endTime:
            modalEndTime.value,

        notes:
            modalNotes.value,

        completed: false

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    renderProjects();

    updateStats();

    updateEmptyMessage();

    modalTitle.value = "";
    modalDeadline.value = "";
    modalNotes.value = "";

    taskModal.style.display =
        "none";

}

// =========================
// TASK FILTERING
// =========================

function filterTasks() {

    const searchValue =
        searchTask.value
            .toLowerCase()
            .trim();

    const selectedProject =
        projectFilter.value;

    let filtered =
        [...tasks];

    if (selectedProject !== "all") {

        filtered =
            filtered.filter(
                task =>
                    task.project ===
                    selectedProject
            );

    }

    if (searchValue) {

        filtered =
            filtered.filter(
                task =>
                    task.title
                        .toLowerCase()
                        .includes(
                            searchValue
                        )
            );

    }

    renderTasks(filtered);

}

// =========================
// PROJECT CREATION
// =========================

function createProject() {

    if (
        !projectName.value.trim()
    ) {
        return;
    }

    const project = {

        id: Date.now(),

        name:
            projectName.value.trim(),

        description:
            projectDescription.value.trim(),

        createdAt:
            new Date().toISOString()

    };

    projects.push(project);

    saveProjects();

    renderProjects();

    projectName.value = "";
    projectDescription.value = "";

    projectModal.style.display =
        "none";

}

// =========================
// DASHBOARD STATISTICS
// =========================

function updateStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;

    const pending =
        total - completed;

    totalTasksElement.textContent =
        total;

    completedTasksElement.textContent =
        completed;

    pendingTasksElement.textContent =
        pending;

    inProgressTasksElement.textContent =
        pending;

}

// =========================
// EMPTY STATE
// =========================

function updateEmptyMessage() {

    emptyMessage.style.display =
        tasks.length === 0
            ? "block"
            : "none";

}

// =========================
// CALENDAR
// =========================

function renderCalendar() {

    const calendarGrid =
        document.getElementById(
            "calendarGrid"
        );

    const monthYear =
        document.getElementById(
            "monthYear"
        );

    calendarGrid.innerHTML = "";

    const today =
        new Date();

    const currentMonth =
        today.getMonth();

    const currentYear =
        today.getFullYear();

    monthYear.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        );

    const lastDay =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        );

    let startDay =
        firstDay.getDay();

    startDay =
        startDay === 0
            ? 6
            : startDay - 1;

    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const emptyCell =
            document.createElement(
                "div"
            );

        calendarGrid.appendChild(
            emptyCell
        );

    }

    for (
        let day = 1;
        day <= lastDay.getDate();
        day++
    ) {

        const dayCell =
            document.createElement(
                "div"
            );

        dayCell.className =
            "calendar-day";

        dayCell.textContent =
            day;

        if (
            day === today.getDate()
        ) {

            dayCell.classList.add(
                "today"
            );

        }

        dayCell.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".calendar-day"
                    )
                    .forEach(cell =>
                        cell.classList.remove(
                            "selected-day"
                        )
                    );

                dayCell.classList.add(
                    "selected-day"
                );

                selectedDate =
                    `${currentYear}-${String(
                        currentMonth + 1
                    ).padStart(
                        2,
                        "0"
                    )}-${String(
                        day
                    ).padStart(
                        2,
                        "0"
                    )}`;

                modalDeadline.value =
                    selectedDate;

                taskModal.style.display =
                    "flex";

            }
        );

        calendarGrid.appendChild(
            dayCell
        );

    }

}

// =========================
// MODAL HELPERS
// =========================

function openTaskModal() {

    taskModal.style.display =
        "flex";

}

function closeTaskModal() {

    taskModal.style.display =
        "none";

}

function openProjectModal() {

    projectModal.style.display =
        "flex";

}

function closeProjectModalFunction() {

    projectModal.style.display =
        "none";

}

// =========================
// EVENT LISTENERS
// =========================

newTaskBtn.addEventListener(
    "click",
    openTaskModal
);

closeModalBtn.addEventListener(
    "click",
    closeTaskModal
);

createTaskBtn.addEventListener(
    "click",
    createTask
);

newProjectBtn.addEventListener(
    "click",
    openProjectModal
);

closeProjectModal.addEventListener(
    "click",
    closeProjectModalFunction
);

createProjectBtn.addEventListener(
    "click",
    createProject
);

searchTask.addEventListener(
    "input",
    filterTasks
);

projectFilter.addEventListener(
    "change",
    filterTasks
);

window.addEventListener(
    "click",
    event => {

        if (
            event.target === taskModal
        ) {

            closeTaskModal();

        }

        if (
            event.target === projectModal
        ) {

            closeProjectModalFunction();

        }

    }
);

// =========================
// INITIALIZATION
// =========================

loadTasks();

loadProjects();

updateGreeting();

renderTasks();

renderProjects();

renderCalendar();

updateStats();

updateEmptyMessage();