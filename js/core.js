app.controller('form',function($scope,$http){

$scope.distance = [];
$scope.duration = [];
$scope.test = true;
$scope.routesTable = true;
$scope.routeDetails = true;
$scope.selectedItem = "Travel Mode";


$scope.trick = function() {
  return $scope.test;
};

$scope.OnItemClick = function(event) {
  $scope.selectedItem = event;
}

$scope.calculateRoute = function(from, to) {

        // Center initialized to Naples, Italy
        var myOptions = {
          zoom: 10,
          center: new google.maps.LatLng(40.84, 14.25),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // Draw the map
        var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
        var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
          origin: from,
          destination: to,
          unitSystem: google.maps.UnitSystem.METRIC,
          provideRouteAlternatives: true
        };

        $scope.travelMode = $scope.selectedItem;
        switch($scope.travelMode) {
		    case "Driving":
		        directionsRequest.travelMode = google.maps.DirectionsTravelMode.DRIVING;
		        break;
		    case "Walking":
		        directionsRequest.travelMode = google.maps.DirectionsTravelMode.WALKING;
		        break;
		    case "Bicycling":
		        directionsRequest.travelMode = google.maps.DirectionsTravelMode.BICYCLING;        
		        break;
		    default:
		        directionsRequest.travelMode = google.maps.DirectionsTravelMode.DRIVING;
		}
		var j="a";
        directionsService.route(
          directionsRequest,
          function(response, status){
          	j="b";
          	if (status == google.maps.DirectionsStatus.OK){
            	$scope.routesNbr = (response.routes).length;
            	var routesLoop = [];
            	var originCoordinates = [];
            	var endCoordinates = [];
            	var htmlInstructions = [];
            	var instructionsNbr;
            	var stepsNbr = [];
            	var stepsLoop = [];
            	var currentRouteSteps = [];
            	var reg=new RegExp("<.[^>]*>", "gi" );

				for(var j=0;j<$scope.routesNbr;j++) {
				  routesLoop.push(j);
				}
				$scope.routesLoop = routesLoop;

				// Here we get the details we need from Google Maps API
      	    	for (var i = 0; i < response.routes.length; i++) {
      	      		var route = response.routes[i];
			        for (j = 0; j < route.legs.length; j++) {
			            var leg = route.legs[j];
			            for (k = 0; k < leg.steps.length; k++) {	            	
			                var step = leg.steps[k];
			                var distance = step.distance.text;
			                var duration = step.duration.text;
			                var instruction = step.instructions;
			                while( (instruction.search(reg)>-1)|| (instruction.search(reg)>-1) ){
				                instruction = instruction.replace(reg," ");
				                instruction = instruction.replace(reg," ");
				            }
			                currentRouteSteps[k] = [instruction,distance,duration];
			            }
			            endCoordinates[i] = ((((((response.routes[i]).legs))[0]).steps)[$scope.routesNbr - 1]).end_location;			
			        }   
		       		htmlInstructions[i] = currentRouteSteps ;
		            stepsNbr[i] = (htmlInstructions[i]).length;
		            var stepsNbrLoop = [];
		         	for(var z=0;z<stepsNbr[i];z++) {
					  stepsNbrLoop[z] = z;
					}				 
					stepsLoop[i] = stepsNbrLoop;
					$scope.distance[i] = (((((response.routes[i]).legs))[0]).distance).text;
      			    $scope.duration[i] = (((((response.routes[i]).legs))[0]).duration).text; 	  
      	  			originCoordinates[i] = ((((((response.routes[i]).legs))[0]).steps)[0]).start_location;
			    }

			    // Here we make the variables we need accessible from AngularJS
			    $scope.stepsLoop = stepsLoop;
			    $scope.htmlInstructions = htmlInstructions;
                $scope.stepsNbr = stepsNbr;
                $scope.originCoordinates = originCoordinates;
                $scope.endCoordinates = endCoordinates;
                $scope.htmlInstructions = htmlInstructions;
                $scope.instructionsNbr = instructionsNbr;
	  
	            new google.maps.DirectionsRenderer({
                  map: mapObject,
                  directions: response
                });
            }
            else
              $("#error").append("Unable to retrieve your route<br />");
          }
        );
      }

// Here we submit the form
$scope.send1 = function() { 
	$scope.test = false;	
	document.getElementById('startPoint').style.border = "0px solid #f00";
	document.getElementById('endPoint').style.border = "px solid #f00";
    // If the browser supports the Geolocation API
    if (typeof navigator.geolocation == "undefined") {
          $("#error").text("Your browser doesn't support the Geolocation API");
          return;
    }
    $scope.calculateRoute($("#startPoint").val(), $("#endPoint").val());
}

$scope.send2 = function() { 	
	document.getElementById('startPoint').style.border = "0px solid #f00";
	document.getElementById('endPoint').style.border = "px solid #f00";
    // If the browser supports the Geolocation API
    if (typeof navigator.geolocation == "undefined") {
      $("#error").text("Your browser doesn't support the Geolocation API");
      return;
    }
    $scope.calculateRoute($("#startPoint").val(), $("#endPoint").val());
	if($scope.startPoint && $scope.endPoint){
		
	$scope.submit = true; 
	$scope.routesTable = false;	
	$scope.$apply();		
	}else{
		if(!$scope.startPoint){
			document.getElementById('startPoint').style.border = "1px solid #f00";
		}
		if(!$scope.endPoint){
			document.getElementById('endPoint').style.border = "1px solid #f00";
		}
	}	
	  
}

//Here we define which View to Display
$scope.details = function(x) { 	
	$scope.routesTable = true;  
	$scope.routeDetails = false; 
	$scope.routeFetchedDetails = x;
}

$scope.goBackToRoutesTable = function() { 	
	$scope.routesTable = false;  
	$scope.routeDetails = true; 
	$scope.submit = true;  
}

$scope.goBackToHome = function() { 	
	$scope.routesTable = true;  
	$scope.routeDetails = true; 
	$scope.submit = false;  
}

});

