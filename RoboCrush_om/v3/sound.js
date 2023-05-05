function Sound(path)
{
	this.Audio = new Audio();
	this.Audio.autobuffer = true;
	var ext = path.substring(path.length - 3);
	if (ext == "mp3")
	{
		var mp3OK = this.Audio.canPlayType('audio/mpeg;');
		if (mp3OK.match(/maybe|probably/i))
		{
			this.Audio.src = path;	
			this.Audio.type = "audio/mpeg";
		} else 
			alert("device may not play mp3");
	} 
	else (ext == "wav")
	{
		this.Audio.src = path;	
		this.Audio.type = "audio/x-wav";
	}
}
Sound.prototype.play = function()
{
	try { this.Audio.currentTime = 0; } catch(e){};
	this.Audio.play();				
}