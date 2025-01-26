// Example tasks data
const tasks = [
    { id: 📜, title: "Join SupremeAmer coin airdrop", url: "https://t.me/Suprememer_bot" },
    { id: 📜, title: "Join SupremeAmer channel", url: "https://t.me/SupremeAmer_community" },
    // Add more tasks here...
];

// Function to render tasks
function renderTasks() {
    const taskList = document.querySelector(".task-list");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");

        const taskTitle = document.createElement("h2");
        taskTitle.textContent = task.title;

        const startButton = document.createElement("button");
        startButton.classList.add("start-button");
        startButton.textContent = "Start";
        startButton.addEventListener("click", () => {
            startTask(task);
        });

        const verifyButton = document.createElement("button");
        verifyButton.classList.add("verify-button");
        verifyButton.textContent = "Verify";
        verifyButton.addEventListener("click", () => {
            verifyTask(task);
        });

        taskContainer.appendChild(taskTitle);
        taskContainer.appendChild(startButton);
        taskContainer.appendChild(verifyButton);

        taskList.appendChild(taskContainer);
    });
}

// Function to start a task
function startTask(task) {
    const startedTasks = JSON.parse(localStorage.getItem("startedTasks") || "[]");

    if (startedTasks.includes(task.id)) {
        // Show error message
        const errorPopup = document.getElementById("error-popup");
        errorPopup.style.display = "block";
        setTimeout(() => {
            errorPopup.style.display = "none";
        }, 5000);
    } else {
        // Open task URL
        window.open(task.url, "_blank");

        // Add task to started tasks
        startedTasks.push(task.id);
        localStorage.setItem("startedTasks", JSON.stringify(startedTasks));
    }
}

// Function to verify a task
function verifyTask(task) {
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");

    if (completedTasks.includes(task.id)) {
        // Do nothing
    } else {
        // Add task to completed tasks
        completedTasks.push(task.id);
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

        // Remove task from task list
        const taskList = document.querySelector(".

task-list");
const taskContainer = taskList.querySelector(`.task-container:nth-child(${tasks.indexOf(task) + 1})`);
taskContainer.remove();

// Show complete message
const completePopup = document.getElementById("complete-popup");
completePopup.style.display = "block";
setTimeout(() => {
  completePopup.style.display = "none";
}, 5000);
}
}

// Render tasks on page load
renderTasks();
