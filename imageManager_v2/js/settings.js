var imageGallery = {};
	imageGallery.config = {};
	
	imageGallery.config.dataPath = 'data/'
	imageGallery.config.galleryDataFile = imageGallery.config.dataPath + 'galleryData.json';
	
	imageGallery.config.imagePath = 'images/';
	imageGallery.config.servicePath = 'php/'
	imageGallery.config.imageRetrieveService = imageGallery.config.servicePath + 'retrieveImages.php';
	imageGallery.config.saveImageDataService = imageGallery.config.servicePath + 'saveImageData.php';
	imageGallery.config.saveImageDataPath = '../' + imageGallery.config.galleryDataFile;