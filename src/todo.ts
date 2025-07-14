interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

class TaskManager {
  private tasks: TodoItem[] = [];
  private taskIdCounter = 1;
  private listElement: HTMLElement;

  constructor(listElement: HTMLElement) {
    this.listElement = listElement;
  }

  addTask(text: string): void {
    const task: TodoItem = { id: this.taskIdCounter++, text, completed: false };
    this.tasks.push(task);
    this.renderTask(task);
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    const li = this.listElement.querySelector(`li[data-id='${id}']`);
    if (li) this.listElement.removeChild(li);
  }

  editTask(id: number, newText: string): void {
    const task = this.tasks.find((task) => task.id === id);
    if (task) task.text = newText;
    const li = this.listElement.querySelector(`li[data-id='${id}']`);
    if (li) {
      const span = li.querySelector("span.task-text") as HTMLElement;
      if (span) span.textContent = newText;
    }
  }

  toggleTaskCompletion(id: number): void {
    const task = this.tasks.find((task) => task.id === id);
    if (task) task.completed = !task.completed;
    const li = this.listElement.querySelector(`li[data-id='${id}']`);
    if (li) li.classList.toggle("completed", task?.completed);
  }

  renderTask(task: TodoItem): void {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id.toString());
    (li as any)._editing = false;

    const span: HTMLElement = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";
    span.onclick = () => {
      this.toggleTaskCompletion(task.id);
    };

    const editBtn: HTMLElement = document.createElement("button");
    editBtn.innerHTML = "✎";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      if (!(li as any)._editing) {
        const editInput: HTMLInputElement = document.createElement("input");
        editInput.type = "text";
        editInput.value = span.textContent || "";
        li.replaceChild(editInput, span);
        editBtn.innerHTML = "✓";
        editInput.focus();
        (li as any)._editing = true;
      } else {
        const editInput = li.querySelector(
          "input[type='text']"
        ) as HTMLInputElement;
        if (editInput) {
          this.editTask(task.id, editInput.value);
          span.textContent = editInput.value;
          li.replaceChild(span, editInput);
        }
        editBtn.innerHTML = "✎";
        (li as any)._editing = false;
      }
    };

    const deleteBtn: HTMLElement = document.createElement("button");
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

const form = document.querySelector("#add-task-form") as HTMLFormElement;
const input = document.querySelector("#new-task-input") as HTMLInputElement;
const list = document.querySelector("#task-list") as HTMLElement;
const taskManager = new TaskManager(list);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value.trim() !== "") {
    taskManager.addTask(input.value.trim());
    input.value = "";
  }
});
