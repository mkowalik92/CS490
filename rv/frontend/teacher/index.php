<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="teacher_stylesheet.css">
    <script src="teacher_script.js"></script>
    <script>
      window.onload = function() {
        // Default tab that is open is questions tab
        populateQuestionTab(<?php echo $_SESSION['userId'];?>);

        // Code for switching tabs
        var question_tab = document.getElementById("question_tab");
        var exam_tab = document.getElementById("exam_tab");
        document.getElementById("question_tab_nav_button").addEventListener("click", function() {
          exam_tab.style.display = "none";
          question_tab.style.display = "block";
          populateQuestionTab(<?php echo $_SESSION['userId'];?>);
        });
        document.getElementById("exam_tab_nav_button").addEventListener("click", function() {
          question_tab.style.display = "none";
          exam_tab.style.display = "block";
        });
        // End code for switching tabs

        document.getElementById("refresh_question_tab_button").addEventListener("click", function() {
          populateQuestionTab(<?php echo $_SESSION['userId'];?>);
        });
        document.getElementById("add_new_test_case_button").addEventListener("click", addTestCaseToNewQuestion);
        document.getElementById("remove_new_test_case_button").addEventListener("click", removeTestCaseToNewQuestion);
        document.getElementById("create_new_question_button").addEventListener("click", createNewQuestion);
      };
    </script>
  </head>

  <body>

    <div id="header"><h1>Teacher</h1></div>

    <div id="nav_bar_container"><button id="question_tab_nav_button">Questions</button><button id="exam_tab_nav_button">Exams</button><button id="logout_button">Logout</button></div>

    <!-- Start Question Tab -->
    <div id="question_tab">
      <h2>Question Tab</h2>
      <div id="question_bank_container">
        <h3>Question Bank</h3>
        <div id="question_bank_table_container"></div>
        <div><button id="refresh_question_tab_button">Refresh</button><button id="create_question_button">Create New</button><button id="edit_question_button">Edit</button><button id="delete_question_button">Delete</button></div>
      </div>
      <div id="question_creator_container">
        <h3>Question Creator</h3>
        <div><textarea id="new_question_input" placeholder="question"></textarea></div>
        <div><input id="new_topic_input" placeholder="topic"></div>
        <div><label for="new_function_type">Function Type</label><select id="new_function_type">
          <option value="return">return</option>
          <option value="print">print</option>
        </select></div>
        <div><input id="new_function_name_input" placeholder="function name (optional)"></div>
        <div><textarea id="new_arguments_input" placeholder="function argument names (optional, seperate by new lines)"></textarea></div>
        <div><label for="new_difficulty_input">Difficulty</label><select id="new_difficulty_input">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select></div>
        <div id="new_test_case_container"></div>
        <div><button id="add_new_test_case_button">Add Test Case</button></div>
        <div><button id="remove_new_test_case_button">Remove Test Case</button></div>
        <div><button id="create_new_question_button">Create Question</button></div>
      </div>
      <div id="question_editor_container">
        <h3>Question Editor</h3>
        <div><textarea id="edit_question_input" placeholder="question"></textarea></div>
        <div><input id="edit_topic_input" placeholder="topic"></div>
        <div><label for="edit_function_type">Function Type</label><select id="edit_function_type">
          <option value="return">return</option>
          <option value="print">print</option>
        </select></div>
        <div><input id="edit_function_name_input" placeholder="function name (optional)"></div>
        <div><textarea id="edit_arguments_input" placeholder="function argument names (optional, seperate by new lines)"></textarea></div>
        <div><label for="edit_difficulty_input">Difficulty</label><select id="edit_difficulty_input">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select></div>
      </div>
    </div>
    <!-- End Question Tab -->

    <div id="exam_tab"><h2>Exam Tab</h2></div>

  </body>

</html>
