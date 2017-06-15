
//.................. Set Style Sheet Function .................................. //
function swap_style(tab)
{   
  var temp_style =   "https://code.getmdl.io/1.1.3/material.indigo-red.min.css";   
  var temp_foot  =   "#F44336";     // Red footer color
  var lights_style = "https://code.getmdl.io/1.3.0/material.deep_purple-light_green.min.css";
  var lights_foot =  "#8BC34A";     // Light green footer color
  var har_style =    "https://code.getmdl.io/1.3.0/material.orange-indigo.min.css";
  var har_foot =     "#3F51B5";     // Indigo footer color

  if      (tab == 'temp')   { var sheet = temp_style;   var foot = temp_foot;}
  else if (tab == 'lights') { var sheet = lights_style; var foot = lights_foot;}
  else if (tab == 'harmony'){ var sheet = har_style;    var foot = har_foot;}
  
  document.getElementById("pagestyle").setAttribute("href", sheet);
  document.getElementById("foot").style.backgroundColor = foot;
}
//------------- End Set Style Sheet Function ---------------------------------- //





// ....................... Change to Light/Dark Mode ...................... //

function change_theme(stat)
{
  var light_bg =   "#FAFAFA";
  var light_card = "white";

  var dark_bg =    "#303030";
  var dark_card =  "#424242";

  if (stat == "start")
  {
    document.body.style.backgroundColor = light_bg ;
    document.getElementById("cell").style.backgroundColor = light_card;
    document.getElementById("theme").style.backgroundColor = light_card;

    document.getElementById("theme").innerHTML = "Dark Mode";
    document.getElementById("theme").value = "light"; 
  }
  else
  {
    var theme = document.getElementById("theme").value;//document.body.style.backgroundColor;

    if (theme == "light")
    {
      document.body.style.backgroundColor = dark_bg;
      document.getElementById("theme").style.backgroundColor = dark_card;
      document.getElementById("cell").style.backgroundColor = dark_card;
      
      document.body.style.color = "white";
      document.getElementById("theme").style.color = "white";
      
      document.getElementById("theme").innerHTML = "Light Mode";
      
      document.getElementById("theme").value = "dark"; 
    }
    else
    {
      document.body.style.backgroundColor = light_bg;
      document.getElementById("theme").style.backgroundColor = light_card;
      document.getElementById("cell").style.backgroundColor = light_card;
      
      document.body.style.color = "black";
      document.getElementById("theme").style.color = "black"
      
      document.getElementById("theme").innerHTML = "Dark Mode";
      
      document.getElementById("theme").value = "light"; 
    }
  }
}
//-------------- End Change to Light/Dark Mode ------------------------ //
