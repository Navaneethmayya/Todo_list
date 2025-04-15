interface Task {
  title: string;
  date: string;
  completed: boolean;
}

const addTaskBtn = document.getElementById("addtask") as HTMLButtonElement;
const taskListDiv = document.getElementById("task-list") as HTMLDivElement;
const filterButtons = document.querySelectorAll(".filter-btn");

addTaskBtn.addEventListener("click", () => {
  const titleInput = document.getElementById("task-title") as HTMLInputElement;
  const dateInput = document.getElementById("task-date") as HTMLInputElement;

  const newTask: Task = {
    title: titleInput.value.trim(),
    date: dateInput.value,
    completed: false,
  };

  if (!newTask.title) {
    alert("Please enter a task.");
    return;
  }

  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(tasks, getActiveFilter()); // 👈 Use active filter here

  titleInput.value = "";
  dateInput.value = "";
});

function getTasks(): Task[] {
  return JSON.parse(localStorage.getItem("taskList") || "[]");
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem("taskList", JSON.stringify(tasks));
}

function renderTasks(tasks: Task[], filter: string = "all"): void {
  taskListDiv.innerHTML = "";

  tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .forEach((task, index) => {
      const taskDiv = document.createElement("div");
      const taskContent = document.createElement("div");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", () => {
        const updatedTasks = getTasks();
        updatedTasks[index].completed = checkbox.checked;
        saveTasks(updatedTasks);

        // 👇 Rerender using current filter
        renderTasks(updatedTasks, getActiveFilter());
      });

      taskContent.className = "task-title";
      const titleSpan = document.createElement("span");
      titleSpan.textContent = `${task.title} ${task.date ? " - " + task.date : ""}`;
      if (task.completed) titleSpan.classList.add("completed");

      taskContent.appendChild(checkbox);
      taskContent.appendChild(titleSpan);
      taskDiv.appendChild(taskContent);
      taskListDiv.appendChild(taskDiv);
    });
}

function getActiveFilter(): string {
  const active = document.querySelector(".filter-btn.active") as HTMLElement;
  return active?.dataset.filter || "all";
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => (b as HTMLElement).classList.remove("active"));
    (btn as HTMLElement).classList.add("active");

    const filter = (btn as HTMLElement).dataset.filter || "all";
    renderTasks(getTasks(), filter);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  renderTasks(getTasks());
});
