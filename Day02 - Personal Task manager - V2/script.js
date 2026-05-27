const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

addTaskBtn.addEventListener('click',function(){
    const taskText = taskInput.value.trim();
    if(taskText === ""){
        return;
    }
    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent ="Delete";
    deleteBtn.addEventListener('click',function(){
        li.remove();
        updateStats();
        updateEmptyMessage();
    });
    li.appendChild(deleteBtn);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener('change',function(){
        if(checkbox.checked){
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
        }
        else{
            li.style.textDecoration = "none";
            li.style.opacity = "1";
        }
        updateStats();
    });
    li.prepend(checkbox);

    taskList.appendChild(li);
    taskInput.value = "";
    updateStats();
    updateEmptyMessage();
});

const hour = new Date().getHours();
let greeting = "";
if(hour < 12){
    greeting = "Good Morning, Fahad 🌅";
}
else if(hour < 16){
    greeting = "Good Afternoon, Fahad 🌞";
}
else if(hour < 19){
    greeting = "Good Evening, Fahad 🌇";
}
else{
    greeting = "Good Night, Fahad 🌛";
}
document.getElementById('greeting').textContent = greeting;

function updateStats(){
    const allTasks = taskList.querySelectorAll("li");
    document.getElementById( "totalTasks").textContent = allTasks.length;

    const completedTasks = taskList.querySelectorAll( "li input[type='checkbox']:checked" );
    document.getElementById("completedTasks").textContent = completedTasks.length;

    const pendingTasks =taskList.querySelectorAll("li input[type='checkbox']:not(:checked)");
    document.getElementById("pendingTasks" ).textContent =pendingTasks.length;
}

function updateEmptyMessage(){
    const emptyMessage =document.getElementById("emptyMessage");
    if(taskList.children.length === 0){
        emptyMessage.style.display ="block";
    }
    else{
        emptyMessage.style.display ="none";
    }
}
updateStats();
updateEmptyMessage();

document.getElementById("todayDate").textContent =new Date().toDateString();