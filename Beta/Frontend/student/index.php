<?php
  session_start();
?>
<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="student_stylesheet.css">
    <script src="https://web.njit.edu/~mk343/cs490/logout.js"></script>
    <script src="student_page_script.js"></script>
    <script>
      //function getQuestionIds(examId) {
      //  console.log(examId);
      //}
      window.onload = function() {
        getExamTitles();
        getGradedExams();
        setTimeout(function(){
          getAvailableExams(<?php echo $_SESSION['userId'];?>);
          displayGradedExams(<?php echo $_SESSION['userId'];?>);
        }, 1000);
      };
    </script>
    <script src="student_page_script.js"></script>
  </head>

  <body>
    <div>

      <!-- Header -->
      <div class="header">
        <img src="logo.png" alt="Logo Placeholder">
        <h1><?php echo $_SESSION['username'];?>'s Home Page</h1>

      </div>

      <div class="logout_button"><button onclick="logout()">Logout</button></div>

      <div id="student_page_container">
        <div id="available_exams">
          <div><h2>Available Exams</h2></div>
          <div id="available_exams_container"></div>
          <div class="refresh_exams"><button onclick="getAvailableExams(<?php echo $_SESSION['userId'];?>)">Refresh</button></div>
          <div id="take_exam_button"><button onclick="">Take Exam</button></div>
        </div>
        <div id="graded_exams">
          <div><h2>Graded Exams</h2></div>
          <div id="completed_exams_container"></div>
          <div class="refresh_exams"><button onclick="displayGradedExams(<?php echo $_SESSION['userId'];?>)">Refresh</button></div>
          <div id="view_results_button"><button onclick="">View Results</button></div>
        </div>
      </div>

      <div id="exam_results_modal" class="modal">
        <div class="modal-content">
          <span class="close"><button onclick="closeExamResults()">X</button></span>
          <div id="results"></div>
        </div>
      </div>

    </div>
  </body>

</html>
