const operationButtons = [...document.querySelectorAll(".operation-button")];
const difficultySelect = document.querySelector("#difficulty");
const problemCountOutput = document.querySelector("#problemCount");
const decreaseCountButton = document.querySelector("#decreaseCount");
const increaseCountButton = document.querySelector("#increaseCount");
const generateButton = document.querySelector("#generateButton");
const showAnswersInput = document.querySelector("#showAnswers");
const problemGrid = document.querySelector("#problemGrid");
const worksheetTitle = document.querySelector("#worksheetTitle");
const worksheetId = document.querySelector("#worksheetId");
const worksheetSelectionName = document.querySelector("#worksheetSelectionName");
const printButton = document.querySelector("#printButton");
const selectionNameInput = document.querySelector("#selectionName");
const saveSelectionButton = document.querySelector("#saveSelection");
const savedSelectionsSelect = document.querySelector("#savedSelections");
const loadSelectionButton = document.querySelector("#loadSelection");
const selectionStatus = document.querySelector("#selectionStatus");

const operations = ["addition", "subtraction", "multiplication", "division"];
let selectedOperations = [...operations];
let problemCount = 20;
const savedSelectionsKey = "problem-lab.saved-selections";

const ranges = {
  easy: { min: 1, max: 20 },
  medium: { min: 1, max: 100 },
  hard: { min: 1, max: 999 },
  extreme: { min: 1, max: 10000 }
};

const operationTitles = {
  mixed: "Mixed operations",
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division"
};

const difficultyTitles = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  extreme: "Extreme"
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeProblem(selectedOperation, difficulty) {
  const { min, max } = ranges[difficulty];

  if (selectedOperation === "addition") {
    const a = randomInt(min, max);
    const b = randomInt(min, max);
    return { expression: `${a} + ${b}`, answer: a + b };
  }

  if (selectedOperation === "subtraction") {
    let a = randomInt(min, max);
    let b = randomInt(min, max);
    if (difficulty !== "hard" && b > a) [a, b] = [b, a];
    if (difficulty === "hard" && b > a) [a, b] = [b, a];
    return { expression: `${a} − ${b}`, answer: a - b };
  }

  if (selectedOperation === "multiplication") {
    const upper = difficulty === "easy" ? 12 : difficulty === "medium" ? 25 : max;
    const lowerUpper = difficulty === "hard" ? 50 : upper;
    const a = randomInt(min, upper);
    const b = randomInt(min, lowerUpper);
    return { expression: `${a} × ${b}`, answer: a * b };
  }

  const divisor = randomInt(2, difficulty === "easy" ? 12 : difficulty === "medium" ? 25 : difficulty === "hard" ? 50 : max);
  const quotient = randomInt(min, difficulty === "easy" ? 12 : difficulty === "medium" ? 40 : difficulty === "hard" ? 100 : max);
  const dividend = divisor * quotient;
  return { expression: `${dividend} ÷ ${divisor}`, answer: quotient };
}

function renderProblems() {
  const difficulty = difficultySelect.value;
  worksheetId.textContent = randomInt(10000000, 99999999);
  document.title = `Problem Lab - ${worksheetId.textContent}`;
  const title = selectedOperations.length === 1
    ? operationTitles[selectedOperations[0]]
    : operationTitles.mixed;
  worksheetTitle.textContent = `${title} · ${difficultyTitles[difficulty]}`;
  problemGrid.replaceChildren();

  for (let index = 0; index < problemCount; index += 1) {
    const operation = selectedOperations[randomInt(0, selectedOperations.length - 1)];
    const problem = makeProblem(operation, difficulty);
    const card = document.createElement("article");
    card.className = "problem-card";

    const number = document.createElement("span");
    number.className = "problem-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const expression = document.createElement("span");
    expression.className = "problem-expression";
    expression.textContent = `${problem.expression} =`;

    const answer = document.createElement("span");
    answer.className = `answer-space${showAnswersInput.checked ? "" : " blank"}`;
    answer.dataset.answer = problem.answer;
    answer.textContent = showAnswersInput.checked ? problem.answer : " ";

    card.append(number, expression, answer);
    problemGrid.append(card);
  }
}

function updateOperationButtons() {
  operationButtons.forEach((item) => {
    const isActive = item.dataset.operation === "mixed"
      ? selectedOperations.length === operations.length
      : selectedOperations.includes(item.dataset.operation);
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
    item.disabled = isActive && item.dataset.operation !== "mixed" && selectedOperations.length === 1;
  });
}

function showWorksheetSelectionName(name) {
  worksheetSelectionName.textContent = name || "";
}

