// SELECTORS

// image selector for changing themes
const moon = document.querySelector('.moon')
// main container

const listContainer = document.querySelector('.list-container')  
// input container

const inputContainer = document.querySelector('.input-container') 
// actual input selector
const input = document.getElementById('input')
// input text selector
const textInput = document.querySelectorAll('.text')

// ul container where todos will be appended
const todoList = document.querySelector('.todo-list')

// task container
const tasks = document.querySelector('.tasks')
// items left text(number)
const itemsLeft = document.querySelector('.items-left strong')
// links all,active,completed
const links = document.querySelectorAll('.links a')
// all link
const allLink = document.getElementById('all')
// completed link
const completedLink = document.getElementById('completed')
// active link
const activeLink = document.getElementById('active')

// clear completed text
const clearCompleted = document.querySelector('.clear-completed')

// drag text
const dragText = document.querySelector('.drag')

// counting todos
let counter = 0;

// EVENTLISTENERS

//document loaded then run getTodos 
document.addEventListener('DOMContentLoaded', getTodos)

// adding todo without submitting form
inputContainer.addEventListener('submit', (e) => {
    e.preventDefault()
    addTodo()
})

// dark to light theme toggling
moon.addEventListener('click', () => {
    // changing image
    moon.src = toggleImg()
    listContainer.classList.toggle('dark-theme')
    inputContainer.classList.toggle('dark-items')

    textInput.forEach(text=> {
        text.classList.toggle('dark-items')
    })

    tasks.classList.toggle('dark-items')
    tasks.style.color = "hsl(236, 9%, 61%)"

    links.forEach(link=> {
        link.classList.toggle('dark-link')
    })

    clearCompleted.classList.toggle('dark-link')

    // added todo container background color changing
    const todoItem = document.querySelectorAll('.todo-item')
    todoItem.forEach(item => {
        item.classList.toggle('dark-items')
    })

    // added todo text style changing
    const spanText = document.querySelectorAll('.span-text')
    spanText.forEach(text => {
        text.classList.toggle('dark-items')
    })

    // remove icon toggling
    const removeIcons = document.querySelectorAll('.fa-times')
    removeIcons.forEach(icon => {
        icon.classList.toggle('dark-icon')
    })

})

// delete todo
todoList.addEventListener('click', deleteTodo);

// check todo
todoList.addEventListener('click', checkTodo);

// clear allCompleted todos
clearCompleted.addEventListener('click', clearAllCompleted);

// all todos
allLink.addEventListener('click', allTodos)
// completed todos
completedLink.addEventListener('click', completedTodos)
// active todos
activeLink.addEventListener('click', activeTodos)

// FUNCTIONS

// function for image switching
function toggleImg() {
    let initialImg = moon.src;
    let srcTest = initialImg.includes('/images/icon-sun.svg');
    let newImg = {
      'true':'/images/icon-moon.svg', 
      'false':'/images/icon-sun.svg'}[srcTest];
    return newImg;
  }

// function for add Todo to the list
function addTodo(){
    //creating li
    const todoItem = document.createElement('li'); 
    todoItem.classList.add('todo-item')
    //creating input checkbox 
    const inp = document.createElement('input')
    inp.type = "checkbox"
    inp.classList.add('check')
    // creating span element
    const sp = document.createElement('span'); 
    sp.innerText = input.value;
    sp.classList.add('span-text')
    // creating icon
    const ic= document.createElement('i'); 
    ic.classList.add('fas')
    ic.classList.add('fa-times')

    // save to local storage
    saveLocalTodos(input.value);

    // appending elements
    todoItem.appendChild(inp)
    todoItem.appendChild(sp)
    todoItem.appendChild(ic)
    todoList.appendChild(todoItem)

    tasks.style.display = "flex"
    dragText.style.display = "block"

    input.value = ""; //resetting input value
    itemsLeft.innerText = ++counter // adding to item text
}

