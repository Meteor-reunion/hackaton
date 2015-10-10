var GoogleMap = function (element) {
  var self = this;

  self.element = element;
  self.markers = {};
  self.latLngs = {}
  self.selectedMarkerId = null;
  self.infowindow = new google.maps.InfoWindow({ content: "" });
  google.maps.event.addListener(self.infowindow, "closeclick", function () {
    if (self.selectedMarkerId) {
      self.selectedMarkerId.set(null);
    }
  });

  var MY_MAPTYPE_ID = 'custom_style';
  var MY_MAPTYPE_DARK_ID = 'custom_style_dark';
  var lat = 0, lng = 0;
  var mapOptions = {
  	zoom:17,
    center: new google.maps.LatLng(lat, lng),
    mapTypeControlOptions: {
    mapTypeIds: [google.maps.MapTypeId.ROADMAP,MY_MAPTYPE_DARK_ID,MY_MAPTYPE_ID]
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };


  var featureOptsdark = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
];

  var featureOpts = [
    {
      stylers: [
        { hue: '#56a8a8' },
        { visibility: 'simplified' },
        { gamma: 0.5 },
        { weight: 0.5 }
      ]
    },
    {
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        { color: '#56a8a8' }
      ]
    }
  ];
  self.gmap = new google.maps.Map(element, mapOptions);

    var styledMapOptions = {
    name: 'zen'
  };

    var styledMapOptionsdark = {
    name: 'sombre'
  };
  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
  var customMapTypedark = new google.maps.StyledMapType(featureOptsdark, styledMapOptionsdark);

  self.gmap.mapTypes.set(MY_MAPTYPE_ID, customMapType);
  self.gmap.mapTypes.set(MY_MAPTYPE_DARK_ID, customMapTypedark);


};


// accepts reactive function that returns {lat: Number, lng: Number}
GoogleMap.prototype.setCenter = function (centerFunc) {
  var self = this;

  if (self.centerComputation) {
    self.centerComputation.stop();
  }

  self.centerComputation = Deps.autorun(function () {
    //var center = centerFunc();
    var center = centerFunc;



    if (self.selectedMarkerId && self.selectedMarkerId.get()) {
      // marker is currently selected, don't update the center until it's closed
      var markerId = self.selectedMarkerId.get();
      if (self.markers[markerId]) {
        var marker = self.markers[markerId];
        self.gmap.setCenter(marker.getPosition());
        //self.gmap.setZoom(17);
      }
      return;
    }

    if (center) {
      //var latLng = new google.maps.LatLng(center.lat, center.lng);
      var latLng = new google.maps.LatLng(center.latitude, center.longitude);
      self.gmap.setCenter(latLng);
    }
  });
};

// accepts minimongo cursor
// documents must have field marker: {lat: Number, lng: Number, infoWindowContent: String}
GoogleMap.prototype.setMarkers = function (cursor) {
  var self = this;

  if (self.liveQuery) {
    self.liveQuery.stop();
  }

  self.liveQuery = cursor.observe({
    added: function (doc) {
    	//var pos = new google.maps.LatLng(parseFloat(doc.loc.coordinates[1]), parseFloat(doc.loc.coordinates[0]));
           var countOffre = Offres.find({restoId:doc._id,'status':'active'}).count();
      if(countOffre>0){
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(doc.loc.coordinates[1]), parseFloat(doc.loc.coordinates[0])),
        map: self.gmap,
        icon: new google.maps.MarkerImage(iconpin, null, null, null,
      new google.maps.Size(24, 24))
      });

      self.markers[doc._id] = marker;
      //self.markerCluster.addMarker(self.markers[doc._id]);
      //self.latLngs[doc._id]=pos;

        self.markers[doc._id].infoWindowContent = '<a href="'+Router.path("restoDetail",{_id:doc._id})+'">'+countOffre+' offres</a>';

        google.maps.event.addListener(self.markers[doc._id], "click", function () {
          self.selectMarker(doc._id);
        });

      if (self.selectedMarkerId && self.selectedMarkerId.get() === doc._id) {
        self.syncWithSelectedMarkerId(doc._id);
      }
    }
    },
    removed: function (doc) {
      //self.markerCluster.removeMarker(self.markers[doc._id]);
                 //var countOffre = Offres.find({restoId:doc._id,'status':'active'}).count();
      //if(countOffre<1){
      self.markers[doc._id].setMap(null);
      delete self.markers[doc._id];
    },
    changed: function (doc) {
      self.markers[doc._id].setPosition(
        new google.maps.LatLng(parseFloat(doc.loc.coordinates[1]), parseFloat(doc.loc.coordinates[0])));
        self.markers[doc._id].infoWindowContent = 'Offres';
 }
  });
};


