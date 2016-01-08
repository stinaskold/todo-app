var toDoList = document.getElementById("todo-list");
var finishedList = document.getElementById("finished-list");

// Add task
document.getElementById("activity-button").addEventListener("click", function() {

  // Store input-element in variable
  var input = document.getElementById("new-activity");

  // If task is empty, show error message
  if (input.value === "") {
    showErrorMessage(input);
  } else {
    addTask(input.value);
    input.value = "";
  }

  saveTasks(toDoList);
});

// Read saved todo-tasks
savedTasks = window.localStorage.getItem("toDoTasks");

if (savedTasks != "") {
  var savedTaskArray = new Array();
  savedTaskArray = JSON.parse(savedTasks);
  for (var i = 0; i < savedTaskArray.length; i++) {
    addTask(savedTaskArray[i]);
  }
};

// Read saved finished-tasks
savedTasks = window.localStorage.getItem("finishedTasks");

if (savedTasks != "") {
  var savedTaskArray = new Array();
  savedTaskArray = JSON.parse(savedTasks);
  for (var i = 0; i < savedTaskArray.length; i++) {
    finishTask(savedTaskArray[i]);
  }
};

function saveTasks(list) {
  var tasks = list.getElementsByTagName("li");
  var taskArray = new Array();
  for (var i = 0; i < tasks.length; i++) {
    var taskString = tasks[i].childNodes[0].innerHTML;
    taskArray.push(taskString);
  }

  if (list === toDoList) {
    window.localStorage.setItem("toDoTasks", JSON.stringify(taskArray));
  }
  else if (list === finishedList) {
    window.localStorage.setItem("finishedTasks", JSON.stringify(taskArray));
  }
}

function createButton(name, text) {
  var button = document.createElement("button");
  button.className = name;
  var buttonText = document.createTextNode(text);
  button.appendChild(buttonText);
  return button;
}

function showErrorMessage(input) {
  if (input.classList.contains("error")) {
    return;
  }
  // Set red background (class = error)
  input.className = "error";
  // Change display mode of error-message
  input.parentNode.lastElementChild.style.display = "block";

  input.addEventListener("focus", function() {
    if (input.classList.contains("error")) {
    this.classList.remove("error");
    input.parentNode.lastElementChild.style.display = "none";
    }
  });
}

function addTask(newActivity) {

  //Create list element, append to todo-list
  var listElement = toDoList.appendChild(document.createElement("li"));
  // Create paragraph, append to list element, append input from user to paragraph
  listElement.appendChild(document.createElement("p")).appendChild(document.createTextNode(newActivity));

  //Create buttons
  var changeButton = createButton("change", "Ändra");
  var finishButton = createButton("finish", "Klart");
  var deleteButton = createButton("delete", "Ta bort");

  //Append buttons
  listElement.appendChild(changeButton);
  listElement.appendChild(finishButton);
  listElement.appendChild(deleteButton);

  // Create error-message with id set to display: none
  var errorMessage = document.createElement("p");
  errorMessage.appendChild(document.createTextNode("Fältet får inte vara tomt."));
  errorMessage.className = "error-message";

  // Append error-message
  listElement.appendChild(errorMessage);

  // Add event listeners to buttons
  changeButton.addEventListener("click", function() {
    changeTask(this, finishButton, newActivity);
  });

  finishButton.addEventListener("click", function() {
    finishTask(newActivity);
    // Delete finished task from to do-list
    deleteTask(finishButton, toDoList);
    saveTasks(toDoList);
    saveTasks(finishedList);
  });

  deleteButton.addEventListener("click", function() {
    deleteTask(this, toDoList);
    saveTasks(toDoList);
  });
}

// Change content of task
function changeTask(changeButton, finishButton, inputValue) {

  // Create input element
  var input = document.createElement("input");
  input.value = inputValue;

  var listElement = changeButton.parentNode;

  // Get paragraph
  var paragraph = listElement.firstChild;

  // Replace paragraph with input
  listElement.replaceChild(input, paragraph);

  // Disable buttons
  changeButton.disabled = true;
  finishButton.disabled = true;

  input.focus();

  input.addEventListener("focusout", function() {
    if (this.value === "") {
      showErrorMessage(input);
      return;
    }
    // Create paragraph
    var newParagraph = document.createElement("p")
    // Set paragraph innerhtml to input from user
    newParagraph.innerHTML = this.value;
    // Replace input with new paragraph
    listElement.replaceChild(newParagraph, input);
    changeButton.disabled = false;
    finishButton.disabled = false;
    saveTasks(toDoList);
    saveTasks(finishedList);
  });
}

  // Move task to finished-list
  function finishTask(inputValue) {

    var listElement = finishedList.appendChild(document.createElement("li"));
    listElement.appendChild(document.createElement("p")).appendChild(document.createTextNode(inputValue));

    // Create delete-button
    var deleteButton = createButton("delete", "Ta bort");

    listElement.appendChild(deleteButton);

    deleteButton.addEventListener("click", function() {
      deleteTask(this, finishedList);
      saveTasks(finishedList);
    });
  }

  function deleteTask(button, list) {
    // Delete task
    list.removeChild(button.parentNode);
  }
