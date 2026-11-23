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
const printButton = document.querySelector("#printButton");

const operations = ["addition", "subtraction", "multiplication", "division"];
let selectedOperations = [...operations];
let problemCount = 20;

const ranges = {
  easy: { min: 1, max: 20 },
  medium: { min: 1, max: 100 },
  hard: { min: 1, max: 999 }
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
  hard: "Hard"
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

  const divisor = randomInt(2, difficulty === "easy" ? 12 : difficulty === "medium" ? 25 : 50);
  const quotient = randomInt(min, difficulty === "easy" ? 12 : difficulty === "medium" ? 40 : 100);
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
    answer.textContent = showAnswersInput.checked ? problem.answer : " ";

    card.append(number, expression, answer);
    problemGrid.append(card);
  }
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
    operationButtons.forEach((item) => {
      const isActive = item.dataset.operation === "mixed"
        ? selectedOperations.length === operations.length
        : selectedOperations.includes(item.dataset.operation);
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
      item.disabled = isActive && item.dataset.operation !== "mixed" && selectedOperations.length === 1;
    });
    renderProblems();
  });
});

difficultySelect.addEventListener("change", renderProblems);

decreaseCountButton.addEventListener("click", () => {
  problemCount = Math.max(4, problemCount - 2);
  problemCountOutput.textContent = problemCount;
  renderProblems();
});

increaseCountButton.addEventListener("click", () => {
  problemCount = Math.min(20, problemCount + 2);
  problemCountOutput.textContent = problemCount;
  renderProblems();
});

generateButton.addEventListener("click", renderProblems);
showAnswersInput.addEventListener("change", renderProblems);
printButton.addEventListener("click", () => window.print());

renderProblems();
