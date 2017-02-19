<?php

echo("<nav>");
echo("<ul>");
echo("<li><strong>Home</strong></li>");
$name = "caseSwitcher.php";
    echo("<li><a href=".$name.">Switch this case</a></li>");
 $name = "Sim.html";
   echo(" <li><a href=".$name.">Simulation 1</a></li>");
 $name = "Root.html";
    echo("<li><a href=".$name.">Simulation 2</a></li>");
 $name = "Root.html";
    echo("<li><a href=".$name.">Simulation 3</a></li>");
  echo("</ul>");
echo("</nav>");

$num = doubleval($_POST['Visualizations']);

if($num == 1){
	readfile("Sim.html");
}else if($num == 2){
	readfile("Sim2.html");
}
else if($num == 3){
	echo("<h3>This is not the simulation you are looking for</h3>");
}

?>