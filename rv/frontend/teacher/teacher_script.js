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
  var edit_question_button = document.getElementById("edit_question_button");
  const clone1 = edit_question_button.cloneNode(true);
  edit_question_button.parentNode.replaceChild(clone1, edit_question_button);
  var delete_question_button2 = document.getElementById("delete_question_button");
  const clone2 = delete_question_button2.cloneNode(true);
  delete_question_button2.parentNode.replaceChild(clone2, delete_question_button2);
}

function selectQuestionQuestTab(thisTR, userId, questionId) {
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
  // Edit Question code
  var edit_question_button = document.getElementById("edit_question_button");
  const clone1 = edit_question_button.cloneNode(true);
  edit_question_button.parentNode.replaceChild(clone1, edit_question_button);
  edit_question_button = document.getElementById("edit_question_button");
  edit_question_button.addEventListener("click", function() {
    edit_question_from_quest_bank(questionId, userId);
  });
  // Delete question code
  var delete_question_button = document.getElementById("delete_question_button");
  const clone = delete_question_button.cloneNode(true);
  delete_question_button.parentNode.replaceChild(clone, delete_question_button);
  delete_question_button = document.getElementById("delete_question_button");
  delete_question_button.addEventListener("click", function() {
    delete_question_from_quest_bank(questionId, userId);
  });
}

async function edit_question_from_quest_bank(questionId, userId) {
  var div = document.getElementById("edit_test_case_container");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  var newdiv = document.getElementById("edit_new_test_case_container");
  while (newdiv.firstChild) {
    newdiv.removeChild(newdiv.firstChild);
  }
  const response = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  responseJSON.forEach((question) => {
    if (question.questionId != questionId) return;
    if (question.questionId == questionId) {
      document.getElementById("edit_question_input").value = question.question;
      document.getElementById("edit_topic_input").value = question.topic;
      document.getElementById("edit_difficulty_input").value = question.difficultyLevel;
    }
  });
  const responseTC = await fetch("test_case_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseTCJSON = await responseTC.json();
  responseTCJSON.forEach((testcase) => {
    if (testcase.questionId != questionId) return;
    if (testcase.questionId == questionId) {
      var newdiv = document.createElement("div");
      newdiv.innerHTML = "<button id='edit_question_delete_test_case_button" + testcase.testcaseId + "'>X</button><textarea id='edit_test_case_inputs[]' placeholder='input'>" + testcase.input + "</textarea><textarea id='edit_test_case_outputs[]' placeholder='output'>" + testcase.output + "</textarea>";
      document.getElementById("edit_test_case_container").appendChild(newdiv);
    }
  });
  responseTCJSON.forEach((testcase) => {
    if (testcase.questionId != questionId) return;
    if (testcase.questionId == questionId) {
      document.getElementById("edit_question_delete_test_case_button" + testcase.testcaseId).addEventListener("click", function() {
        deleteTestCase(testcase.testcaseId, userId, questionId);
      });
    }
  });
  var save_question_button = document.getElementById("save_question_button");
  const clonesave = save_question_button.cloneNode(true);
  save_question_button.parentNode.replaceChild(clonesave, save_question_button);
  save_question_button = document.getElementById("save_question_button");
  save_question_button.addEventListener("click", function() {
    saveQuestion(questionId, userId);
  });
  document.getElementById("question_editor_container").style.display = "block";
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
  await populateQuestionTab(userId);
  closeQuestionEditor();
  closeQuestionCreator();
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

function addEditNewTestCase() {
  var newdiv = document.createElement("div");
  newdiv.innerHTML = "<textarea id='edit_new_test_case_inputs[]' placeholder='input'></textarea><textarea id='edit_new_test_case_outputs[]' placeholder='output'></textarea>";
  document.getElementById("edit_new_test_case_container").appendChild(newdiv);
}

function removeEditNewTestCase() {
  var div = document.getElementById("edit_new_test_case_container");
  if (div.childNodes.length > 0) {
    div.removeChild(div.lastChild);
  }
}

function openQuestionCreator(userId) {
  document.getElementById("new_question_input").value = "";
  document.getElementById("new_topic_input").value = "";
  document.getElementById("new_function_type").value = "return";
  document.getElementById("new_function_name_input").value = "";
  document.getElementById("new_arguments_input").value = "";
  document.getElementById("new_difficulty_input").value = "1";
  var div = document.getElementById("new_test_case_container");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  populateQuestionTab(userId);
  document.getElementById("question_creator_container").style.display = "block";
}

function closeQuestionCreator() {
  document.getElementById("question_creator_container").style.display = "none";
  document.getElementById("new_question_input").value = "";
  document.getElementById("new_topic_input").value = "";
  document.getElementById("new_function_type").value = "return";
  document.getElementById("new_function_name_input").value = "";
  document.getElementById("new_arguments_input").value = "";
  document.getElementById("new_difficulty_input").value = "1";
  var div = document.getElementById("new_test_case_container");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function closeQuestionEditor() {
  document.getElementById("question_editor_container").style.display = "none";
  var div = document.getElementById("edit_test_case_container");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  var newdiv = document.getElementById("edit_new_test_case_container");
  while (newdiv.firstChild) {
    newdiv.removeChild(newdiv.firstChild);
  }
  var edit_question_button = document.getElementById("edit_question_button");
  const clone1 = edit_question_button.cloneNode(true);
  edit_question_button.parentNode.replaceChild(clone1, edit_question_button);
  var delete_question_button = document.getElementById("delete_question_button");
  const clone = delete_question_button.cloneNode(true);
  delete_question_button.parentNode.replaceChild(clone, delete_question_button);
}

async function createNewQuestion(userId) {
  const response = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=CREATE&question=" + encodeURIComponent(document.getElementById("new_question_input").value) + "&topic=" + document.getElementById("new_topic_input").value + "&difficultyLevel=" + document.getElementById("new_difficulty_input").value,
    method: "POST"
  });
  const responseREAD = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await responseREAD.json();
  var newTestCaseInputsArray = document.querySelectorAll('[id^="new_test_case_inputs[]"]');
  var newTestCaseOutputsArray = document.querySelectorAll('[id^="new_test_case_outputs[]"]');
  for (var i = 0; i < newTestCaseInputsArray.length; i++) {
    await createNewTestCase(await responseJSON[responseJSON.length - 1].questionId, encodeURIComponent(newTestCaseInputsArray[i].value), encodeURIComponent(newTestCaseOutputsArray[i].value));
  }
  await populateQuestionTab(userId);
  document.getElementById("question_creator_container").style.display = "none";
  await edit_question_from_quest_bank(await responseJSON[responseJSON.length - 1].questionId, userId);
}

async function createNewTestCase(questionId, input, output) {
  const response = await fetch("test_case_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=CREATE&questionId=" + questionId + "&input=" + input + "&output=" + output,
    method: "POST"
  });
}

