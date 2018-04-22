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
  await getFilterTopics(userId);
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
      document.getElementById("edit_function_name_input").value = question.functionName;
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
      deleteTestCase(testcase.testcaseId, userId, questionId);
    }
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
  document.getElementById("new_function_name_input").value = "";
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
  document.getElementById("new_function_name_input").value = "";
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
    body: "action=CREATE&question=" + encodeURIComponent(document.getElementById("new_question_input").value) + "&topic=" + document.getElementById("new_topic_input").value + "&difficultyLevel=" + document.getElementById("new_difficulty_input").value + "&functionName=" + document.getElementById("new_function_name_input").value,
    method: "POST"
  });
  console.log(await response.text());
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
  //console.log(await response.text());
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
  var select = document.getElementById("topic_filter");
  var length = select.options.length;
  for (i = 1; i < length; i++) {
    select.remove(length - i);
  }
  var topic_filter = document.getElementById("topic_filter");
  const clone = topic_filter.cloneNode(true);
  topic_filter.parentNode.replaceChild(clone, topic_filter);
  document.getElementById("topic_filter").addEventListener("change", async function() {
    await filter();
  });
  var difficulty_filter = document.getElementById("difficulty_filter");
  const clone1 = difficulty_filter.cloneNode(true);
  difficulty_filter.parentNode.replaceChild(clone1, difficulty_filter);
  document.getElementById("difficulty_filter").addEventListener("change", async function() {
    await filter();
  });
  document.getElementById("search_filter").value = "";
  const response = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  var topics = [];
  const responseJSON = await response.json();
  responseJSON.forEach((question) => {
    if (question.instructorId != userId) return;
    if ((question.instructorId == userId) && (topics.indexOf(question.topic) == -1)) {
      var x = document.getElementById("topic_filter");
      var option = document.createElement("option");
      topics.push(question.topic);
      option.text = question.topic;
      x.add(option);
    }
  });
}

async function filter() {
  const search =  document.getElementById("search_filter").value.toUpperCase();
  const topic = document.getElementById("topic_filter").value;
  const difficulty = document.getElementById("difficulty_filter").value;
  var table = document.getElementById("question_bank_table"), i;
  for (i = 1; i < table.rows.length; i++) {
    table.rows[i].style.display = "";
  }
  if (topic != "-") {
    for (i = 1; i < table.rows.length; i++) {
      if (table.rows[i].cells[2].innerHTML != topic) {
        table.rows[i].style.display = "none";
      }
    }
  }
  if (difficulty != "-") {
    for (i = 1; i < table.rows.length; i++) {
      if (table.rows[i].cells[3].innerHTML != difficulty) {
        table.rows[i].style.display = "none";
      }
    }
  }
  if (search != "") {
    for (i = 1; i < table.rows.length; i++) {
      if (table.rows[i].cells[1].innerHTML.toUpperCase().indexOf(search) === (-1)) {
        table.rows[i].style.display = "none";
      }
    }
  }
}
// End Question Tab Functions

