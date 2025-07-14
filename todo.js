"use strict";
class TaskManager {
    constructor(listElement) {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.listElement = listElement;
    }
    addTask(text) {
        const task = { id: this.taskIdCounter++, text, completed: false };
        this.tasks.push(task);
        this.renderTask(task);
    }
    removeTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        const li = this.listElement.querySelector(`li[data-id='${id}']`);
        if (li)
            this.listElement.removeChild(li);
    }
    editTask(id, newText) {
        const task = this.tasks.find((task) => task.id === id);
        if (task)
            task.text = newText;
        const li = this.listElement.querySelector(`li[data-id='${id}']`);
        if (li) {
            const span = li.querySelector("span.task-text");
            if (span)
                span.textContent = newText;
        }
    }
    toggleTaskCompletion(id) {
        const task = this.tasks.find((task) => task.id === id);
        if (task)
            task.completed = !task.completed;
        const li = this.listElement.querySelector(`li[data-id='${id}']`);
        if (li)
            li.classList.toggle("completed", task === null || task === void 0 ? void 0 : task.completed);
    }
    renderTask(task) {
        const li = document.createElement("li");
        li.setAttribute("data-id", task.id.toString());
        li._editing = false;
        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";
        span.onclick = () => {
            this.toggleTaskCompletion(task.id);
        };
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✎";
        editBtn.className = "edit-btn";
        editBtn.onclick = () => {
            if (!li._editing) {
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = span.textContent || "";
                li.replaceChild(editInput, span);
                editBtn.innerHTML = "✓";
                editInput.focus();
                li._editing = true;
            }
            else {
                const editInput = li.querySelector("input[type='text']");
                if (editInput) {
                    this.editTask(task.id, editInput.value);
                    span.textContent = editInput.value;
                    li.replaceChild(span, editInput);
                }
                editBtn.innerHTML = "✎";
                li._editing = false;
            }
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => {
            this.removeTask(task.id);
        };
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        this.listElement.appendChild(li);
    }
}
const form = document.querySelector("#add-task-form");
const input = document.querySelector("#new-task-input");
const list = document.querySelector("#task-list");
const taskManager = new TaskManager(list);
form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value.trim() !== "") {
        taskManager.addTask(input.value.trim());
        input.value = "";
    }
});
