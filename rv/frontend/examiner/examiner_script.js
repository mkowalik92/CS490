var answers = [];
var questionIds = [];

async function populateExaminer(userId, examId) {
  var examQuestionsInfo = {};
  var examPointTotal = 0;
  var headerString;
  const response = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  for (var i = 0; i < responseJSON.length; i++) {
    if (responseJSON[i].examId != examId) continue;
    document.getElementById("header_h1").innerHTML += responseJSON[i].title;
    const response2 = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/users_handler.php", {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
      credentials: "include",
      body: "action=READ",
      method: "POST"
    });
    const response2JSON = await response2.json();
    for (var y = 0; y < response2JSON.length; y++) {
      if (responseJSON[i].instructorId != response2JSON[y].userId) continue;
      headerString = "<p>" + responseJSON[i].description + "<br>Instructor: " + response2JSON[y].username;
    }
  }
  const response3 = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/exam_questions_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const response3JSON = await response3.json();
  const question_bank_container = document.getElementById("question_bank_container");
  question_bank_container.innerHTML = "<table id='question_bank_table'><tr><th>Question</th></tr></table";
  const tbody = question_bank_container.querySelector("tbody");
  var questionCount = 0;
  for (var j = 0; j < response3JSON.length; j++) {
    if (response3JSON[j].examId != examId) continue;
    const questionId = response3JSON[j].questionId;
    questionIds.push(questionId);
    examQuestionsInfo[questionId] = response3JSON[j].points;
    examPointTotal += parseInt(response3JSON[j].points);
    const tr = tbody.appendChild(document.createElement("tr"));
    tr.addEventListener("click", function() {
      selectQuestion(tr, userId, questionId, examQuestionsInfo[questionId]);
    });
    questionCount++;
    tr.innerHTML = `<td>${questionCount}</td>`;

  }
  headerString += "<br>Total Points: " + examPointTotal + "</p>";
  document.getElementById("exam_info_container").innerHTML = headerString;
}

async function selectQuestion(thisTR, userId, questionId, points) {
  document.getElementById("answer_textarea").value = "";
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
  var question;
  const response = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  for (var i = 0; i < responseJSON.length; i++) {
    if (questionId != responseJSON[i].questionId) continue;
    question = responseJSON[i].question;
  }
  var questionInfoString = "<h3>Question: " + thisTR.cells[0].innerHTML + "</h3><p>Points: " + points + "<br>Question ID: " + questionId + "<br>Question:<br>" + question + "</p>";
  var question_info_container = document.getElementById("question_info_container");
  question_info_container.innerHTML = questionInfoString;
  // Save answer button code
  var save_answer_button = document.getElementById("save_answer_button");
  const clone = save_answer_button.cloneNode(true);
  save_answer_button.parentNode.replaceChild(clone, save_answer_button);
  save_answer_button = document.getElementById("save_answer_button");
  save_answer_button.addEventListener("click", function() {
    answers[questionId] = encodeURIComponent(document.getElementById("answer_textarea").value);
    alert("Answer Saved!");
  });
  if(typeof answers[questionId] != 'undefined') {
    var answer = decodeURIComponent(answers[questionId]);
    document.getElementById("answer_textarea").value = answer;
  }
  document.getElementById("answer_area_container").style.display = "grid";
}

async function submitAnswers(userId, examId){
  let studentId = userId;
  var questions = [];
  for (var qnum = 0; qnum < questionIds.length; qnum++) {
    let question = {};
    let questionId = questionIds[qnum];
    let answer = answers[questionIds[qnum]];
    question.questionId = questionId;
    question.answer = encodeURIComponent(answer);
    questions.push(question);
  }
  console.log(questions);
  const response = await fetch("submit_answers.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "studentId=" + studentId + "&examId=" + examId + "&questions=" + JSON.stringify(questions),
    method: "POST"
  });
  const responseJSON = await response.text();
  const response2 = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/student_exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const response2JSON = await response2.json();
  for (var i = 0; i < response2JSON.length; i++) {
    if (response2JSON[i].examId != examId || response2JSON[i].studentId != userId) continue;
    await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/student_exam_handler.php", {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
      credentials: "include",
      body: "action=UPDATEEXAMSUBMITTED&studentExamId=" + response2JSON[i].studentExamId,
      method: "POST"
    });
  }
  window.location.href = "https://web.njit.edu/~mk343/cs490/rv/student";
  console.log(responseJSON);


}

async function clearAnswersTable() {
  const response = await fetch("answers_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  for (var i = 0; i < responseJSON.length; i++) {
    const answerId = responseJSON[i].answerId;
    const response2 = await fetch("answers_handler.php", {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
      credentials: "include",
      body: "action=DELETE&answerId=" + answerId,
      method: "POST"
    });
  }
  //console.log(responseJSON);
}

async function getAnswersTable() {
  const response = await fetch("answers_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  console.log(responseJSON);
}
