<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--script src="https://web.njit.edu/~mk343/cs490/rv/logout.js"></script-->
    <link rel="stylesheet" type="text/css" href="editexamresults_stylesheet.css">
    <!--link href="https://fonts.googleapis.com/css?family=Roboto:300" rel="stylesheet"-->
    <script src="editexamresults_script.js"></script>
    <script>
      window.onload = async function() {
        await populateExamResults(<?php echo $_SESSION['editExamIdResults'];?>, <?php echo $_SESSION['editExamStudentId'];?>);
        document.getElementById("go_back_button").addEventListener("click", function() {
          window.location.href = "https://web.njit.edu/~mk343/cs490/rv/teacher/";
        });
        document.getElementById("save_exam_changes_button").addEventListener("click", async function() {
          await saveChanges(<?php echo $_SESSION['editExamIdResults'];?>, <?php echo $_SESSION['editExamStudentId'];?>);
        });
      };
    </script>
  </head>

  <body>

    <div><button id="go_back_button">Go Back</button><button id="save_exam_changes_button">Save Changes</button></div>
    <div><h1>Exam ID: <?php echo $_SESSION['editExamIdResults'];?> Student ID: <?php echo $_SESSION['editExamStudentId'];?></h1></div>
    <div id="exam_info_container"></div>
    <div id="exam_results_container"></div>

  </body>

</html>
