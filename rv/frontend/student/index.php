<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://web.njit.edu/~mk343/cs490/rv/logout.js"></script>
    <link rel="stylesheet" type="text/css" href="student_stylesheet.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300" rel="stylesheet">
    <script src="student_script.js"></script>
    <script>
      window.onload = async function() {
        document.getElementById("logout_button").addEventListener("click", logout);
        await populateAvailableExams(<?php echo $_SESSION['userId'];?>);
        await populateGradedExams(<?php echo $_SESSION['userId'];?>);
        document.getElementById("refresh_available_exams_button").addEventListener("click", async function() {
          await populateAvailableExams(<?php echo $_SESSION['userId'];?>);
        });
        document.getElementById("refresh_graded_exams_button").addEventListener("click", async function() {
          await populateGradedExams(<?php echo $_SESSION['userId'];?>);
        });
      };
    </script>
  </head>

  <body>
    <h1><?php echo $_SESSION['fname'];?>'s Student Hub</h1>
    <div><button id="logout_button">Logout</button></div>
    <div id="exam_banks_container">
      <div id="available_exams">
        <h2>Available Exams</h2>
        <div id="available_exams_container"></div>
        <div class="buttons"><button id="refresh_available_exams_button">Refresh</button><button id="take_exam_button">Take Exam</button></div>
      </div>
      <div id="graded_exams">
        <h2>Graded Exams</h2>
        <div id="graded_exams_container"></div>
        <div class="buttons"><button id="refresh_graded_exams_button">Refresh</button><button id="view_results_button">View Results</button></div>
      </div>
    </div>
  </body>

</html>
