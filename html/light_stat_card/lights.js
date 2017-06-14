
   
//.......................... Dimmer Switch Function ......................... //    
function dimmer(light_stat)
{
    
  if (light_stat == 'light_on')
  {     
    var slider = document.getElementById('dim').value;
    var scale = slider/100.0
    document.getElementById('light_bulb').style = "opacity: " + scale;
    var style = document.createElement("STYLE");
    var opa = document.createTextNode(".mdl-slider__background-lower { background: orange;opacity: "+ scale + ";}");
    style.appendChild(opa);
    document.head.appendChild(style);
  }
  else if (light_stat == 'light_off')
  {
    var style = document.createElement("STYLE");
    var opa = document.createTextNode(".mdl-slider__background-lower { background: grey ; opacity: .55 }");
    style.appendChild(opa);
    document.head.appendChild(style);
  }
}
//--------------------- End Dimmer Switch Function ------------------------- //


//..................... Light Switch Function ............................. //
function light_switch(stat)
{   
  var image = document.getElementById('light_bulb');
  var light_stat = image.src.match('light_on');
  if (stat == 'light')
  { 
    if (image.src.match("light_on")) 
    {
        image.src = "Fig/light_off.png";
        dimmer('light_off');
    } 
    else
    {
        image.src = "Fig/light_on.png";
        dimmer('light_on');
    }      
  }
  else if (stat == 'dim')
  {
    dimmer(light_stat);
  }

}
//------------- End Light Switch Function ------------------------------- //

