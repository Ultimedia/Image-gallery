/**
 * General namespace and settings
 */
var imageGallery = {};
	imageGallery.contentHeight = 800;
	imageGallery.pageHeight = document.documentElement.clientHeight;
	imageGallery.scrollPosition;
	imageGallery.imageName;
	imageGallery.tagit = null;
	
	imageGallery.config = {};
	imageGallery.config.picturePath = 'pictures/thumbs/';
	imageGallery.config.servicePath = 'php/';
	imageGallery.config.dataRetrieverService = imageGallery.config.servicePath + 'dataretriever.php';
	
	
/**
 * Init the application
 */
$(document).ready( function() {
	$("input[type=text], textarea").tooltip({
		// place tooltip on the right edge
		position: "center right",

		// a little tweaking of the position
		offset: [-2, 10],

		// use the built-in fadeIn/fadeOut effect
		effect: "fade",

		// custom opacity setting
		opacity: 0.7
	});
	
	// wire the application
	imageGallery.wire();
});


/**
 * Wire the buttons and plugins
 */
imageGallery.wire = function(){
	// alpha numeric validation plugin
	$('.num').numeric();
	$('.cust').alphanumeric({
		ichars:'"\''
	});
	$('.custtag').alphanumeric({
		ichars:'"\''
	});
	
	// load the content
	imageGallery.tagContent();
		
	// bind click handlers
	$('#ex3aTrigger2').bind('click', function() {
		imageGallery.newImage("");
	});
	
	$('#new_add_holder').bind('click', function() {
		imageGallery.addTags("newtag");
	});

	// scroll interval
	setInterval('imageGallery.scroll()', 250);
	
	// fancybox
	$("a#single_image").fancybox();		
}


/**
 * Submit image info, saves the image in the application
 */
imageGallery.submitNewInfo = function(){
	var retnew= new Array();
	$('.newtagList span').each( function(index, el) {
		retnew.push($(el).html());
	});
	
	newImageArray = {
		rating: document.testform.new_rating.value,
		title: document.testform.new_title.value,
		author: document.testform.new_author.value,
		type: document.testform.new_type.value,
		asin: document.testform.new_asin.value,
		tags: retnew.toString(),
		newImage: $("#new_image_name_holder").html(),
	};
	imageGallery.imageName = newImageArray['newImage'];

	// save the image
	$.ajax({
		url: imageGallery.config.dataRetrieverService,
		type: "GET",
		data: {
			"new_value": newImageArray
		},
		success: function(data_from_php, textStatus, jqXHR) {	
			// hide the modal
			$('.jqmDialog').jqmHide(); 
			
			// show the info of the new image (opens the sidebar)
			imageGallery.imageInformation(imageGallery.imageName);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		}
	});
}


/**
 * Populate the left sidebar with a list of all tags
 */
imageGallery.tagContent = function() {
	$.ajax({
		url: imageGallery.config.dataRetrieverService,
		type: "GET",
		data: {
			"tag_value": "tags"
		},
		success: function(data_from_php, textStatus, jqXHR) {
			var str_array = data_from_php.tag_value;
			data = str_array;

			// Process the results
			var result = TrimPath.processDOMTemplate("tag_value_jst", data);
			
			// Count the results
			dummie = str_array.length
			if(dummie < "25") {
				count = "There are " + (str_array.length - "1") + " results";
			} else {
				count = "There are " + (str_array.length - "1") + " results";
			}

			// Append the results to the container
			$('#tags_holder').html(result);
			
			// Bind a click handler
			$('.tagListButton').bind('click', function() {
				imageGallery.imageContent($(this).attr('data'));
			});
			
			// Bind the mouseOver, mouseOut for hover effects
			$('.tagListRow').mouseover(function(){
				imageGallery.changeColor(this, true);
			});
			$('.tagListRow').mouseout(function(){
				imageGallery.changeColor(this, false);
			});
	
			// Add the count
			$('#tag_count').html(count);
			
			imageGallery.searchTags();
		},
		error: function(jqXHR, textStatus, errorThrown) {
		}
	});
}


/**
 * 
 */