// Start Exam Tab Functions
async function populateExamTab(userId) {
  const delete_exam_button = document.getElementById("delete_exam_button");
  const clone = delete_exam_button.cloneNode(true);
  delete_exam_button.parentNode.replaceChild(clone, delete_exam_button);
  const response = await fetch("exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  var gradedExamIds = [];
  const exam_bank_container = document.getElementById("exam_bank_container");
  exam_bank_container.innerHTML = "<table id='exam_bank_table'><tr><th>ID</th><th>Title</th><th>Description</th></tr></table";
  const graded_exam_bank_container = document.getElementById("graded_exam_bank_container");
  graded_exam_bank_container.innerHTML = "<table id='graded_exam_bank_table'><tr><th>Exam ID</th><th>Student ID</th></tr></table";
  responseJSON.forEach((exam) => {
    const examId = exam.examId;
    if (exam.instructorId != userId) return;
    if (exam.gradeVisible > 0) {
      gradedExamIds.push(examId);
      return;
    }
    const tbody = document.getElementById("exam_bank_table").tBodies[0];
    const tr = tbody.appendChild(document.createElement("tr"));
    tr.addEventListener("click", function() {
      selectExamBank(tr, userId, examId);
    });
    tr.innerHTML = `<td>${examId}</td><td>${exam.title}</td><td>${exam.description}</td>`;
  });
  const responseSE = await fetch("student_exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseSEJSON = await responseSE.json();
  responseSEJSON.forEach((student_exam) => {
    if (gradedExamIds.indexOf(student_exam.examId) > -1) return;
    if (student_exam.examSubmitted == 1) {
      const tbody = document.getElementById("graded_exam_bank_table").tBodies[0];
      const tr = tbody.appendChild(document.createElement("tr"));
      tr.addEventListener("click", function() {
        selectExamGrader(tr, userId, student_exam.examId);
      });
      tr.innerHTML = `<td>${student_exam.examId}</td><td>${student_exam.studentId}</td>`;
    }
  });
}

function selectExamBank(thisTR, userId, examId) {
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
  // delete exam button Code
  var delete_exam_button = document.getElementById("delete_exam_button");
  const clone = delete_exam_button.cloneNode(true);
  delete_exam_button.parentNode.replaceChild(clone, delete_exam_button);
  delete_exam_button = document.getElementById("delete_exam_button");
  delete_exam_button.addEventListener("click", function() {
    deleteExam(userId, examId);
  });
  // publish exam button Code
  var publish_exam_button = document.getElementById("publish_exam_button");
  const clone2 = publish_exam_button.cloneNode(true);
  publish_exam_button.parentNode.replaceChild(clone2, publish_exam_button);
  publish_exam_button = document.getElementById("publish_exam_button");
  publish_exam_button.addEventListener("click", function() {
    publishExam(examId);
  });
}

async function deleteExam(userId, examId) {
  const response = await fetch("exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=DELETE&examId=" + examId,
    method: "POST"
  });
  await populateExamTab(userId);
}

function selectExamGrader(thisTR, userId, examId) {
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
}

async function openExamCreator(userId) {
  document.getElementById("exam_creator_title_input").value = "";
  document.getElementById("exam_creator_description_input").value = "";
  const response = await fetch("question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  const quest_bank_table_container = document.getElementById("exam_creator_question_bank_container");
  quest_bank_table_container.innerHTML = "<table id='exam_creator_question_bank_table'><tr><th>ID</th><th>Question</th><th>Topic</th><th>Difficulty</th></tr></table";
  const tbody = quest_bank_table_container.querySelector("tbody");
  responseJSON.forEach((question) => {
    const questionId = question.questionId;
    if (question.instructorId != userId) return;
    const tr = tbody.appendChild(document.createElement("tr"));
    tr.addEventListener("click", function() {
      selectQuestionExamCreator(tr, userId, questionId, question.question, question.topic, question.difficultyLevel);
    });
    tr.innerHTML = `<td>${questionId}</td><td>${question.question}</td><td>${question.topic}</td><td>${question.difficultyLevel}</td>`;
  });
  document.getElementById("exam_creator").style.display = "block";
}

function selectQuestionExamCreator(thisTR, userId, questionId, question, topic, difficultyLevel) {
  var add_question_exam_creator_button = document.getElementById("add_question_exam_creator_button");
  const clone = add_question_exam_creator_button.cloneNode(true);
  add_question_exam_creator_button.parentNode.replaceChild(clone, add_question_exam_creator_button);
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
  document.getElementById("add_question_exam_creator_button").addEventListener("click", function() {
    addQuestionExamCreator(userId, questionId, question, topic, difficultyLevel);
  });
}

function selectQuestionsTBAExamCreator(thisTR, userId, questionId, question, topic, difficultyLevel) {
  var remove_question_exam_creator_button = document.getElementById("remove_question_exam_creator_button");
  const clone = remove_question_exam_creator_button.cloneNode(true);
  remove_question_exam_creator_button.parentNode.replaceChild(clone, remove_question_exam_creator_button);
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
  document.getElementById("remove_question_exam_creator_button").addEventListener("click", function() {
    removeQuestionExamCreator(userId, questionId, question, topic, difficultyLevel);
  });
}

function removeQuestionExamCreator(userId, questionId, question, topic, difficultyLevel) {
  var remove_question_exam_creator_button = document.getElementById("remove_question_exam_creator_button");
  const clone = remove_question_exam_creator_button.cloneNode(true);
  remove_question_exam_creator_button.parentNode.replaceChild(clone, remove_question_exam_creator_button);
  const tbody = document.getElementById("exam_creator_question_bank_table").querySelector("tbody");
  if (tbody.rows.length == 1) {
    const tr = tbody.appendChild(document.createElement("tr"));
    tr.addEventListener("click", function() {
      selectQuestionExamCreator(tr, userId, questionId, question, topic, difficultyLevel);
    });
    tr.innerHTML = `<td>${questionId}</td><td>${question}</td><td>${topic}</td><td>${difficultyLevel}</td>`;
  } else {
    for (var y = 1; y < tbody.rows.length; y++) {
      if (tbody.rows[y].cells[0].innerHTML > questionId) {
        var tr = document.getElementById("exam_creator_question_bank_table").insertRow(y);
        var cell0 = tr.insertCell(0);
        var cell1 = tr.insertCell(1);
        var cell2 = tr.insertCell(2);
        var cell3 = tr.insertCell(3);
        cell0.innerHTML = questionId;
        cell1.innerHTML = question;
        cell2.innerHTML = topic;
        cell3.innerHTML = difficultyLevel;
        tr.addEventListener("click", function() {
          selectQuestionExamCreator(tr, userId, questionId, question, topic, difficultyLevel);
        });
        break;
      }
      if (tbody.rows[y].cells[0].innerHTML <= questionId) {
        if (y < tbody.rows.length - 1) {
          continue;
        }
        var tr = document.getElementById("exam_creator_question_bank_table").insertRow(y+1);
        var cell0 = tr.insertCell(0);
        var cell1 = tr.insertCell(1);
        var cell2 = tr.insertCell(2);
        var cell3 = tr.insertCell(3);
        cell0.innerHTML = questionId;
        cell1.innerHTML = question;
        cell2.innerHTML = topic;
        cell3.innerHTML = difficultyLevel;
        tr.addEventListener("click", function() {
          selectQuestionExamCreator(tr, userId, questionId, question, topic, difficultyLevel);
        });
        break;
      }
    }
  }
  const tbody2 = document.getElementById("exam_creator_questions_tba_container").querySelector("tbody");
  for (var i = 1; i < tbody2.rows.length; i++) {
    if (tbody2.rows[i].cells[0].innerHTML == questionId) document.getElementById("exam_creator_questions_tba_table").deleteRow(i);
  }
  add_question_exam_creator_button = document.getElementById("add_question_exam_creator_button");
  const clone2 = add_question_exam_creator_button.cloneNode(true);
  add_question_exam_creator_button.parentNode.replaceChild(clone2, add_question_exam_creator_button);

  remove_question_exam_creator_button = document.getElementById("remove_question_exam_creator_button");
  const clone3 = remove_question_exam_creator_button.cloneNode(true);
  remove_question_exam_creator_button.parentNode.replaceChild(clone3, remove_question_exam_creator_button);
}

function addQuestionExamCreator(userId, questionId, question, topic, difficultyLevel) {
  var add_question_exam_creator_button = document.getElementById("add_question_exam_creator_button");
  const clone = add_question_exam_creator_button.cloneNode(true);
  add_question_exam_creator_button.parentNode.replaceChild(clone, add_question_exam_creator_button);
  const tbody = document.getElementById("exam_creator_questions_tba_container").querySelector("tbody");
  if (tbody.rows.length == 1) {
    const tr = tbody.appendChild(document.createElement("tr"));
    tr.addEventListener("click", function() {
      selectQuestionsTBAExamCreator(tr, userId, questionId, question, topic, difficultyLevel);
    });
    tr.innerHTML = `<td>${questionId}</td><td>${question}</td><td>${topic}</td><td>${difficultyLevel}</td><td><input></td>`;
  } else {
    for (var y = 1; y < tbody.rows.length; y++) {
      if (tbody.rows[y].cells[0].innerHTML > questionId) {
        var tr = document.getElementById("exam_creator_questions_tba_table").insertRow(y);
        var cell0 = tr.insertCell(0);
        var cell1 = tr.insertCell(1);
        var cell2 = tr.insertCell(2);
        var cell3 = tr.insertCell(3);
        var cell4 = tr.insertCell(4);
        cell0.innerHTML = questionId;
        cell1.innerHTML = question;
        cell2.innerHTML = topic;
        cell3.innerHTML = difficultyLevel;
        cell4.innerHTML = "<input>";
        tr.addEventListener("click", function() {
          selectQuestionsTBAExamCreator(tr, userId, questionId, question, topic, difficultyLevel);
        });
        break;
      }
      if (tbody.rows[y].cells[0].innerHTML <= questionId) {
        if (y < tbody.rows.length - 1) {
          continue;
        }
        var tr = document.getElementById("exam_creator_questions_tba_table").insertRow(y+1);
        var cell0 = tr.insertCell(0);
        var cell1 = tr.insertCell(1);
        var cell2 = tr.insertCell(2);
        var cell3 = tr.insertCell(3);
        var cell4 = tr.insertCell(4);
        cell0.innerHTML = questionId;
        cell1.innerHTML = question;
        cell2.innerHTML = topic;
        cell3.innerHTML = difficultyLevel;
        cell4.innerHTML = "<input>";
        tr.addEventListener("click", function() {
          selectQuestionsTBAExamCreator(tr, userId, questionId, question, topic, difficultyLevel);
        });
        break;
      }
    }
  }
  const tbody2 = document.getElementById("exam_creator_question_bank_container").querySelector("tbody");
  for (var i = 1; i < tbody2.rows.length; i++) {
    if (tbody2.rows[i].cells[0].innerHTML == questionId) document.getElementById("exam_creator_question_bank_table").deleteRow(i);
  }
  add_question_exam_creator_button = document.getElementById("add_question_exam_creator_button");
  const clone2 = add_question_exam_creator_button.cloneNode(true);
  add_question_exam_creator_button.parentNode.replaceChild(clone2, add_question_exam_creator_button);
}

function closeExamCreator() {
  document.getElementById("exam_creator").style.display = "none";
  document.getElementById("exam_creator_title_input").value = "";
  document.getElementById("exam_creator_description_input").value = "";
  const tbody2 = document.getElementById("exam_creator_questions_tba_container").querySelector("tbody");
  for (var i = tbody2.rows.length - 1; i > 0; i--) {
    document.getElementById("exam_creator_questions_tba_table").deleteRow(i);
  }
}

function closeExamEditor() {
  document.getElementById("exam_editor").style.display = "none";
  document.getElementById("exam_editor_title_input").value = "";
  document.getElementById("exam_editor_description_input").value = "";
}

async function createExam(userId) {
  var table = document.getElementById("exam_creator_questions_tba_table");
  var length = table.rows.length;
  const response = await fetch("exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=CREATE&title=" + document.getElementById("exam_creator_title_input").value + "&description=" + document.getElementById("exam_creator_description_input").value,
    method: "POST"
  });
  const response2 = await fetch("exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  var response2JSON = await response2.json();
  var length2 = response2JSON.length;
  if (length > 1) {
    for (var i = 1; i < length; i++) {
      const response = await fetch("exam_questions_handler.php", {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
        credentials: "include",
        body: "action=CREATE&examId=" + response2JSON[length2 - 1].examId + "&questionId=" + table.rows[i].cells[0].innerHTML + "&points=" + table.rows[i].cells[4].firstChild.value,
        method: "POST"
      });
    }
  }
  populateExamTab(userId);
}

async function publishExam(examId) {
  const response = await fetch("users_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  var responseJSON = await response.json();
  for (var i = 0; i < responseJSON.length; i++) {
    if (responseJSON[i].isInstructor == 0) {
      const response = await fetch("student_exam_handler.php", {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
        credentials: "include",
        body: "action=CREATE&examId=" + examId + "&studentId=" + responseJSON[i].userId,
        method: "POST"
      });
    }
  }
}

async function saveExam(userId) {
  //console.log(userId);
}
// End Exam Tab Functions
