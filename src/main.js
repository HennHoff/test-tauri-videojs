const { getClient, ResponseType } = window.__TAURI__.http;
const { appDataDir, join } = window.__TAURI__.path;
const { convertFileSrc } = window.__TAURI__.tauri;

async function getVideos() {
	let client = await getClient();
	let response = await client.get('https://pipedapi.adminforge.de/trending?region=US', {
		timeout: 30,
		responseType: ResponseType.JSON
	});
	let videoId = response.data[0].url.split("=");

	response = await client.get('https://pipedapi.adminforge.de/streams/' + videoId[1], {
		timeout: 30,
		responseType: ResponseType.JSON
	});

	console.log(response);

	let video = document.createElement('video-js');
	video.className = 'video-js';
	video.id = 'my-video';
	video.setAttribute('controls', true);
	video.setAttribute('preload', 'auto');
	//video.setAttribute('data-setup', '{}');

	let source = document.createElement('source');
	//source.src = response.data.videoStreams[1].url;
	//source.type = response.data.videoStreams[1].mimeType;
	//source.src = response.data.audioStreams[1].url;
	//source.type = response.data.audioStreams[1].mimeType;
	source.src = response.data.hls;
	source.type = 'application/x-mpegURL';
	video.appendChild(source);

	let title = document.createElement('p');
	title.innerText = JSON.stringify(response.data.title);

	let main = document.querySelector('#main');
	main.innerHTML = "";
	main.appendChild(title)
	main.appendChild(video);

	videojs.log.level('all');
	videojs(video);
}

window.addEventListener("DOMContentLoaded", () => {
	getVideos();
})
