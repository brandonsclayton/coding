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


