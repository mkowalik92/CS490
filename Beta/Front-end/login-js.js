function login() {
  document.getElementById("wrong_password").innerHTML = ""; // reset on each click
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = this.responseText;
      // Do something with your response depending on what it is
      // I need to know if the username and password are valid.
      // If not valid then wrong password div gets displayed
      // If valid redirect to proper home page
      
      // You can check if responseText == "instructor" to redirect to intructor page. Same for student.
      if(result == "instructor"){
        // use window.location to redirect to instructor page
      }else if(result == "student"){
        // use window.location to redirect to student page
      }else{        
        document.getElementById("wrong_password").innerHTML = "Invalid username and password!";
      }
    }
  }
  // your authenticator.php should return instructor / student / invalid based on the JSON my php will be sending back to you.
  xhr.open("POST", "authenticator.php", true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var loginFormData = "username=" + document.getElementById('username').value + "&password=" + document.getElementById('password').value;
  xhr.send(loginFormData);
}

// Authenticator Function will be here. Will be very similar to login just it wont change a div and will
// instead redirect to a page dependent on if the credentials are valid or not and the
// type of credentials
