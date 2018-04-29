<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--script src="https://web.njit.edu/~mk343/cs490/rv/logout.js"></script-->
    <link rel="stylesheet" type="text/css" href="examresults_stylesheet.css">
    <!--link href="https://fonts.googleapis.com/css?family=Roboto:300" rel="stylesheet"-->
    <script src="examresults_script.js"></script>
    <script>
      window.onload = async function() {
        await populateExamResults(<?php echo $_SESSION['examIdResults'];?>, <?php echo $_SESSION['userId'];?>);
        document.getElementById("go_back_button").addEventListener("click", function() {
          window.location.href = "https://web.njit.edu/~mk343/cs490/rv/student/";
        });
      };
    </script>
  </head>

  <body>

    <div><button id="go_back_button">Go Back</button></div>
    <div><h1>Exam ID: <?php echo $_SESSION['examIdResults'];?></h1></div>
    <div id="exam_info_container"></div>
    <div id="exam_results_container"></div>

  </body>

</html>
