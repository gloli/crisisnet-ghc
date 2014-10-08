var initMap = function() {

  //var template = 'http://c.tiles.mapbox.com/v3/examples.map-szwdot65/{Z}/{X}/{Y}.png';
  //var provider = new MM.TemplatedLayer("http://t0.tiles.virtualearth.net/tiles/h{Q}?g=854&mkt=en-US&token=Anz84uRE1RULeLwuJ0qKu5amcu5rugRXy1vKc27wUaKVyIv1SVZrUjqaOfXJJoI0");
  //var provider = new MM.TemplatedLayer("http://t0.tiles.virtualearth.net/tiles/a{Q}?g=854&mkt=en-US&token=Anz84uRE1RULeLwuJ0qKu5amcu5rugRXy1vKc27wUaKVyIv1SVZrUjqaOfXJJoI0");
  var provider = new MM.TemplatedLayer("http://ecn.t0.tiles.virtualearth.net/tiles/r{Q}?g=689&mkt=en-us&lbl=l1&stl=h");

  //var provider = new MM.TemplatedLayer(template);
  var map = new MM.Map('map', provider);
  map.setZoom(10).setCenter({ lat: 22.25, lon: 114.1667 }); //hong kong 
  
  var canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.width = map.dimensions.x;
  canvas.height = map.dimensions.y;
  map.parent.appendChild(canvas);

  var data = [];
  
  loadData();  

  function redraw() {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    if( data.length == 0 )
    	return;
    for (var i = 0; i < data.length; i++) {
      if( data[i].draw ) { 
	      p = map.locationPoint(data[i].loc);
	      var radius = 5;
	
	      ctx.beginPath();
	      ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI, false);
	      ctx.fillStyle = '#C190F2';
	      ctx.fill();
	      ctx.lineWidth = 1;
	      ctx.strokeStyle = 'black';
	      ctx.stroke();
      }

    }
    ctx.stroke();
  }
  
  function loadData(){
  	  //load locations
  	  
  	  loadTabDelim( function(d) {//callback function
			lines = d;
			console.log("back ", lines.length);
			
			for(i = 0; i < lines.length-1; i++){	//loop through all but first and last
				console.log(lines[i]);
				dataPt = lineToDataPoint(lines[i]); 
				data.push( dataPt ); 
				
			}
			
			redraw(); 
	   });
  	  
	  // var loc1 = new com.modestmaps.Location(22.417961, 114.142284);
	  // var loc2 = new com.modestmaps.Location(22.429069, 114.068470);
	  // var loc3 = new com.modestmaps.Location(22.407805, 114.051304);
	  // var loc4 = new com.modestmaps.Location(22.407951, 114.142384);
// 	    
	  // data.push( { loc: loc1, date: new Date(), url: "http:", hashTags: "#" , draw: true } );
	  // data.push( { loc: loc2, date: new Date(), url: "http:", hashTags: "#" , draw: true } );
	  // data.push( { loc: loc3, date: new Date(), url: "http:", hashTags: "#" , draw: true } );
	  // data.push( { loc: loc4, date: new Date(), url: "http:", hashTags: "#" , draw: true } );

  }
  
  function lineToDataPoint(line){
  		console.log(line);
  		var tokens = line.split("\t");
    	//make sure right number of tokens
		// if( tokens.length != 4 ){//should never happen
			// console.log("BAD LINE: ", line, " ", tokens.length);
			// return; 
		// }
		 
		//parse file
		var lat = parseFloat(tokens[1]);
		console.log(lat);
		var lon = parseFloat(tokens[0]);
		var loc = new com.modestmaps.Location(lat, lon);
		
		var date = tokens[2]; //new Date( parseInt(tokens[2]), parseInt(tokens[3])-1, parseInt(tokens[4]) ); 
		var url = tokens[3];
		var hashTags = "#"; 
		var draw = true;
		
		return { loc: loc, date: date, url: "http:", hashTags: "#" , draw: true };
  }
  
  function loadTabDelim(callback){
		console.log("loading data...");
		var txtFile = new XMLHttpRequest();
		var lines;
		var allText;
		txtFile.open("GET", "hkcrisisdata.csv", true);//file://localhost/Users/jauri/Development/OpenSourceDay/crisisnet-ghc/map/
		txtFile.onreadystatechange = function() {
		 	if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
		    	if (txtFile.status === 200) {  // Makes sure it's found the file.
		    		console.log("found file");
		      		allText = txtFile.responseText; 
		      		lines = txtFile.responseText.split("\n"); // Will separate each line into an array
		      		callback(lines);
		    	}
		    	else{
		    		console.log("not 200");
		    	}
		 	}
		 	else{
		 		console.log("not 4");
		 	}
	 	}
	 	console.log("fail");
		txtFile.send(null);//only reaches here if it fails... 
   }
  
  function filterHashtag(hashtag){
  	 for (var i = 1; i < data.length; i++) {
  	 	
  	 
  	 }
  }

  map.addCallback('drawn', redraw);
  map.addCallback('resized', function() {
    canvas.width = map.dimensions.x;
    canvas.height = map.dimensions.y;
    redraw();
  });

  redraw();
}
