let notes = JSON.parse(localStorage.getItem("notes")) || [];

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

    const newNote = {
        id : Date.now(),
        title: noteTitle.value,
        content: noteContent.value,
        category: noteCategory.value,
        createdAt: Date.now(),
        pinned: false
    };
    notes.push(newNote);
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

function renderNotes(notesToRender = notes){
    notesGrid.innerHTML = "";
    notesToRender.sort((a, b) => {
        return Number(b.pinned) - Number(a.pinned);
    });
    notesToRender.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note-card");
        const title = document.createElement("h3");
        title.textContent = note.pinned ? `📌 ${note.title}` : note.title;
        const content = document.createElement("p");
        content.textContent = note.content;
        const category = document.createElement("span");
        category.textContent = note.category;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️ Delete";
        const pinBtn = document.createElement("button");
        pinBtn.textContent = note.pinned ? "📌 Unpin" : "📍 Pin";

        pinBtn.addEventListener("click", () => {
            note.pinned = !note.pinned;
            saveToLocalStorage();
            renderNotes();
        });
        deleteBtn.addEventListener("click", () => {
            notes = notes.filter(currentNote => {
                return currentNote.id !== note.id;
            });
            saveToLocalStorage();
            renderNotes();
        });

        noteCard.appendChild(title);
        noteCard.appendChild(content);
        noteCard.appendChild(category);
        noteCard.appendChild(deleteBtn);
        noteCard.appendChild(pinBtn);
        notesGrid.appendChild(noteCard);
    });
}

function saveToLocalStorage() {
    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    )
}

renderNotes();

