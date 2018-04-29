var examQuestionIdsPoints = {};
var examQuestionIdsQuestions = {};
var examQuestionIds = [];
var maxPointsPossible = 0;
var examGrade = 0;

async function populateExamResults(examId, studentId) {
  const response = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/exam_questions_handler.php", {
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
    const questionId = String(responseJSON[i].questionId);
    examQuestionIds.push(responseJSON[i].questionId);
    examQuestionIdsPoints[questionId] = responseJSON[i].points;
    maxPointsPossible += parseInt(responseJSON[i].points);
  }
  const response3 = await fetch("https://web.njit.edu/~mk343/cs490/rv/teacher/question_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const response3JSON = await response3.json();
  for (var j = 0; j < response3JSON.length; j++) {
    if (examQuestionIds.indexOf(response3JSON[j].questionId) == -1) continue;
    const questionId = String(response3JSON[j].questionId);
    examQuestionIdsQuestions[questionId] = response3JSON[j].question;
  }
  const response2 = await fetch("https://web.njit.edu/~mk343/cs490/rv/examiner/answers_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "action=READ",
    method: "POST"
  });
  const response2JSON = await response2.json();
  for (var y = 0; y < response2JSON.length; y++) {
    if (examQuestionIds.indexOf(response2JSON[y].questionId) == -1 || response2JSON[y].studentId != studentId || response2JSON[y].examId != examId) continue;
    examGrade += parseInt(response2JSON[y].pointsAwarded);
    var replacementText = "";
    var isCorrect;
    if (y > 0) replacementText += "<br>";
    if (response2JSON[y].isCorrect == 1) {
      isCorrect = "TRUE";
    } else {
      isCorrect = "FALSE";
    }
    var jsonString = response2JSON[y].json;
    var jsonStringParse = JSON.parse(jsonString);
    var functionNameMatched;
    if (jsonStringParse.function_name_matched == true) {
      functionNameMatched = "TRUE";
    } else {
      functionNameMatched = "FALSE";
    }
    replacementText += "Question Id: " + response2JSON[y].questionId + "<div>Correct: " + isCorrect + "</div><div>Function Name Matched: " + functionNameMatched + "</div><div>Points Awarded: "
                    + response2JSON[y].pointsAwarded + " / " + examQuestionIdsPoints[String(response2JSON[y].questionId)]
                    + "</div><div>Points Deducted: " + jsonStringParse.points_deducted
                    + "</div><div>Question:</div><div class='question'><p>" + examQuestionIdsQuestions[String(response2JSON[y].questionId)] + "</p></div><div>Student's Answer:</div><div><textarea>"
                    + response2JSON[y].answer + "</textarea></div><div>Testcases: </div>";
    for (var m = 0; m < jsonStringParse.testcases.length; m++) {
      var compiled;
      if (jsonStringParse.testcases[m].compile_success == true) {
        compiled = "TRUE";
      } else {
        compiled = "FALSE";
      }
      replacementText += "<div class='testcase'><div>Compiled: " + compiled + "</div><div>Parameters: " + jsonStringParse.testcases[m].parameters + "</div><div>Expected Return: "
                      + jsonStringParse.testcases[m].expected_return + "</div><div>Student Returned: " + jsonStringParse.testcases[m].student_return
                      + "</div><div>Student Printed: " + jsonStringParse.testcases[m].student_print + "</div></div>";

    }
    document.getElementById("exam_results_container").innerHTML += replacementText;
  }
  document.getElementById("exam_info_container").innerHTML = "<p>Exam Grade: " + examGrade + " / " + maxPointsPossible + "</p>";
}
