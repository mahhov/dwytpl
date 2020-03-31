class VideoContainer {
	get videos() {
		return this.videos_ || $tream();
	}
}

module.exports = VideoContainer;
