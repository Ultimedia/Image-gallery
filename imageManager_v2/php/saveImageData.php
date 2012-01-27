<?php
	if ((isset($_REQUEST["data"])) && ($_REQUEST["data"] !== "")) {
		$data = $_REQUEST["data"];
		$saveLocation = $_REQUEST["savePath"];
	} else {
		header("HTTP/1.1 400 No data specified (no folder specified...)");
		die();
	}
	
	if ($data != null) { 
     	$file = fopen($saveLocation,'w+');
		fwrite($file, stripslashes($data));
		fclose($file);
		
		echo "true";
   } else {
   		echo "false";
   }
?>