function login() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText == "TEACHER") {
        window.location.href = "https://web.njit.edu/~mk343/cs490/teacher/";
      }
      if (this.responseText == "STUDENT") {
        window.location.href = "https://web.njit.edu/~mk343/cs490/student/";
      }
      if (this.responseText == "FALSE") {
        document.getElementById("wrongpassword").innerHTML = "Incorrect username and/or password!";
      }
    }
  }
  xhr.open("POST", "login_page_handler.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "username=" + document.getElementById('username').value + "&password=" + document.getElementById('password').value;
  xhr.send(loginFormData);
}
