<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://web.njit.edu/~mk343/cs490/rv/logout.js"></script>
    <!--link rel="stylesheet" type="text/css" href="login_stylesheet.css"-->
    <script src="student_script.js"></script>
    <script>
      window.onload = async function() {
        document.getElementById("logout_button").addEventListener("click", logout);
        await populateAvailableExams(<?php echo $_SESSION['userId'];?>);
        document.getElementById("refresh_available_exams_button").addEventListener("click", async function() {
          await populateAvailableExams(<?php echo $_SESSION['userId'];?>);
        });
      };
    </script>
  </head>

  <body>
    <h1>Student</h1>
    <div><button id="logout_button">Logout</button></div>
    <div>
      <h2>Available Exams</h2>
      <div id="available_exams_container"></div>
      <div><button id="refresh_available_exams_button">Refresh</button><button id="take_exam_button">Take Exam</button></div>
    </div>
    <div>
      <h2>Graded Exams</h2>
      <div><button>Refresh</button><button>View Results</button></div>
    </div>
  </body>

</html>
