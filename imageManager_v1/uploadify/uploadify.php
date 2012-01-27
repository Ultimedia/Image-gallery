<?php
/*
Uploadify v2.1.4
Release Date: November 8, 2010

Copyright (c) 2010 Ronnie Garcia, Travis Nickels

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
function RandomString($length=35) 
	{ 
	$randstr=''; 
	srand((double)microtime()*1000000); 
	$chars = array ( 'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0'); 
	for ($rand = 0; $rand <= $length; $rand++) 
		{ 
		$random = rand(0, count($chars) -1); 
		$randstr .= $chars[$random]; 
		} 
		return $randstr; 
} 


$randomteil = RandomString(8);
$timestamp = time();
$name = $timestamp.$randomteil;


if (!empty($_FILES)) {
    $tempFile = $_FILES['Filedata']['tmp_name'];
    $targetPath = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['folder'] . '/';
    $targetFile =  str_replace('//','/',$targetPath) . $_FILES['Filedata']['name'];
	$extension = end(explode('.', $targetFile));
	$extension = strtolower($extension);	
	$newFileName = $name.(($_GET['location'] != '')?$_GET['location'].'':'').".".$extension; // 
	$targetFile =  str_replace('//','/',$targetPath) . $newFileName;
    move_uploaded_file($tempFile,$targetFile);
  
	
}

$imgsize = getimagesize($targetFile);
switch(strtolower(substr($targetFile, -3))){
    case "jpg":
        $image = imagecreatefromjpeg($targetFile);    
    break;
    case "png":
        $image = imagecreatefrompng($targetFile);
    break;
    case "gif":
        $image = imagecreatefromgif($targetFile);
    break;
    default:
        exit;
    break;
}

$width = 200; //New width of image    
$height = $imgsize[1]/$imgsize[0]*$width; //This maintains proportions

$src_w = $imgsize[0];
$src_h = $imgsize[1];
    

$picture = imagecreatetruecolor($width, $height);
imagealphablending($picture, false);
imagesavealpha($picture, true);
$bool = imagecopyresampled($picture, $image, 0, 0, 0, 0, $width, $height, $src_w, $src_h); 

if($bool){
    switch(strtolower(substr($targetFile, -3))){
        case "jpg":
            header("Content-Type: image/jpeg");
            $bool2 = imagejpeg($picture,$targetPath."thumbs/".$newFileName,80);
        break;
        case "png":
            header("Content-Type: image/png");
            imagepng($picture,$targetPath."thumbs/".$newFileName);
        break;
        case "gif":
            header("Content-Type: image/gif");
            imagegif($picture,$targetPath."thumbs/".$newFileName);
        break;
    }
}



echo  "".$newFileName."";
?>