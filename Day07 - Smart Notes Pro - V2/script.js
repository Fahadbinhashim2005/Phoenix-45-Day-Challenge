let notes = JSON.parse(localStorage.getItem("notes")) || [
    {
        id: 1,
        title: "Project Phoenix",
        content: "Build Smart Notes App using JavaScript.",
        category: "Projects"
    },
    {
        id: 2,
        title: "JavaScript Revision",
        content: "Learn DOM manipulation and Local Storage.",
        category: "Study"
    },
    {
        id: 3, 
        title: "T-Shirt Business",
        content: " Design and launch a new t-shirt line.",
        category: "Business"
    }
];

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
        id : notes.length +1,
        title: noteTitle.value,
        content: noteContent.value,
        category: noteCategory.value,
        createdAt: Date.now()
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
    renderNotes();
})

function renderNotes(notesToRender = notes){
    notesGrid.innerHTML = "";
    notesToRender.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note-card");
        const title = document.createElement("h3");
        title.textContent = note.title;
        const content = document.createElement("p");
        content.textContent = note.content;
        const category = document.createElement("span");
        category.textContent = note.category;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️ Delete";

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

