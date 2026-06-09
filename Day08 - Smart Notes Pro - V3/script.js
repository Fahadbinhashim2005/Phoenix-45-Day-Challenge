let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editingNoteId = null;

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
        id : Date.now(),
        title: noteTitle.value,
        content: noteContent.value,
        category: noteCategory.value,
        createdAt: Date.now(),
        pinned: false
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
        deleteBtn.textContent = "🗑️";
        deleteBtn.classList.add("delete-btn");
        const pinBtn = document.createElement("button");
        pinBtn.textContent = note.pinned ? "📌" : "📍";
        pinBtn.classList.add("pin-btn");
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.classList.add("edit-btn");
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("card-actions");
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);


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
        editBtn.addEventListener("click", () => {
            editingNoteId = note.id;
            noteTitle.value = note.title;
            noteContent.value = note.content;
            noteCategory.value = note.category;
            modalTitle.textContent = "Edit Note";
            noteModal.classList.remove("hidden");
        });

        noteCard.appendChild(title);
        noteCard.appendChild(content);
        noteCard.appendChild(category);
        if (!note.pinned) {
            noteCard.appendChild(pinBtn);
        }
        noteCard.appendChild(actionsDiv);
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

