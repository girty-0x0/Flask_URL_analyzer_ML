function validateURL(url_str) {
  try {
    new URL(url_str); //true if url is valid
    return true;
  } catch (_) { //returns false if the url is invalid
    return false;  
  }
}
function alertTheClient() {
  alert("Please input a valid URL.");
}

function callServer(to_server) {
  var url_result = document.getElementById("url_analyze_result"); // where url will be sent to
  var resultsContainer = document.getElementById("results"); //big block holding all elements; default hidden
  $.ajax({
    type: "POST",
    url: "/proc_url",
    data: JSON.stringify(to_server),
    contentType: "application/json",
    dataType: 'json',
    success: function(result) {
      let res = result.url;
      if (res == 'inv') {
        alertTheClient();
      } else {
        url_result.innerHTML = res; 
        resultsContainer.style.display = "block";
      }
      
      } 
    });
}

function analyze_url(){
    var url = document.getElementById("url_input").value; //user input url
    var no_scheme = '0';
    if (!/^((http|https|ftp):\/\/)/.test(url)) { //test for scheme; add http scheme if not present
      no_scheme = url
      url = "http://" + url;
    }

    var to_server = [
        {"url_str": url},
        {"no_scheme": no_scheme}
      ];
    
    if (validateURL(url)) {
      callServer(to_server);
    } else{
      alertTheClient();
    }
    
    
}

