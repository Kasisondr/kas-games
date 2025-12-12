

	var SND = {
		list:[],
		muted:false
	}
	
	SND.map = {
		"melody":"snd/melody.mp3",
		"pop" : "snd/pop.wav",
		"coin": "snd/coin.ogg",
		"levelup": "snd/levelup.ogg"
	}
	
	SND.play = function(id, loop, vol) {
		if(SND.muted && loop!=true) return;
		var au = new Audio(SND.map[id]);
		if(vol!=null) au.volume=vol;
		if(SND.muted) au.volume=0;
		au.loop = loop;  
		au.play();
		if(loop) SND.list.push(au);
	}
	
	SND.mute = function() {
		SND.muted = !SND.muted;
		for(var i=0; i<SND.list.length; i++) SND.list[i].muted = SND.muted;//? 0 : 1;
	}
