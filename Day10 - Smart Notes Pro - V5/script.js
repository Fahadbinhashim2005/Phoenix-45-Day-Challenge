let notes = JSON.parse(localStorage.getItem("notes")) || [];

notes = notes.map(note => ({
    deleted: note.deleted ?? false,
    pinned: note.pinned ?? false,
    summary: note.summary || generateSummary(note.content || ""),
    tags: note.tags || generateTags(
        note.title || "",
        note.content || "",
        note.category || "General"
    ),
    mood: note.mood || detectMood(note.content || ""),
    ...note
}));

let editingNoteId = null;
let currentView = "all";

const notesGrid = document.getElementById("notesGrid");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteModal = document.getElementById("noteModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteCategory = document.getElementById("noteCategory");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const modalTitle = document.getElementById("modalTitle");
const filterButtons = document.querySelectorAll(".filter-btn");
const trashBtn = document.getElementById("trashBtn");
const allCount = document.getElementById("allCount");
const projectsCount = document.getElementById("projectsCount");
const studyCount = document.getElementById("studyCount");
const personalCount = document.getElementById("personalCount");
const ideasCount = document.getElementById("ideasCount");
const themeBtn = document.getElementById("themeBtn");

const downloadBtn = document.getElementById("downloadBtn");
const downloadModal = document.getElementById("downloadModal");
const closeDownloadModalBtn = document.getElementById("closeDownloadModalBtn");
const downloadTxtBtn = document.getElementById("downloadTxtBtn");
const downloadJsonBtn = document.getElementById("downloadJsonBtn");

const savedTheme = localStorage.getItem("theme");

summary.classList.add("ai-summary");
tags.classList.add("ai-tags");
mood.classList.add("ai-mood");

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-theme")
            ? "dark"
            : "light"
    );
});

addNoteBtn.addEventListener("click", () => {
    editingNoteId = null;
    modalTitle.textContent = "New Note";
    noteTitle.value = "";
    noteContent.value = "";
    noteCategory.value = "Projects";
    noteModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    noteModal.classList.add("hidden");
});

downloadBtn.addEventListener("click", () => {
    downloadModal.classList.remove("hidden");
});

closeDownloadModalBtn.addEventListener("click", () => {
    downloadModal.classList.add("hidden");
});

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );

    renderNotes(filtered);
});

sortSelect.addEventListener("change", () => {
    if (sortSelect.value === "newest") {
        notes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else {
        notes.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    }

    saveToLocalStorage();
    renderNotes();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "All") {
            currentView = "all";
            renderNotes();
            return;
        }

        renderNotes(
            notes.filter(note =>
                note.category === category
            )
        );
    });
});

trashBtn.addEventListener("click", () => {
    currentView = "trash";
    renderNotes(
        notes.filter(note => note.deleted)
    );
});

saveNoteBtn.addEventListener("click", () => {
    if (
        noteTitle.value.trim() === "" ||
        noteContent.value.trim() === ""
    ) {
        alert("Please fill in all details");
        return;
    }

    if (editingNoteId !== null) {
        const noteToEdit = notes.find(
            note => note.id === editingNoteId
        );

        noteToEdit.title = noteTitle.value;
        noteToEdit.content = noteContent.value;
        noteToEdit.category = noteCategory.value;

        noteToEdit.summary = generateSummary(
            noteContent.value
        );

        noteToEdit.tags = generateTags(
            noteTitle.value,
            noteContent.value,
            noteCategory.value
        );

        noteToEdit.mood = detectMood(
            noteContent.value
        );

        editingNoteId = null;
        modalTitle.textContent = "New Note";
    } else {
        notes.push({
            id: Date.now(),
            title: noteTitle.value,
            content: noteContent.value,
            category: noteCategory.value,
            createdAt: Date.now(),
            pinned: false,
            deleted: false,
            summary: generateSummary(noteContent.value),
            tags: generateTags(
                noteTitle.value,
                noteContent.value,
                noteCategory.value
            ),
            mood: detectMood(noteContent.value)
        });
    }

    saveToLocalStorage();
    renderNotes();

    noteModal.classList.add("hidden");

    noteTitle.value = "";
    noteContent.value = "";
    noteCategory.value = "Projects";
});

