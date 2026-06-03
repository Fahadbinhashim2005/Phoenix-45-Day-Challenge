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
    }
];

const notesGrid = document.getElementById("notesGrid");

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

        noteCard.appendChild(title);
        noteCard.appendChild(content);
        noteCard.appendChild(category);
        notesGrid.appendChild(noteCard);
    });
}

renderNotes();

