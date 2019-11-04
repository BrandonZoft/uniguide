$(document).ready(function () {
	$('#menu-icon').on('click', function () {
		$('.navbar').toggleClass('expand');
		return false;
	});
});

var map = new L.map('map');

// Bounds
var southWest = L.latLng(25.7501, -100.3434),
	northEast = L.latLng(25.6768, -100.2548),
	bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
//'http://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'

L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a> <a href="https://leafletjs.com/">Leaflet</a> | © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	maxBounds: bounds,
	maxZoom: 19, //not working
	minZoom: 16
}).addTo(map);

map.setView(new L.LatLng(25.72650, -100.31180), 16);

// 'control' previously called 'routingControl'
var control = L.Routing.control({
	// geocoder: L.Control.Geocoder.nominatim(),
	createMarker: function () { 
		return null; 
	},
	routeWhileDragging: false,
	addWaypoints: false,
	draggableWaypoints: false,
	router: L.Routing.graphHopper('3513fe12-dd36-42ad-8090-54069cfb7bb1', {
		urlParameters: {
			vehicle: 'foot'
		},
	})
}).addTo(map);

control.hide();
// map.removeControl(control)

var router = control.getRouter();
router.on('response',function(e){
  console.log('This request consumed ' + e.credits + ' credit(s)');
  console.log('You have ' + e.remaining + ' left');
});

////

function button(label, container) {
	var btn = L.DomUtil.create('button', '', container);
	btn.setAttribute('type', 'button');
	btn.innerHTML = label;
	return btn;
}

var startBtn;
var startmarker = new L.marker([25.72375857, -100.31251645], { draggable: 'false' });
var endmarker = new L.marker([25.72864538, -100.31225252], { draggable: 'false' });
map.on('click', function (e) {
	var container = L.DomUtil.create('div'),
		startBtn = button('Empezar desde aqui', container);
	L.DomEvent.on(startBtn, 'click', function () {
		control.spliceWaypoints(0, 1, e.latlng);
		map.removeLayer(startmarker);
		startmarker = new L.marker(e.latlng, { draggable: 'false', icon: L.AwesomeMarkers.icon({ icon: 'street-view', prefix: 'fa', markerColor: 'darkpurple' }) });
		startmarker
		startmarker.on('dragend', function (event) {
			startmarker = event.target;
			var position = startmarker.getLatLng();
			control.spliceWaypoints(0, 1, position);
		});
		map.addLayer(startmarker);
		map.closePopup();
	});
	L.popup().setContent(container).setLatLng(e.latlng).openOn(map);
});

L.Routing.errorControl(control).addTo(map);  

L.easyButton('fa-crosshairs fa-lg', function (btn, map) {
	var home = {
		lat: 25.72650,
		lng: -100.31180,
		zoom: 16
	}; 
	map.setView([home.lat, home.lng], home.zoom);
}).addTo(map);

var comp = new L.Control.Compass({ autoActive: true});
map.addControl(comp);

// var data_points = {
// 	"type": "FeatureCollection",
// 	"name": "test-points-short-named",
// 	"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
// 	"features": [
// 		{ "type": "Feature", "properties": { "name": "FIME" }, "geometry": { "type": "Point", "coordinates": [-100.31340, 25.72506] } },
// 		{ "type": "Feature", "properties": { "name": "FIC" }, "geometry": { "type": "Point", "coordinates": [-100.31381, 25.72439] } },
// 		{ "type": "Feature", "properties": { "name": "FCQ" }, "geometry": { "type": "Point", "coordinates": [-100.31546, 25.72439] } },
// 		{ "type": "Feature", "properties": { "name": "FCB" }, "geometry": { "type": "Point", "coordinates": [-100.31638, 25.72439] } },
// 		{ "type": "Feature", "properties": { "name": "FCFM" }, "geometry": { "type": "Point", "coordinates": [-100.31518, 25.72539] } },
// 		{ "type": "Feature", "properties": { "name": "FOD" }, "geometry": { "type": "Point", "coordinates": [-100.31249, 25.72742] } },
// 		{ "type": "Feature", "properties": { "name": "FACPYA" }, "geometry": { "type": "Point", "coordinates": [-100.30910, 25.72811] } }
// 	]
// };

// var pointLayer = L.geoJSON(null, {
// 	pointToLayer: function (feature, latlng) {
// 		label = String(feature.properties.name) // .bindTooltip can't use straight 'feature.properties.attribute'
// 		return new L.CircleMarker(latlng, {
// 			radius: 0.01,
// 		}).bindTooltip(label, { permanent: true, direction: "center", className: "my-labels" }).openTooltip();
// 	}
// });
// pointLayer.addData(data_points);
// map.addLayer(pointLayer);
