<?php
  session_start();
?>
<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="examiner_stylesheet.css">
    <script src="examiner_page_script.js"></script>
    <script>
      window.onload = function() {
        getQuestions(<?php echo $_SESSION['examId'];?>);
        getExamInfo(<?php echo $_SESSION['examId'];?>);
        getExamQuestions(<?php echo $_SESSION['examId'];?>);
        setTimeout(function(){
          //console.log(questions);
          getQuestionStrings();
          console.log(questionIds);
          console.log(questionStrings);
          console.log(answers);
        }, 1000);



      };
    </script>
  </head>

  <body>
    <div>
      <div><h1>Examiner</h1></div>
      <div><button onclick="goHome()">Return Home</button></div>
      <div id="exam_info_container"></div>
      <div id="exam_area">
        <div id="exam_question_bank_container">
          <div id="exam_questions"></div>
          <div id="submit_exam_button"><button>Submit Exam</button></div>
        </div>
        <div id="answer_area_container">
          <div id="question_description"></div>
          <div id="answer_text_area">
          </div>
          <div id="save_answer_button"></div>
        </div>
      </div>
    </div>
  </body>

</html>
