var taskIdCounter = 0;
  // this starts counter at 0

var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];

var taskFormHandler = function(event) {  
    //prevents the webpage from default refreshing
  event.preventDefault();
    // console.log(event);
  var taskNameInput = document.querySelector("input[name='task-name']").value;
    //  console.log(taskNameInput);
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // console.dir(taskNameInput);

    //check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
    // resets form after each text entry
  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
    // console.log(isEdit);
  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };

    createTaskEl(taskDataObj);
  }
};

var completeEditTask = function(taskName, taskType, taskId) {
    // console.log(taskName, taskType, taskId);

    // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].id === parseInt(taskId)) {
    tasks[i].name = taskName;
    tasks[i].type = taskType;
  }

  saveTasks()
};
  
  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
}

var createTaskEl = function(taskDataObj) {
  console.log(taskDataObj);
  console.log(taskDataObj.status);
  
    //create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

    // add task id as a custom attribute to add a counter to the task list
  listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");

    // give it a class name
  taskInfoEl.className = "task-info";

    // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks()
  
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
    // console.log(taskActionsEl);

    // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
  taskIdCounter++;
};

var createTaskActions = function(taskId) {
    // create the div item to act as a container for the other elements
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

    // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
    //appendchild allows new data to be added to the list
  actionContainerEl.appendChild(editButtonEl);

    // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
    //appendchild allows new data to be added to the list
  actionContainerEl.appendChild(deleteButtonEl);

    // create the drop down element
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
    //appendchild allows new data to be added to the listo9
  actionContainerEl.appendChild(statusSelectEl);

    // array to help the looping and for Loop
  var statusChoices = ["To Do", "In Progress", "Completed"];
    // var i = 0, the initial counter
  for (var i = 0; i < statusChoices.length; i++) {
      // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textContent = statusChoices[i];
  
    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }
    //returns the informatio requested
  return actionContainerEl;
};

var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var editTask = function(taskId) {
// get task list item element
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// get content from task name and type
var taskName = taskSelected.querySelector("h3.task-name").textContent;
  // console.log(taskName);

var taskType = taskSelected.querySelector("span.task-type").textContent;
  // console.log(taskType);

document.querySelector("input[name='task-name']").value = taskName;
document.querySelector("select[name='task-type']").value = taskType;
document.querySelector("#save-task").textContent = "Save Task";
formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // console.log(taskSelected);
    // removes the task
  taskSelected.remove();

// create new array to hold updated list of tasks
var updatedTaskArr = [];

// loop through current tasks
for (var i = 0; i < tasks.length; i++) {
  // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
  if (tasks[i].id !== parseInt(taskId)) {
    updatedTaskArr.push(tasks[i]);
  }
}

// reassign tasks array to be the same as updatedTaskArr
tasks = updatedTaskArr;

};

var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
    }

    else if (statusValue === "in progress") {
      taskInProgressEl.appendChild(taskSelected);
    }

    else if (statusValue === "completed") {
      taskCompletedEl.appendChild(taskSelected);
    }

  // update task's in tasks array
for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].id === parseInt(taskId)) {
    tasks[i].status = statusValue;
  }
  saveTasks()
}
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
  var savedTasks = localStorage.getItem("tasks");
  // if there are no tasks, set tasks to an empty array and return out of the function
  if (!savedTasks) {
    return false;
  }
  console.log("Saved tasks found!");
  // else, load up saved tasks

  // parse into array of objects
  savedTasks = JSON.parse(savedTasks);

  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  }
};

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

// Create a new task
formEl.addEventListener("submit", taskFormHandler);
