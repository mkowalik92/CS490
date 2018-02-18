function login() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var responseString = this.responseText;
      // Do something with your response depending on what it is
      // I need to know if the username and password are valid.
      // If not valid then wrong password div gets displayed
      // If valid redirect to proper home page
      document.getElementById("wrong_password").innerHTML = responseString;
    }
  }
  xhr.open("POST", "login_page_handler.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "username=" + document.getElementById('username').value + "&password=" + document.getElementById('password').value;
  xhr.send(loginFormData);
}

// Authenticator Function will be here. Will be very similar to login just it wont change a div and will
// instead redirect to a page dependent on if the credentials are valid or not and the
// type of credentials
