// Start Question Tab Functions
async function populateQuestionTab(userId) {
  const delete_question_button = document.getElementById("delete_question_button");
  const clone = delete_question_button.cloneNode(true);
  delete_question_button.parentNode.replaceChild(clone, delete_question_button);
  const response = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  const quest_bank_table_container = document.getElementById("question_bank_table_container");
  quest_bank_table_container.innerHTML = "<table id='question_bank_table'><tr><th>ID</th><th>Question</th><th>Topic</th><th>Difficulty</th></tr></table";
  const tbody = quest_bank_table_container.querySelector("tbody");
  responseJSON.forEach((question) => {
    const questionId = question.questionId;
    if (question.instructorId != userId) return;
    const tr = tbody.appendChild(document.createElement("tr"));
    tr.addEventListener("click", function() {
      selectQuestionQuestTab(tr, userId, questionId);
    });
    tr.innerHTML = `<td>${questionId}</td><td>${question.question}</td><td>${question.topic}</td><td>${question.difficultyLevel}</td>`;
  });
}

function selectQuestionQuestTab(thisTR, userId, questionId) {
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
  var delete_question_button = document.getElementById("delete_question_button");
  const clone = delete_question_button.cloneNode(true);
  delete_question_button.parentNode.replaceChild(clone, delete_question_button);
  delete_question_button = document.getElementById("delete_question_button");
  delete_question_button.addEventListener("click", function() {
    delete_question_from_quest_bank(questionId, userId);
  });
}

async function delete_question_from_quest_bank(questionId, userId) {
  const response = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=DELETE&questionId=" + questionId,
    method: "POST"
  });
  populateQuestionTab(userId);
}

function addTestCaseToNewQuestion() {
  var newdiv = document.createElement("div");
  newdiv.innerHTML = "<textarea id='new_test_case_inputs[]' placeholder='input'></textarea><textarea id='new_test_case_outputs[]' placeholder='output'></textarea>";
  document.getElementById("new_test_case_container").appendChild(newdiv);
}

function removeTestCaseToNewQuestion() {
  var div = document.getElementById("new_test_case_container");
  if (div.childNodes.length > 0) {
    div.removeChild(div.lastChild);
  }
}

async function createNewQuestion() {
  const response = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=CREATE&question=" + encodeURIComponent(document.getElementById("new_question_input").value) + "&topic=" + document.getElementById("new_topic_input").value + "&difficultyLevel=" + document.getElementById("new_difficulty_input").value,
    method: "POST"
  });
  console.log(encodeURIComponent(document.getElementById("new_question_input").value));
  console.log(await response.text());
  //createNewTestCase("asd","asd","asd");
  /*
  var oldTestOutputsArray = document.querySelectorAll('[id^="oldTestOutputs[]"]');
  for (var i = 0; i < oldTestInputsArray.length; i++) {
  */
}

async function createNewTestCase(questionId, input, output) {
  console.log("createNewTestCase entered");
}
// End Question Tab Functions
