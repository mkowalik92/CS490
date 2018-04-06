var examTitles = [];
var gradedExams = [];
var questionIds = [];
var questionStrings = {};
var pointsPerQuestion = [];
var maxPoints = 0;
var pointsAwarded = 0;



function getAvailableExams(userId) {
  document.getElementById("take_exam_button").style.display = "none";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      //console.log(json);
      var textToTable = "<table id='available_exams_table' border='1'><tr><th>Exam ID</th><th>Exam Title</th></tr>";
      var rowCount = 0;
      for (var i = 0; i < json.length; i++) {
        if ((json[i].examSubmitted == 0) && (json[i].studentId == userId)) {
          rowCount++;
          //console.log(json[i]);
          //var examTitle = examTitles[];
          textToTable += "<tr id='available_exams_row" + rowCount + "' onclick='selectAvailableExamsRow(" + json[i].examId + ", " + userId + ", this.id)'><td>" + json[i].examId + "</td><td>" + examTitles[json[i].examId.toString()] + "</td></tr>";
        }
      }
      textToTable += "</table>";
      //console.log(examTitles);
      document.getElementById("available_exams_container").innerHTML = textToTable;
    }
  }
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/teacher/get_student_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function getExamTitles() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        examTitles[json[i].examId.toString()] = json[i].title;
      }
    }
  }
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/teacher/get_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function getGradedExams() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        //console.log(json);
        if (json[i].gradeVisible == 1) {
          gradedExams.push(json[i].examId);
        }
      }
    }
  }
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/teacher/get_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function displayGradedExams(userId) {
  document.getElementById("view_results_button").style.display = "none";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      //console.log(json);
      var textToTable = "<table id='completed_exams_table' border='1'><tr><th>Exam ID</th><th>Exam Title</th></tr>";
      var rowCount = 0;
      for (var i = 0; i < json.length; i++) {
        if ((json[i].examSubmitted == 1) && (json[i].studentId == userId) && (gradedExams.indexOf(json[i].examId) > -1)) {
          rowCount++;
          textToTable += "<tr id='completed_exams_row" + rowCount + "' onclick='selectCompletedExamsRow(" + json[i].examId + ", " + userId + ", this.id)'><td>" + json[i].examId + "</td><td>" + examTitles[json[i].examId.toString()] + "</td></tr>";
        }
      }
      textToTable += "</table>";
      //console.log(examTitles);
      document.getElementById("completed_exams_container").innerHTML = textToTable;
    }
  }
  xhr.open("POST", "https://web.njit.edu/~mk343/cs490/teacher/get_student_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function selectCompletedExamsRow(examId, userId, rowId) {
  var table = document.getElementById("completed_exams_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("completed_exams_row" + rowCount) != rowId) {
      document.getElementById("completed_exams_row" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#9CB4A9";

  var viewResultsButtonText = "<button onclick='openExamResults(" + userId + ", " + examId + ")'>View Results</button>";
  document.getElementById("view_results_button").innerHTML = viewResultsButtonText;
  document.getElementById("view_results_button").style.display = "block";
}

function selectAvailableExamsRow(examId, userId, rowId) {
  var table = document.getElementById("available_exams_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("available_exams_row" + rowCount) != rowId) {
      document.getElementById("available_exams_row" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#9CB4A9";

  var takeExamButtonText = "<button onclick='takeExam(" + examId + ")'>Take Exam</button>";
  document.getElementById("take_exam_button").innerHTML = takeExamButtonText;
  document.getElementById("take_exam_button").style.display = "block";
}



function takeExam(examId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "take_exam.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "examId=" + examId;
  xhr.send(loginFormData);
  window.location.href = "https://web.njit.edu/~mk343/cs490/examiner/";
}


function closeExamResults() {
  document.getElementById("exam_results_modal").style.display = "none";
  document.getElementById("student_page_container").style.display = "flex";
}

function openExamResults(userId, examId) {
  //document.getElementById("student_page_container").style.display = "none";
  document.getElementById("exam_results_modal").style.display = "block";
  getQuestId(examId);
  setTimeout(function(){
    getQuestStrings();
  }, 1000);

  //console.log(questionStrings);
  setTimeout(function(){
    populateResults(userId, examId);
  }, 3000);

  //console.log(userId, examId);
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

function populateResults(userId, examId) {
  console.log(examId);
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
        console.log(json[i]);
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
          textToDiv += "<div class='answers' id='answer" + answerCount + "'><div>" + json[i].questionId + " " + correct + "</div><div class='question'><p>" + question + "</p></div><div>Your answer:</div><div class='answers'>" + json[i].answer + "</div><div class='notes'>" + json[i].notes + "</div></div>";
        }
      }
      textToDiv += "<div>Exam Score: " + pointsAwarded + "/" + maxPoints + "</div>";
      document.getElementById("results").innerHTML = textToDiv;
      questionIds = [];
      questionStrings = {};
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
