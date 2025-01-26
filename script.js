There could be several reasons why the task page is blank. Here are a few potential causes:

// Example tasks data
const tasks = [
  { id: 1, title: "JOIN OUR COMMUNITY", url: "https://t.me/SupremeAmer_community" },
  { id: 2, title: "JOIN THE AIRDROP", url: "https://t.me/Suprememer_bot" },
  // Add more tasks here...
];

console.log("Tasks data:", tasks);

// Function to render tasks
function renderTasks() {
  console.log("Rendering tasks...");
  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    console.log("Rendering task:", task.title);
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

// Render tasks on page load
renderTasks();
