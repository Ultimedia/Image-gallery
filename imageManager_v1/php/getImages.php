
<?php

$location = "../uploads/logos/";
$folder = opendir($location); // Use 'opendir(".")' if the PHP file is in the same folder as your images. Or set a relative path 'opendir("../path/to/folder")'.

$pic_types = array("jpg", "jpeg", "gif", "png");

$index = array();

while ($file = readdir ($folder)) {

  if(in_array(substr(strtolower($file), strrpos($file,".") + 1),$pic_types))
	{
		array_push($index,$file);
	}
}

closedir($folder);

asort($index);
		
echo json_encode($index);
	
?>