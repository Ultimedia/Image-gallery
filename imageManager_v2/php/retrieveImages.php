<?php
	if ((isset($_REQUEST["imagePath"])) && ($_REQUEST["imagePath"] !== "")) {
		$imagePath = $_REQUEST["imagePath"];
	} else {
		header("HTTP/1.1 400 No payload specified (no folder specified...)");
		die();
	}

	$folder = opendir($imagePath);
	$pic_types = array("jpg", "jpeg", "gif", "png");
	$index = array();
	
	while ($file = readdir ($folder)) {
		if(in_array(substr(strtolower($file), strrpos($file,".") + 1),$pic_types)){
			array_push($index,$file);
		}
	}
	
	closedir($folder);
	asort($index);
	
	header('Content-type: application/json');
	echo json_encode($index);
?>