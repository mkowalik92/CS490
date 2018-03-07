var examTitles = [];
var gradedExams = [];

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
  xhr.open("POST", "get_student_exams.php", true);
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
  xhr.open("POST", "get_exams.php", true);
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
  xhr.open("POST", "get_student_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function selectAvailableExamsRow(examId, userId, rowId) {
  var table = document.getElementById("available_exams_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("available_exams_row" + rowCount) != rowId) {
      document.getElementById("available_exams_row" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#D0D1DB";

  var takeExamButtonText = "<button onclick='takeExam(" + examId + ")'>Take Exam " + examId + "</button>";
  document.getElementById("take_exam_button").innerHTML = takeExamButtonText;
  document.getElementById("take_exam_button").style.display = "block";
}

function selectCompletedExamsRow(examId, userId, rowId) {
  var table = document.getElementById("completed_exams_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("completed_exams_row" + rowCount) != rowId) {
      document.getElementById("completed_exams_row" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#D0D1DB";

  var viewResultsButtonText = "<button>View Results " + examId + "</button>";
  document.getElementById("view_results_button").innerHTML = viewResultsButtonText;
  document.getElementById("view_results_button").style.display = "block";
}

function takeExam(examId) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "take_exam.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "examId=" + examId;
  xhr.send(loginFormData);
  window.location.href = "https://web.njit.edu/~mk343/cs490/examiner/";
}
