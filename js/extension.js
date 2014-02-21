var instance;

chrome.browserAction.onClicked.addListener(function(curTab) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.executeScript(tab.id, { file: 'js/page.js' }, function() {
			instance = {};
			chrome.tabs.sendRequest(tab.id, { msg: 'scroll' }, function() {
				var dataURI = instance.canvas.toDataURL();
				chrome.tabs.create({
					'url': chrome.extension.getURL('crop.html')
				}, function(tab) {
					chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
						if ( changeInfo.status == 'complete' && tabId == tab.id ) {
							chrome.tabs.sendRequest(tab.id, { msg: 'image', dataURI: dataURI }, function() {
								//
							});
						}
					});
				});
			});
		});
	});
});

chrome.extension.onRequest.addListener(function onMessage(request, sender, callback) {
	if (request.msg == 'capture') {
		chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, function(dataURI) {
			var canvas = null;
			if (dataURI) {
				if (! instance.canvas ) {
					canvas = document.createElement('canvas');
					canvas.width = request.fullWidth;
					canvas.height = request.fullHeight;
					instance.canvas = canvas;
					instance.ctx = canvas.getContext('2d');
				}
				var image = new Image();
				image.onload = function() {
					instance.ctx.drawImage(image, request.scrollX, request.scrollY);
					callback(true);
				};
				image.src = dataURI;
			}
		});
	}
});