$(document).ready(function () {
	$('#menu-icon').on('click', function () {
		$('.navbar').toggleClass('expand');
		return false;
	});
});

$("#tags").keydown(function (e) {
	if (e.which == 13) {
		searchTags();
		event.preventDefault();
	}
});

var map = new L.map('map');

// Bounds
var southWest = L.latLng(25.7027, -100.2803),
	northEast = L.latLng(25.7385, -100.3314),
	bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
//'http://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'

L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a> | Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
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

var fime = 'images/FIME.png',
	FIMEbounds = [[25.72573, -100.31418], [25.725264767960276, -100.31327378454574]],
	fod = 'images/FOD.png',
	fodbounds = [[25.72764, -100.31283], [25.72733, -100.31236]],
	ftsydh = 'images/FTSYDH.png',
	ftsydhbounds = [[25.72793, -100.31038], [25.72770, -100.30979]]
	facpya = 'images/FACPYA.png',
		facpyabounds = [[25.72827, -100.30973], [25.72786, -100.30874]]
	facdyc = 'images/FACDYC.png',
		facdycbounds = [[25.72650, -100.31105], [25.72616, -100.31009]]
	farq = 'images/FARQ.png',
	farqbounds = [[25.72551, -100.31237], [25.72510, -100.31135]]
	fcb = 'images/FCB.png',
	fcbbounds = [[25.72473, -100.31681], [25.72424, -100.31616]]
	fcq = 'images/FCQ.png',
		fcqbounds = [[25.72461, -100.31574], [25.72419, -100.31515]]
	fic = 'images/FIC.png',
		ficbounds = [[25.72455, -100.31417], [25.72417, -100.31369]]
	fcfm = 'images/FCFM.png',
	fcfmbounds = [[25.72568, -100.31564], [25.72536, -100.31493]]
	ffly = 'images/FFYL.png',
		fflybounds = [[25.72710, -100.31098], [25.72678, -100.31040]]


L.imageOverlay(fime, FIMEbounds).addTo(map);
L.imageOverlay(fod, fodbounds).addTo(map);
L.imageOverlay(ftsydh, ftsydhbounds).addTo(map);
L.imageOverlay(facpya, facpyabounds).addTo(map);
L.imageOverlay(facdyc, facdycbounds).addTo(map);
L.imageOverlay(farq, farqbounds).addTo(map);
L.imageOverlay(fcb, fcbbounds).addTo(map);
L.imageOverlay(fcq, fcqbounds).addTo(map);
L.imageOverlay(fic, ficbounds).addTo(map);
L.imageOverlay(fcfm, fcfmbounds).addTo(map);
L.imageOverlay(ffly, fflybounds).addTo(map);

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
