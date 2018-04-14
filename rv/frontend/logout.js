function logout() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    window.location.href = "https://web.njit.edu/~mk343/cs490/rv/login";
  }
  xhr.open('GET', 'https://web.njit.edu/~mk343/cs490/rv/logout.php', true);
  xhr.send();
}
