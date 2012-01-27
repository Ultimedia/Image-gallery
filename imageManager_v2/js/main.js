// Store the images
imageGallery.images = [];
imageGallery.imageData = [];
imageGallery.tags = [];
imageGallery.imageSelected = false;

// imageObject Dummy
imageGallery.imageObject = {
	url:'',
	tags:[],
	rating:0,
	title:'',
	author:'',
	asin:''
}


/**
 * Document ready
 */
$(document).ready(function() {
	// load the images
	imageGallery.loadImages();
	
	// bind events
	imageGallery.bindEvents();
});


/**
 * Bind the events
 */
imageGallery.bindEvents = function(){
	// Stars plugin
	var ui = $("#ratingWrapper");
		ui.stars({
			 callback: function(ui, type, value){
			 	imageGallery.newImage.rating = value;
			 }
		});
		ui.find('.ui-stars-cancel').remove();

	// jQModal
	$('#imageModal').jqm(); 
	
	// close the image modal
	$('#closeModal').click(function(){ 
		$('#imageModal').jqmHide() 
	});
	
	// open the image modal
	$('#newImageButton').click(function(){
		$('#imageModal').jqmShow(); 
		
		// create a new empty image object
		imageGallery.newImage = $.extend({}, imageGallery.imageObject);
	});
	
	// searching
	$("#searchInput").keyup(function() {
		imageGallery.search($('#searchInput').val());
	});
	
	// resizer
	$(window).resize(function() {
		imageGallery.setPos();
	});
	imageGallery.setPos();
	
	// uploadButton
	$('#uploadButton').click(function(){

		
		return false;
	});
	
	// add tag button	
	$('#addTagButton').click(function(){
		var tagText = $('#tagInput').val();	
		
		if(tagText !== ""){
			var tag = '<span class="tag">' + tagText + '</span>';
			$('#tagContainer').append(tag);
			$('#tagInput').val('');
			imageGallery.newImage.tags.push(tagText);
		}
		return false;
	});
	
	// add the image to the gallery
	$('#saveImageButton').click(function(){
		imageGallery.newImage.title = $('#titleInput').val();
		imageGallery.newImage.author = $('authorInput').val();
		imageGallery.newImage.asin = $('asinInput').val();

		return false;
	});
}

imageGallery.setPos = function(){
	var requestedHeight = $(document).height() - 50;
	$('#rightCol').css('height', requestedHeight);
	$('#imageCol').css('height', requestedHeight);
	$('#listCol').css('height', requestedHeight);
	
	// Modal
	$('#imageModal').css("top", ( $(window).height() - $('#imageModal').height() ) / 2+$(window).scrollTop() + "px");
	$('#imageModal').css("left", ( $(window).width() - $('#imageModal').width() ) / 2+$(window).scrollLeft() + "px");
	$('#galleryInfo').css("left", ( $(window).width() - $('#galleryInfo').width() ) / 2+$(window).scrollLeft() + "px");
}

/**
 * Search
 */
imageGallery.search = function(searchValue){
	
	if(searchValue !== ''){
		// show all images
		$('#imageCol img').show();
		
		// remove the highlight from the listCol
		$('#listCol li').removeClass('selected');
		
		// perform a search on our dataObject (using the tags)
		$(imageGallery.tags).each(function(imageIndex, imageObject){
			var result = searchValue.toLowerCase().indexOf(imageObject.toLowerCase())>=0;
			
			if(result){
				$('#imageCol ' + '.' + imageObject).show();
			}else{
				$('#imageCol ' + '.' + imageObject).hide();
			}
		});
		
		imageGallery.imageCounter();
	}else{
		$('#imageCol img').show();
		imageGallery.imageCounter();
		$('#listCol li').first().addClass('selected');
	}
};


/**
 * Grab the images from the specified folder
 */
imageGallery.loadImages = function(){
	
	// Create the payload
	var payload = {};
		payload.imagePath = '../' + imageGallery.config.imagePath 
	
	// Retrieve the images from the main image folder
	$.ajax({
  		url: imageGallery.config.imageRetrieveService,
 		data: payload,
 		dataType: 'json',
  		success: function(images){
  			
  			// All the images that the application needs
  			imageGallery.images = images;	
  			
  			// Adjust The counter
  			imageGallery.updateImageCounter(imageGallery.images.length);
  			
  			// Load the gallery data
  			$.ajax({
  				url: imageGallery.config.galleryDataFile,
 				dataType: 'json',
  				success: function(data){
  					imageGallery.imageData = data.images;
  				
  					// Now generate the gallery
  					imageGallery.generateData();
  				},
  				error: function(){
  					imageGallery.errorMessage('error when loading imageData', 'error');
  				}
  			});
  		}
	});
}


/**
 * Update the imageCounter in the topBar
 */
imageGallery.updateImageCounter = function(length){
	$('.imageCount').text(length + ' Images');
}


/**
 * Generate the image data
 */
imageGallery.generateData = function(){
	
	/* 
	 * What we do is comparing the imageData JSON file with the images from the image folder
	 * when an image is not present in the imageData we create a new image
	 */
	
	$.each(imageGallery.images, function(imageFolderIndex, imageFolderObject){
		var found = false;
		var newDataImage = $.extend({}, imageGallery.imageObject);
			newDataImage.url = imageFolderObject;
			
		if(imageGallery.imageData.length !== 0){
			$.each(imageGallery.imageData, function(imageIndex, imageObject){
				if (imageObject.url === imageFolderObject) {
					found = true;
					
					// ok we found it, there is no need to continue searching
					return false;
				}else{
					newDataImage.url = imageFolderObject;
					found = false;
				}
			});
		}
		
		if(!found){
			// Add the new image object to the data
			imageGallery.imageData.push(newDataImage);
		}
	});

	// now lets update the actual JSON file.
	imageGallery.saveDataToServer(function(success){
		if(success){
			// once this is complete we can start generating the visuals
			imageGallery.generateGallery();
		}else{
			imageGallery.errorMessage('error saving data on the server', 'test');
		}
	});
	
}


