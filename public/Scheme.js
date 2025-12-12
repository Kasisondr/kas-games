


	// 10 min - 27 million, 20 min - 343 million, 30 min - 2.283 billion
	
	var Scheme = {
		items: [
			{
				name  :"Move",  // 0
				icost : 0,  // first upgrade cost
				coeff : 0,  // ratio of growth of the upgrade cost
				itime : 0.000001,  // time per job
				ireve : 999999999999999999999999999999,  // profit per job per unit
				
				icon  : "move",
				acost : 2000 // manager cost
			},
			{
				name  :"Lasso",  // 1
				icost : 0,  
				coeff : 0,
				itime :  0.000001,
				ireve : 999999999999999999999999999999,  // profit is also the cost to unlock the item
				
				icon  : "lasso",
				acost : 20000
			},
			{
				name  :"Crop",  // 2
				icost : 0,
				coeff : 0,
				itime :   0.000001,
				ireve : 999999999999999999999999999999,
				
				icon  : "rcrop",
				acost : 200e3
			},
			{
				name  :"Eraser",  // 3
				icost : 0,
				coeff : 0,
				itime :   0.000001,
				ireve : 999999999999999999999999999999,
				
				icon  : "eraser",
				acost : 5e6
			},
			{
				name  :"Pencil",  // 4
				icost : 0,
				coeff : 0,
				itime :   0.000001,
				ireve : 999999999999999999999999999999,
				
				icon  : "pencil",
				acost : 50e6
			},
			{
				name  :"Brush",
				icost : 0,
				coeff : 0,
				itime :   0.000001,
				ireve : 999999999999999999999999999999,
				
				icon  : "brush",
				acost : 500e6
			},
			{
				name  :"Clone",
				icost : 0,
				coeff : 0,
				itime :  0.000001,
				ireve : 999999999999999999999999999999,
				
				icon  : "clone",
				acost : 10e9
			},
			{
				name  :"Gradient",
				icost : 0,
				coeff : 0,
				itime : 0.000001,
				ireve : 999999999999999999999999999999,
				
				icon  : "gradient",
				acost : 100e9
			},
			{
				name  :"Pen",
				icost : 0,
				coeff : 0,
				itime : 0.000001,
				ireve : 999999999999999999999999999999,
				
				icon  : "pen",
				acost : 1e12
			},
			{
				name  :"Type",
				icost : 0,
				coeff : 0,
				itime : 0.000001,
				ireve : 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999,
				
				icon  : "htype",
				acost : 10e12
			}
		],
		
		upgrades: [],
		milestones: []
	};
	
	Scheme.upgrades = [];
	for(var i=0; i<15; i++) {
		var mul = Math.pow(10,(i)*7+4);
		for(var j=0; j<11; j++) Scheme.upgrades.push([j==10?-1:j, j<5?5:(j<7?4:3), Math.pow(4,(j+1))*mul]);
	}
	Scheme.upgrades.push(
		[3,10,1e8],[3,10,1e10],
		[1,1000,2e13],[1,7,2e15], [1,4,1e16],[1,2,1e19],//[0,2,1e15]
		[2,20000,1e21],[2,10,1e22],
		[3,700,1e24],[3,3,1e26],[3,3,1e28],[3,5,1e30],[3,4,1e33],
		[4,10000,1e36],[4,1000,1e37],[4,10,1e38],[4,10,1e43],[4,10,1e47],
		[5,100000,2e50],[5,5000000,5e50],[5,10,5e58],
		[6,3000000000000,1e63],[6,10,1e67],[6,10,1e71],[6,10,1e76],[6,6,1e80],
		[7,100,1e81],[7,10000000000000000,1e83],[7,10,1e88],
		[8,300000000000000000,1e91],[8,10,1e96],[8,10,1e99],
		[1,100000000000000000000,1e104],[1,10,1e106],[1,10,1e108],
		[2,1000000000000000000000,1e112],[2,10,1e114],[2,10,1e117],[2,10,1e119],
		[3,10000000000000000000000,1e122],[3,10,1e124],[3,10,1e128],[3,10,1e130],[3,10,1e132],
		[4,50000000000000000000000,1e135],[4,10,1e136],[4,10,1e139],[4,10,1e142],[4,10,1e144],
		[9,100000000000000000000000000000000,1e146],[9,10,1e148],[9,10,1e150],[9,10,5e152],
		[0,10000000000000000000000000000000000000,1e154],[0,20,1e155],[0,10,1e157],[0,10,1e159],
		//[5,]//,[0,10000,1e155]
		//[5,4,1e9],//[-1,2,1e15]//,[-1,3,1e20],//,[-1,3,1e23]//,[-1,3,1e27],[-1,2,1e29],
		//[4,10,1e13], [4,2,1e17],[4,2,1e20]//[4,4,1e25],
		//[1,100,1e26],[1,100,1e27],
		//[0,1000,1e30],[0,10,1e35],[0,10,1e41],[0,10,1e44],[0,10,1e47],
		//[3,1000000,1e49],[3,10000,1e50],[3,5,1e53],[3,10,1e55],[3,6,4e56],[3,6,4e58]
		//[4,100,1e29],[4,10,5e30],[4,30,5e31],
		//[5,400,1e32],[5,20,2e34],[5,20,1e38],[5,16,1e41],[5,10,1e43],[5,10,1e45],
		//[6,500000,1e45],[6,500,1e46],[6,12,1e49],[6,10,1e51],[6,5,1e52],
		//[9,100000000,5e52],[9,100,1e54],[9,3,1e56],[9,4,1e57],[9,40,1e59],
		//[1,100000000000000000,1e60],[1,150,1e61],[1,10,1e62],[1,10,1e64],[1,10,1e66],[1,5,1e68],[1,10,1e70],
		//[7,100000000000000000000,1e71],[7,5,1e73],[7,10,1e75],[7,10,1e77],[7,10,1e79],[7,10,1e81],[7,10,1e83]
	);
	Scheme.upgrades.sort(function(a,b){return a[2]-b[2]});
	//console.log(Scheme.upgrades);
	
	
	for(var i=0; i<11; i++) {
		var ms = Scheme.milestones;
		if(i<10) {
			var it = Scheme.items[i];  ms=it.milestones;
			if(ms==null) ms = it.milestones = [];
		}
		var ii=i<10?i:-1
		ms.push([ii,2,20],[ii,3,50]);  if(ii!=-1) ms.push([ii,2,150]);
		for(var j=100; j<5000; j+=100) ms.push([ii,2,j]);
		
		ms.sort(function(a,b){return a[2]-b[2]});
	}
	
	//Scheme.items[2].milestones.push([2,10,60]);
	
	Scheme.powers  = [];
	Scheme.cpowers = [];
	for(var i=0; i<Scheme.items.length; i++) {
		var sit=Scheme.items[i];
		var pow = [];   Scheme.powers.push(pow);
		for(var j=0; j<10000; j++) pow.push(Math.pow(sit.coeff,j));
		
		var cst = [0,1];  Scheme.cpowers.push(cst);
		for(var j=1; j<10000; j++) cst.push(cst[j]+Math.pow(sit.coeff,j));
	}
	

