async function populateAvailableExams(userId) {
  const response = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/student_exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  var responseJSON = await response.json();
  const available_exams_container = document.getElementById("available_exams_container");
  available_exams_container.innerHTML = "<table id='available_exams_table'><tr><th>ID</th></tr></table";
  const tbody = available_exams_container.querySelector("tbody");
  for (var i = 0; i < responseJSON.length; i++) {
    if ((responseJSON[i].studentId == userId) && (responseJSON[i].examSubmitted == 0)) {
      const examId = responseJSON[i].examId;
      const tr = tbody.appendChild(document.createElement("tr"));
      tr.addEventListener("click", function() {
        selectAvailableExam(tr, userId, examId);
      });
      tr.innerHTML = `<td>${examId}</td>`;
    }
  }
}

function selectAvailableExam(thisTR, userId, examId) {
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
  // Take exam button code
  var take_exam_button = document.getElementById("take_exam_button");
  const clone = take_exam_button.cloneNode(true);
  take_exam_button.parentNode.replaceChild(clone, take_exam_button);
  take_exam_button = document.getElementById("take_exam_button");
  take_exam_button.addEventListener("click", function() {
    takeExam(examId);
  });
}

async function takeExam(examId) {
  await fetch("https://web.njit.edu/~mk343/cs490/rv/student/take_exam.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "examId=" + examId,
    method: "POST"
  });
  window.location.href = "https://web.njit.edu/~mk343/cs490/rv/examiner/";
}

// function selectQuestionQuestTab(thisTR, userId, questionId) {
//   const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
//   otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
//   thisTR.style.backgroundColor = "#D0D1D8";
//   // Edit Question code
//   var edit_question_button = document.getElementById("edit_question_button");
//   const clone1 = edit_question_button.cloneNode(true);
//   edit_question_button.parentNode.replaceChild(clone1, edit_question_button);
//   edit_question_button = document.getElementById("edit_question_button");
//   edit_question_button.addEventListener("click", function() {
//     edit_question_from_quest_bank(questionId, userId);
//   });
//   // Delete question code
//   var delete_question_button = document.getElementById("delete_question_button");
//   const clone = delete_question_button.cloneNode(true);
//   delete_question_button.parentNode.replaceChild(clone, delete_question_button);
//   delete_question_button = document.getElementById("delete_question_button");
//   delete_question_button.addEventListener("click", function() {
//     delete_question_from_quest_bank(questionId, userId);
//   });
// }

// const quest_bank_table_container = document.getElementById("question_bank_table_container");
// quest_bank_table_container.innerHTML = "<table id='question_bank_table'><tr><th>ID</th><th>Question</th><th>Topic</th><th>Difficulty</th></tr></table";
// const tbody = quest_bank_table_container.querySelector("tbody");
// responseJSON.forEach((question) => {
//   const questionId = question.questionId;
//   if (question.instructorId != userId) return;
//   const tr = tbody.appendChild(document.createElement("tr"));
//   tr.addEventListener("click", function() {
//     selectQuestionQuestTab(tr, userId, questionId);
//   });
//   tr.innerHTML = `<td>${questionId}</td><td>${question.question}</td><td>${question.topic}</td><td>${question.difficultyLevel}</td>`;
// });