GoogleMap.prototype.showCurrLocationMarker = function () {
  var self = this;

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(0, 0),
    map: self.gmap,
    icon: new google.maps.MarkerImage(icon, null, null, null,
      new google.maps.Size(20, 20))
  });

   var circle = new google.maps.Circle();


  Deps.autorun(function () {
    var latLng=Session.get('geo');
    if (latLng) {

   var pos = new google.maps.LatLng(latLng.latitude, latLng.longitude)

   //circle
   //circle.setRadius(Session.get('radius'));
   //circle.setCenter(pos);
   //circle.setMap(self.gmap);

      marker.setMap(self.gmap);
      marker.setPosition(pos);
    }
  });
};

// accepts reactive var
GoogleMap.prototype.bindToSelectedMarkerId = function (selectedMarkerId) {
  var self = this;

  self.selectedMarkerId = selectedMarkerId;

  if (self.selectedMarkerIdComputation) {
    self.selectedMarkerIdComputation.stop();
  }

  self.selectedMarkerIdComputation = Deps.autorun(function () {
    var markerId = self.selectedMarkerId.get();

    if (markerId) {
      self.syncWithSelectedMarkerId(markerId);
    }
  });
};

GoogleMap.prototype.selectMarker = function (markerId) {
  var self = this;

  if (self.selectedMarkerId) {
    self.selectedMarkerId.set(markerId);
  }
};

GoogleMap.prototype.syncWithSelectedMarkerId = function (markerId) {
  var self = this;

  var marker = self.markers[markerId];
  if (marker) {
    self.infowindow.setContent(marker.infoWindowContent);
    self.infowindow.open(self.gmap, marker);
  }
};

GoogleMap.prototype.markerCluster= function () {
	  var self = this;
  var mcOptions = {maxZoom: 16};
  self.markerCluster = new MarkerClusterer(self.gmap, self.markers,mcOptions);

};

GoogleMap.prototype.fitBounds= function () {
	  var self = this;
  self.gmap.fitBounds(self.bounds);
};

GoogleMap.prototype.calcBounds=function() {
		  var self = this;
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = self.latLngs.length; i < latLngLength; i++) {
            bounds.extend(self.latLngs[i]);
        }
        self.gmap.fitBounds(bounds);
        //self.gmap.setZoom(self.gmap.getZoom());
        //self.gmap.setCenter(bounds.getCenter());
};

Template.googleMap.rendered = function () {
  var template = this;

  var map = new GoogleMap(template.firstNode);
  var options = template.data;
  //map.calcBounds();
  //if (options.center) {
  //  map.setCenter(options.center);
  //} else if (options.geolocate) {
    map.showCurrLocationMarker();
    map.setCenter(Session.get('geo'));
  //}

  if (options.selectedMarkerId) {
    map.bindToSelectedMarkerId(options.selectedMarkerId);
  }

if(options.markers){
  map.setMarkers(options.markers);
	}
if(options.markersuser){
  map.setMarkersUser(options.markersuser);
	}
  //map.markerCluster();
  //map.fitBounds();


};
