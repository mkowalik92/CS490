<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="examiner_stylesheet.css">
    <script src="examiner_script.js"></script>
    <script>
      window.onload = async function() {
        await populateExaminer(<?php echo $_SESSION['userId'] . ', ' . $_SESSION['examId']; ?>);
        document.getElementById("submit_exam_button").addEventListener("click", async function() {
          await submitAnswers(<?php echo $_SESSION['userId'] . ', ' . $_SESSION['examId']; ?>);
        });
        document.getElementById("answer_textarea").addEventListener("keydown", function(event) {
          if (event.keyCode===9) {
            var v = this.value, s=this.selectionStart,e=this.selectionEnd;
            this.value = v.substring(0, s)+"\t"+v.substring(e);
            this.selectionStart=this.selectionEnd=s+1;
            event.preventDefault();
            return false;
          }
        });
        document.getElementById("clear_answers_table_button").addEventListener("click", async function() {
          clearAnswersTable();
        });
        document.getElementById("get_answers_table_button").addEventListener("click", getAnswersTable);
        // End code for IDE
      };

    </script>
  </head>

  <body>
    <div>
      <div><button id="get_answers_table_button">Get Answers Table</button></div>
      <div><button id="clear_answers_table_button">Clear Answers Table</button></div>

      <!-- header -->
      <div>
        <h1 id="header_h1">Exam <?php echo $_SESSION['examId']; ?> - </h1>
        <div id="exam_info_container"></div>
      </div>
      <!-- examiner holder -->
      <div id="examiner_holder">
        <!-- question bank holder  -->
        <div>
          <div id="question_bank_container"></div>
          <div><button id="submit_exam_button">Submit Exam</button></div>
        </div>
        <!-- answer area -->
        <div id="answer_area_container">
          <!-- question info questionId, question, points-->
          <div id="question_info_container"></div>
          <!-- answer container -->
          <div>
            <textarea id="answer_textarea"></textarea>
            <div><button id="save_answer_button">Save Answer</button></div>
          </div>
        </div>
      </div>

    </div>
  </body>

</html>
