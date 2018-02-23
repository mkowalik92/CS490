function getQuestionBank() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    console.log(this.responseText);
  }
  xhr.open("GET", "get_question_bank.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send();
}

function postToQuestBank() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  }
  xhr.open("POST", "post_quest_to_bank.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var questionData = "question=" + encodeURIComponent(document.getElementById('question').value) + "&topic=" + document.getElementById('topic').value+ "&points=" + document.getElementById('points').value+ "&difficultyLevel=" + document.getElementById('difficultyLevel').value;
  xhr.send(questionData);
}
