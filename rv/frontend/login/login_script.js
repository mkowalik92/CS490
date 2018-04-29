window.onload = function() {
  document.getElementById("login_button").addEventListener("click", login);
  document.getElementById("username_input").addEventListener("keyup", function(e) {
    if (13 == e.keyCode) {
      login();
    }
  });
  document.getElementById("password_input").addEventListener("keyup", function(e) {
    if (13 == e.keyCode) {
      login();
    }
  });
};

async function login() {
  const response = await fetch("login_handler.php", {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    credentials: "include",
    body: "username=" + document.getElementById('username_input').value + "&password=" + document.getElementById('password_input').value,
    method: "POST"
  });
  const responseString = await response.text();
  if (await responseString == "TEACHER") {
    window.location.href = "https://web.njit.edu/~mk343/cs490/rv/teacher/";
  }
  else if (await responseString == "STUDENT") {
    window.location.href = "https://web.njit.edu/~mk343/cs490/rv/student/";
  }
  else {
    document.getElementById("wrong_password_message_container").innerHTML = "Incorrect username and/or password!";
  }
}
