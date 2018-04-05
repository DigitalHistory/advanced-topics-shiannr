// initialize the variables we need
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'
var my_map; // this will hold the map
var my_map_options; // this will hold the options we'll use to create the map
var my_center = new google.maps.LatLng(1.352083,103.819836); // center of map
var my_markers = []; // we use this in the main loop below to hold the markers
// this one is strange.  In google maps, there is usually only one
// infowindow object -- its content and position change when you click on a
// marker.  This is counterintuitive, but we need to live with it.
var infowindow = new google.maps.InfoWindow({content: ""});
var legendHTML = "<h1>Legend</h1>";

// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
var blueURL = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
var redURL = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
var orangeURL = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
var purpleURL = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
var greenURL = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
var red_markers = [];
var blue_markers = [];
var orange_markers = [];
var purple_markers = [];
var green_markers = [];

// this is for fun, if you want it.  With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://developers.google.com/maps/documentation/javascript/datalayer#load_geojson
var myGeoJSON= {
  "type":"FeatureCollection",
  "features":
  [{"type":"Feature",
    "properties":{myColor: 'red'},
    "myColor" : "red",
    "geometry":{"type":"Polygon",
                "coordinates":[[[-85.60546875,49.03786794532644],[-96.6796875,40.713955826286046],
                                [-79.62890625,37.71859032558816],[-81.2109375,49.26780455063753],
                                [-85.60546875,49.03786794532644]]]}},
   {"type":"Feature",
    "properties":{myColor: 'green'},
    "myColor" : "green",
     "geometry":{"type":"Polygon",
                 "coordinates":[[[-113.203125,58.35563036280967],[-114.78515624999999,51.944264879028765],
                                 [-101.6015625,51.944264879028765],[-112.32421875,58.263287052486035],
                                 [-113.203125,58.35563036280967]]]
                }}]};


/* a function that will run when the page loads.  It creates the map
 and the initial marker.  If you want to create more markers, do it here. */
