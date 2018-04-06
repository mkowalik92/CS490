var student_exams;
var studentIds = [];
var examCreatorQuestionBankJSON;
var questionToNotShow = [];
var newestExamId;
var gradedExams = [];

// All global below this are for only the exam Gradervar questionIds = [];
var questionIds = []; // Array containing all question Ids in the exam
var questionStrings = {}; // List of question strings by question id
var pointsPerQuestion = []; // Amount of points possible for answer question right
var maxPoints = 0; // Max possible points one can achieve

var pointsAwarded = 0; // Total points awarded out of max
var pointsAwardedPerQuestion = [];

function switchTabs(choosenTab, userId) {
  if (choosenTab === "quest_tab") {
    var quest = document.getElementById("quest_tab");
    quest.style.display = "block";
    var exam = document.getElementById("exam_tab");
    exam.style.display = "none";
  }
  if (choosenTab === "exam_tab") {
    var quest = document.getElementById("quest_tab");
    quest.style.display = "none";
    var exam = document.getElementById("exam_tab");
    exam.style.display = "block";
    getExams(userId);
  }
}

function openQuestionCreator() {
  var questCreator = document.getElementById("quest_creator");
  questCreator.style.display = "block";
  var questEditor = document.getElementById("quest_editor");
  questEditor.style.display = "none";
  document.getElementById("questionC").value = "";
  document.getElementById("topicC").value = "";
  document.getElementById("difficultyLevelC").value = "";
}

function getQuestBank(userId) {
  document.getElementById("quest_creator").style.display = "none";
  document.getElementById("quest_editor").style.display = "none";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      var textToTable = "<table id='quest_bank_table' border='1'><tr><th>ID</th><th>Question</th><th>Topic</th><th>Difficulty</th></tr>";
      var rowCount = 0;
      for (var i = 0; i < json.length; i++) {
        if (json[i].instructorId == userId) {
          rowCount++;
          textToTable += "<tr id='questBankRow" + rowCount + "' onclick='selectRow(" + json[i].questionId + ", " + json[i].instructorId + ", this.id)'><td>" + json[i].questionId + "</td><td>" + json[i].question + "</td><td>" + json[i].topic + "</td><td>" + json[i].difficultyLevel + "</td></tr>";
        }
      }
      textToTable += "</table>";
      document.getElementById("quest_bank_container").innerHTML = textToTable;
    }
  }
  xhr.open("POST", "get_quest_bank.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function createQuestion(userId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      getQuestBank(userId);
    }
  }
  xhr.open("POST", "create_question_handler.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=CREATE" + "&question=" + encodeURIComponent(document.getElementById('questionC').value)  + "&topic=" + encodeURIComponent(document.getElementById('topicC').value) + "&difficultyLevel=" + document.getElementById('difficultyLevelC').value;
  xhr.send(loginFormData);
}

function selectRow(questionId, userId, rowId) {
  openQuestionEditor(questionId, userId);
  var table = document.getElementById("quest_bank_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("questBankRow" + rowCount) != rowId) {
      document.getElementById("questBankRow" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#9CB4A9";
  var deleteButtonText = "<button onclick='deleteQuestionFromBank(" + questionId + ", " + userId + ")'>Delete</button>";
  document.getElementById("no_select_delete_button").innerHTML = deleteButtonText;
}

function openQuestionEditor(questionId, userId) {
  var questCreator = document.getElementById("quest_creator");
  questCreator.style.display = "none";
  var questEditor = document.getElementById("quest_editor");
  questEditor.style.display = "block";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        if (json[i].questionId == questionId) {
          document.getElementById("questionE").value = json[i].question;
          document.getElementById("topicE").value = json[i].topic;
          document.getElementById("difficultyLevelE").value = json[i].difficultyLevel;
        }
      }
      getTestCases(questionId);
      var saveButton = "<button class='editButtons' onclick='saveQuestAndTestEditor(" + questionId + ", " + userId + ")'>Save Question & Test Cases</button>";
      document.getElementById("editor_save_button").innerHTML = saveButton;
    }
  }
  xhr.open("POST", "get_quest_bank.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function deleteQuestionFromBank(questionId, userId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      getQuestBank(userId);
      document.getElementById("quest_editor").style.display = "none";
    }
  }
  xhr.open("POST", "delete_question_handler.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=DELETE" + "&questionId=" + questionId;
  xhr.send(loginFormData);
}

