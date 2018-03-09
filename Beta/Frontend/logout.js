function logout() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    window.location.href = "https://web.njit.edu/~mk343/cs490/login";
  }
  xhr.open('GET', 'https://web.njit.edu/~mk343/cs490/logout.php', true);
  xhr.send();
}
