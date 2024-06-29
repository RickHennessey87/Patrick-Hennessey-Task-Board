// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('task-card m-3').attr('id', task.id);
    const taskCardBody = $('<div>').addClass('task-card-body');
    const taskCardTitle = $('<h3>').addClass('task-card-title').text(task.title);
    const taskCardDescription = $('<p>').addClass('task-card-description').text(task.description);
    const taskCardDueDate = $('<p>').addClass('task-card-due-date').text(task.DueDate);

    taskCardBody.append(taskCardTitle, taskCardDescription, taskCardDueDate);
    taskCard.append(taskCardBody)

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    for (let i = 0; i < taskList.length; i++) {
        const taskCard = createTaskCard(task[0]);

        if (task.status === 'todo') {
            $('#todo-cards').append(taskCard);
        } else if (task.status === 'in-progress') {
            $('#in-progress-cards').append(taskCard);
        } else if (task.status === 'done') {
            $('#done-cards').append(taskCard);
        }
    };

    
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = $('#task-title').val();
    const taskDescription = $('#task-description').val();
    const dueDate = $('#task-due-date').val();

    const Task = {
        id: generateTaskId(),
        title,
        description,
        dueDate,
        status: 'todo'
    };

    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextID));

    const taskCard = createTaskCard(Task);
    $('#todo-cards').append(taskCard);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