function getTestCases(questionId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      var testCaseCount = 0;
      var testCaseOutput = "";
      for (var i = 0; i < json.length; i++) {
        if (json[i].questionId == questionId) {
          testCaseCount++;
          testCaseOutput += "<div><button class='deleteTestCaseButtons' onclick='deleteTestCase(" + json[i].testcaseId + ", " + questionId + ")'>x</button></div><div>input: <textarea name='" + json[i].testcaseId + "' id='oldTestInputs[]' class='test_cases' value='" + json[i].input + "'>" + json[i].input + "</textarea></div><div>output: <textarea name='" + json[i].testcaseId + "' id='oldTestOutputs[]' class='test_cases' value='" + json[i].output + "'>" + json[i].output + "</textarea></div>";
        }
      }
      document.getElementById("testCasesReplace").innerHTML = testCaseOutput;
    }
  }
  xhr.open("POST", "get_test_cases.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function addNewTestCase(divName) {
  var newDiv = document.createElement('div');
  newDiv.innerHTML = "input: <textarea id='newTestInputs[]'></textarea><br>output: <textarea id='newTestOutputs[]'></textarea><br><br>";
  document.getElementById(divName).appendChild(newDiv);
}

function saveQuestAndTestEditor(questionId, userId) {
  // First part updates only the question
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "update_question.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var questData = "action=UPDATE" + "&questionId=" + questionId + "&question=" + encodeURIComponent(document.getElementById('questionE').value)  + "&topic=" + encodeURIComponent(document.getElementById('topicE').value) + "&difficultyLevel=" + document.getElementById('difficultyLevelE').value;
  xhr.send(questData);
  // Update old test cases
  var oldTestInputsArray = document.querySelectorAll('[id^="oldTestInputs[]"]');
  var oldTestOutputsArray = document.querySelectorAll('[id^="oldTestOutputs[]"]');
  for (var i = 0; i < oldTestInputsArray.length; i++) {
    updateTestCase(oldTestInputsArray[i].name, oldTestInputsArray[i].value, oldTestOutputsArray[i].value);
    openQuestionEditor(questionId, userId);
  }
  // Create new test cases
  var newTestInputsArray = document.querySelectorAll('[id^="newTestInputs[]"]');
  var newTestOutputsArray = document.querySelectorAll('[id^="newTestOutputs[]"]');
  for (var i = 0; i < newTestInputsArray.length; i++) {
    createTestCase(questionId, newTestInputsArray[i].value, newTestOutputsArray[i].value);
    openQuestionEditor(questionId, userId);
  }
  openQuestionEditor(questionId, userId);
}

function updateTestCase(testcaseId, newInput, newOutput) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "update_test_case.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var oldTestData = "action=UPDATE" + "&testcaseId=" + testcaseId + "&newInput=" + newInput  + "&newOutput=" + newOutput;
  xhr.send(oldTestData);
}

function createTestCase(questionId, newInput, newOutput) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "create_test_case.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var oldTestData = "action=CREATE" + "&questionId=" + questionId + "&newInput=" + newInput  + "&newOutput=" + newOutput;
  xhr.send(oldTestData);
}

function deleteTestCase(testcaseId, questionId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "delete_test_case.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var testcaseData = "action=DELETE" + "&testcaseId=" + testcaseId;
  xhr.send(testcaseData);
  getTestCases(questionId);
}

