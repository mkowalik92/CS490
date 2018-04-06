<?php
  session_start();
?>
<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="teacher_stylesheet.css">
    <script src="https://web.njit.edu/~mk343/cs490/logout.js"></script>
    <script src="teacher_page_script.js"></script>
    <script>
      window.onload = function() {
        getGradedExams();
        getStudentIds();
        getStudentExams(function(result) { one(result); });
        getQuestBank(<?php echo $_SESSION['userId'];?>);

        //getNewestExamId();
        setTimeout(function(){
          getExams(<?php echo $_SESSION['userId'];?>);
          getCompletedExams(<?php echo $_SESSION['userId'];?>);
        }, 2000);
        //console.log(gradedExams);
      };


    </script>
  </head>

  <body>
    <div>

      <!-- Header -->
      <div class="header">
        <img src="logo.png" alt="Logo Placeholder">
        <h1><?php echo $_SESSION['username'];?>'s Home Page</h1>

      </div>

      <!-- Teacher Navbar -->
      <div class="navbar">
        <div><button onclick="switchTabs('quest_tab', <?php echo $_SESSION['userId'];?>)">Questions</button></div>
        <div><button onclick="switchTabs('exam_tab', <?php echo $_SESSION['userId'];?>)">Exams</button></div>
        <div><button onclick="logout()">Logout</button></div>
      </div>

      <!-- Questions Tab -->
      <div id="quest_tab">
        <div class="quest_tab_container">

          <div id="quest_bank">
            <div id="quest_bank_header"><h2>Question Bank</h2></div>
            <div id="quest_bank_container"></div>
            <div id="quest_bank_buttons">
              <div><button onclick="getQuestBank(<?php echo $_SESSION['userId'];?>)">Refresh</button></div>
              <div><button onclick="openQuestionCreator()">Create New</button></div>
              <!--div id="no_select_edit_button"><button>Edit</button></div-->
              <div id="no_select_delete_button"><button>Delete</button></div>
            </div>
          </div>


          <div id="quest_creator">
            <h2>Question Creator</h2>
            <div><textarea rows="10" cols="30" placeholder="Question" id="questionC"></textarea></div>
            <div class="top_desc_inputs"><input placeholder="Topic" id="topicC"></div>
            <div class="top_desc_inputs"><input placeholder="Difficulty" id="difficultyLevelC"></div>
            <button id="create_question_button" onclick="createQuestion(<?php echo $_SESSION['userId'];?>)">Create Question</button>
            <div>
              Test Cases
              <div id="test_cases"></div>
              <button onclick="addNewTestCaseToCreator('test_cases')" class="editButtons">Add Test Case</button>
              <button id="remove_test_case_button" onclick="removeNewTestCaseToCreator('test_cases')">Remove Test Case</button>
              <button id="create_quest_and_test_button" onclick="createQuestAndTest(<?php echo $_SESSION['userId'];?>)">Create Question & Test Cases</button>
            </div>
          </div>

          <div id="quest_editor">
            <h2>Question Editor</h2>
            <div><textarea rows="10" cols="30" placeholder="Question" id="questionE" value=""></textarea></div>
            <div class="top_desc_inputs"><input placeholder="Topic" id="topicE" value=""></div>
            <div class="top_desc_inputs"><input placeholder="Difficulty" id="difficultyLevelE" value=""></div>
            <div>
              Test Cases
              <div id="testCasesReplace"></div>
              <div id="test_case_get_button"></div>
              <button class="editButtons" onclick="addNewTestCase('testCasesReplace')">Add Test Case</button>
              <div id="editor_save_button"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exams Tab -->
      <div id="exam_tab">

        <div id="exam_tab_container">
          <div id="exam_bank">
            <div id="exam_bank_header">
              <h2>Exam Bank</h2>
            </div>
            <div id="exam_bank_container"></div>
            <div id="exam_bank_buttons">
              <div><button onclick="getExams(<?php echo $_SESSION['userId'];?>)">Refresh</button></div>
              <div id="exam_create_button"><button onclick="openExamCreator(<?php echo $_SESSION['userId'];?>)">Create</button></div>
              <div id="exam_edit_button"><button>Edit</button></div>
              <div id="exam_delete_button"><button>Delete</button></div>
              <div id="exam_publish_button"><button>Publish</button></div>
            </div>
          </div>

          <div id="completed_exam_bank">
            <div id=completed_exam_bank_header"">
              <h2>Exam Grader</h2>
            </div>
            <div id="completed_exam_bank_container"></div>
            <div id="completed_exam_bank_buttons">
              <div><button onclick="getCompletedExams(<?php echo $_SESSION['userId'];?>)">Refresh</button></div>
              <div id="preview_grade_button_container"><button onclick="">Grade</button></div>
              <div id="grade_button"><button onclick="">Grade</button></div>
            </div>

          </div>
        </div>


        <!-- Exam Creator Popup Modal -->
        <div id="exam_creator" class="modal">
          <div class="modal-content">
            <span class="close"><button onclick="closeExamCreator()">X</button></span>
            <div><input placeholder="Title" id="title"></div>
            <div><input placeholder="Description" id="description"></div>
            <div id="current_exam_questions_creator">
              <table id="current_exam_questions_table" border="1">
                <tr>
                  <th>ID</th>
                  <th>Question</th>
                  <th>Difficulty</th>
                  <th>Points</th>
                </tr>
              </table>
              <div id="remove_question_button"></div>
            </div>
            <div id="exam_creator_question_bank"></div>
            <div id="add_question_button"><button>Add Question</button></div>
            <div><button onclick="createExam(<?php echo $_SESSION['userId'];?>)">Create Exam</button></div>
          </div>
        </div>

        <!-- Exam Editor Popup Modal -->
        <div id="exam_editor" class="modal">
          <div class="modal-content">
            <span class="close"><button onclick="closeExamEditor()">X</button></span>
          </div>
        </div>

        <!-- Exam Grader Popup Modal -->
        <div id="exam_grader" class="modal">
          <div class="modal-content">
            <span class="close"><button onclick="closeExamGrader()">X</button></span>
            <div id="results"></div>
          </div>
        </div>

      </div>

    </div>
  </body>

</html>
