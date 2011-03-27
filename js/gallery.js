var URL = "gallery_json.txt";

// Loads Photos from JSON - Displays Current Photo and Thumbnails
// Sets up Click Event Handlers on Thumbnails and Previous and Next Buttons
function loadPhotos() {

	// Gets JSON Data of Photos via AJAX call
	$.get(URL, function(jsonData) {
		displayCurrentPhoto("1", jsonData); // Displays first photo in list on load
		displayThumbnails(jsonData);
		highlightSelectedThumbnail("1", jsonData.photos.length); // Highlights first Thumbnail in list on load
		
		// Thumbnail Click Handler
		$('#thumbnail_section ul li img').click(function(){
			var imgIdClickedOn = $(this).attr('id');
			highlightSelectedThumbnail(imgIdClickedOn, jsonData.photos.length);
			displayCurrentPhoto(imgIdClickedOn, jsonData); // Displays the selected photo
		});
		
		// Previous Button Click Handler
		$('#previous-button').click(function(){
			var currentImageId = $('#thumbnail_section img.selected').attr('id');
			var currentImageIdIntVal = parseInt(currentImageId);
			// allows ability to wrap around array element
			if(currentImageIdIntVal <= 1) {
				currentImageId = (jsonData.photos.length).toString();
			}
			else {
				currentImageIdIntVal = currentImageIdIntVal - 1; 
				currentImageId = currentImageIdIntVal.toString();
			}
			
			highlightSelectedThumbnail(currentImageId, jsonData.photos.length);
			displayCurrentPhoto(currentImageId, jsonData); // Displays the selected photo
		});

		// Next Button Click Handler
		$('#next-button').click(function(){
			var currentImageId = $('#thumbnail_section img.selected').attr('id');
			var currentImageIdIntVal = parseInt(currentImageId);
			// allows ability to wrap around array element
			if(currentImageIdIntVal >= jsonData.photos.length) {
				currentImageId = '1'; 
			}
			else {
				currentImageIdIntVal = currentImageIdIntVal + 1; 
				currentImageId = currentImageIdIntVal.toString();
			}
			
			highlightSelectedThumbnail(currentImageId, jsonData.photos.length);
			displayCurrentPhoto(currentImageId, jsonData); // Displays the selected photo
		});

	},
	"json");
}

// Displays Photo with CSS Id selector specified along with title, date, location
// Also, highlights the thumbnail border to blue color.
// jsonData contains the data
function displayCurrentPhoto(id, jsonData) {
	$('#header h1').text(jsonData.album.name); // sets album name
	
	// iterate through array of photos in jsonData in order to find the photo record (given the id).
	$.each(jsonData.photos, function(index, photo) {
		if(photo.id == id) {
			$('#current_image_section img').attr("src", photo.url);
			$('#current_image_section img').attr("alt", photo.title);
			$('#current_image_section h2').text(photo.title);
			$('#current_image_section h3').text('Taken on ' + photo.date + ' in ' + photo.location);
			
			return false; // breaks out of $.each loop
		}
	});
	
}

// Displays Thumbnails by loading JSON data of images into DOM.
// Sets opacity hover effects on Thumbs as well.
function displayThumbnails(jsonData) {
	var ul = $('<ul />').appendTo("#thumbnail_section");
	
	$.each(jsonData.photos, function(index, photo) {
		var li = $("<li />").appendTo(ul);
		
		$("<img />", {
			id: (parseInt(index) + 1),
			src: photo.thumb_url,
			alt: photo.title
		}).appendTo(li);		
	});
	
	// Initially set opacity on thumbs and add
	// additional styling for hover effect on thumbs
	var onMouseOutOpacity = 0.75;
	$('#thumbnail_section ul li').opacityrollover({
		mouseOutOpacity:   onMouseOutOpacity,
		mouseOverOpacity:  1.0,
		fadeSpeed:         'fast',
		exemptionSelector: '.selected'
	});
}

// Highlights Selected Thumbnail by Giving it a non-white border (currently blue)
// All Thumbnails not highlighted will have the default white border color.
function highlightSelectedThumbnail(imgIdClickedOn, numberOfPhotos) {
	// Loops through total number photos which were included in json file
	for (var i=1; i<=numberOfPhotos; i=i+1) {
		if(i != imgIdClickedOn)
		{
			$('#' + i).removeClass('selected');
		}
		else {
			$('#' + i).addClass('selected');
		}
	}
}

// Handler for when the DOM is ready
$(function(){
	loadPhotos();
	
	// Sets up Event Handlers for Previous and Next Arrows
	$('img#previous-button').mouseover(function(){
		$(this).attr('src', 'images/previous-button-over.png');
	});

	$('img#previous-button').mouseout(function(){
		$(this).attr('src', 'images/previous-button.png');
	});

	$('img#next-button').mouseover(function(){
		$(this).attr('src', 'images/next-button-over.png');
	});

	$('img#next-button').mouseout(function(){
		$(this).attr('src', 'images/next-button.png');
	});

});