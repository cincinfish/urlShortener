// 初始變數
const list = document.querySelector("#my-todo");
const addBtn = document.querySelector("#add-btn");
const input = document.querySelector("#new-todo");
const listDone = document.querySelector("#my-done");
const listWhole = document.querySelector("#whole-list");

// 資料
const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
const doneList = JSON.parse(localStorage.getItem("doneList")) || [];
const todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
];
localStorage.setItem("todoList", JSON.stringify(todos));
updateList();

// 更新localStorage
function updateLocalStorage(dones, storageName) {
  localStorage.setItem(dones, JSON.stringify(storageName));
  updateList();
}

// 函式 updateList
function updateList() {
  list.innerHTML = "";
  for (let text of todoList) {
    const newItem = document.createElement("li");
    newItem.innerHTML += `
        <label for="todo" class="myMOUSE">${text}</label>
        <i class="delete fa fa-trash myMOUSE"></i>
    `;
    list.appendChild(newItem);
  }
  listDone.innerHTML = "";
  for (let text of doneList) {
    const newDownItem = document.createElement("li");
    newDownItem.innerHTML += `
        <label for="todo" class="checked myMOUSE">${text}</label>
        <i class="delete fa fa-trash myMOUSE"></i>
    `;
    listDone.appendChild(newDownItem);
  }
}

// check space
function checkSpace(text) {
  const inputValue = text.replace(/\s+/g, "");
  if (inputValue.length > 0) {
    return inputValue;
  }
}

// Create
addBtn.addEventListener("click", function (event) {
  const string = checkSpace(input.value);
  if (string.length > 0) {
    todoList.push(checkSpace(input.value));
    updateLocalStorage("todoList", todoList);
  }
});

input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const string = checkSpace(input.value);
    if (string.length > 0) {
      todoList.push(checkSpace(input.value));
      updateLocalStorage("doneList", doneList);
    }
  }
});

// Delete and check
listWhole.addEventListener("click", function (event) {
  const target = event.target;
  const dostate = target.parentElement.parentElement;
  console.log(list);
  if (target.classList.contains("delete")) {
    if (dostate.dataset.doneTodo === "true") {
      // 移除 todoList array
      const indexTodo = todoList.indexOf(
        target.previousElementSibling.innerText
      );
      todoList.splice(indexTodo, 1);
    } else {
      // 移除 doneList array
      const indexDone = doneList.indexOf(
        target.previousElementSibling.innerText
      );
      doneList.splice(indexDone, 1);
      console.log(doneList);
    }
  } else if (target.tagName === "LABEL") {
    // 若點擊的data attribute與html中的相同
    if (dostate.dataset.doneTodo === "true") {
      // 加入 doneList array
      doneList.push(checkSpace(target.innerText));
      // 移除 todoList array
      const indexTodo = todoList.indexOf(target.innerText);
      todoList.splice(indexTodo, 1);
      // 更新
    } else {
      todoList.push(checkSpace(target.innerText));
      const indexDone = doneList.indexOf(target.innerText);
      doneList.splice(indexDone, 1);
    }
  }
  updateLocalStorage("todoList", todoList);
  updateLocalStorage("doneList", doneList);
});