async function updateTestCaseInput(testcaseId, input) {
  const response = await fetch("test_case_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=UPDATEINPUT&testcaseId=" + testcaseId + "&input=" + input,
    method: "POST"
  });
}

async function updateTestCaseOutput(testcaseId, output) {
  const response = await fetch("test_case_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=UPDATEOUTPUT&testcaseId=" + testcaseId + "&output=" + output,
    method: "POST"
  });
}

async function deleteTestCase(testcaseId, userId, questionId) {
  const response = await fetch("test_case_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=DELETE&testcaseId=" + testcaseId,
    method: "POST"
  });
  await edit_question_from_quest_bank(questionId, userId);
}

async function saveQuestion(questionId, userId) {
  const responseQuestion = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=UPDATEQUESTION&questionId=" + questionId + "&question=" + encodeURIComponent(document.getElementById("edit_question_input").value),
    method: "POST"
  });
  const responseTopic = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=UPDATETOPIC&questionId=" + questionId + "&topic=" + document.getElementById("edit_topic_input").value,
    method: "POST"
  });
  const responseDifficulty = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=UPDATEDIFFICULTY&questionId=" + questionId + "&difficultyLevel=" + document.getElementById("edit_difficulty_input").value,
    method: "POST"
  });

  var editTestCaseInputsArray = document.querySelectorAll('[id^="edit_test_case_inputs[]"]');
  var editTestCaseOutputsArray = document.querySelectorAll('[id^="edit_test_case_outputs[]"]');

  const responseTC = await fetch("test_case_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  var testCaseCount = 0;
  const responseTCJSON = await responseTC.json();
  responseTCJSON.forEach((testcase) => {
    if (testcase.questionId != questionId) return;
    if (testcase.questionId == questionId) {
      updateTestCaseInput(testcase.testcaseId, encodeURIComponent(editTestCaseInputsArray[testCaseCount].value));
      updateTestCaseOutput(testcase.testcaseId, encodeURIComponent(editTestCaseOutputsArray[testCaseCount].value));
      testCaseCount++;
    }
  });
  var editNewTestCaseInputsArray = document.querySelectorAll('[id^="edit_new_test_case_inputs[]"]');
  var editNewTestCaseOutputsArray = document.querySelectorAll('[id^="edit_new_test_case_outputs[]"]');
  for (var i = 0; i < editNewTestCaseInputsArray.length; i++) {
    await createNewTestCase(questionId, encodeURIComponent(editNewTestCaseInputsArray[i].value), encodeURIComponent(editNewTestCaseOutputsArray[i].value));
  }
  await populateQuestionTab(userId);
  await edit_question_from_quest_bank(questionId, userId);
}

async function getFilterTopics(userId) {
  const response = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  responseJSON.forEach((question) => {
    if (question.instructorId != userId) return;
    if (question.instructorId == userId) {
      var x = document.getElementById("topic_filter");
      var option = document.createElement("option");
      option.text = question.topic;
      x.add(option);
    }
  });
}
// End Question Tab Functions
