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
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener('click', function(){
        li.remove();
    });
    li.appendChild(deleteBtn);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener('change', function(){
        if(checkbox.checked){
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
        }
        else{
            li.style.textDecoration = "none";
            li.style.opacity = "1";
        }   
    });
    li.prepend(checkbox);
    taskList.appendChild(li);
    taskInput.value = "";
    console.log(taskText);
})