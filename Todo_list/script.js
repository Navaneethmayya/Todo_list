"use strict";
const addTaskBtn = document.getElementById("addtask");
const taskListDiv = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
addTaskBtn.addEventListener("click", () => {
    const titleInput = document.getElementById("task-title");
    const dateInput = document.getElementById("task-date");
    const newTask = {
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
function getTasks() {
    return JSON.parse(localStorage.getItem("taskList") || "[]");
}
function saveTasks(tasks) {
    localStorage.setItem("taskList", JSON.stringify(tasks));
}
function renderTasks(tasks, filter = "all") {
    taskListDiv.innerHTML = "";
    tasks
        .filter((task) => {
        if (filter === "completed")
            return task.completed;
        if (filter === "pending")
            return !task.completed;
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
        if (task.completed)
            titleSpan.classList.add("completed");
        taskContent.appendChild(checkbox);
        taskContent.appendChild(titleSpan);
        taskDiv.appendChild(taskContent);
        taskListDiv.appendChild(taskDiv);
    });
}
function getActiveFilter() {
    const active = document.querySelector(".filter-btn.active");
    return (active === null || active === void 0 ? void 0 : active.dataset.filter) || "all";
}
filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter || "all";
        renderTasks(getTasks(), filter);
    });
});
window.addEventListener("DOMContentLoaded", () => {
    renderTasks(getTasks());
});
