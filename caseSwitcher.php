<?php
include("jakesFunction.js");
echo("<head>");
echo("<style>");
echo("ul#menu li {");
echo("display:inline;");
echo("}");
echo("</style>");
$name = "title";
echo("<div class=".$name."><h3>Physics Simulation 1 - JHacks 2017 - Team UIUC</h3></div>");
$name = "utf-8";
echo("<meta charset=".$name."> ");
echo("</head>");

echo("<nav>");
$name = "menu";
echo("<ul id=".$name.">");
$name = "SampleHTML.html";
echo("<li><a href=".$name.">Home</a></li>");
echo("<li><strong>Simulation 1 test</strong></li>");
$name = "Sim2Page.html";
echo("<li><a href=".$name.">Simulation 2</a></li>");
$name = "Sim3Page.html";
echo("<li><a href=".$name.">Simulation 3</a></li>");
echo("</ul>");
echo("</nav>");

$arg = "Sim1.csv";

echo("<script>jakesFunction(".$arg.");</script>");
readfile("Sim.html");

?>