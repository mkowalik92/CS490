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
      window.onload = function() {
        getExamTitles();
        getGradedExams();
        setTimeout(function(){
          getAvailableExams(<?php echo $_SESSION['userId'];?>);
          displayGradedExams(<?php echo $_SESSION['userId'];?>);
        }, 1000);
      };
    </script>
  </head>

  <body>
    <div>

      <h1>Student Page</h1>

      <div><button onclick="logout()">Logout</button></div>

      <div id="student_page_container">
        <div id="available_exams">
          <div><h2>Available Exams</h2></div>
          <div id="available_exams_container"></div>
          <div><button onclick="getAvailableExams(<?php echo $_SESSION['userId'];?>)">Refresh</button></div>
          <div id="take_exam_button"><button onclick="">Take Exam</button></div>
        </div>
        <div id="graded_exams">
          <div><h2>Graded Exams</h2></div>
          <div id="completed_exams_container"></div>
          <div><button onclick="displayGradedExams(<?php echo $_SESSION['userId'];?>)">Refresh</button></div>
          <div id="view_results_button"><button onclick="">View Results</button></div>
        </div>
      </div>

    </div>
  </body>

</html>
