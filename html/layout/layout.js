
//.................. Set Style Sheet Function .................................. //
function swap_style(tab)
{   
  var temp_style =   "https://code.getmdl.io/1.1.3/material.indigo-red.min.css"   
  var lights_style = "https://code.getmdl.io/1.3.0/material.purple-green.min.css"
  var har_style =    "https://code.getmdl.io/1.3.0/material.orange-indigo.min.css"

  if      (tab == 'temp')   { var sheet = temp_style;}
  else if (tab == 'lights') { var sheet = lights_style;}
  else if (tab == 'harmony'){ var sheet = har_style;}
  
  document.getElementById("pagestyle").setAttribute("href", sheet); 
}
//------------- End Set Style Sheet Function ---------------------------------- //





// ....................... Change to Light/Dark Mode ...................... //

function change_theme(stat)
{
    
  if (stat == "start")
  {
    document.body.style.backgroundColor = "white";
    document.getElementById("theme").innerHTML = "Dark Theme";
  }
  else
  {
    var theme = document.body.style.backgroundColor;

    if (theme == "white")
    {
      document.body.style.backgroundColor = "rgba(0,0,0,.8)";
      document.body.style.color = "white";
      document.getElementById("theme").innerHTML = "Light Theme";
    }
    else
    {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
      
      document.getElementById("theme").innerHTML = "Dark Theme";
    }
  }
}
//-------------- End Change to Light/Dark Mode ------------------------ //
