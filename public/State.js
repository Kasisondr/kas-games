



	function State(money) {
		this.tmoney = 0;
		this.stmoney = 0;  // starting money <= tmoney
		this.wands = 0;
		this.Ascend();
		if(money!=null) this.money=money;
	}
	
	State.prototype.Ascend = function() {
		this.wands += Math.floor(this.GetWands());
		
		this.stmoney = this.tmoney;  
		this.money = 0; 
		this.time  = 0;
		
		this.seq   = [];  // sequence of buying steps
		this.items = [];
		this.upgrs = [];
		this.umap  = {};
		for(var i=0; i<Scheme.items.length; i++) this.items.push(
			// number, manager, time left to finish,    x time, x revenue : redundant (can be computed from Number, upgrs)
			[0,0,0, 1,1]  
		);
		this.items[0][0] = 1;
		
		//this.money=this.tmoney = 1e6;  for(var i=0; i<100; i++) this.Buy(0);
	}
	
	State.prototype.toString = function() {
		var FL = Math.floor;
		
		var its = JSON.parse(JSON.stringify(this.items));
		for(var i=0; i<its.length; i++) its[i][2]=FL(its[i][2]);
		
		var obj = [its,this.upgrs,[FL(this.money),FL(this.tmoney),FL(this.stmoney)],FL(this.time),this.wands,Date.now()];
		return JSON.stringify(obj);
	}
	State.fromString = function(str, loud) {
		var o=JSON.parse(str), m=o[2];
		var st = new State();
		st.items=o[0];  st.upgrs=o[1];  st.money=m[0];  st.tmoney=m[1];  st.stmoney=m[2];  st.time=o[3];  st.wands=o[4];
		for(var i=0; i<st.upgrs.length; i++) st.umap[st.upgrs[i]]=true;
		if(o[5]!=null) {
			var om = st.money;
			st.Step((Date.now()-o[5])/1000);
			if(loud && st.money>om) alert("You made "+Game.PrintM(st.money-om)+" while away!",5);
		}
		return st;
	}


	State.prototype.Step = function(sec) {
		var its = this.items;
		
		var add = 0;
		
		for(var i=0; i<its.length; i++) {
			var it = its[i];  if(it[0]==0) continue;  // no items
			
			var prf = this.GetProfit(i), tim = this.GetTime(i);
			if(it[1]) {  // automated
				var cur = it[2];
				var reps = Math.floor((cur+sec)/tim);  
				add += reps*prf;
				it[2] = ((cur+sec)%tim);
			}  
			else if(it[2]>tim) {  add += prf;  it[2]=0;  }
			else if(it[2]!=0 ) it[2]+=sec;
		}
		this.money  += add;
		this.tmoney += add;
		this.time   += sec;
	}
	
	
	State.prototype.Make = function(i) {
		var it = this.items[i];
		if(it[0]>0 && it[2]==0) it[2]=0.00001; // make
	}
	State.prototype.Buy = function(i, loud) {
		var its=this.items, it = its[i], sit = Scheme.items[i];
		var cost = this.GetUpCost(i,1);  if(this.money<cost) throw "e";
		var ncnt = it[0] = it[0]+1;
		
		var unl = State._findUnlocks(sit.milestones, ncnt,ncnt);
		if(unl) {
			for(var j=unl[0]; j<=unl[1]; j++) {
				var un = sit.milestones[j], ii=un[0];
				its[ii][  ii==i?3 : 4  ] *= un[1];
				if(loud) {
					if(ii==i) alert(sit.name+" Tool is "+un[1]+"x faster");
					else      alert(Scheme.items[ii].name+" Tool makes "+un[1]+"x more peas");
				}
			}
		}
		
		var unl = State._findUnlocks(Scheme.milestones, ncnt,ncnt);
		if(unl) {
			var min=1e9, un=Scheme.milestones[unl[0]];
			for(var j=0; j<its.length; j++) min=Math.min(min,its[j][0]);
			if(min==ncnt) {
				for(var j=0; j<its.length; j++) its[j][3]*=un[1];
				if(loud) setTimeout(function() {alert("All tools "+un[1]+"x faster");}, 7);
			}
		}
		
		this.money-=cost;  
		this.seq.push(i);
	}
	State.prototype.BuyUpgrade = function(i,loud) {
		if(this.GotUpgrade(i)) return;
		var upg = Scheme.upgrades[i], ii=upg[0];
		if(ii==-1) for(var j=0; j<this.items.length; j++)  this.items[j][4] *= upg[1];
		else this.items[ii][4] *= upg[1];
		if(loud) alert(ii==-1 ? "All items make "+upg[1]+"x more!" : Scheme.items[ii].name+" Tool makes "+upg[1]+"x more!");
		this.money -= upg[2];
		this.upgrs.push(i);  this.umap[i]=true;
		this.seq.push(-1-i);
	}
	State.prototype.GotUpgrade = function(i) {  return this.umap[i];  /*this.upgrs.indexOf(i)!=-1;*/  }
	State.prototype.Auto = function(i,loud) {
		var it = this.items[i], sit = Scheme.items[i];
		if(it[1]==1 || this.money<sit.acost) return;
		it[1]=1;  this.money-=sit.acost;
		if(loud) alert(sit.name+" Tool automated!");
	}
	
	State.prototype.GetWands = function() {
		//Lifetime earnings/(400 Billion/9)^0.5
		return 2*(Math.sqrt(this.tmoney / (400e9/9)) - Math.sqrt(this.stmoney / (400e9/9)));
	}
	
	State._findUnlocks = function(ms,i0,i1) {
		
		//var mul0 = 1;   for(var j=0; j<ms.length; j++) if(i0<=ms[j][2] && ms[j][2]<=i1) mul0*=ms[j][1];  return mul0;
		
		var N=ms.length, j0=0, j1=N-1;
		
		//if(i1<ms[0][2] || ms[j1][2]<i0) return 1;
		
		
		while(j0+12< N && ms[j0+12][2]<=i0) j0+=12;	
		while(0<=j1-12 && i1<=ms[j1-12][2]) j1-=12;		
		while(j0+4< N && ms[j0+4][2]<=i0) j0+=4;
		while(0<=j1-4 && i1<=ms[j1-4][2]) j1-=4;
		
		while(j0< N && ms[j0][2]<i0) j0+=1;
		while(j1>=0 && ms[j1][2]>i1) j1-=1;
		
		return j0<=j1 ? [j0,j1] : null;
		//for(var j=j0; j<=j1; j++) mul*=ms[j][1];  return mul;
	}

	State.prototype.GetProfit = function(i, diff) {
		var it  = this.items[i], sit = Scheme.items[i], cnt=it[0], mul = sit.ireve * it[4] * (1+this.wands/100);
		
		//*
		if(diff!=null) {
			var unl = State._findUnlocks(sit.milestones, it[0]+1,it[0]+diff);
			if(unl) {
				for(var j=unl[0]; j<=unl[1]; j++) {
					var un = sit.milestones[j], ii=un[0];
					mul *= un[1];
				}
			}
		
			cnt += diff;
		}
		//*/
		
		return mul * cnt;
	}
	State.prototype.GetTime  = function(i) {
		var it  = this.items[i], sit = Scheme.items[i];
		return sit.itime / it[3];
	}
	State.prototype.GetRate = function(i, diff) {  
		return this.GetProfit(i,diff)/this.GetTime(i);  
	}
	State.prototype.GetRateDiff = function(i) {
		return (this.GetRate(i,1)-this.GetRate(i))/this.GetUpCost(i,1);
	}
	State.prototype.GetTotalRate = function(passive) {
		var rat=0;
		for(var i=0; i<this.items.length; i++) if(!passive || this.items[i][1]==1) rat+=this.GetRate(i);
		return rat;
	}
	State.prototype.GetRates = function() {
		var rts = [], sum=0, its=this.items;
		for(var i=0; i<its.length; i++) {  var r=this.GetRate(i);  sum+=r;  rts.push(r);  }
		for(var i=0; i<its.length; i++) rts[i]/=sum;
		return rts;
	}

	State.prototype.GetUpCost = function(i,diff) {
		var it  = this.items[i], sit=Scheme.items[i], ps=Scheme.cpowers[i], cnt=it[0];
		return sit.icost * (ps[cnt+diff]-ps[cnt]);  //ps[it[0]];
	}
	
	State.prototype.bestIndex = function(money) {
		var st = this;
		
		var ind=null, rv=0;
		for(var i=0; i<st.items.length; i++) {
			var it = st.items[i],sit=Scheme.items[i], ms=sit.milestones, rate=st.GetRate(i);
			
			var unl = State._findUnlocks(ms, it[0]+1,it[0]+100), ui=unl?unl[0]:0, mul=sit.ireve*it[4]*(1+this.wands/100)/st.GetTime(i), cnt=it[0];
			
			for(var diff=1; diff<100; diff++) {
				var upc = st.GetUpCost(i,diff);
				if(money>=upc) {
					if(unl && ui<=unl[1] && ms[ui][2]==cnt+diff) {  if(ms[ui][0]==i) mul*=ms[ui][1];  ui++;  }
					var crat = mul*(cnt+diff);
					
					var rd = (crat-rate)/upc;
					if(rd>rv) {  rv=rd;  ind=[0,i];  }
				}
				else break;
			}
		}
		var ugs = Scheme.upgrades;
		for(var i=0; i<ugs.length; i++) {
			if(st.GotUpgrade(i)) continue;
			var upg = ugs[i];
			if(money>=upg[2]) {
				var rate;
				if(upg[0]==-1) rate = st.GetTotalRate();
				else           rate = st.GetRate(upg[0]);
				var rd = rate * (upg[1]-1)/upg[2];
				if(rd>rv)  {  rv=rd;  ind=[1,i];  }
			}
			else break;
		}
		return ind;
	}


	
	State.emulateSeq = function(seq, st, lim) {
		for(var i=0; i<st.items.length; i++) st.items[i][1]=1;
		var si=0, ind=-1,cost=0,rate=0;
		while(si<seq.length) {
			if(ind==-1) {
				ind = seq[si];
				if(ind<0) cost = Scheme.upgrades[-ind-1][2];
				else      cost = st.GetUpCost(ind,1);
				rate = st.GetTotalRate();
			}
			
			var step = (cost-st.money)/rate;
			if(step>0) st.Step(step+0.0001);
			
			if(st.money>=cost) {
				if(ind<0) st.BuyUpgrade(-ind-1);
				else st.Buy(ind);
				si++;  ind=-1;
			}
			
		}
	}
	State.seqCost = function(seq,lim) {
		var time = Date.now();
		//for(var i=0; i<200; i++) {
			var st = new State();
			State.emulateSeq (seq,st,lim);
			st.Step(lim-st.time);
		//}
		console.log(Date.now()-time);
		return st.tmoney;
	}
