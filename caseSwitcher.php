<?php


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