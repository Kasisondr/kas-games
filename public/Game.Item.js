
	Game.Item = function(i) {
		Sprite.call(this);
		
		this._i = i;
		this._ct = 0;
		this._count = 1;
		var sit = Scheme.items[i];		
		
		
		
		var make = this._make = Game.Item.getIcon(i);   this.addChild(make);  make.buttonMode=true;
		
		
		var gr = make._green = new Sprite();  make.addChild(gr);
		gr.graphics.lineStyle(10,0x00ff00);  gr.graphics.drawRoundRect(0,0,200,200,40,40);  
		
		var ye = make._yello = new Sprite();  make.addChild(ye);
		ye.graphics.lineStyle(10,0xffff00);  ye.graphics.drawRoundRect(0,0,200,200,40,40);  
		
		//make.x=make.y=10;
		make.scaleX = make.scaleY = 170/200;
	
		var ox = 200;
		
		var lbl = this._lbl = new Text(500,0,60);  lbl.SetValue(sit.name+" Tool");  this.addChild(lbl);  lbl.x=ox;  lbl.y=20
		
		var bar = this._bar = new Bar(300,40);  this.addChild(bar);  bar.x = ox;
		var cbar = this._cbar = new Bar(130,44);  this.addChild(cbar);  cbar.y = 200-44;
		
		var prf = this._prf = new Money(1);  this.addChild(prf); prf.x=ox+12;  prf.y=bar.y; 
		var prc = this._prc = new Text(150,2,35);  this.addChild(prc);   prc.SetValue("100%");
		//var lbl = this._lbl = this.getText(200);   lbl.x=make.x;  lbl.y=65;   this._lbl.text = sit.name;
		var cnt = this._cnt = new Text(130,1,36); this.addChild(cnt); cnt.y=157;  cnt.x=cbar.x=(170-130)/2;
		
		var buy = this._buy = new Button("",500);  buy.x = ox;  buy.y=110;  this.addChild(buy);
		
		var btxt = this._btxt = new Text(100,0,35);  buy.addChild(btxt);   btxt.SetValue("Buy");  btxt.x=16;  btxt.y=2;
		var bcnt = this._bcnt = new Text(140,0,42);  buy.addChild(bcnt);   bcnt.SetValue("+1");  bcnt.x=16;  bcnt.y=42;
		
		var rgt = this._rgt = new Sprite();  rgt.y = 110;  this.addChild(rgt);
		var tim = this._tim = new Text(230,2);  rgt.addChild(tim);  tim.x=-230;  tim.y=10; 
		var cst = this._cst = new Money(2);  rgt.addChild(cst);  cst.x=-230-300+30;
		
		
		this._make.addEventListener2(MouseEvent.MOUSE_UP, this.click, this);
		this._buy .addEventListener2(MouseEvent.MOUSE_UP, this.click, this);
		
		//this._help = new Text(300);  this.addChild(this._help);  this._help.x = 200;  this._help.y = 180;
	}
	Game.Item.prototype = new Sprite();
	
	Game.Item.getIcon = function(i) {
		var make = new Sprite();   
		make.graphics.beginFill(0xffffff,0.2);  make.graphics.drawRoundRect(0,0,200,200,40,40);
		if(i==10) {  var t=new Text(200,1,90);  t.y=50;  t.SetValue("All");  make.addChild(t);  return make;  }
		if(Game.Item.icons==null) {
			var sits = Scheme.items; Game.Item.icons = [];
			for(var j=0; j<sits.length; j++) {
				Game.Item.icons.push(new BitmapData("img/tools/"+sits[j].icon+".png"));
			}
			Game.Item.icons.push(new BitmapData("img/tools/cshape.png"));  // star
		}
		var icon = make.icon = new Bitmap(Game.Item.icons[i]);  
		icon.transform.colorTransform = [	// invert colors
                  -1, 0, 0, 0, 0,
				   0,-1, 0, 0, 0,
                   0, 0,-1, 0, 0,
                   0, 0, 0, 1, 0,
                   1, 1, 1, 0, 1
             ]	
		make.addChild(icon);
		icon.x=icon.y=20;
		return make;
	}
	
	Game.Item.prototype.uiresize = function(w,h) {
		var scl = h/200, lw=w/scl;
		//this.graphics.clear();  this.graphics.beginFill(0xffffff,0.1);  this.graphics.drawRect(0,0,lw,200);
		
		
		var bar = this._bar, ox=bar.x;
		this.scaleX = this.scaleY = scl;
		bar.SetSize(lw-ox,90);
		//this._tim.x = lw-230;
		this._prf.x = bar.x + (lw-ox-300)/2;
		this._prc.x = lw-157;
		
		var rscl = Math.min(1,(lw-ox-100)/440);
		this._buy.SetSize(lw-ox-230*rscl,90);
		this._rgt.x = lw;
		this._rgt.scaleX = this._rgt.scaleY = rscl;
		this._lbl.scaleX = this._lbl.scaleY = rscl;
	}
	
	Game.Item.prototype.click = function(e) {
		this._ct = [this._make, this._buy].indexOf(e.currentTarget);
		this.dispatchEvent(new Event("clicked"));
	}
	
	Game.Item.prototype.Update = function(st, bi) {
		var i = this._i, sit = Scheme.items[i], it=st.items[i], ms=sit.milestones;
		
		var av = it[0]!=0;
		
		//this._make.SetValue(it[1]==1 ? "âœ”" : "Make");
		
		var mi = 0;  while(mi<ms.length && ms[mi][2]<=it[0]) mi++;
		var v0 = mi==0?0:ms[mi-1][2], v1=(mi==ms.length)?it[0]:ms[mi][2];
		this._cnt.SetValue(it[0]); 
		this._cbar.SetValue((it[0]-v0)/(v1-v0));
		
		var prf = this._prf, tim=this._tim, bar=this._bar;
		
		this._cbar.visible = bar.visible = prf.visible = tim.visible = this._make.visible = this._cnt.visible = av;
		this._make._green.visible = it[1]==1;
		this._make._yello.visible = (it[1]!=1 && it[2]==0);
		
		var ti = st.GetTime(i), fast=ti<0.1;
		tim.SetValue( Game.PrintT(ti<1?ti:Math.ceil(ti-it[2])) );
		
		if(av)      prf.SetValue(st.GetProfit(i), fast?ti:null);   
		else        prf.SetValue(sit.ireve*it[4]*(1+st.angels/100));
		
		bar.SetValue(av ? it[2]/st.GetTime(i) : 0, fast);
		
		//this._help.SetValue(st.GetRateDiff(i).toFixed(3));
		
		var cnt;
		if(bi==0) cnt=1;
		if(bi==1) cnt=10;
		if(bi==2) cnt=100;
		if(bi==3) {
			cnt = mi==ms.length ? 1 : v1-it[0];
		}
		if(bi==4) {
			var cnt=1;
			while(st.money>=st.GetUpCost(i,cnt+1)) cnt++;
		}
		var cst = st.GetUpCost(i,cnt);
		this._count=cst<=st.money ? cnt : 0;
		
		this._buy._green.visible = cst<=st.money;
		//this._buy.stroke.visible=false;
		this._cst.alpha = this._btxt.alpha = this._bcnt.alpha = (cst<=st.money ? 1 : 0.2);
		//this._buy.alpha = this._cst.alpha = (cst<=st.money ? 1 : 0.2);
		this._cst.SetValue(cst);
		this._bcnt.SetValue("+"+cnt);
		
		var all = true;
		for(var j=0; j<st.items.length; j++)  if(st.items[j][0]==0) all=false; 
		
		this._prc.visible=all;
		if(all) this._prc.SetValue(Math.round(100*st.GetRate(i)/st.GetTotalRate())+"%");
		
	}
	
	function Bar(w,h) {
		Sprite.call(this);
		
		this.graphics.beginFill(0);
		this.graphics.drawRect(0,0,1,1);
		
		var b=this.bar=new Sprite();  this.addChild(b);
		b.graphics.beginFill(0x3482f6);
		b.graphics.drawRect (0,0,1,1);
		this.SetSize(w,h);
	}
	Bar.prototype = new Sprite();
	
	Bar.prototype.SetValue = function(sx, fast) {
		var b = this.bar;
		if(fast) {  var s = Math.sin(Date.now()*0.01);  b.scaleX=1;  b.scaleY=0.95+0.05*s;  b.y = 0.025-0.025*s;  }
		else     {  b.scaleX=Math.max(0.000001,sx);  b.scaleY=1;  b.y=0;  }
	}
	
	Bar.prototype.SetSize = function(w,h) {
		this.scaleX=w;  this.scaleY=h;
	}
	
	function Money(al,sz) {
		Sprite.call(this);
		
		this._v=-100;
		if(sz==null) sz=50;
		var al0=al, al1=al;
		if(al==3) {  al0=1;  al1=0;  }
		
		this._val = new Text(sz*5.2,al0,sz);  this.addChild(this._val);
		this._cur = new Text(sz*7,al1,sz*0.63);  this.addChild(this._cur);
		if(al==3) {  this._cur.x = sz*5.2;  this._cur.y=sz*0.37;  }
		else      {  this._cur.y=50;  if(al!=0) this._cur.x = sz * (al==1 ? (5.2-7)*0.5 : (5.2-7) );  }
	}
	Money.prototype=new Sprite();
	
	Money.prototype.SetValue = function(n, ti) {
		if(ti!=null) n/=ti;
		if(n==this._v) return;  this._v=n;
		var v = Game.PrintM(n,true);
		this._val.SetValue(v[0]);
		this._cur.SetValue(v[1]+(ti==null ? "" : " / sec"));
	}

	function Text(w, align,sz,clr) {
		Sprite.call(this);
		
		this._val = "";
		if(align==null) align=0;
		if(sz==null) sz=52;
		if(clr==null) clr=0xffffff;
		var f0 = new TextFormat("Open Sans", sz, clr);
		f0.bold = true;
		f0.align=[TextFormatAlign.LEFT, TextFormatAlign.CENTER, TextFormatAlign.RIGHT][align];
		
		var tf = this._tf = new TextField();  this.addChild(tf);
		tf.setTextFormat(f0);
		tf.width=tf.textWidth=w;  tf.height=tf.textHeight=sz*1.2;
		tf.mouseEnabled=false;
	}
	Text.prototype=new Sprite();
	
	Text.prototype.SetValue = function(s) {
		if(s==this._val) return;  this._val=s;
		this._tf.text = s;
	}

	function Button(name, size)	// extends Sprite
	{
		Sprite.call(this);
		this.buttonMode = true;
		this.mouseChildren = false;
		
		
		var t = this._t = new TextField();  t.y=10;
		t.selectable = false;
		Button.tFormat.size = 48;
		t.setTextFormat(Button.tFormat);
		
		
		var bw = t.width + 2*t.x, bh = t.height+2*t.y;
		
		this._green = new Sprite();  this.addChild(this._green);  this._green.visible=false;
		this.stroke = new Sprite();  this.addChild(this.stroke);  this.stroke.alpha=0;
		
		this.addChild(t);
		
		this.SetSize(size,80);
		
		this.SetValue(name);
		
		this.addEventListener2(MouseEvent.MOUSE_OVER, function(e) {Tweener.addTween(this.stroke,{alpha:1, time:0.2, transition:"easeInOutSine"});}, this);
		this.addEventListener2(MouseEvent.MOUSE_OUT , function(e) {Tweener.addTween(this.stroke,{alpha:0, time:0.2, transition:"easeInOutSine"});}, this);
	}
	Button.prototype = new Sprite();
	
	Button.prototype.SetSize = function(w,h) {
		this.graphics.clear();
		this.graphics.beginFill(0x252525);
		var rad = Math.min(w,h)*0.3;
		this.graphics.drawRoundRect(0, 0, w,h,rad,rad);
		
		var gr = this.stroke.graphics;
		gr.clear();  gr.lineStyle(8, 0xff00ff);
		gr.drawRoundRect(0, 0, w,h,rad,rad);
		
		gr = this._green.graphics;
		gr.clear();  gr.beginFill(0x00ff00,0.44);
		gr.drawRoundRect(0, 0, w,h,rad,rad);
		
		var t = this._t;
		t.width = w;  t.height=t.textHeight=h;  //t.width=t.textWidth=w;
	}
	
	Button.prototype.SetValue = function(val) {  if(val==this._val) return;  this._val=val;  this._t.text = val;  }

	//	static variable
	Button.tFormat    = new TextFormat("Open Sans", 25, 0xffffff);
	Button.tFormat.align = TextFormatAlign.CENTER;
	//Button.tFormat.bold=true;