// delete todo function
function deleteTodo(e){
    const item = e.target; //getting target which is clicked
    if(item.classList[0] === "fas"){ //checking if that target first classList is equal to fas
        const todo = item.parentElement; //if so then we get this target parentElement which is whole
        // container and we remove it 
        // adding transition to the todo will run it first
        todo.classList.add("fall")
        // than with special eventlistener transitioned wil execute remove function,
        // which wil be run only after transition end !!!
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', e => {
            todo.remove();
            // if ul element child count is equal to 0 remove task container and drag text
            if(todoList.childNodes.length === 0){
                tasks.style.display = "none"
                dragText.style.display = "none"
            }
        })
        itemsLeft.innerText = --counter //removing items by one in text
    }
}

// check todo function
function checkTodo(e){
    const item = e.target;
    if(item.classList[0] === "check"){
        const todoText = item.nextElementSibling; // getting checkbox next sibling which is span text
        todoText.classList.toggle('completed') // toggling to span text class
    }
}

// clear all completed todos
function clearAllCompleted(e) {
    const completeTodos = document.querySelectorAll('.todo-item')
    completeTodos.forEach(todo => {
        // if li second children contains class of completed then remove whole li
        if(todo.children[1].classList[1] === "completed"){
            todo.classList.add("fall")
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', e => {
            todo.remove();      
        })
        itemsLeft.innerText = --counter
    }
    // if ul element child count is equal to 0 remove task container and drag text
    if(todoList.childNodes.length === 0){
        tasks.style.display = "none"
        dragText.style.display = "none"
        }
    })
}

// filter all todos
function allTodos() {
    const todoItems = document.querySelectorAll('.todo-item')
    todoItems.forEach(todo => {
        todo.style.display = "flex"
    })
}

// filter completed todos
function completedTodos() {
    const todoItems = document.querySelectorAll('.todo-item')
    todoItems.forEach(todo => {
        if(todo.children[1].classList[1] !== "completed"){
            todo.style.display = "none"
        } else{
            todo.style.display = "flex"
        }
    })
}

// filter active todos
function activeTodos() {
    const todoItems = document.querySelectorAll('.todo-item')
    todoItems.forEach(todo => {
        if(todo.children[1].classList[1] === "completed"){
            todo.style.display = "none"
        }
        else{
            todo.style.display = "flex"
        }
    })
}

// LOCAL STORAGE
// save todos in local storage
function saveLocalTodos(todo) {
    // check if local storage with todos element is empty 
    let todos;
    if( localStorage.getItem('todos') === null) {
        todos = []; // create array
    } else {
        todos = JSON.parse(localStorage.getItem('todos')); // parse it back to the array if not empty
    }

    todos.push(todo)
    localStorage.setItem('todos', JSON.stringify(todos));
}

// remove todos from local storage
function removeLocalTodos(todo) {
    // check if local storage is empty
    let todos;
    if( localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }   

    const todoIndex = todo.children[1].innerText //span text
    todos.splice(todos.indexOf(todoIndex), 1); //removes one element from selected index from todo list
    localStorage.setItem('todos', JSON.stringify(todos)) // converting todos array to JSON string
}

// for displaying todos
function getTodos() {
    // check if local storage is empty
    let todos;
    if( localStorage.getItem('todos') === null) { 
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos')); // 
    }    

// looping through todos (styling, appending etc...)
    todos.forEach(function(todo){
        const todoItem = document.createElement('li'); 
        todoItem.classList.add('todo-item')
        todoItem.draggable = "true";
        //creating input checkbox 
        const inp = document.createElement('input')
        inp.type = "checkbox"
        inp.classList.add('check')
        // creating span element
        const sp = document.createElement('span'); 
        // now we need actual text from local storage not from input value
        sp.innerText = todo;
        sp.classList.add('span-text')    
        // creating icon
        const ic= document.createElement('i'); 
        ic.classList.add('fas')
        ic.classList.add('fa-times')
        // appending elements
        todoItem.appendChild(inp)
        todoItem.appendChild(sp)
        todoItem.appendChild(ic)
        todoList.appendChild(todoItem)

        tasks.style.display = "flex"
        dragText.style.display = "block"

        input.value = ""; //resetting input value
        itemsLeft.innerText = ++counter // adding to item text
    })
}