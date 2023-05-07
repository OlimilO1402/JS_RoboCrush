//==================   Sound   ==================//
class Sound
{
	/**
	 * creates a sound object
	 * @param {String} path the path to a mp3 or wav file
	 */
	constructor(path)
	{
		this.Audio = new Audio();
		this.Audio.autobuffer = true;
		var ext = path.substring(path.length - 3);
		if (ext === "mp3")
		{
			var mp3OK = this.Audio.canPlayType("audio/mpeg");
			if (mp3OK.match(/maybe|probably/i))
			{
				this.Audio.src = path;	
				this.Audio.type = "audio/mpeg";
			} else {
				alert("device may not play mp3");
			}
		} 
		else (ext === "wav")
		{
			this.Audio.src = path;	
			this.Audio.type = "audio/x-wav";
		}
	}
	/**
	 * plays the sound; stops and starts from beginning if it's during playback 
	 */
	play()
	{
		try { this.Audio.currentTime = 0; } catch(e){};
		this.Audio.play();				
	}	
}
