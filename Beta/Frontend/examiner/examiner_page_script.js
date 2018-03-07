var questionIds = [];
var questionStrings = [];
var answers = [];

function goHome() {
  window.location.href = "https://web.njit.edu/~mk343/cs490/student/";
}

function getExamInfo(examId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      for (var i = 0; i < json.length; i++) {
        if (json[i].examId ==  examId) {
          var examInfoText = "<h2>Exam ID: " + examId + " - " + json[i].title + "</h2><h2>" + json[i].description + "</h2>";
          document.getElementById("exam_info_container").innerHTML = examInfoText;
          break;
        }
      }
    }
  }
  xhr.open("POST", "get_exams.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function getExamQuestions(examId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      var textToTable = "<table id='questions_table' border='1'><tr><th>Questions</th></tr>";
      var rowCount = 0;
      for (var i = 0; i < json.length; i++) {
        if (json[i].examId == examId) {
          rowCount++;
          //selectCompletedExamsRow(" + json[i].examId + ", " + userId + ", this.id)
          textToTable += "<tr id='exam_question_row" + rowCount + "' onclick='selectQuestion(" + json[i].questionId + ", " + rowCount + ", this.id)'><td>Question " + rowCount + "</td></tr>";
          //questionIds.push(json[i].questionId);
        }
      }
      textToTable += "</table>";
      //console.log(examTitles);
      document.getElementById("exam_questions").innerHTML = textToTable;
    }
  }
  xhr.open("POST", "get_exam_questions.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function selectQuestion(questionId, rowCounter, rowId) {
  var table = document.getElementById("questions_table");
  for (var rowCount = 1; rowCount < table.rows.length; rowCount++) {
    if (("exam_question_row" + rowCount) != rowId) {
      document.getElementById("exam_question_row" + rowCount).style.backgroundColor = "#FFFFFF";
    }
  }
  document.getElementById(rowId).style.backgroundColor = "#D0D1DB";

  var questionText = "<h2>Question " + rowCounter + "</h2><br><br>" + questionStrings[questionId];
  document.getElementById("question_description").innerHTML = questionText;

  var saveAnswerButtonText = "<button onclick='saveAnswer(" + questionId + ", " + rowCounter + ")'>Save Answer</button>";
  document.getElementById("save_answer_button").innerHTML = saveAnswerButtonText;

  var answerTestAreaTest = "<textarea onkeydown='if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+\"\\t\"+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}' rows='10' cols='60' placeholder='Answer' id='answer" + rowCounter + "'></textarea>";
  var answerTestAreaId = "answer" + rowCounter;
  //console.log(answerTestAreaId);
  //document.getElementById(answerTestAreaId).value = answers[questionId];

  document.getElementById("answer_text_area").innerHTML = answerTestAreaTest;
  document.getElementById("answer_area_container").style.display = "block";
  if(typeof answers[questionId] === 'undefined') {
    // does not exist
    console.log("NO ANSWER");
  } else {
    // does exist
    console.log(answers[questionId]);
    var answer = decodeURIComponent(answers[questionId]);
    document.getElementById(answerTestAreaId).value = answer;
  }
}

function getQuestions(examId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      //var rowCount = 0;
      for (var i = 0; i < json.length; i++) {
        if (json[i].examId == examId) {
          questionIds.push(json[i].questionId);
          continue;
        }
      }
    }
  }
  xhr.open("POST", "get_exam_questions.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function getQuestionStrings() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      //var rowCount = 0;
      for (var i = 0; i < json.length; i++) {
        if (questionIds.indexOf(json[i].questionId) > -1) {
          questionStrings[json[i].questionId] = json[i].question;
        }
      }
    }
  }
  xhr.open("POST", "get_questions.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "action=READ";
  xhr.send(loginFormData);
}

function saveAnswer(questionId, rowCount) {
  //console.log(rowId);
  answers[questionId] = encodeURIComponent(document.getElementById("answer" + rowCount).value);
  //console.log(answers);
}

function submitAnswers(userId, examId) {
  var jsonToSend = { "studentId" : userId , "examId" : examId , "questions" : [] };

  //console.log(questionIds);
  for (var qnum = 0; qnum < questionIds.length; qnum++) {
    if (answers[questionIds[qnum]] === undefined) {
      var key = questionIds[qnum];
      jsonToSend["questions"].push({ [key] : "" });
      //console.log("BLANK ANSWER");
      continue;
    } else {
      var key = questionIds[qnum];
      jsonToSend["questions"].push({ [key] : answers[questionIds[qnum]] });
      //console.log("ANSWER");
      continue;
    }
  }
  //console.log(jsonToSend);
  var newJson = JSON.stringify(jsonToSend);
  //console.log(JSON.stringify(jsonToSend));
  //console.log(JSON.parse(newJson));
}
