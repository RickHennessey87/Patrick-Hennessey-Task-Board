// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
// generateTaskId creates a unique task id for each task incrementally
function generateTaskId() {
    return nextId++
}

// Todo: create a function to create a task card
//createTaskCard creates a new task card from the modal form in the html. 
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('task-card draggable m-3').attr('id', task.id);
    const taskCardBody = $('<div>').addClass('task-card-body');
    const taskCardTitle = $('<h3>').addClass('task-card-title').text(task.taskTitle);
    const taskCardDescription = $('<p>').addClass('task-card-description').text(task.taskDescription);
    const taskCardDueDate = $('<p>').addClass('task-card-due-date').text(`Due Date: ${dayjs(task.taskDueDate).format('MMM D, YY')}`);
    const deleteButton = $('<button>').addClass('btn btn-danger btn-sm').text('Delete Task').on('click', handleDeleteTask);

    taskCardBody.append(taskCardTitle, taskCardDescription, taskCardDueDate, deleteButton);
    taskCard.append(taskCardBody)

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // reset task list on refresh
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    for (let i = 0; i < taskList.length; i++) {
        const taskCard = createTaskCard(taskList[i]);

        if (taskList[i].status === 'todo') {
            $('#todo-cards').append(taskCard);
        } else if (taskList[i].status === 'in-progress') {
            $('#in-progress-cards').append(taskCard);
        } else if (taskList[i].status === 'done') {
            $('#done-cards').append(taskCard);
        }
    };

    $(function() {
        $('.draggable').draggable();
    })
    

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    console.log('handle task');

    const taskTitle = $('#task-title').val();
    const taskDescription = $('#task-description').val();
    const taskDueDate = $('#task-due-date').val();

    const Task = {
        id: generateTaskId(),
        taskTitle,
        taskDescription,
        taskDueDate,
        status: 'todo'
    };
    console.log(Task);

    taskList.push(Task);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextId));

    const taskCard = createTaskCard(Task);

    $('#todo-cards').append(taskCard);
    $('#task-form')[0].reset();
    $('#formModal').modal('hide');

    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();

    const taskCard = $(event.target).closest('.task-card');
    const taskId = taskCard.attr('id');
    const taskIndex = taskList.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);

        localStorage.setItem('tasks', JSON.stringify(taskList));
    }

    taskCard.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList()

    $('#task-form').submit(handleAddTask);
});
