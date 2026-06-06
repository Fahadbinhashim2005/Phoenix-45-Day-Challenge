let notes = [
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
        category: noteCategory.value
    };
    console.log(newNote);
    notes.push(newNote);
    renderNotes();

    noteModal.classList.add("hidden");
    noteTitle.value = "";
    noteContent.value = "";
    noteCategory.value = "Projects";
});

function renderNotes(){
    notesGrid.innerHTML = "";
    notes.forEach(note => {
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
            renderNotes();
        });

        noteCard.appendChild(title);
        noteCard.appendChild(content);
        noteCard.appendChild(category);
        noteCard.appendChild(deleteBtn);
        notesGrid.appendChild(noteCard);
    });
}

renderNotes();

