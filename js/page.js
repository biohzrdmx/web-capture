function max(nums) {
	return Math.max.apply(Math, nums.filter(function(x) { return x; }));
}

if ( typeof window.hasWebCapture === 'undefined' ) {

	chrome.extension.onRequest.addListener(function onMessage(request, sender, callback) {
		if (request.msg == 'scroll') {
			var body = document.body,
				widths = [
					document.documentElement.clientWidth,
					document.body.scrollWidth,
					document.documentElement.scrollWidth,
					document.body.offsetWidth,
					document.documentElement.offsetWidth
				],
				heights = [
					document.documentElement.clientHeight,
					document.body.scrollHeight,
					document.documentElement.scrollHeight,
					document.body.offsetHeight,
					document.documentElement.offsetHeight
				],
				fullWidth = max(widths),
				fullHeight = max(heights),
				windowWidth = window.innerWidth,
				windowHeight = window.innerHeight,
				steps = Math.ceil(fullHeight / windowHeight)
				step = 0;
			// Scroll, capture, repeat
			var capture = function() {
				window.scrollTo(0, step * windowHeight);
				window.setTimeout(function() {
					var data = {
						msg: 'capture',
						scrollX: window.scrollX,
						scrollY: window.scrollY,
						fullWidth: fullWidth,
						fullHeight: fullHeight
					};
					chrome.extension.sendRequest(data, function(captured) {
						step++;
						if (step < steps) {
							capture();
						} else {
							callback(true);
						}
					});
				}, 500);
			}
			capture();
		}
	});

	window.hasWebCapture = true;

}
