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

async function populateGradedExams(userId) {
  var gradedExamIds = [];
  const response = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const responseJSON = await response.json();
  responseJSON.forEach((exam) => {
    const examId = exam.examId;
    if (exam.gradeVisible == 0) return;
    gradedExamIds.push(examId);
  });
  const response2 = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/student_exam_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const response2JSON = await response2.json();
  const graded_exams_container = document.getElementById("graded_exams_container");
  graded_exams_container.innerHTML = "<table id='graded_exams_table'><tr><th>ID</th></tr></table";
  const tbody = graded_exams_container.querySelector("tbody");
  for (var i = 0; i < response2JSON.length; i++) {
    if (response2JSON[i].studentId != userId) continue;
    if (gradedExamIds.indexOf(response2JSON[i].examId) > -1) {
      const examId = response2JSON[i].examId;
      const tr = tbody.appendChild(document.createElement("tr"));
      tr.addEventListener("click", function() {
        selectGradedExam(tr, userId, examId);
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

function selectGradedExam(thisTR, userId, examId) {
  const otherTRs = Array.from(thisTR.parentElement.children).filter(tr => tr !== thisTR);
  otherTRs.forEach(otherTR => otherTR.style.backgroundColor = "#FFFFFF");
  thisTR.style.backgroundColor = "#D0D1D8";
  // view results button code
  var view_results_button = document.getElementById("view_results_button");
  const clone = view_results_button.cloneNode(true);
  view_results_button.parentNode.replaceChild(clone, view_results_button);
  view_results_button = document.getElementById("view_results_button");
  view_results_button.addEventListener("click", async function() {
    await fetch("exam_results_handler.php", {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
      credentials: "include",
      body: "examId=" + examId,
      method: "POST"
    });
    window.location.href = "https://web.njit.edu/~mk343/cs490/rv/student/examresults/";
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
