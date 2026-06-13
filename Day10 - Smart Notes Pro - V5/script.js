let notes = JSON.parse(localStorage.getItem("notes")) || [];
notes = notes.map(note => ({
    deleted: false,
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
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
}

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNotes = notes.filter(note => {
        return(
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
    });
    renderNotes(filteredNotes);
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});
addNoteBtn.addEventListener("click", () => {
    noteModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    noteModal.classList.add("hidden");
});

saveNoteBtn.addEventListener("click", () => {
    if(
        noteTitle.value.trim() === "" ||
        noteContent.value.trim() === ""
    ){
        alert("Please fill in all details");
        return;
    }

    if (editingNoteId !== null) {
        const noteToEdit = notes.find(note => {
            return note.id === editingNoteId;
        });
        editingNoteId = null;
        modalTitle.textContent = "New note";
        noteToEdit.title = noteTitle.value;
        noteToEdit.content = noteContent.value;
        noteToEdit.category = noteCategory.value;
    }
    else{
        const newNote = {
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
        };
        notes.push(newNote);
    }
    saveToLocalStorage();
    renderNotes();

    noteModal.classList.add("hidden");
    noteTitle.value = "";
    noteContent.value = "";
    noteCategory.value = "Projects";
});

sortSelect.addEventListener("change", () => {
    if(sortSelect.value === "newest"){
        notes.sort((a,b) => {
            return (b.createdAt || 0) - (a.createdAt || 0);
        });
    }else{
        notes.sort((a,b) => {
            return (a.createdAt || 0) - (b.createdAt || 0);
        })
    }
    saveToLocalStorage();
    renderNotes();
})

filterButtons.forEach(button => {
    button.addEventListener("click", () =>{
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });
        button.classList.add("active");
        const category = button.dataset.category;
        if(category === "All"){
            currentView = "all";
            renderNotes();
            return;
        }
        const filteredNotes = notes.filter(note => {
            return note.category === category;
        });
        renderNotes(filteredNotes);
    });
});
trashBtn.addEventListener("click", () => {
    currentView = "trash";
    const trashedNotes = notes.filter(note => {
        return note.deleted;
    });
    renderNotes(trashedNotes);
});

function highlightText(text, searchTerm){
    if(!searchTerm){
        return text;
    }
    const regex = new RegExp(
        `(${searchTerm})`,
        "gi"
    );
    return text.replace(
        regex,
        "<mark>$1</mark>"
    );
}
function updateStats() {
    allCount.textContent = notes.filter(note => !note.deleted).length;
    projectsCount.textContent = notes.filter(note =>
        note.category === "Projects" && !note.deleted
    ).length;
    studyCount.textContent = notes.filter(note =>
        note.category === "Study" && !note.deleted
    ).length;
    personalCount.textContent = notes.filter(note =>
        note.category === "Personal" && !note.deleted
    ).length;
    ideasCount.textContent = notes.filter(note =>
        note.category === "Ideas" && !note.deleted
    ).length;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function renderNotes(notesToRender = notes){
    updateStats();
    notesGrid.innerHTML = "";
    if (currentView !== "trash") {
        notesToRender = notesToRender.filter(note => {
            return !note.deleted;
        });
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
    notesToRender.sort((a, b) => {
        return Number(b.pinned) - Number(a.pinned);
    });
    notesToRender.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note-card");
        noteCard.classList.add(
            note.category.toLowerCase()
        );
        const title = document.createElement("h3");
        if(note.pinned){
            title.innerHTML =`📌 ${highlightText(note.title,searchTerm)}`;
            title.style.cursor = "pointer";
            title.addEventListener("click", () => {
                note.pinned = false;
                saveToLocalStorage();
                renderNotes();
            });
        }
        else{
            title.innerHTML =highlightText(note.title,searchTerm);
        }
        const content = document.createElement("p");
        content.innerHTML = highlightText(note.content,searchTerm);
        const summary = document.createElement("small");
        summary.textContent = "📝 " + note.summary;

        const tags = document.createElement("small");
        tags.textContent = "🏷️ " + (note.tags || []).join(", ");

        const mood = document.createElement("small");
        mood.textContent = "😊 " + (note.mood || "😌 Normal");
        const timestamp = document.createElement("small");
        timestamp.textContent = formatDate(
            note.createdAt || Date.now()
        );
        timestamp.classList.add("note-date");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.classList.add("delete-btn");
        const pinBtn = document.createElement("button");
        pinBtn.textContent = note.pinned ? "📌" : "📍";
        pinBtn.title = note.pinned ? "Unpin Note" : "Pin Note";
        pinBtn.classList.add("pin-btn");
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.classList.add("edit-btn");
        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "♻️";
        restoreBtn.classList.add("restore-btn");
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("card-actions");
        if (currentView === "trash") {
            actionsDiv.appendChild(restoreBtn);
            actionsDiv.appendChild(deleteBtn);
        } else {
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
        }
        pinBtn.addEventListener("click", () => {
            note.pinned = !note.pinned;
            saveToLocalStorage();
            renderNotes();

        });
        deleteBtn.addEventListener("click", () => {
            if (currentView === "trash") {
                notes = notes.filter(currentNote => {
                    return currentNote.id !== note.id;
                });
                saveToLocalStorage();
                const trashedNotes = notes.filter(note => {
                    return note.deleted;
                });
                renderNotes(trashedNotes);
            } else {
                note.deleted = true;
                saveToLocalStorage();
                renderNotes();
            }
        });
        editBtn.addEventListener("click", () => {
            editingNoteId = note.id;
            noteTitle.value = note.title;
            noteContent.value = note.content;
            noteCategory.value = note.category;
            modalTitle.textContent = "Edit Note";
            noteModal.classList.remove("hidden");
        });
        restoreBtn.addEventListener("click", () => {
            note.deleted = false;
            saveToLocalStorage();
            const trashedNotes = notes.filter(note => {
                return note.deleted;
            });
            renderNotes(trashedNotes);
        });
        noteCard.appendChild(title);
        noteCard.appendChild(content);
        noteCard.appendChild(summary);
        noteCard.appendChild(tags);
        noteCard.appendChild(mood);
        noteCard.appendChild(timestamp);
        if (!note.pinned && currentView !== "trash") {
        noteCard.appendChild(pinBtn);
    }
        noteCard.appendChild(actionsDiv);
        notesGrid.appendChild(noteCard);
    });
}

function generateSummary(content) {
    if (content.length <= 50) {
        return content;
    }
    return content.substring(0, 50) + "...";
}

function generateTags(title, content, category) {
    const text = (title + " " + content).toLowerCase();
    const tags = [];

    if (text.includes("react")) tags.push("React");
    if (text.includes("javascript")) tags.push("JavaScript");
    if (text.includes("gym")) tags.push("Fitness");
    if (text.includes("study")) tags.push("Study");
    if (text.includes("project")) tags.push("Project");

    tags.push(category);

    return [...new Set(tags)];
}

function detectMood(content) {
    const text = content.toLowerCase();

    if (text.includes("learn") || text.includes("study")) {
        return "📚 Learning";
    }

    if (text.includes("idea")) {
        return "💡 Creative";
    }

    if (text.includes("urgent")) {
        return "🔥 Urgent";
    }

    return "😌 Normal";
}

function saveToLocalStorage() {
    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    )
}

renderNotes();