/** 
 * Generate the visuals for the gallery
 */
imageGallery.generateGallery = function(){
	
	// ok the data is saved, now populate the application
	$.each(imageGallery.imageData, function(imageIndex, imageObject){		
		
		console.log(imageGallery.config.imagePath + imageObject.url);
		
		var image = $('.dummyImage').clone().attr('data-id', imageIndex);
			$(image).attr('src', imageGallery.config.imagePath + imageObject.url);
			$('#imageCol').append(image);
			$('.imageTitle p', image).text(imageObject.title);
		
		if(imageObject.tags.length !== 0){
				$.each(imageObject.tags, function(tagIndex, tagObject){
				$('#listCol ul').append('<li class="' + tagObject + '">' + tagObject + '</li>');
				$(image).addClass(tagObject.toString());
				imageGallery.tags.push(tagObject);
				
							console.log(tagObject + ' ');
			});
		

		}
		
		// remove the template image
		image.removeClass('dummyImage');
	});
	
	// show the number of images
	imageGallery.imageCounter();
	
	// show the number of tags
	imageGallery.tagCounter();
	
	// remove the template image
	$('.dummyImage').remove();
	
	// filter out the duplicate tags from the menu	
	imageGallery.removeDuplicateItems($('#listCol'));
	
	// add a clickHandler so we can filter on tags
	$('#listCol ul li').click(function(){
		$('#listCol ul li').removeClass('selected');
		imageGallery.filterOnTags(this);
	});
	
	// add a clickhandler on the images
	$('.imageBlock').click(function(){
		imageGallery.showDetail($(this).attr('data-id'), this);
	});
}

/**
* Show the detailPage
*/ 
imageGallery.showDetail = function(imageID, imageObject){
	var selectedImage = imageGallery.imageData[imageID];
	var myTags = "";	
		
	// Highlight the image in the grid
	$('#imageCol img').removeClass('selected');
	$('img',imageObject).addClass('selected');
	
	//	
	if(!imageGallery.imageSelected){
		$('#noImages').hide();
		$('#imageInfo').show();
		imageGallery.imageSelected = true;
	}
	
	// Show info related to the selected image
	$('#imageInfo img').attr('src', imageGallery.config.imagePath + selectedImage.url);
	$('#imageTitle').text(selectedImage.title);
	$('#r_author').text(selectedImage.author);
	$('#r_asin').text(selectedImage.asin);	
	
	// Show the rating	
	
	// Empty tagcloud
	$('#tagCloud').empty();
	
	// Generate the tagcloud
	$(selectedImage.tags).each(function(tagIndex, tagElement){
		myTags += '<span class="tag">';
		myTags += tagElement;
		myTags += '</span>';	
	});
	
	$('#tagCloud').append(myTags);
}

/**
 * Filter on a tag
 */
imageGallery.filterOnTags = function(tag){
	
	// create the filter
	var myFilter = '.' + $(tag).attr('class');
	
	// see if the filter actually contains any filter data (if not, we just have to show all the images)
	if(myFilter !== '.'){
		
		// apply the filter
		$('#imageCol img').hide().filter(myFilter).show();
	}else{
		
		// no filter = just show every image
		$('#imageCol img').show();
	}
	
	imageGallery.imageCounter();
	
	// update the menu
	$(tag).addClass('selected');
};


/**
 * Count the visible images
 */
imageGallery.imageCounter = function(){
	var images = $('#imageCol img:visible').length;
	
	if(images === 1){
		$('#galleryInfo .imageCount').text(images + ' image');
	}else{
		$('#galleryInfo .imageCount').text(images + ' images');
	}
}


/**
 * Count the number of tags
 */
imageGallery.tagCounter = function(){
	var tags = $('#listCol ul li').length - 2;
	if(tags === 1){
		$('#loadMoreButton').text(tags + ' Tag');
	}else{
		$('#loadMoreButton').text(tags + ' Tags');
	}
}


/**
 * Remove duplicate elements from a list
 */
imageGallery.removeDuplicateItems = function(dupl) {
    var ul = dupl;

    $('li', ul).each(function() {
        if($('li:contains("' + $(this).text() + '")', ul).length > 1)
           $(this).remove();
    });
}


/**
 * Show a gritter message (used for debugging)
 */
imageGallery.errorMessage = function(msg, title){
	$.gritter.add({
		// (string | mandatory) the heading of the notification
		title: title,
		text: msg,
		fade_out_speed: 3000, // how fast the notices fade out
		time: 15000 // hang on the screen for...
   });
}

/**
 * Update our saved JSON file
 */
imageGallery.saveDataToServer = function(callback){
	var saveData = {};
		saveData.data = '{ "images":' + JSON.stringify(imageGallery.imageData) + '}';
		saveData.savePath = imageGallery.config.saveImageDataPath;
	
	$.ajax({
  		url: imageGallery.config.saveImageDataService,
 		data: saveData,
 		type: 'POST',
  		success: function(result){	
			// Call back
			if (result === "true") {
				callback(true);
			}else{
				callback(false);
			}
  		},
  		error: function(error){
  			console.log(error);	
  		}
 	});
}