downloadJsonBtn.addEventListener("click", () => {
    const blob = new Blob(
        [JSON.stringify(notes, null, 2)],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "smart-notes.json";
    a.click();

    URL.revokeObjectURL(url);

    downloadModal.classList.add("hidden");
});

downloadTxtBtn.addEventListener("click", () => {
    let text = "";

    notes.forEach(note => {
        text += `Title: ${note.title}\n`;
        text += `Category: ${note.category}\n`;
        text += `Summary: ${note.summary}\n`;
        text += `Mood: ${note.mood}\n`;
        text += `Tags: ${(note.tags || []).join(", ")}\n`;
        text += `Created: ${formatDate(note.createdAt)}\n`;
        text += `Content:\n${note.content}\n`;
        text += "\n----------------------------------------\n\n";
    });

    const blob = new Blob(
        [text],
        {
            type: "text/plain"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "smart-notes.txt";
    a.click();

    URL.revokeObjectURL(url);

    downloadModal.classList.add("hidden");
});
function parseMarkdown(text) {
    return text
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/\n/g, "<br>");
}

function renderNotes(notesToRender = notes) {
    updateStats();
    notesGrid.innerHTML = "";

    if (currentView !== "trash") {
        notesToRender = notesToRender.filter(note => !note.deleted);
    }

    const searchTerm = searchInput.value.trim();

    if (notesToRender.length === 0) {
        notesGrid.innerHTML = `
            <div class="empty-state">
                <h2>📝 No Notes Found</h2>
                <p>Create a new note to get started.</p>
            </div>
        `;
        return;
    }

    notesToRender.sort((a, b) => Number(b.pinned) - Number(a.pinned));

    notesToRender.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.classList.add(
            "note-card",
            note.category.toLowerCase()
        );

        const title = document.createElement("h3");

        if (note.pinned) {
            title.innerHTML = `📌 ${highlightText(
                note.title,
                searchTerm
            )}`;

            title.style.cursor = "pointer";

            title.addEventListener("click", () => {
                note.pinned = false;
                saveToLocalStorage();
                renderNotes();
            });

        } else {
            title.innerHTML = highlightText(
                note.title,
                searchTerm
            );
        }

        const content = document.createElement("p");
        content.innerHTML = parseMarkdown(
            highlightText(
                note.content,
                searchTerm
            )
        );

        const summary = document.createElement("small");
        summary.textContent =
            "📝 " + (note.summary || "");

        const tags = document.createElement("small");
        tags.textContent =
            "🏷️ " + (note.tags || []).join(", ");

        const mood = document.createElement("small");
        mood.textContent =
            "😊 " + (note.mood || "😌 Normal");

        const timestamp = document.createElement("small");
        timestamp.classList.add("note-date");
        timestamp.textContent = formatDate(
            note.createdAt || Date.now()
        );

        const pinBtn = document.createElement("button");
        pinBtn.classList.add("pin-btn");
        pinBtn.textContent = note.pinned ? "📌" : "📍";

        pinBtn.addEventListener("click", () => {
            note.pinned = !note.pinned;
            saveToLocalStorage();
            renderNotes();
        });

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "✏️";

        editBtn.addEventListener("click", () => {

            editingNoteId = note.id;

            noteTitle.value = note.title;
            noteContent.value = note.content;
            noteCategory.value = note.category;

            modalTitle.textContent = "Edit Note";

            noteModal.classList.remove("hidden");

        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "🗑️";

        deleteBtn.addEventListener("click", () => {

            if (currentView === "trash") {

                notes = notes.filter(
                    currentNote =>
                        currentNote.id !== note.id
                );

            } else {

                note.deleted = true;

            }

            saveToLocalStorage();

            if (currentView === "trash") {

                renderNotes(
                    notes.filter(
                        currentNote =>
                            currentNote.deleted
                    )
                );

            } else {

                renderNotes();

            }

        });

        const restoreBtn = document.createElement("button");
        restoreBtn.classList.add("restore-btn");
        restoreBtn.textContent = "♻️";

        restoreBtn.addEventListener("click", () => {

            note.deleted = false;

            saveToLocalStorage();

            renderNotes(
                notes.filter(
                    currentNote =>
                        currentNote.deleted
                )
            );

        });

        const actionsDiv =
            document.createElement("div");

        actionsDiv.classList.add("card-actions");

        if (currentView === "trash") {

            actionsDiv.appendChild(restoreBtn);
            actionsDiv.appendChild(deleteBtn);

        } else {

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

        }

        noteCard.appendChild(title);
        noteCard.appendChild(content);
        noteCard.appendChild(summary);
        noteCard.appendChild(tags);
        noteCard.appendChild(mood);
        noteCard.appendChild(timestamp);

        if (
            !note.pinned &&
            currentView !== "trash"
        ) {
            noteCard.appendChild(pinBtn);
        }

        noteCard.appendChild(actionsDiv);

        notesGrid.appendChild(noteCard);
    });
}

function highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");

    return text.replace(regex, "<mark>$1</mark>");
}

function updateStats() {
    allCount.textContent = notes.filter(
        note => !note.deleted
    ).length;

    projectsCount.textContent = notes.filter(
        note =>
            note.category === "Projects" &&
            !note.deleted
    ).length;

    studyCount.textContent = notes.filter(
        note =>
            note.category === "Study" &&
            !note.deleted
    ).length;

    personalCount.textContent = notes.filter(
        note =>
            note.category === "Personal" &&
            !note.deleted
    ).length;

    ideasCount.textContent = notes.filter(
        note =>
            note.category === "Ideas" &&
            !note.deleted
    ).length;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);

    const today = new Date();

    if (
        date.toDateString() ===
        today.toDateString()
    ) {
        return "Today";
    }

    const yesterday = new Date();

    yesterday.setDate(
        today.getDate() - 1
    );

    if (
        date.toDateString() ===
        yesterday.toDateString()
    ) {
        return "Yesterday";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}

function generateSummary(content) {
    if (content.length <= 60) {
        return content;
    }

    return (
        content.substring(0, 60) + "..."
    );
}

function generateTags(
    title,
    content,
    category
) {
    const text = (
        title +
        " " +
        content
    ).toLowerCase();

    const tags = [];

    if (text.includes("react"))
        tags.push("React");

    if (text.includes("javascript"))
        tags.push("JavaScript");

    if (text.includes("html"))
        tags.push("HTML");

    if (text.includes("css"))
        tags.push("CSS");

    if (text.includes("study"))
        tags.push("Study");

    if (text.includes("project"))
        tags.push("Project");

    if (text.includes("gym"))
        tags.push("Fitness");

    if (text.includes("idea"))
        tags.push("Idea");

    tags.push(category);

    return [...new Set(tags)];
}

function detectMood(content) {
    const text =
        content.toLowerCase();

    if (
        text.includes("study") ||
        text.includes("learn")
    ) {
        return "📚 Learning";
    }

    if (
        text.includes("idea")
    ) {
        return "💡 Creative";
    }

    if (
        text.includes("urgent")
    ) {
        return "🔥 Urgent";
    }

    if (
        text.includes("happy") ||
        text.includes("great")
    ) {
        return "😊 Positive";
    }

    return "😌 Normal";
}

function saveToLocalStorage() {
    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );
}

renderNotes();