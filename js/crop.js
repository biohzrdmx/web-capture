chrome.extension.onRequest.addListener(function onMessage(request, sender, callback) {
	if (request.msg == 'image') {
		//
		var image = new Image;
		image.onload = function() {
			var jCropApi = null;
			$('#cropper').empty().append(image);
			$(image).Jcrop({
				onChange: function(coords) {
					$('header .x').html(coords.x + '<i>px</i>');
					$('header .y').html(coords.y + '<i>px</i>');
					$('header .width').html(coords.w + '<i>px</i>');
					$('header .height').html(coords.h + '<i>px</i>');
				}
			}, function() {
				jCropApi = this;
			});
			$('.btn-crop').on('click', function(e) {
				e.preventDefault();
				var coords = jCropApi.tellSelect(),
					canvas = document.createElement('canvas'),
					ctx = canvas.getContext('2d');
				canvas.width = coords.w;
				canvas.height = coords.h;
				ctx.drawImage(image, coords.x, coords.y, coords.w, coords.h, 0, 0, coords.w, coords.h);
				//
				window.open( canvas.toDataURL() );
			});
			//
			callback(true);
		}
		image.src = request.dataURI;
	}
});