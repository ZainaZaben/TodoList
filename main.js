"use strict";

// Global array to store the TODO list data
let todoList = [];

// DOM elements
const addText = document.getElementById('add-text');
const searchInput = document.getElementById('search');
const tableBody = document.querySelector('.table-list tbody');
const countElement = document.querySelector('.count');

// Function to fetch TODO data from the API
async function fetchTodoData() {
    try {
      const response = await fetch('https://dummyjson.com/todos');
      const data = await response.json();
      todoList = [...data.todos.slice(0, 5)]; // Get the first 5 tasks from the API
      saveToStorage();

      renderTodoList(todoList);
    } catch (error) {
      console.error('Error fetching TODO data:', error);
    }
}

// Event listener to fetch TODO data on page load
window.addEventListener('load', fetchTodoData);

// Function for filling the table
function rowData(task, index){
  const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="${task.completed ? 'completed-task' : ''}" onclick="toggleTaskStatus(${index})">${task.todo}</td>
        <td>${task.userId}</td>
        <td>${task.completed ? 'Completed' : 'Pending'}</td>
        <td>
          <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
          <button class="complete-btn" onclick="toggleTaskStatus(${index})">
            ${task.completed ? 'Pend' : 'Done'}
          </button>
        </td>
        <td>
          <button class="edit-btn" onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
}

// Function to render the TODO list
function renderTodoList(todoList) {
    tableBody.innerHTML = '';
    todoList.forEach((task, index) => {
      rowData(task, index);
    });
    const count = todoList.length;
    updateCount(count);
}

function updateCount(count) {
  countElement.textContent = count;
}

// Function to add a task -when triggering the submit form action-
function addTask(){
    const taskText = addText.value.trim();
    if (taskText === '') {
      return;
    }
    const newTask = {
      todo: taskText,
      userId: parseInt(Math.random() * 100),
      completed: false,
    };
    todoList.push(newTask);
    saveToStorage();
    renderTodoList(todoList);
    addText.value = '';  
}


// Function to delete a task
function deleteTask(index) {
    todoList.splice(index, 1);
    saveToStorage();
    renderTodoList(todoList);
}

// Function to edit a task
function editTask(index) {
    const newTaskText = prompt("Edit the task:", todoList[index].todo);
    if (newTaskText !== null && newTaskText.trim() !== "") {
        todoList[index].todo = newTaskText.trim();
        saveToStorage();
        renderTodoList(todoList);
    }
}

// Function to toggle the task between complete and pend
function toggleTaskStatus(index) {
    todoList[index].completed = !todoList[index].completed;
    saveToStorage();
    renderTodoList(todoList);
}

// Event listener for search input
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = todoList.filter(task =>
      task.todo.toLowerCase().includes(searchTerm)
    );
    renderTodoList(filteredTasks);
});

// Save data to browser storage (LocalStorage) whenever the list changes
function saveToStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
  
// Call saveToStorage whenever the list is updated
renderTodoList(todoList);