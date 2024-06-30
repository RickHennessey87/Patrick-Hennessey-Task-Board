// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Create a task card
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('task-card draggable m-3').attr('id', task.id);
    const taskCardBody = $('<div>').addClass('task-card-body');
    const taskCardTitle = $('<h3>').addClass('task-card-title').text(task.taskTitle);
    const taskCardDescription = $('<p>').addClass('task-card-description').text(task.taskDescription);
    const taskCardDueDate = $('<p>').addClass('task-card-due-date').text(`Due Date: ${dayjs(task.taskDueDate).format('DD/MM/YYYY')}`);
    const deleteButton = $('<button>').addClass('btn btn-danger btn-sm').text('Delete Task').on('click', handleDeleteTask);

    if (task.taskDueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.taskDueDate, 'DD/MM/YYYY');
    
        if (now.isSame(taskDueDate, 'day')) {
          taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
          taskCard.addClass('bg-danger text-white');
          deleteButton.addClass('border-light');
        }
      }

    taskCardBody.append(taskCardTitle, taskCardDescription, taskCardDueDate, deleteButton);
    taskCard.append(taskCardBody);

    return taskCard;
}

// Render the task list and make cards draggable
function renderTaskList() {
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
    }

    makeDraggable();
}

// Make tasks draggable
function makeDraggable() {
    $('.draggable').draggable({
        revert: 'invalid',
        stack: '.draggable',
        cursor: 'move',
        zIndex: 100,
        opacity: 0.7
    });
}

// Handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskTitle = $('#task-title').val();
    const taskDescription = $('#task-description').val();
    const taskDueDate = $('#task-due-date').val();
    const task = {
        id: generateTaskId(),
        taskTitle,
        taskDescription,
        taskDueDate,
        status: 'todo'
    };

    taskList.push(task);

    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextId));

    renderTaskList();

    $('#task-form')[0].reset();
    $('#formModal').modal('hide');
}

// Handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();

    const taskCard = $(event.target).closest('.task-card');
    const taskId = taskCard.attr('id');
    const taskIndex = taskList.findIndex(task => task.id == taskId);

    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);

        localStorage.setItem('tasks', JSON.stringify(taskList));

        renderTaskList();
    }

    taskCard.remove();
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('id');
    const newStatus = $(this).attr('id').split('-')[0];
    const taskIndex = taskList.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));

        renderTaskList();
    }

    const targetColumn = $(this).find('.drop-column');
    ui.draggable.detach().appendTo(targetColumn).css({top: 0, left: 0 });
}


// Initialize on page load
$(document).ready(function () {
    renderTaskList();

    $('#todo, #in-progress, #done').droppable({
        accept: '.draggable',
        drop: handleDrop
    });

    $('#task-form').submit(handleAddTask);

    $(document).on('click', '.btn-danger', handleDeleteTask);
});