



//.................. Set Style Sheet Function .................................. //
function swap_style(tab)
{   
  var temp_style =   "https://code.getmdl.io/1.1.3/material.indigo-red.min.css";   
  var temp_foot  =   "#F44336";     // Red footer color
  var lights_style = "https://code.getmdl.io/1.3.0/material.deep_purple-light_green.min.css";
  var lights_foot =  "#8BC34A";     // Light green footer color
  var sec_style =    "https://code.getmdl.io/1.3.0/material.orange-indigo.min.css";
  var sec_foot =     "#3F51B5";     // Indigo footer color

  if      (tab == 'temp')   { var sheet = temp_style;   var foot = temp_foot;}
  else if (tab == 'lights') { var sheet = lights_style; var foot = lights_foot;}
  else if (tab == 'sec'){ var sheet = sec_style;    var foot = sec_foot;}
  
  document.getElementById("pagestyle").setAttribute("href", sheet);
  document.getElementById("foot-"+tab).style.backgroundColor = foot;
}
//------------- End Set Style Sheet Function ---------------------------------- //





// ....................... Change to Light/Dark Mode ...................... //

function change_theme(stat,tab)
{
  var light_bg =   "#FAFAFA";
  var light_card = "white";

  var dark_bg =    "#303030";
  var dark_card =  "#424242";

  if (stat == "start")
  {
    document.body.style.backgroundColor = light_bg ;
    //document.getElementById("cell").style.backgroundColor = light_card;
    document.getElementById("theme-"+tab).style.backgroundColor = light_card;

    document.getElementById("theme-"+tab).innerHTML = "Dark Mode";
    document.getElementById("theme-"+tab).value = "light"; 
  }
  else
  {
    var theme = document.getElementById("theme-"+tab).value;//document.body.style.backgroundColor;

    if (theme == "light")
    {
      document.body.style.backgroundColor = dark_bg;
      document.getElementById("theme-"+tab).style.backgroundColor = dark_card;
      //document.getElementById("cell").style.backgroundColor = dark_card;
      
      document.body.style.color = "white";
      document.getElementById("theme-"+tab).style.color = "white";
      
      document.getElementById("theme-"+tab).innerHTML = "Light Mode";
      
      document.getElementById("theme-"+tab).value = "dark"; 
    }
    else
    {
      document.body.style.backgroundColor = light_bg;
      document.getElementById("theme-"tab).style.backgroundColor = light_card;
      //document.getElementById("cell").style.backgroundColor = light_card;
      
      document.body.style.color = "black";
      document.getElementById("theme-"+tab).style.color = "black"
      
      document.getElementById("theme-"+tab).innerHTML = "Dark Mode";
      
      document.getElementById("theme-"+tab).value = "light"; 
    }
  }
}
//-------------- End Change to Light/Dark Mode ------------------------ //