function initializeMap() {
    my_map_options = {
        center:  my_center, // to change this value, change my_center above
        zoom: 11.5,  // higher is closer-up
        mapTypeId: google.maps.MapTypeId.HYBRID // you can also use TERRAIN, STREETMAP, SATELLITE
    };

    // this one line creates the actual map
    my_map = new google.maps.Map(document.getElementById("map_canvas"),
                                 my_map_options);
    // this is an *array* that holds all the marker info
    var all_my_markers =
            [{position: new google.maps.LatLng(1.335139,103.918397),
              map: my_map,
              icon: redURL, // this sets the image that represents the marker in the map to the one
                             // located at the URL which is given by the variable blueURL, see above
              title: "Bedok Reservoir MRT",
              window_content: "<h3>Bedok Reservoir</h3><p>Bedok Reservoir is a residential area located to the east of the city centre. The ethnicity of the majority of the population living in Bedok are chinese. They consitute of nearly <a href='https://www.singstat.gov.sg/statistics/browse-by-theme/geographic-distribution'>208,000 </a> out of the 289,000 people residing in Bedok. </p>"
             },
             {position: new google.maps.LatLng(1.356409,103.953290),
              map: my_map,
              icon: orangeURL, // this sets the image that represents the marker in the map
              title: "Tampines East MRT",
              window_content: "<h3>Tampines East</h3><p>Tampines East is nearing the Eastern most point of Singapore. In 2017, the population was nearly 136,000, which included almost 40,000 people above the age of <a href='https://www.citypopulation.de/php/singapore-admin.php?adm2id=20702'>50</a>. By implenting a MRT station here, the older demographic have the opportunity to travel to and from the city for employement in an affordable, more efficient manner.</p>"
            },
            {position: new google.maps.LatLng(1.449720,103.785097),
             map: my_map,
             icon: purpleURL, // this sets the image that represents the marker in the map
             title: "Woodland North MRT",
             window_content: "<h3>Woodland North</h3><p> Woodland North is close to the border of Malaysia and Singapore. Due to its distance from the city centre, building a MRT station here would be extremely beneficial for the residents, who are lower-income workers. This is an image of what the future station will look like. </p> <img src='https://2.bp.blogspot.com/-tY66lX5eGl0/UpkoMSaxDEI/AAAAAAAABRI/QzBh0UUrVys/s1600/TS01+Woodlands+North+03.jpg' <div id='image' style= 'width:120%; height:120%;' </div> </img> "
           },
           {position: new google.maps.LatLng(1.297691,103.886177),
             map: my_map,
             icon: greenURL, // this sets the image that represents the marker in the map to the one
                            // located at the URL which is given by the variable blueURL, see above
             title: "Katong Park MRT",
             window_content: "<h3>Katong Park</h3><p>Katong Park is located away from the city centre, but actually holds caters to middle-income earners due to the value of properties found in that area.</p>"
           },
           {position: new google.maps.LatLng(1.327233,103.946541),
             map: my_map,
             icon: blueURL, // this sets the image that represents the marker in the map to the one
                            // located at the URL which is given by the variable blueURL, see above
             title: "Bedok South MRT",
             window_content: "<h3>Bedok South</h3><p>Bedok South is a residential area with a large demographic of low-income earners. The average population found in this area is <a href='https://www.singstat.gov.sg/statistics/browse-by-theme/geographic-distribution'>51,190 </a> people. Nearly half of the population in Bedok South earns less than <a href='https://www.singstat.gov.sg/statistics/browse-by-theme/geographic-distribution'>$2000</a> on average per month.</p>"
            }
            ];

    for (j = 0; j < all_my_markers.length; j++) {
        var marker =  new google.maps.Marker({
            position: all_my_markers[j].position,
            map: my_map,
            icon: all_my_markers[j].icon,
            title: all_my_markers[j].title,
            window_content: all_my_markers[j].window_content});

        // this next line is ugly, and you should change it to be prettier.
        // be careful not to introduce syntax errors though.
      legendHTML +=
        "<div class=\"pointer\" onclick=\"locateMarker(my_markers[" + j + "])\"> " +
          marker.window_content + "</div>";
        marker.info = new google.maps.InfoWindow({content: marker.window_content});
        var listener = google.maps.event.addListener(marker, 'click', function() {
            // if you want to allow multiple info windows, uncomment the next line
            // and comment out the two lines that follow it
            //this.info.open(this.map, this);
            infowindow.setContent (this.window_content);
            infowindow.open(my_map, this);
        });
        my_markers.push({marker:marker, listener:listener});
        if (all_my_markers[j].icon == blueURL ) {
            blue_markers.push({marker:marker, listener:listener});
        } else if (all_my_markers[j].icon == redURL ) {
            red_markers.push({marker:marker, listener:listener});
        } else if (all_my_markers[j].icon == orangeURL ) {
            orange_markers.push({marker:marker, listener:listener});
        } else if (all_my_markers[j].icon == greenURL ) {
            green_markers.push({marker:marker, listener:listener});
        } else if (all_my_markers[j].icon == purpleURL ) {
            purple_markers.push({marker:marker, listener:listener});
        }

    }
    document.getElementById("map_legend").innerHTML = legendHTML;
  my_map.data.addGeoJson(myGeoJSON);

  var romeCircle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    // in general, we always have to *set the map* when we
    // add features.
    map: my_map,
    bounds: {
      north: 1.449720,
      south: 1.297691,
      east: 103.953290,
      west: 103.785097
    },

    center: {"lat": 1.352083, "lng":103.819836},
    radius: 1000
  });
  my_map.data.setStyle(function (feature) {
    var thisColor = feature.getProperty("myColor");
    return {
      fillColor: thisColor,
      strokeColor: thisColor,
      strokeWeight: 5
    };

});
}

// this hides all markers in the array
// passed to it, by attaching them to
// an empty object (instead of a real map)
function hideMarkers (marker_array) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(null);
    }
}
// by contrast, this attaches all the markers to
// a real map object, so they reappear
function showMarkers (marker_array, map) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(map);
    }
}

//global variable to track state of markers

var markersHidden = false;

function toggleMarkers (marker_array, map) {
  for (var j in marker_array) {
    if (markersHidden) {
      marker_array[j].marker.setMap(map);
    } else {
      marker_array[j].marker.setMap(null);
    }
  }
  markersHidden = !markersHidden;
}


// I added this for fun.  It allows you to trigger the infowindow
// from outside the map.
function locateMarker (marker) {
    console.log(marker);
    my_map.panTo(marker.marker.position);
    google.maps.event.trigger(marker.marker, 'click');
}