function addNewTestCaseToCreator(divName) {
  var newDiv = document.createElement('div');
  newDiv.innerHTML = "input: <textarea id='creatorTestCaseInputs[]'></textarea><br>output: <textarea id='creatorTestCaseOutputs[]'></textarea><br><br>";
  document.getElementById(divName).appendChild(newDiv);
  document.getElementById("remove_test_case_button").style.display = "block";
  document.getElementById("create_question_button").style.display = "none";
  document.getElementById("create_quest_and_test_button").style.display = "block";
}

function removeNewTestCaseToCreator(divName) {
  var testCases = document.getElementById(divName);
  if (testCases.childNodes.length > 0) {
    testCases.removeChild(testCases.lastChild);
  }
  if (testCases.childNodes.length == 0) {
    document.getElementById("remove_test_case_button").style.display = "none";
    document.getElementById("create_question_button").style.display = "block";
    document.getElementById("create_quest_and_test_button").style.display = "none";
  }
}

function createQuestAndTest(userId) {
  createQuestion(userId);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      var questionId = json[json.length - 1].questionId;
      var creatorTestCaseInputsArray = document.querySelectorAll('[id^="creatorTestCaseInputs[]"]');
      var creatorTestCaseOutputsArray = document.querySelectorAll('[id^="creatorTestCaseOutputs[]"]');
      for (var i = 0; i < creatorTestCaseInputsArray.length; i++) {
        createTestCase(questionId, creatorTestCaseInputsArray[i].value, creatorTestCaseOutputsArray[i].value);
      }
      clearQuestCreator(creatorTestCaseInputsArray.length);
    }
  }
  xhr.open("POST", "get_quest_bank.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function clearQuestCreator(testCasesCreated) {
  document.getElementById("questionC").value = "";
  document.getElementById("topicC").value = "";
  document.getElementById("difficultyLevelC").value = "";
  document.getElementById("remove_test_case_button").style.display = "none";
  document.getElementById("create_quest_and_test_button").style.display = "none";
  var testCases = document.getElementById("test_cases");
  for (var i = 0; i < testCasesCreated; i++) {
    testCases.removeChild(testCases.lastChild);
  }
}

function getExams(userId) {
  document.getElementById("exam_edit_button").style.display = "none";
  document.getElementById("exam_delete_button").style.display = "none";
  document.getElementById("exam_publish_button").style.display = "none";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      var textToTable = "<table id='exam_bank_table' border='1'><tr><th>ID</th><th>Title</th><th>Published</th></tr>";
      var rowCount = 0;
      for (var i = 0; i < json.length; i++) {
        if (json[i].instructorId == userId) {
          rowCount++;
          var studentExamsJSON = JSON.parse(student_exams);
          var published = false;
          for (var x = 0; x < studentExamsJSON.length; x++) {
            if (studentExamsJSON[x].examId == json[i].examId) {
              published = true;
              break;
            } else {
              published = false;
            }
          }
          textToTable += "<tr id='examBankRow" + rowCount + "' onclick='selectExamBankRow(" + json[i].examId + ", " + userId + ", this.id, " + published + ")'><td>" + json[i].examId + "</td><td>" + json[i].title + "</td><td>" + published + "</td></tr>";
        }
      }
      textToTable += "</table>";
      document.getElementById("exam_bank_container").innerHTML = textToTable;
    }
  }
  xhr.open("POST", "get_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function getExamQuestions(userId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "get_exam_questions.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

// These two functions READs the studentExams table and post the string to
// the global variable which is then used the the getExams() function
function one(result) {
  var test = result;
  student_exams = test;
}
function getStudentExams(callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  }
  xhr.open("POST", "get_student_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function selectExamBankRow(examId, userId, rowId, published) {
  var table = document.getElementById("exam_bank_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("examBankRow" + rowCount) != rowId) {
      document.getElementById("examBankRow" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#9CB4A9";
  if (published == true) {
    document.getElementById("exam_publish_button").style.display = "none";

  }
  if (published == false) {
    document.getElementById("exam_publish_button").style.display = "block";
    var publishButtonText = "<button onclick='publishExam(" + examId + ", " + userId + ")'>Publish</button>";
    document.getElementById("exam_publish_button").innerHTML = publishButtonText;
  }
  document.getElementById("exam_edit_button").style.display = "block";
  var editButtonText = "<button onclick='openExamEditor(" + examId + ")'>Edit " + examId + "</button>";
  document.getElementById("exam_edit_button").innerHTML = editButtonText;
  document.getElementById("exam_delete_button").style.display = "block";
  var deleteButtonText = "<button onclick='deleteExamButton(" + examId + ", " + userId + ")'>Delete</button>";
  document.getElementById("exam_delete_button").innerHTML = deleteButtonText;
}

function getStudentIds() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        if (json[i].isInstructor == 0) {
          studentIds.push(json[i].userId);
        }
      }
    }
  }
  xhr.open("POST", "get_student_ids.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function createStudentExamEntry(examId, studentId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "publish_exam.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=CREATE&examId=" + examId + "&studentId=" + studentId;
  xhr.send(loginFormData);
}