function readSavedSelections() {
  const saved = localStorage.getItem(savedSelectionsKey);
  if (saved === null) return [];

  const selections = JSON.parse(saved);
  if (!Array.isArray(selections) || selections.some((selection) =>
    !selection
      || typeof selection !== "object"
      || typeof selection.name !== "string"
      || !selection.name.trim()
      || !Array.isArray(selection.operations)
      || selection.operations.length === 0
      || new Set(selection.operations).size !== selection.operations.length
      || selection.operations.some((operation) => !operations.includes(operation))
      || !["easy", "medium", "hard", "extreme"].includes(selection.difficulty)
      || !Number.isInteger(selection.problemCount)
      || selection.problemCount < 4
      || selection.problemCount > 20
  )) {
    throw new Error("Saved selections are invalid.");
  }
  return selections;
}

function refreshSavedSelections() {
  const selectedName = savedSelectionsSelect.value;
  const selections = readSavedSelections();
  savedSelectionsSelect.replaceChildren(new Option("Choose a saved selection", ""));
  selections.forEach(({ name }) => {
    savedSelectionsSelect.add(new Option(name, name));
  });
  savedSelectionsSelect.value = selections.some(({ name }) => name === selectedName)
    ? selectedName
    : "";
  loadSelectionButton.disabled = !savedSelectionsSelect.value;
}

function showSelectionError(error) {
  selectionStatus.textContent = `Could not access saved selections: ${error.message}`;
}

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const operation = button.dataset.operation;
    if (operation === "mixed") {
      selectedOperations = [...operations];
    } else if (selectedOperations.includes(operation)) {
      if (selectedOperations.length === 1) return;
      selectedOperations = selectedOperations.filter((item) => item !== operation);
    } else {
      selectedOperations.push(operation);
    }

    problemCount = selectedOperations.length === 1 ? 10 : 20;
    problemCountOutput.textContent = problemCount;
    showWorksheetSelectionName("");
    updateOperationButtons();
    renderProblems();
  });
});

difficultySelect.addEventListener("change", () => {
  showWorksheetSelectionName("");
  renderProblems();
});

decreaseCountButton.addEventListener("click", () => {
  problemCount = Math.max(4, problemCount - 2);
  problemCountOutput.textContent = problemCount;
  showWorksheetSelectionName("");
  renderProblems();
});

increaseCountButton.addEventListener("click", () => {
  problemCount = Math.min(20, problemCount + 2);
  problemCountOutput.textContent = problemCount;
  showWorksheetSelectionName("");
  renderProblems();
});

generateButton.addEventListener("click", renderProblems);
savedSelectionsSelect.addEventListener("change", () => {
  loadSelectionButton.disabled = !savedSelectionsSelect.value;
});

saveSelectionButton.addEventListener("click", () => {
  const name = selectionNameInput.value.trim();
  if (!name) {
    selectionStatus.textContent = "Enter a name for this selection.";
    selectionNameInput.focus();
    return;
  }

  try {
    const selections = readSavedSelections();
    const selection = {
      name,
      operations: [...selectedOperations],
      difficulty: difficultySelect.value,
      problemCount
    };
    const existingIndex = selections.findIndex(
      (item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    );
    if (existingIndex === -1) selections.push(selection);
    else selections[existingIndex] = selection;
    localStorage.setItem(savedSelectionsKey, JSON.stringify(selections));
    refreshSavedSelections();
    savedSelectionsSelect.value = selection.name;
    loadSelectionButton.disabled = !savedSelectionsSelect.value;
    selectionNameInput.value = "";
    showWorksheetSelectionName(selection.name);
    selectionStatus.textContent = `Saved "${name}".`;
  } catch (error) {
    showSelectionError(error);
  }
});

loadSelectionButton.addEventListener("click", () => {
  try {
    const selection = readSavedSelections().find(
      (item) => item.name === savedSelectionsSelect.value
    );
    if (!selection) {
      selectionStatus.textContent = "Choose a saved selection to load.";
      return;
    }

    selectedOperations = [...selection.operations];
    difficultySelect.value = selection.difficulty;
    problemCount = selection.problemCount;
    problemCountOutput.textContent = problemCount;
    showWorksheetSelectionName(selection.name);
    updateOperationButtons();
    renderProblems();
    selectionStatus.textContent = `Loaded "${selection.name}".`;
  } catch (error) {
    showSelectionError(error);
  }
});

showAnswersInput.addEventListener("change", () => {
  problemGrid.querySelectorAll(".answer-space").forEach((answer) => {
    answer.classList.toggle("blank", !showAnswersInput.checked);
    answer.textContent = showAnswersInput.checked ? answer.dataset.answer : " ";
  });
});
printButton.addEventListener("click", () => window.print());

try {
  refreshSavedSelections();
} catch (error) {
  showSelectionError(error);
}
renderProblems();
