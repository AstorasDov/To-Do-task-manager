const input = document.querySelector('input');
const button = document.querySelector('button');
const container = document.getElementById("container");
const reminder = document.getElementById("reminder");

async function loadTasks(){
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    if(tasks.length>0){
        reminder.style.display = "none";
        const HTML = tasks.map(({name})=>`<p class="task">${name}</p>`);
        container.innerHTML = HTML.join('');
    }
}

async function addTask(task) {
    fetch('/api/addTask',{
        "method":"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(task)
    });
}

button.addEventListener("click",()=>{
    const taskName = input.value.trim();
    console.log(taskName);
    if(taskName!=="" && taskName.length > 5 && taskName.length <= 25){
        const task = {name:input.value};
        addTask(task);
        loadTasks();
    }
});

window.addEventListener("DOMContentLoaded",loadTasks);