function publishExam(examId, userId) {
  for (var i = 0; i < studentIds.length; i++) {
    createStudentExamEntry(examId, studentIds[i]);
  }
  getStudentExams(function(result) { one(result); });
  setTimeout(function(){
    getExams(userId);
  }, 1000);
}

function getCompletedExams(userId) {
  document.getElementById("grade_button").style.display = "none";
  document.getElementById("preview_grade_button_container").style.display = "none";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      var textToTable = "<table id='completed_exam_bank_table' border='1'><tr><th>Exam ID</th><th>Student ID</th></tr>";
      var rowCount = 0;
      for (var i = 0; i < json.length; i++) {
        if ((json[i].examSubmitted == 1) && (gradedExams.indexOf(json[i].examId) == -1)) {
          rowCount++;
          textToTable += "<tr id='completedExamBankRow" + rowCount + "' onclick='selectCompletedExamBankRow(" + json[i].examId + ", " + userId + ", this.id, " + json[i].studentId + ")'><td>" + json[i].examId + "</td><td>" + json[i].studentId + "</td></tr>";
        }
      }
      textToTable += "</table>";
      document.getElementById("completed_exam_bank_container").innerHTML = textToTable;
    }
  }
  xhr.open("POST", "get_student_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function selectCompletedExamBankRow(examId, userId, rowId, studentId) {
  var table = document.getElementById("completed_exam_bank_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("completedExamBankRow" + rowCount) != rowId) {
      document.getElementById("completedExamBankRow" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#9CB4A9";

  //var gradeButtonText = "<button onclick='openExamGrader(" + examId + ", " + studentId + ")'>Release Grade " + examId + "</button>";
  var previewGradeButtonText = "<button onclick='openExamGrader(" + examId + ", " + studentId + ")'>Preview & Edit Grade " + examId + "</button>";
  var gradeButtonText = "<button onclick='releaseGrade(" + examId + ", " + userId + ")'>Release Grade " + examId + "</button>";
  document.getElementById("grade_button").innerHTML = gradeButtonText;
  document.getElementById("preview_grade_button_container").innerHTML = previewGradeButtonText;
  document.getElementById("grade_button").style.display = "block";
  document.getElementById("preview_grade_button_container").style.display = "block";
}

function closeExamCreator() {
  document.getElementById("exam_creator").style.display = "none";
  document.getElementById("exam_tab_container").style.display = "flex";
}

function openExamCreator(userId) {
  document.getElementById("exam_tab_container").style.display = "none";
  document.getElementById("exam_creator").style.display = "block";
  getExamCreatorQuestionBank(userId);
}

function getExamCreatorQuestionBank(userId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      examCreatorQuestionBankJSON = json;
      var textToTable = "<table id='exam_creator_question_table' border='1'><tr><th>ID</th><th>Question</th><th>Difficulty</th></tr>";
      var rowCount = 0;
      var jsonRowCount = 0;
      for (var i = 0; i < json.length; i++) {
        var dontShow = 0;
        jsonRowCount++;
        if (json[i].instructorId == userId) {
          for (var x = 0; x < questionToNotShow.length; x++) {
            if (questionToNotShow[x] == json[i].questionId) {
              dontShow = 1;
            }
          }
          if (dontShow != 0) {
            continue;
          }
          rowCount++;
          textToTable += "<tr id='exam_creator_question_table_row" + rowCount + "' onclick='selectExamCreatorQuestionRow(" + json[i].questionId + ", " + userId + ", this.id, " + jsonRowCount + ", " + rowCount + ")'><td>" + json[i].questionId + "</td><td>" + json[i].question + "</td><td>" + json[i].difficultyLevel + "</td></tr>";
        }
      }
      textToTable += "</table>";
      document.getElementById("exam_creator_question_bank").innerHTML = textToTable;
    }
  }
  xhr.open("POST", "get_quest_bank.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function selectExamCreatorQuestionRow(questionId, userId, rowId, rowCounter, rowCountToDelete) {
  var table = document.getElementById("exam_creator_question_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("exam_creator_question_table_row" + rowCount) != rowId) {
      document.getElementById("exam_creator_question_table_row" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#9CB4A9";

  var addQuestionButtonText = "<button onclick='addQuestionToCreator(" + questionId + ", " + rowCounter + ", " + rowCountToDelete + ", " + userId + ")'>Add Question " + questionId + "</button>";
  document.getElementById("add_question_button").innerHTML = addQuestionButtonText;
  document.getElementById("add_question_button").style.display = "block";
}

function addQuestionToCreator(questionId, rowCount, rowCountToDelete, userId) {
  questionToNotShow.push(questionId);
  var table = document.getElementById("current_exam_questions_table");
  var row = table.insertRow(-1);
  row.id = "current_exam_question_table_row" + (table.rows.length - 1);
  row.onclick = function () { selectCurrentExamQuestionTableRow((table.rows.length - 1), questionId, row.id, userId); };
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  cell0.innerHTML = questionId;
  cell1.innerHTML = examCreatorQuestionBankJSON[rowCount - 1].question;
  cell2.innerHTML = examCreatorQuestionBankJSON[rowCount - 1].difficultyLevel;
  cell3.innerHTML = "<input placeholder='Points' value='0' id='exam_creator_new_question_row" + table.rows.length + "'>";
  var tableToDeleteFrom = document.getElementById("exam_creator_question_table");
  document.getElementById("add_question_button").style.display = "none";
  getExamCreatorQuestionBank(userId);
}

function selectCurrentExamQuestionTableRow(rowToDelete, questionId, rowId, userId) {
  var table = document.getElementById("current_exam_questions_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("current_exam_question_table_row" + rowCount) != rowId) {
      document.getElementById("current_exam_question_table_row" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#9CB4A9";

  var removeQuestionButtonText = "<button onclick='deleteFromCurrentExamQuestionsTable(" + rowToDelete + ", " + questionId + ", " + userId + ")'>Remove Question " + questionId + "</button>";
  document.getElementById("remove_question_button").innerHTML = removeQuestionButtonText;
  document.getElementById("remove_question_button").style.display = "block";
}

function deleteFromCurrentExamQuestionsTable(rowToDelete, questionId, userId) {
  var table = document.getElementById("current_exam_questions_table");
  table.deleteRow(rowToDelete);
  document.getElementById("remove_question_button").style.display = "none";
  removeFromQuestionToNotShow(questionId);
  getExamCreatorQuestionBank(userId);
}

function removeFromQuestionToNotShow(questionId) {
  var index = questionToNotShow.indexOf(questionId);
  questionToNotShow.splice(index, 1);
}

function createExam(userId) {
  var table = document.getElementById("current_exam_questions_table");
  postExam(document.getElementById("title").value, document.getElementById("description").value);
  getNewestExamId();
  setTimeout(function(){
    for (var i = 2; i <= table.rows.length; i++) {
      createExamQuestion(table.rows[i - 1].cells[0].innerHTML, newestExamId, document.getElementById("exam_creator_new_question_row" + i).value);
    }
  }, 2000);
  closeExamCreator();
  getExams(userId);
}

function getNewestExamId() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      newestExamId = json[json.length - 1].examId;
    }
  }
  xhr.open("POST", "get_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function postExam(title, description) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "create_new_exam.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var oldTestData = "action=CREATE" + "&title=" + title + "&description=" + description;
  xhr.send(oldTestData);
}

function createExamQuestion(questionId, examId, points) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "create_exam_question.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var oldTestData = "action=CREATE" + "&questionId=" + questionId + "&examId=" + examId  + "&points=" + points;
  xhr.send(oldTestData);
}

function deleteExamButton(examId, userId) {
  deleteExam(examId);
  deleteExamQuestions(examId);
  deletePublishedExams(examId);
  setTimeout(function(){
    getExams(userId);
  }, 1000);
}

function deleteExam(examId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "delete_exam.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var oldTestData = "action=DELETE" + "&examId=" + examId;
  xhr.send(oldTestData);
}

function deleteExamQuestions(examId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        if (json[i].examId == examId) {
          deleteExamQuestion(json[i].questionBankId);
        }
      }
    }
  }
  xhr.open("POST", "get_exam_questions.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function deleteExamQuestion(questionBankId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "delete_exam_question.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var oldTestData = "action=DELETE" + "&questionBankId=" + questionBankId;
  xhr.send(oldTestData);
}

