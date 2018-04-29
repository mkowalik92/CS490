<?php
  session_start();
?>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="teacher_stylesheet.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300" rel="stylesheet">
    <script src="https://web.njit.edu/~mk343/cs490/rv/logout.js"></script>
    <script src="teacher_script.js"></script>
    <script>
      window.onload = async function() {
        document.getElementById("logout_button").addEventListener("click", logout);
        // Default tab that is open is questions tab
        await populateQuestionTab(<?php echo $_SESSION['userId'];?>);
        await populateExamTab(<?php echo $_SESSION['userId'];?>);
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
        document.getElementById("create_question_button").addEventListener("click", function() {
          openQuestionCreator(<?php echo $_SESSION['userId'];?>);
        });
        document.getElementById("close_quest_creator").addEventListener("click", closeQuestionCreator);
        document.getElementById("close_quest_editor").addEventListener("click", closeQuestionEditor);
        document.getElementById("add_new_test_case_button").addEventListener("click", addTestCaseToNewQuestion);
        document.getElementById("remove_new_test_case_button").addEventListener("click", removeTestCaseToNewQuestion);
        document.getElementById("add_edit_new_test_case_button").addEventListener("click", addEditNewTestCase);
        document.getElementById("remove_edit_new_test_case_button").addEventListener("click", removeEditNewTestCase);
        document.getElementById("create_new_question_button").addEventListener("click", function() {
          createNewQuestion(<?php echo $_SESSION['userId'];?>);
        });
        document.getElementById("topic_filter").addEventListener("change", async function() {
          await filter();
        });
        document.getElementById("difficulty_filter").addEventListener("change", async function() {
          await filter();
        });
        document.getElementById("search_filter").addEventListener("keyup", async function() {
          await filter();
        });
        document.getElementById("exam_topic_filter").addEventListener("change", async function() {
          await examfilter();
        });
        document.getElementById("exam_difficulty_filter").addEventListener("change", async function() {
          await examfilter();
        });
        document.getElementById("exam_search_filter").addEventListener("keyup", async function() {
          await examfilter();
        });
        // exam bank code Start
        document.getElementById("refresh_exam_bank_button").addEventListener("click", async function() {
          await populateExamTab(<?php echo $_SESSION['userId'];?>);
        });
        document.getElementById("refresh_graded_exam_bank_button").addEventListener("click", async function() {
          await populateExamTab(<?php echo $_SESSION['userId'];?>);
        });
        document.getElementById("create_exam_bank_button").addEventListener("click", async function() {
          await openExamCreator(<?php echo $_SESSION['userId'];?>);
        });
        document.getElementById("close_exam_creator_button").addEventListener("click", closeExamCreator);
        document.getElementById("close_exam_editor_button").addEventListener("click", closeExamEditor);
        document.getElementById("create_exam_button").addEventListener("click", async function() {
          createExam(<?php echo $_SESSION['userId'];?>);
        });
      };
    </script>
  </head>

  <body>

    <div id="header"><h1><?php echo $_SESSION['fname'];?>'s Instructor Hub</h1></div>

    <div id="nav_bar_container"><button id="question_tab_nav_button">Questions</button><button id="exam_tab_nav_button">Exams</button><button id="logout_button">Logout</button></div>

    <!-- Start Question Tab -->
    <div id="question_tab">
      <h2>Question Tab</h2>
      <div id="question_bank_container">
        <h3>Question Bank</h3>
        <div><input id="search_filter" placeholder="Search filtered questions..."></input></div>
        <div>
          <div><label for="topic_filter">Filter: Topic</label><select id="topic_filter">
            <option value="-"> -------- </option>
          </select></div>
          <div>
            <label for="difficulty_filter">Filter: Difficulty</label><select id="difficulty_filter">
              <option value="-"> - </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
          </select></div>
        </div>
        <div id="question_bank_table_container"></div>
        <div class="buttons"><button id="refresh_question_tab_button">Refresh</button><button id="create_question_button">Create New</button><button id="edit_question_button">Edit</button><button id="delete_question_button">Delete</button></div>
      </div>
      <div id="question_cre_edi_container">
        <div id="question_creator_container">
          <div class="creator_editor_header_container">
            <div><h3>Question Creator</h3></div>
            <div><button id="close_quest_creator">X</button></div>
          </div>
          <div class="question_input"><textarea id="new_question_input" placeholder="question"></textarea></div>
          <div><input id="new_topic_input" placeholder="topic"></div>
          <div><input id="new_function_name_input" placeholder="function name (optional)"></div>
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
          <div class="creator_editor_header_container">
            <div><h3>Question Editor</h3></div>
            <div><button id="close_quest_editor">X</button></div>
          </div>
          <div class="question_input"><textarea id="edit_question_input" placeholder="question"></textarea></div>
          <div><input id="edit_topic_input" placeholder="topic"></div>
          <div><input id="edit_function_name_input" placeholder="function name (optional)"></div>
          <div><label for="edit_difficulty_input">Difficulty</label><select id="edit_difficulty_input">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select></div>
          <div id="edit_test_case_container"></div>
          <div id="edit_new_test_case_container"></div>
          <div><button id="add_edit_new_test_case_button">Add Test Case</button></div>
          <div><button id="remove_edit_new_test_case_button">Remove Test Case</button></div>
          <div><button id="save_question_button">Save Question</button></div>
        </div>
      </div>
    </div>
    <!-- End Question Tab -->

    <div id="exam_tab">
      <h2>Exam Tab</h2>
      <div id="exam_tab_container">
        <div id="exam_bank">
          <h3>Exam Bank</h3>
          <div id="exam_bank_container"></div>
          <div class="buttons"><button id="refresh_exam_bank_button">Refresh</button><button id="create_exam_bank_button">Create</button><!--button id="">Edit</button--><button id="delete_exam_button">Delete</button><button id="publish_exam_button">Publish</button></div>
        </div>
        <div id="exam_grader">
          <h3>Exam Grader</h3>
          <div id="graded_exam_bank_container"></div>
          <div class="buttons2"><button id="refresh_graded_exam_bank_button">Refresh</button><button id="preview_grade_button">Preview & Edit Grade</button><button id="release_grade_button">Release Grade</button></div>
        </div>
      </div>
      <div id="exam_creator">
        <div class="creator_editor_header_container">
          <div><h3>Exam Creator</h3></div>
          <div><button id="close_exam_creator_button">X</button></div>
        </div>
        <div><input id="exam_creator_title_input" placeholder="title"></div>
        <div><input id="exam_creator_description_input" placeholder="description"></div>
        <div id="exam_creator_questions_tba_container">
          <table id="exam_creator_questions_tba_table">
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Points</th>
            </tr>
          </table>
        </div>
        <div><button id="remove_question_exam_creator_button">Remove Question</button></div>
        <div><input id="exam_search_filter" placeholder="Search filtered questions..."></input></div>
        <div>
          <div><label for="exam_topic_filter">Filter: Topic</label><select id="exam_topic_filter">
            <option value="-"> -------- </option>
          </select></div>
          <div>
            <label for="exam_difficulty_filter">Filter: Difficulty</label><select id="exam_difficulty_filter">
              <option value="-"> - </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
          </select></div>
        </div>
        <div id="exam_creator_question_bank_container"></div>
        <div><button id="add_question_exam_creator_button">Add Question</button></div>
        <div><button id="create_exam_button">Create Exam</button></div>
      </div>
      <div id="exam_editor">
        <div class="creator_editor_header_container">
          <div><h3>Exam Editor</h3></div>
          <div><button id="close_exam_editor_button">X</button></div>
        </div>
        <div><input id="exam_editor_title_input" placeholder="title"></div>
        <div><input id="exam_editor_description_input" placeholder="description"></div>
        <div></div>
        <div><button>Remove Question</button></div>
        <div></div>
        <div><button>Add Question</button></div>
        <div><button id="save_exam_button">Save Exam</button></div>
      </div>
    </div>

  </body>

</html>
