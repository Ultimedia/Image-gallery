<?php
# include parseCSV class.
require_once ('parsecsv.lib.php');

# create new parseCSV object.
$csv = new parseCSV();
$csv -> sort_by = 'tags';
$csv -> auto('_books.csv');


$key = "";
$key2 = "";
$id = -1;
$id3 = -1;
$id4 = -1;
$arr = array();
$imageKey = "bob";
$alltitlear = array();
$allimagear = array();


foreach($csv->data as $value) {
	

	
	$myArray = explode(',', $value['tags']);
	
	
	
	
foreach($myArray as $value2) {
	
		$id++;
		$arr[$id][] = $value['rating'];
		$arr[$id][] = $value['title'];
		$arr[$id][] = $value['author'];
		$arr[$id][] = $value['type'];
		$arr[$id][] = $value['asin'];
		$arr[$id][] = $value2;
		$arr[$id][] = $value['image'];
		
	
	}
}

foreach($arr as $value3) {

$imname = $value3['6'];
$titleval = $value3['1'];
$id2 = trim($value3['5']);
$arr2[$id2][] = $imname;
$titlear[$id2][] = $titleval;

}



$tag_value = $_REQUEST['tag_value'];
header("Content-type: application/json");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

if($tag_value == "tags") {
$tag_array["tag_value"];
while($element = current($arr2)) {

$tag_array["tag_value"][] = key($arr2);

next($arr2);
}


$data_to_send = $tag_array;

echo json_encode($data_to_send);
}

$image_value = $_REQUEST['image_value'];
header("Content-type: application/json");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

if($image_value != "") {
	$id3 = -1;
$imageKey = $image_value;

foreach($arr2 as $value4) {
	$id3++;

	if($arr2[$image_value][$id3] != ""){
	$imageArray["image_value"]['imname'][] = $arr2[$image_value][$id3];
	$imageArray["image_value"]['titles'][] = $titlear[$image_value][$id3];

	
}
	
}

$data_to_send = $imageArray;

echo json_encode($data_to_send);

}

$imageInfo_value = $_REQUEST['imageInfo_value'];
header("Content-type: application/json");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

if($imageInfo_value != "") {
	
	foreach($csv->data as $value) {
		if($value['image'] == $imageInfo_value){
			
		$imageInfoArray['imageInfo_value'][] = $value['rating'];
		$imageInfoArray['imageInfo_value'][] = $value['title'];
		$imageInfoArray['imageInfo_value'][] = $value['author'];
		$imageInfoArray['imageInfo_value'][] = $value['type'];
		$imageInfoArray['imageInfo_value'][] = $value['asin'];
		$imageInfoArray['imageInfo_value'][] = $value['tags'];
		$imageInfoArray['imageInfo_value'][] = $value['image'];
		}
	}
	$data_to_send = $imageInfoArray;
	
	

echo json_encode($data_to_send);
}

$edit_value = $_REQUEST['edit_value'];
header("Content-type: application/json");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
if($edit_value != "") {
$csv2 = new parseCSV();
$csv2 -> auto('_books.csv');

foreach($csv2->data as $value) {
		$id4++;
		
		if($value['image'] == $edit_value['oldImage']){
			
			$csv2->data[$id4++] = array('id' => $id4++,'rating' => $edit_value['rating'], 'title' => $edit_value['title'], 'author' => $edit_value['author'], 'type' => $edit_value['type'], 'asin' => $edit_value['asin'], 'tags' => $edit_value['tags'], 'image' => $edit_value['newImage']);
			$csv2->save();
		}
			
			
		}
	
}


$new_value = $_REQUEST['new_value'];
header("Content-type: application/json");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
if($new_value  != "") {
	
		$csv3 = new parseCSV();
		$csv3 -> auto('_books.csv');
			$value = $csv3->data;
			$nr= sizeof($value);
			
			
			$csv3->data[$nr] = array('id'=>$nr,'rating' => $new_value['rating'], 'title' => $new_value['title'], 'author' => $new_value['author'], 'type' => $new_value['type'], 'asin' => $new_value['asin'], 'tags' => $new_value['tags'], 'image' => $new_value['newImage'],'');
			$csv3->save();
				
}


$infinite_value = $_REQUEST['infinite_value'];
header("Content-type: application/json");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

if($infinite_value != "") {

$csv4 = new parseCSV();
$csv4 -> auto('_books.csv');


foreach($csv4->data as $value3) {
	$alltitlear[] = $value3['title'];
	$allimagear[] = $value3['image'];
}
	
foreach($csv4->data as $value4) {
$id3++;

if($alltitlear[$id3] != ""){
	$imageArray["infinite_value"]['imname'][] = $allimagear[$id3];
	$imageArray["infinite_value"]['titles'][] = $alltitlear[$id3];
}
}	
$data_to_send = $imageArray;

echo json_encode($data_to_send);
	
}


?>