function deletePublishedExams(examId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        if (json[i].examId == examId) {
          deleteStudentExamEntry(json[i].studentExamId);
        }
      }
    }
  }
  xhr.open("POST", "get_student_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function deleteStudentExamEntry(studentExamId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "delete_published_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var oldTestData = "action=DELETE" + "&studentExamId=" + studentExamId;
  xhr.send(oldTestData);
}

function closeExamGrader() {
  document.getElementById("exam_grader").style.display = "none";
  document.getElementById("exam_tab_container").style.display = "flex";
}

function openExamGrader(examId, studentId) {
  document.getElementById("exam_tab_container").style.display = "none";
  document.getElementById("exam_grader").style.display = "block";
  openExamResults(studentId, examId);
  //console.log(examId);
  //console.log(studentId);
}

function closeExamEditor() {
  document.getElementById("exam_editor").style.display = "none";
  document.getElementById("exam_tab_container").style.display = "flex";
}

function openExamEditor(examId) {
  document.getElementById("exam_tab_container").style.display = "none";
  document.getElementById("exam_editor").style.display = "block";
  //console.log(examId);
}

function releaseGrade(examId, userId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "release_grade.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var oldTestData = "action=UPDATE" + "&examId=" + examId;
  xhr.send(oldTestData);
  getGradedExams();
  setTimeout(function(){
    getCompletedExams(userId);
  }, 1000);
}