imageGallery.imageContent = function(cv) {
	imageGallery.tagit = cv;
	$.ajax({
		url: imageGallery.config.dataRetrieverService,
		type: "GET",
		data: {
			"image_value": cv
		},
		success: function(data_from_php, textStatus, jqXHR) {
			var str_array = data_from_php.image_value;
			dummie = str_array['imname'].length;

			if(dummie == "1"){
				data2 = "<p>" + dummie + " image</p>"
			} else {
				data2 = "<p>" + dummie + " images</p>"
			}

			var imageshowArray = [];
			$.each(str_array['imname'], function(index, image) {
				imageshowArray.push({
					image: image,
					title: str_array['titles'][index]
				})
			});
			
			var result = TrimPath.processDOMTemplate("images_value_jst", {
				"imageshowArray":imageshowArray
			});

			$('#images_holder').html(result);
		
			$(".listImage").bind('click', function() {
				imageGallery.imageInformation($(this).attr('data'));
			});
		
			$('#imagesCount').html(data2);
			$("a.single_image").fancybox();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});
}


/**
 * Shows the info panel for the image (the panel floating on the right of the page)
 */
imageGallery.imageInfo = function(picname){
	$.ajax({
		url: imageGallery.config.dataRetrieverService,
		type: "GET",
		data: {
			"imageInfo_value": picname
		},
		success: function(data_from_php, textStatus, jqXHR) {
			var str_array = data_from_php.imageInfo_value;
			imageInfoArray = {
				rating: str_array[0],
				title: str_array[1],
				author: str_array[2],
				type: str_array[3],
				asin: str_array[4],
				tags: str_array[5],
				image: str_array[6]
			};
			imageGallery.imageName = str_array[6];

			var result = TrimPath.processDOMTemplate("imageInfo_value_jst", {
				"imageInfoArray":imageInfoArray
			});

			$('#imageInfo_holder').html(result);

			document.testform.style.display = "";
			$('.num').numeric();
			$('.cust').alphanumeric({
				ichars:'"\''
			});
			
			// bind uploadify
			$('#file_upload2').uploadify({
				'uploader'  : 'uploadify/uploadify.swf',
				'script'    : 'uploadify/uploadify.php',
				'cancelImg' : 'uploadify/cancel.png',
				'folder'    : 'pictures',
				'displayData' : 'speed',
				'fileDataName' : 'Filedata',
				'auto'      : true,
				'multi': false,
				'height' : 35,
				'width' : 145,
				'removeCompleted' : true,
				'buttonText'  : 'Select image',
				'fileExt': '*.jpg;*.jpeg;*.gif;*.png',
				'fileDesc'    : 'Image Files',
				'onComplete' : function(event, queueID, fileObj, reponse, data) {
					$("#image_name_holder").html(reponse);
					$("#img_change").attr('src',"pictures/thumbs/" + reponse);
				}
			});
			
			// the modal
			$('#ex3a').jqm({
				trigger: '#ex3aTrigger',
				overlay: 40, /* 0-100 (int) : 0 is off/transparent, 100 is opaque */
				overlayClass: 'whiteOverlay'
			});
			$('#ex3a').jqmShow(); 
			
			$('#add_holder').bind('click', function() {
				alert($('.custtag').val());
				
				imageGallery.addTags("tag");
				
			});
			
			$('.editButton').bind('click', function() {
				imageGallery.submitInfo("sub");
			});
				
			$("#image_name_holder").html(imageGallery.imageName);
			$('.imageInfoList').bind('click', function() {
				imageGallery.imageContent($(this).attr('data'));
			});
			
			tags_array = str_array[5].split(",");
			for(var i = 0; i < tags_array.length; i++) {
				var content = $('#add_tags_holder').html();
				$("#add_tags_holder").html(content +"<div class=\"tagList\"><span>"+ tags_array[i] + "</span><a href=\"#\"  onClick=\"return false\" onmousedown=javascript:deleteItem(this);>" + "<img src=\"images/deletebtn.png\"/>" + "</a></div>");
			}
			
			// Close Button Highlighting. IE doesn't support :hover. Surprise?
			$('input.jqmdX')
			.hover( function() {
				$(this).addClass('jqmdXFocus');
			}, function() {
				$(this).removeClass('jqmdXFocus');
			})
			.focus( function() {
				this.hideFocus=true;
				$(this).addClass('jqmdXFocus');
			})
			.blur( function() {
				$(this).removeClass('jqmdXFocus');

			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
		}
	});
}



imageGallery.newImage = function() {
	var result = TrimPath.processDOMTemplate("new_image_value_jst", {});
	
	$('#newImage_holder').html(result);
	$('.num').numeric();
	$('.cust').alphanumeric({
		ichars:'"\''
	});
	$('#file_upload').uploadify({
		'uploader'  : 'uploadify/uploadify.swf',
		'script'    : 'uploadify/uploadify.php',
		'cancelImg' : 'uploadify/cancel.png',
		'folder'    : 'pictures',
		'displayData' : 'speed',
		'fileDataName' : 'Filedata',
		'auto'      : true,
		'multi': false,
		'height' : 35,
		'width' : 145,
		'removeCompleted' : true,
		'buttonText'  : 'Select image',
		'fileExt': '*.jpg;*.jpeg;*.gif;*.png',
		'fileDesc'    : 'Image Files',
		'onComplete' : function(event, queueID, fileObj, reponse, data) {
			$("#new_image_name_holder").html(reponse);
			$("#new_img_change").attr('src',"pictures/thumbs/" + reponse);
		}
	});
	
	$('#ex3a2').jqm({
		trigger: '#ex3aTrigger2',
		overlay: 40, /* 0-100 (int) : 0 is off/transparent, 100 is opaque */
		overlayClass: 'whiteOverlay'
	});
	$('#ex3a2').jqmShow(); 

	$('#newImageButton').click(function(){
		imageGallery.submitNewInfo();
	});
	
	// Close Button Highlighting. IE doesn't support :hover. Surprise?
	$('input.jqmdX')
	.hover( function() {
		$(this).addClass('jqmdXFocus');
	}, function() {
		$(this).removeClass('jqmdXFocus');

	})
	.focus( function() {
		this.hideFocus=true;
		$(this).addClass('jqmdXFocus');

	})
	.blur( function() {
		$(this).removeClass('jqmdXFocus');
	});
}


imageGallery.submitInfo = function(sub) {
	var ret= new Array();
	
	$('.tagList span').each( function(index, el) {
		ret.push($(el).html());
	});
	
	editArray = {
		rating: document.testform.rating.value,
		title: document.testform.title.value,
		author: document.testform.author.value,
		type: document.testform.type.value,
		asin: document.testform.asin.value,
		tags: ret.toString(),
		newImage: $("#image_name_holder").html(),
		oldImage: imageGallery.imageName

	};
	imageGallery.imageName = editArray['newImage'];
	
	$.ajax({
		url: imageGallery.config.dataRetrieverService,
		type: "GET",
		data: {
			"edit_value": editArray
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {			
			imageGallery.tagContent();
			imageGallery.imageContent(imageGallery.tagit);
			imageGallery.imageInformation(imageGallery.imageName);

			$('.jqmDialog').jqmHide();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
			alert('error');	
		}
	});
}


imageGallery.imageInformation = function(picname) {
	$.ajax({
		url: imageGallery.config.dataRetrieverService,
		type: "GET",
		data: {
			"imageInfo_value": picname
		},
		// This executes when the PHP service finisged sending data to the client side
		success: function(data_from_php, textStatus, jqXHR) {

			var str_array = data_from_php.imageInfo_value;

			tags = str_array[5];
			//alert(tags);
			var tags_array = tags.split(",");

			imageInfoArray = {
				rating: str_array[0],
				title: str_array[1],
				author: str_array[2],
				type: str_array[3],
				asin: str_array[4],
				tags: tags_array,
				image: str_array[6]
			};

			imageGallery.imageName = str_array[6];

			//The one line processing call...
			var result = TrimPath.processDOMTemplate("imageInformation_value_jst", {
				"imageInfoArray":imageInfoArray
			});
			
			$('#imageInformation_holder').html(result);
			$("a.single_image").fancybox();
			$('#ex3aTrigger').bind('click', function() {
				imageGallery.imageInfo($(this).attr('data'));
			});
			
			$('.imageInfoList').bind('click', function() {
				imageGallery.imageContent($(this).attr('data'));
			});

		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert("There was some error with the PHP service: " + textStatus);
		}
	});
}


imageGallery.addTags = function(tagger) {
	var tags = "";
	
	if(tagger == "newtag"){
		tags = document.testform.newtag.value;
		tags_array = tags.split(",");
		document.testform.newtag.value = "";
		for(var i = 0; i < tags_array.length; i++) {
			var content = $('#new_add_tags_holder').html();
			$("#new_add_tags_holder").html(content +"<div class=\"newtagList\"><span>"+ tags_array[i] + "</span><a href=\"#\"  onClick=\"return false\" onmousedown=javascript:deleteItem(this);>" + "<img src=\"images/deletebtn.png\"/>" + "</a></div>");
		}
	}else{
		tags = document.testform.tag.value;
		tags_array = tags.split(",");
		document.testform.tag.value = "";
		for(var i = 0; i < tags_array.length; i++) {
			var content = $('#add_tags_holder').html();
			$("#add_tags_holder").html(content +"<div class=\"tagList\"><span>"+ tags_array[i] + "</span><a href=\"#\"  onClick=\"return false\" onmousedown=javascript:deleteItem(this);>" + "<img src=\"images/deletebtn.png\"/>" + "</a></div>");	
		}
	}
}


function deleteItem(e){
	$(e).parent().remove()
}

/**
 * Binds the quicksearch plugin to the search field
 */
imageGallery.searchTags = function(){
	$("#id_search").quicksearch("table tbody tr", {
		noResults: '#noresults',
		stripeRows: ['odd', 'even'],
		loader: 'span.loading',
		onAfter: function(){
			$('#tag_count').text('There are ' + $('.tagListButton:visible').length + ' results');
		}
	});
}

/**
 * The hover effect for the items in the list
 */
imageGallery.changeColor = function(tableRow, highLight) {
	if (highLight) {
		tableRow.style.backgroundColor = "#d84320";
	} else {
		tableRow.style.backgroundColor = "#fdfdfd";
	}
}


var n = 0;
var n2 = 0;
var n3 = 0;

imageGallery.scroll = function(){	
	if(navigator.appName == "Microsoft Internet Explorer"){
		imageGallery.scrollPosition = document.documentElement.scrollTop;
	}else{
		imageGallery.scrollPosition = window.pageYOffset;		
	}
	
	if((imageGallery.contentHeight - imageGallery.pageHeight - imageGallery.scrollPosition) < 640){	
		n = n3;
		n2 = n3 + 15;
		
		$.ajax({
			url: "php/dataretriever.php",
			type: "GET",
			data: {
				"infinite_value": "infinite"
			},
			// This executes when the PHP service finisged sending data to the client side
			success: function(data_from_php, textStatus, jqXHR) {
				var str_array = data_from_php.infinite_value;
				var imageshowArray = [];
			
				for(var i = n; i < n2; i++) {
					if(str_array['imname'].length > i || i < n){
						n3++;
						
						imageshowArray.push({
							image: str_array['imname'][i],
						    title: str_array['titles'][i]
						})
					}
				}
				
				var result = TrimPath.processDOMTemplate("images_value_jst", {
					"imageshowArray":imageshowArray
				});
			
				dummie = str_array['imname'].length;
				
				if(dummie == "1") {

				var imageCount = "<p>" + dummie + " image</p>"
			} else {

				var imageCount = "<p>" + dummie + " images</p>"
			}
			var content = $('#images_holder').html();
			$('#images_holder').html(content + result);
			$('#imagesCount').html(imageCount);
			$("a.single_image").fancybox();
			imageGallery.contentHeight += 750;
		
			// bind a clickhandler to the image
			$(".listImage").bind('click', function() {
				imageGallery.imageInformation($(this).attr('data'));
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert("There was some error with the PHP service: " + textStatus);
		}
	});		
	}
}

	
	
	