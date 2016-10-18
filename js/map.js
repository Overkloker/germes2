$(document).ready(function(){
  var mapCenter = function () {



    var icons = {
      icon: '../Drugstore/img/local.png'
    };

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 46.460633, lng: 30.7242313},
      scrollwheel: false,
      zoom: 15,
      disableDefaultUI: true
    });


    function addMarker(feature) {
      var marker = new google.maps.Marker({
        position: feature.position,
        icon: icons.icon,
        map: map
      });
    }

    var features = [
      {
        position: new google.maps.LatLng(46.460633, 30.7242313)
      }, {
        position: new google.maps.LatLng(46.4753988, 30.7181717)
      }
    ];

    for (var i = 0, feature; feature = features[i]; i++) {

      addMarker(feature);
    }

  };

  $(window).load(function () {
    mapCenter();
  });
});