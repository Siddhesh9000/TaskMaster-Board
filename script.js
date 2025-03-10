function loadIdeas() {
  console.log("Loading ideas...");
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];

  ["toDo", "inProgress", "review", "done"].forEach((id) => {
    const list = document.getElementById(id);
    if (list) list.innerHTML = "";
  });

  ideas.forEach((idea, index) => {
    console.log("Processing idea:", idea);
    const list = document.getElementById(idea.category);
    if (!list) {
      console.error(`Error: Category '${idea.category}' does not exist.`);
      return;
    }

    const ideaElement = document.createElement("li");
    ideaElement.classList.add(
      "p-3",
      "bg-white",
      "border",
      "rounded-md",
      "flex",
      "justify-between",
      "items-center",
      "shadow"
    );

    ideaElement.innerHTML = `
    <div>
        <p class="font-medium">${idea.text}</p>
        <small class="text-sm text-gray-600">Priority: ${
          idea.priority
        } | Due: ${idea.dueDate || "N/A"}</small>
    </div>
    <div class="flex flex-col gap-2 w-full">
        <button onclick="editIdea(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded w-full">Edit</button>
        <button onclick="deleteIdea(${index})" class="bg-red-500 text-white px-2 py-1 rounded w-full">Delete</button>
    </div>
`;

    list.appendChild(ideaElement);
  });
}

function addIdea() {
  const text = document.getElementById("ideaText").value.trim();
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;
  const category = document.getElementById("category").value;

  if (!text) {
    alert("Please enter a task");
    return;
  }

  console.log(
    `Adding task: ${text}, Priority: ${priority}, Due: ${dueDate}, Category: ${category}`
  );
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  ideas.push({ text, priority, dueDate, category });

  localStorage.setItem("ideas", JSON.stringify(ideas));
  document.getElementById("ideaText").value = "";
  loadIdeas();
}

function deleteIdea(index) {
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  ideas.splice(index, 1);
  localStorage.setItem("ideas", JSON.stringify(ideas));
  loadIdeas();
}

function editIdea(index) {
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  const newText = prompt("Edit Task", ideas[index].text);
  if (newText !== null) {
    ideas[index].text = newText;
    localStorage.setItem("ideas", JSON.stringify(ideas));
    loadIdeas();
  }
}

function searchIdeas() {
  const searchText = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll("ul li").forEach((li) => {
    li.style.display = li.textContent.toLowerCase().includes(searchText)
      ? "block"
      : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadIdeas();

  ["toDo", "inProgress", "review", "done"].forEach((id) => {
    const list = document.getElementById(id);
    if (!list) {
      console.error(`Sortable Error: List with id '${id}' not found.`);
      return;
    }

    new Sortable(list, {
      group: "shared",
      animation: 150,
      onEnd: function (evt) {
        console.log(`Moved task from ${evt.from.id} to ${evt.to.id}`);

        let ideas = JSON.parse(localStorage.getItem("ideas")) || [];

        // Find the task that was moved based on its text content
        const movedTaskText = evt.item.querySelector("p").innerText;
        const taskIndex = ideas.findIndex(
          (idea) => idea.text === movedTaskText
        );

        if (taskIndex === -1) {
          console.error("Task not found in localStorage!");
          return;
        }

        // Update category
        ideas[taskIndex].category = evt.to.id;

        // Save updated ideas
        localStorage.setItem("ideas", JSON.stringify(ideas));

        // Reload UI
        loadIdeas();
      },
    });
  });
});