function getGradedExams() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        if (json[i].gradeVisible == 1) {
          gradedExams.push(json[i].examId);
        }
      }
    }
  }
  xhr.open("POST", "get_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

// Functions for previewing and editting graded but non-released exams
function openExamResults(userId, examId) {
  //document.getElementById("student_page_container").style.display = "none";
  //document.getElementById("exam_results_modal").style.display = "block";
  getQuestId(examId);
  setTimeout(function(){
    getQuestStrings();

  }, 1000);

  //console.log(obj);
  //console.log(questionIds);
  //console.log(questionStrings);
  //console.log(pointsPerQuestion);
  //console.log(maxPoints);
  setTimeout(function(){
    populateResults(userId, examId);
    //console.log(questionIds);
    //console.log(questionStrings);
    //console.log(pointsPerQuestion);
    //console.log(maxPoints);
  }, 3000);

  //console.log(userId, examId);
}

function populateResults(userId, examId) {
  //console.log(examId);
  //console.log(questionIds);
  //console.log(questionStrings);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      //console.log(json);
      var textToDiv = "<div id='results_container'>";
      var answerCount = 0;
      for (var i = 0; i < json.length; i++) {
        //console.log(json[i]);
        if (json[i].studentId == userId && questionIds.indexOf(json[i].questionId) > -1) {
          answerCount++;
          //console.log(questionStrings[json[i].questionId.toString()]);
          var question = questionStrings[json[i].questionId.toString()];
          //console.log(json[i]);
          var correct = "WRONG";
          if (json[i].isCorrect == 1) {
            correct = "CORRECT";
          }
          pointsAwarded += parseInt(json[i].pointsAwarded);
          textToDiv += "<div class='answers' id='answer" + answerCount + "'><div>" + json[i].questionId + " " + correct + " Points: <input size='1' id='new_points_awarded[]' placeholder='" + json[i].pointsAwarded + "' value='" + json[i].pointsAwarded + "'>/" + pointsPerQuestion[json[i].questionId] + "</div><div><p>" + question + "</p></div><div>Your answer:</div><div class='answers'>" + json[i].answer + "</div><div class='notes'>" + json[i].notes + "</div></div>";
        }
      }
      textToDiv += "<div><button onclick='savePointChanges(" + userId + ", " + examId + ")'>Save Changes</button></div><div>Exam Score: " + pointsAwarded + "/" + maxPoints + "</div>";
      document.getElementById("results").innerHTML = textToDiv;
      //questionIds = [];
      //questionStrings = {};
      pointsPerQuestion = [];
      maxPoints = 0;
      pointsAwarded = 0;
    }
  }
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/examiner/get_exam_answers.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function getQuestId(examId) {
  var examIdent = examId;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        if (json[i].examId == examIdent) {
          //console.log(json[i].questionId, json[i].examId, json[i].points);
          maxPoints += parseInt(json[i].points);
          questionIds.push(json[i].questionId);
          pointsPerQuestion[json[i].questionId] = json[i].points;
        }
      }
      //console.log("Max Points: " + maxPoints);
      //console.log(questionIds);
    }
  }
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/teacher/get_exam_questions.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function getQuestStrings() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        if (questionIds.indexOf(json[i].questionId.toString()) > -1) {
          questionStrings[json[i].questionId.toString()] = json[i].question;
          //console.log(questionStrings[json[i].questionId.toString()]);
          //var obj = {};
          //obj[json[i].questionId.toString()] = json[i].question;
          //console.log(obj);
          //questionStrings.push(obj);
          //console.log(json[i].question);
        }
      }

    }
  }
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/teacher/get_quest_bank.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function savePointChanges(userId, examId) {
  console.log(userId, examId);
  var newPointValuesArray = document.querySelectorAll('[id^="new_points_awarded[]"]');
  //console.log(newPointValuesArray);

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      var answerCount = 0;
      //console.log(json[0].answerId);
      //console.log(newPointValuesArray[answerCount].value);
      for (var i = 0; i < json.length; i++) {
        //console.log(json[i]);
        console.log(json[i]);
        if (json[i].studentId == userId && questionIds.indexOf(json[i].questionId) > -1) {
          console.log("ahhhhhhhhhhhh");
          console.log(json[i].answerId);
          console.log(newPointValuesArray[answerCount].value);
          updateAnswer(json[i].answerId, newPointValuesArray[answerCount].value);
          answerCount++;
        }
      }

    }
  }
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/examiner/get_exam_answers.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function updateAnswer(answerId, newPointValue) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/teacher/update_exam_answer.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var formData = "action=UPDATE&answerId=" + answerId + "&newPointValue=" + newPointValue;
  xhr.send(formData);
  console.log("updateAnswer ran");
}
