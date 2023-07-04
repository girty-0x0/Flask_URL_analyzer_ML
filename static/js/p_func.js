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
  var phish_res = document.getElementById("phish_res");
  var mal_res = document.getElementById("mal_res");
  var ben_res = document.getElementById("ben_res");
  var def_res = document.getElementById("def_res");

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
        phish_res.innerHTML = result.phish;
        mal_res.innerHTML = result.mal;
        ben_res.innerHTML = result.ben;
        def_res.innerHTML = result.def;
        resultsContainer.style.display = "block";
      }
      
    } 
  });
}

function analyze_url(){
  var url = document.getElementById("url_input").value; //user input url
  var no_scheme = '0';
  if (!/^((http|https|ftp):\/\/)/.test(url)) { //test for scheme; add http scheme if not present
    no_scheme = url;
    url = "http://" + url;
  }

  var to_server = [ // will produce a json result with a url with a scheme and another one without the scheme or 0 if it had a scheme included
      {"url_str": url},
      {"no_scheme": no_scheme}
    ];
  
  if (validateURL(url)) {
    callServer(to_server);
  } else{
    alertTheClient();
  }   
}

function clear_page(){
  var urlContainer = document.getElementById("url_input");
  var resultsContainer = document.getElementById("results");
  urlContainer.value = "";
  resultsContainer.style.display = "none";
}