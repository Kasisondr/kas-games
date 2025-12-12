


	function Game() {
		Sprite.call(this);
		
		this.state = null;
		this.items = [];
		this.miles = [];
		this.upgrs = [];
		this.autos = [];
		this.goals = [];
		this.time = Date.now();	
		this.fram = 0;
		
		this._menu = new Sprite();  this.addChild(this._menu);
		this._scrs = [];  // screens
		this.jumps = [];  // steps into the future
		this._si   = -1;
		
		//setTimeout(function() {  fetch("//www.photopea.com/papi/event.php?id=web_Peasmaker");  },30000);
		
		var lbs = ["hi","um","join the","discord","for more","so yeah",".gg/PJMpT3n8xK"];
		for(var i=0; i<6; i++) {
			var btn = new Button(lbs[i],300);  btn.y = i*100;  //btn.SetSize(300,80);
			this._menu.addChild(btn);
			var dot = btn._dot = new Sprite();
			dot.graphics.beginFill(0xffdd00);  dot.graphics.drawRect(0,0,15,15);  btn.addChild(dot);  dot.x=10;  dot.y=38;  dot.visible=false;
			btn.addEventListener2(MouseEvent.CLICK, this.setScreen,this);
			var scr = new Sprite();  this._scrs.push(scr);
		}
		
		var f0 = new TextFormat("Open Sans", 60, 0xffffff);
		
		
		var top = this._top = new Sprite();  this.addChild(top);
		var lbl = new Text(220,2,60);  lbl.SetValue("Peas:");  top.addChild(lbl);  lbl.x = -250;  lbl.y=33;
		var money = this._money = new Money(3,80);  money.y=16;
		top.addChild(money);
		
		var step = this._step = new Button("+1",200);  this.addChild(step);
		step.addEventListener2(MouseEvent.CLICK, this.iclick,this);
		this._bi = 0;
		
		var fscr = this._fscr = new Bitmap(new BitmapData("img/fullscreen.png"));  fscr.buttonMode=true;
		fscr.addEventListener(MouseEvent.CLICK, function(){
			if(document.fullscreenElement) document.exitFullscreen();
			else {
				var el = document.body;
				if		(el.requestFullScreen      ) el.requestFullScreen();
				else if	(el.webkitRequestFullScreen) el.webkitRequestFullScreen();
				else if	(el.mozRequestFullScreen   ) el.mozRequestFullScreen();	
			}			
		});
		this.addChild(fscr);
		
		f0.size = 30;
		this._hstr="";
		var help = this._help = new TextField();  this._menu.addChild(help);  help.width = 300;  help.height=200;  help.y = 600;
		help.setTextFormat(f0);
		
		var scr = this._scrs[0];
		for(var i=0; i<Scheme.items.length; i++) {
			var ite = new Game.Item(i);  ite.y = 80+i*125;  this.items.push(ite);
			ite.addEventListener2("clicked",this.iclick, this); 
			scr.addChild(ite);
		}
		
		scr=this._scrs[1];  // Milestones
		for(var i=0; i<11; i++) {
			var y = i*1000/11;
			var ico = Game.Item.getIcon(i);  ico.y=y;
			ico.scaleX = ico.scaleY = 0.75*(1000/11)/200;  scr.addChild(ico);
			var lbl = new Text(130,0,40);  lbl.SetValue("Level:");  lbl.scaleX=lbl.scaleY=0.5; 
			scr.addChild(lbl);  lbl.y=y+10;  lbl.x=77;
			var lb2 = new Text(130,0,40);  lb2.SetValue("Speed:");  lb2.scaleX=lb2.scaleY=0.5; 
			scr.addChild(lb2);  lb2.y=y+41;  lb2.x=lbl.x;
			var ms = [];  this.miles.push(ms);
			for(var j=0; j<10; j++) {
				var btn = new Button("Hey",120);  btn.y=y;  btn.x=146+j*95;  btn.SetSize(150,150*10/11);  btn.scaleX=btn.scaleY=0.5;
				scr.addChild(btn);  ms.push(btn);
			}
		}
		
		scr=this._scrs[2];
		
		for(var i=0; i<10; i++) {  // Automate
			var btn = new Button("Automate",700);  btn.y = i*180;  btn.SetSize(700,150);
			scr.addChild(btn);  this.autos.push(btn);
			btn.addEventListener2(MouseEvent.MOUSE_UP, this.iclick, this);
			var ico =btn.icon = Game.Item.getIcon(i);  ico.scaleX=ico.scaleY=0.5;  ico.x=ico.y=25;  btn.addChild(ico);  btn._t.x+=45;
		}
		
		
		scr=this._scrs[3];  // Upgrade
		
		for(var i=0; i<15; i++) {
			var btn = new Button("Upgrade",700);  btn.y = i*180;  btn.SetSize(700,150);
			scr.addChild(btn);  this.upgrs.push(btn);
			btn.addEventListener2(MouseEvent.MOUSE_UP, this.iclick, this);
			var ico =btn.icon = Game.Item.getIcon(0);  ico.scaleX=ico.scaleY=0.5;  ico.x=ico.y=25;  btn.addChild(ico);  btn._t.x+=45;
		}
		
		scr=this._scrs[4];  // Goals
		var gls = ["Make 1000 peas","Make 1,000,000 peas", "Unlock all tools", "Have 100 wands", "Have 1,000,000 wands","Buy all upgrades"];
		
		for(var i=0; i<gls.length; i++) {
			var btn = new Button(gls[i],700);  btn.x=150;  btn.y = 100+i*110;
			this.goals.push(btn);
			scr.addChild(btn);
		}
		
		
		scr=this._scrs[5];
		
		var wand = new Bitmap(new BitmapData("img/tools/mwand.png"));  wand.scaleX = wand.scaleY = 2;  wand.x = 300;
		var at = this._atext = new Text(900,1,50);  at.x = 50;  at.y = 370;
		at._tf.wordWrap=true;  at._tf.height=at._tf.textHeight = 500;
		at.SetValue("Magic wand");  scr.addChild(at);
		scr.addChild(wand);
		
		var asc = new Button("Ascend",500);  asc.x = 250;  asc.y=800;
		asc.addEventListener2(MouseEvent.MOUSE_UP, function() {  
			var wcnt = Game.PrintM(Math.floor(this.state.GetWands()),null,true);
			if(window.confirm("Are you sure? You will lose all your progress, but you will get "+wcnt+" Magic Wands.")) {  
				alert("+"+wcnt+" Magic Wands!",2);  this.state.Ascend();  SND.play("levelup");  
			}  
		}, this);
		scr.addChild(asc);
		var rst = new Button("Restart",250);  rst.x=0;  rst.y=900;  rst.scaleX=rst.scaleY=0.7;
		rst.addEventListener2(MouseEvent.MOUSE_UP, function() {  
			var wcnt = Game.PrintM(Math.floor(this.state.GetWands()),null,true);
			if(window.confirm("Start over with 0 peas and 0 wands. Are you sure?")) {  
				this.state = new State();  this.setScreen(0);
				//alert("+"+wcnt+" Magic Wands!",2);  this.state.Ascend();  SND.play("levelup");  
			}  
		}, this);
		scr.addChild(rst);
		
		this._alert = new Sprite();  this._alert.mouseEnabled=false;
		var gr = this._alert.graphics;  gr.beginFill(0);  gr.drawRect(0,0,600,80);
		this.addChild(this._alert);
		this._atxt = new Text(600,1,28);  var tf=this._atxt._tf;  tf.wordWrap=true;  tf.height=tf.textHeight=80;  tf.y=20;  this._alert.addChild(this._atxt);
		this._atxt.SetValue("Hello Hello hey this is Ivan speaking. How do you like my game? There is a game for everyone.");
		
		
		this._alend = Date.now();
		window.alert = (function(str,t) {
			if(t==null) t=1.4;
			this.removeChild(this._alert);  this.addChild(this._alert);  this._atxt.SetValue(str);  
			this._alend = Date.now()+t*1000;
		}).bind(this);		
		
		this._jumps = new Sprite();  //this.addChild(this._jumps);
		for(var i=0; i<3; i++) {
			var tim = [1,10,60][i];
			var btn = new Button("+"+tim+" mi", 170);  this.jumps.push(btn);  btn._ct = tim;
			this._jumps.addChild(btn);  btn.x = i*180;
			btn.addEventListener2(MouseEvent.MOUSE_UP, this.iclick, this);
		}  //*/
		
		this._sound = new Bitmap(new BitmapData("img/snd.png"));  this._sound.buttonMode=true;  this._sound.visible = false;
		this._sound.addEventListener(MouseEvent.CLICK, function(e) {  SND.mute();  e.target.alpha=SND.muted?0.3:1;  });
		this.addChild(this._sound);
		
		this.setScreen(0);
		
		var st = localStorage.getItem("psmScore");  //console.log(st);
		
		//st = "[[[321,0,0,512,9],[111,0,0,64,9],[111,0,0,64,9],[111,0,0,64,9],[111,0,0,64,9],[111,0,0,64,9],[111,0,3,64,9],[111,0,9,64,9],[59,0,218,16,9],[109,0,0,32,9]],[0,1,2,3,4,5,6,7,8,10,9],[12037117038912,117116112132638,0],40839,0]";
		//st = "[[[300,1,0.004187499998736455,128,3],[111,1,0.0020000000004524177,16,3],[100,1,0.20200999999904368,8,3],[55,1,0.2260099999968901,4,3],[50,1,3.683999999995537,4,3],[43,1,21.823009999999673,2,3],[22,1,130.3139999999868,2,3],[20,1,416.0640099996641,2,1],[1,0,2214.8140099991842,1,1],[0,0,0,1,1]],[0,1,2,3,4,5,6],[584408290.9011302,16970093151,0],17664.06799998485,0]";
		//st = "[[[405,0,0,1152,484],[111,0,0,72,44],[111,0,0,72,44],[111,0,0,72,44],[112,0,0,72,44],[114,0,0,72,112],[105,0,2,72,28],[100,0,12,72,16],[99,0,124,36,16],[100,0,0,72,16]],[0,1,2,3,4,5,8,6,7,11,9,10,12],[16168125159418,113538526245196,0],7022,0]";
		
		
		//st = "[[[1,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1]],[],[0,677852251202652700000,677852251202652700000],0,246992]";
		//st="[[[1,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1],[0,0,0,1,1]],[],[0,1.6817669013299632e+72,1.6817669013299632e+72],0,1.2302805416639601e+31,1724160429884]";
		
		//st="[[[4000,1,0,648518346341351400,1167717041015625],[1322,1,0,4831838208,65392154296875010000],[1416,1,0,9663676416,233543408203124970000],[1552,1,0,19327352832,1.4713234716796874e+22],[1752,1,0,77309411328,5.838585205078126e+25],[1931,1,0,309237645312,1.60489808068608e+27],[2231,1,0,2473901162496,2.3110532361879544e+31],[2500,1,0,19791209299968,2.2876792454961e+32],[3240,1,0,2533274790395904,6.863037736488299e+32],[3600,1,0,40532396646334460,2541865828329]],[0,1,3,6,2,4,10,12,5,7,8,17,9,11,16,14,21,23,13,18,26,20,15,19,25,22,24,29,28,32,30,35,31,39,41,27,33,43,36,34,46,40,47,38,45,37,44,52,55,57,42,60,48,54,50,49,53,59,51,58,70,63,66,61,68,75,77,56,74,82,69,64,67,62,73,65,72,84,88,71,96,87,81,78,80,76,79,86,101,85,92,91,89,102,106,108,83,100,95,115,90,113,103,116,94,121,120,99,93,114,98,97,128,129,107,112,133,127,105,137,111,104,109,126,110,141,144,146,119,125,140,118,122,124,117,139,155,123,151,130,142,147,156,160,159,132,138,154,169,131,134,165,143,157,170,136,168,153,135,172,174,145,152,180,183,148,167,182,185,150,166,181,149,158],[2.0071911019005254e+104,6.170511873758878e+105,1.398903293316644e+105],1556,3.548257267990837e+47,1724241880896]";
		
		this.state = st ? State.fromString(st,true) : new State();
		
		console.log(this.state.toString());
		
		
		this._music=null;
		this.addEventListener2(MouseEvent.MOUSE_DOWN, function(e) {
			if(this._music) return;
			this._music = true;  SND.play("melody",true,0.5);
			this._sound.visible=true;
		},this);
		
		this.addEventListener2(Event.ENTER_FRAME, this.onEF,this);
		
		
		setInterval(function() {  alert("* Tools produce when the game is closed.",3)  }, 3*60000);
		setInterval((function() {
			var min=1e9, ms=Scheme.milestones, its=this.state.items;
			for(var j=0; j<its.length; j++) min=Math.min(min,its[j][0]);
			var mi=0;  while(ms[mi][2]<=min) mi++;  var mil = ms[mi];  console.log(min, mil);
			alert("Have "+mil[2]+" of each tool to produce "+mil[1]+"x faster.",3);
		}).bind(this), 3*71000);
	}
	Game.prototype = new Sprite();
	
	Game.prototype.uiresize = function(w,h) {
		this.w=w;  this.h=h;
		this.graphics.clear();
		this.graphics.beginFill(0x474747);
		this.graphics.drawRect(0,0,w,h);
		var its = this.items, top=this._top, menu=this._menu;
		var ox, oy, gap;
		if(w>h) {
			ox = w/5; oy=h/8; gap=Math.min(w,h)*0.03;
			var iw = (w-ox)/2, ih=(h-oy)/5;
			for(var i=0; i<its.length; i++) {
				var it = its[i];
				it.x = Math.floor(i/5)*iw;
				it.y = (i%5)*ih;
				it.uiresize(iw-gap*2, ih-gap);
			}
		}
		else {
			ox=w*0.28; oy=h/10, gap=Math.min(w,h)*0.02;
			var iw=(w-ox), ih = (h-oy)/10;
			
			for(var i=0; i<its.length; i++) {
				var it=its[i];
				it.x = 0;
				it.y = i*ih;
				it.uiresize(iw-gap, ih-gap);
			}
		}
		menu.scaleX = menu.scaleY = ox/380;
		menu.x = w*0.02;  menu.y=oy;
		
		var scr =this._scrs[this._si];
		scr.x=ox;  scr.y=oy;
		
		var us = Math.min(2, Math.min(w-ox,h-oy)/900);
		var upg = this._scrs[2];  upg.x = ox+(w-ox-720*us)/2;
		upg.scaleX=upg.scaleY=us;
		var aut = this._scrs[3];  aut.x = ox+(w-ox-720*us)/2;
		aut.scaleX=aut.scaleY=us;
		
		var mls = this._scrs[1];
		mls.scaleX = mls.scaleY = (h-oy)/1000;
		
		var gls = this._scrs[4];
		gls.scaleX = gls.scaleY = Math.min((w-ox),(h-oy))/1000;
		gls.x = ox+(w-ox-1000*gls.scaleX)/2;
		gls.y = oy+(h-oy-1000*gls.scaleX)/2;
		
		var asc = this._scrs[5];
		asc.scaleX = asc.scaleY = Math.min((w-ox),(h-oy))/1000;
		asc.x = ox+(w-ox-1000*asc.scaleX)/2;
		asc.y = oy+(h-oy-1000*asc.scaleX)/2;
		
		var tsc = top.scaleX = top.scaleY = Math.min(oy / 140, w/1000);
		top.x=ox;  top.y=oy*0.2;
		
		
		var step = this._step, fscr=this._fscr;
		var ssc = Math.min(w,h)/1300;
		step.scaleX=step.scaleY=ssc;
		step.y =20*ssc;
		step.x = w-330*ssc;
		
		fscr.scaleX=fscr.scaleY=ssc*0.69;
		fscr.y = step.y;
		fscr.x = w - 110*ssc;
		
		var al = this._alert;
		al.scaleX = al.scaleY = Math.min(w,h)/800;
		al.x = (w-600*al.scaleX)/2;  al.y = h*1.1;
		
		this._jumps.x = w/100;
		this._jumps.scaleX = this._jumps.scaleY = Math.min(w,h)/1400;
		
		var snd = this._sound;
		var sx = snd.scaleX=snd.scaleY = Math.min(w,h)/700;
		snd.x=snd.y=16*sx;
		//this._jumps.
	}
	
	Game.prototype.setScreen = function(e) {
		var si = (typeof e=="number") ? e : this._menu.getChildIndex(e.currentTarget);
		if(this._si!=-1) this.removeChild(this._scrs[this._si]);
		this._si=si;
		scr = this._scrs[this._si];
		this.addChild(scr);
		this.uiresize(this.w,this.h);
	}
	
	Game.prototype.iclick = function(e) {
		var tgt=e.currentTarget, i = this.items.indexOf(tgt),si=this.jumps.indexOf(tgt),ai=this.autos.indexOf(tgt), ct=tgt._ct, st=this.state;
		if(i!=-1) {
			if(ct==0) st.Make(i);
			if(ct==1) {  for(var j=0; j<tgt._count; j++) st.Buy (i, true);  if(tgt._count!=0) SND.play("pop");  }
		}
		else if(ai!=-1) {  st.Auto(ct,true);  SND.play("coin");  }
		else if(si!=-1) st.Step(ct*60);
		else if(tgt==this._step) {
			var bi = this._bi = (this._bi+1)%5;
			this._step.SetValue(["+1","+10","+100","Next","Max"][bi]);
			//alert(bi);
		}
		else {  // upgrade
			var upg = Scheme.upgrades[ct];
			if(upg[2]<=st.money) {  st.BuyUpgrade(ct,true);  SND.play("coin");  }
		}
	}

	Game.prototype.onEF = function() {
		
		if(Math.random()<0.01) localStorage.setItem("psmScore",this.state.toString());
		
		
		var tdif = Date.now()-this.time;  this.time=Date.now();  this.fram=(this.fram+1)&0xffff;
		var st=this.state;		
		st.Step(tdif/1000);
		//st.Step(1/60);
		
		if(Math.random()<1/(60*30)) {
			var all = true;
			for(var i=0; i<Scheme.upgrades.length; i++) if(!st.GotUpgrade(i)) all=false;
			if(all) window.confirm("Dear Peas Maker! Your peas have filled the whole universe. All particles have been replaced by peas. Enjoy this moment of glory!\nWhen you feel like it, press Ascend and restart the game from zero :)");
		}
		
		if((this.fram&7)==0) {
			this._money.SetValue(st.money);
			var hstr = "Time: "+Game.PrintT(Math.floor(st.time))+"\nPassive income:\n"
				+Game.PrintM(st.GetTotalRate(true))+" / sec";
			if(hstr!=this._hstr) {  this._help.text = hstr;  this._hstr=hstr;  }
		}
		
		var si=this._si;
		
		var auto = st.items[0][1]==1 || st.money>2000;
		var umenu = [
			st.items[0][0]>10 || auto,
			st.items[0][0]>20,
			auto,
			st.money>40000 || st.upgrs.length!=0,
			st.items[0][0]>10 || auto,
			st.GetWands()>1
		];
		for(var i=0; i<umenu.length; i++) this._menu.getChildAt(i).visible=umenu[i] || st.wands!=0;
		this._help.visible = (st.items[0][1]==1);
		this._step.visible = st.wands!=0 || st.items[0][0]>=20;
		
		if(st.wands==0) {
			if(this._msg0==null && st.money<5) {  this._msg0=true;  alert("Click the Move Tool to make Peas!",5);  }
			if(this._msg1==null && st.items[1][0]==0 && st.money>=5) {  this._msg1=true;  alert("Buy another tool to make 2x more Peas!",3);  }
		}
		
		
		if(si==0) {
			for(var i=0; i<Scheme.items.length; i++) {
				var it = this.items[i];
				it.visible = (i==0 || st.wands!=0 || (i==1 && st.items[0][0]>4) || (st.items[1][0]>1));
				it.Update(st, this._bi);	
			}
		}
		else if(si==1) {
			for(var i=0; i<11; i++) {
				var ms = this.miles[i], cnt, mls;
				if(i<10) {
					mls = Scheme.items[i].milestones;  
					cnt = st.items[i][0];
				}
				else {
					mls=Scheme.milestones;  cnt=1e9;
					for(var j=0; j<10; j++) cnt=Math.min(cnt,st.items[j][0]);
				}
					
				var mi=0;  while(mi<mls.length && mls[mi][2]<=cnt) mi++;
				for(var j=0; j<ms.length; j++) {
					var btn = ms[j],ml=mls[mi+j];
					btn.visible = ml!=null;
					if(ml) btn.SetValue(ml[2]+"\nx"+ml[1]);
				}
			}
		}
		else if(si==4) {
			var arr = [
				st.money>=1000,
				st.money>=1e6,
				st.items[st.items.length-1][0]>0,
				st.wands>=100,
				st.wands>=1e6,
				st.upgrs.length>=Scheme.upgrades.length
			];
			//console.log(st.upgrs, Scheme.upgrades);
			for(var i=0; i<this.goals.length; i++) {
				this.goals[i]._green.visible = arr[i];
			}
		}
		else if(si==5) {
			var wnd = Math.floor(st.GetWands());
			this._atext.SetValue("Each Magic Wand increases the revenue by 1%.\n\nYou have "+Game.PrintM(st.wands,null,true)+" wands.\nAscend to restart the game with "+Game.PrintM(wnd,null,true)+" more wands!");
		}
		var ui, got;
		
		
		ui = 0;  got=false;
		for(var i=0; i<10; i++) {
			var btn = this.autos[i];
			while(ui<10 && st.items[ui][1]==1) ui++;
			var it = st.items[ui];  btn.visible=it!=null;  if(it==null) continue;
			var sit = Scheme.items[ui];
			btn.alpha= (st.money<sit.acost ? 0.2 : 1);  if(st.money>=sit.acost) got=true;
			btn.SetValue("Automate "+sit.name+" Tool\n"+Game.PrintM(sit.acost));
			btn._ct = ui;
			btn.icon.icon.bitmapData = Game.Item.icons[ui];
			ui++;
		}
		this._menu.getChildAt(2)._dot.visible=got;
		
		ui = 0;  got=false;
		for(var i=0; i<this.upgrs.length; i++) {
			var btn = this.upgrs[i];
			
			while(st.GotUpgrade(ui)) ui++;
			
			var uit = Scheme.upgrades[ui];  btn.visible=uit!=null;  if(uit==null) continue;
			var name = uit[0]==-1? "All" : Scheme.items[uit[0]].name+" Tool";
			btn.SetValue(name+" x"+uit[1]+"\n"+Game.PrintM(uit[2]));
			btn.alpha = (st.money<uit[2] ? 0.2 : 1);  if(st.money>=uit[2]) got=true;
			btn.icon.icon.bitmapData = Game.Item.icons[uit[0]==-1?10:uit[0]];
			btn._ct = ui;
			ui++;
		}
		this._menu.getChildAt(3)._dot.visible=got;
		
		this._menu.getChildAt(5)._dot.visible=(st.GetWands()>100 && st.GetWands()>st.wands*1.1);
		
		var al = this._alert, ay = Date.now()>this._alend ? this.h*1.1 : this.h-al.height;
		al.y = al.y*0.7+ay*0.3;
	}

	Game._numarr = ["m","b","tr","quadr","quint","sext","sept","oct","non"/*,
		"dec","undec","duodec","tredec","quattuordec","quindec","sexdec","septendec","octodec","novemdec",
		"vigint","unvigint","duovigint","trevigint","quattuorvigint","quinvigint","sexvigint","septenvigint","octovigint","novemvigint",
		"trigint"*/];
		
	for(var i=0; i<6; i++)
		for(var j=0; j<10; j++) Game._numarr.push(
			["","un","duo","tre","quattuor","quin","sex","septen","octo","novem"][j] + 
			["dec","vigint","trigint","quadragint","quinquagint","sexagint"][i]
		);
		
	Game.PrintM = function(m,asArr,asInt) {
		var val, cur;
		
		var fd = asInt ? 0 : 2;
		if(m<1e6) {  val = m.toLocaleString(undefined, { minimumFractionDigits: fd, maximumFractionDigits: fd });  cur="";  }
		else {
			var l=0, m=m/1e6;
			while(m>=1000) {  m/=1e3;  l++;  }
			val = m.toFixed(3);  cur = Game._numarr[l]+"illion";
		}
		
		return asArr ? [val,cur] : val+(cur==""?"":" "+cur);
	}
	Game.PrintT = function(sec) {
		//if(sec<1) return sec+"s";
		var out = "";
		var h=Math.floor(sec/3600);  sec-=h*3600;  out+=(h<10?"0":"")+h+":";
		var m=Math.floor(sec/  60);  sec-=m*  60;  out+=(m<10?"0":"")+m+":";
		return out+(sec<10?"0":"")+Math.floor(sec);
	}
	
