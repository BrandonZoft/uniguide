// Get the <datalist> and <input> elements.
var facultyList = document.getElementById('faculty-list');
var facultyInput = document.getElementById('faculty-choice');
let classList = document.getElementById('class-list');
var classInput = document.getElementById('class-choice');

// Create a new XMLHttpRequest.
var request = new XMLHttpRequest();
var category_list = []
var popupMarkerArray = new L.FeatureGroup();

// Handle state changes for the request.
request.onreadystatechange = function (response) {
    if (request.readyState === 4) {
        if (request.status === 200) {
            // Parse the JSON
            window.jsonOptions = JSON.parse(request.responseText);

            // Loop over the JSON array.
            for (i in window.jsonOptions.Universidad.Facultades) {
                // Create a new <option> element.
                var option = document.createElement('option');
                // Set the value using the item in the JSON array.
                option.value = window.jsonOptions.Universidad.Facultades[i].nombre;
                // Add the <option> element to the <datalist>.
                facultyList.appendChild(option);
            };



            for (i in window.jsonOptions.Universidad.Facultades) {
                for (k in window.jsonOptions.Universidad.Facultades[i].marcador) {
                    var category = window.jsonOptions.Universidad.Facultades[i].marcador[k].categoria
                    // console.log(jsonOptions.Universidad.Facultades[i].marcador[k].categoria)
                    if (category_list.includes(category) == false) {
                        category_list.push(category)
                    }
                }
            }

            for (i in category_list) {
                // Create a new <option> element.
                var option = document.createElement('option');
                // Set the value using the item in the JSON array.
                option.value = category_list[i]
                // Add the <option> element to the <datalist>.
                classList.appendChild(option);
            }

            // Update the placeholder text.
            facultyInput.placeholder = "Selecciona una facultad";
            classInput.placeholder = "Selecciona una categoria";
        } else {
            // An error occured :(
            facultyInput.placeholder = "Couldn't load datalist options :(";
        }
    }
};

// Update the placeholder text.
facultyInput.placeholder = "cargando opciones";

// Set up and make the request.
request.open('GET', 'https://raw.githubusercontent.com/BrandonZoft/uniguide/master/data.json', true);
request.send();

// search markers based on user input
function search() {
    window.marker = {}
    let ikArray = []

    facultad = document.getElementById("faculty-choice").value;
    categoria = document.getElementById("class-choice").value;
    // only work for empty forms, what if user types 'ssss'.
    if (facultad == '' || categoria == '') {
        console.log("wait, that's illegal")
    } else if (facultad == "Ciudad Universitaria") {
        for (i in window.jsonOptions.Universidad.Facultades) {
            for (k in window.jsonOptions.Universidad.Facultades[i].marcador) {
                if (categoria == 'Todo') {
                    loopIndex = [i, k]
                    ikArray.push(loopIndex)
                } else {
                    var category = window.jsonOptions.Universidad.Facultades[i].marcador[k].categoria
                    if (category == categoria) {
                        loopIndex = [i, k]
                        ikArray.push(loopIndex)
                    }
                }
            }
        }
    } // add categoria == todos
    else {
        for (i in window.jsonOptions.Universidad.Facultades) {
            if (window.jsonOptions.Universidad.Facultades[i].nombre == facultad) {
                if (categoria == 'Todo') {
                    for (k in window.jsonOptions.Universidad.Facultades[i].marcador) {
                        loopIndex = [i, k]
                        ikArray.push(loopIndex)
                    }
                    break;
                } else {
                    for (k in window.jsonOptions.Universidad.Facultades[i].marcador) {
                        var category = window.jsonOptions.Universidad.Facultades[i].marcador[k].categoria
                        if (category == categoria) {
                            loopIndex = [i, k]
                            ikArray.push(loopIndex)
                        }
                    }
                    break;
                }
            }

        }
    }
    for (i in ikArray) {
        window.marker[i] = window.jsonOptions.Universidad.Facultades[ikArray[i][0]].marcador[ikArray[i][1]]
    }

    // deletes and creates markers when user clicks search
    // https://stackoverflow.com/questions/24318862/removing-all-data-markers-in-leaflet-map-before-calling-another-json
    popupMarkerArray.clearLayers()

    for (i in window.marker) {
        // getInfoFrom writes to .bindPopup
        // https://gis.stackexchange.com/questions/261028/dynamically-create-leaflet-popup-via-javascript-object
        function getInfoFrom(object) {
            var popupFood = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    var stringLine = key + ": " + object[key];
                    popupFood.push(stringLine);
                }
            }
            return popupFood;
        }

        var info = getInfoFrom(marker[i]).join(" <br>");

        var coordenadasArray = marker[i].coordenadas.split(",")

        var jsonIcon = marker[i].icon

        // list of colors for icons
        if (marker[i].categoria == 'Ventas'){
            var jsonColor = 'orange'
        } else if (marker[i].categoria == 'Comidas'){
            var jsonColor = 'red'
        } else if (marker[i].categoria == 'Bebederos') {
            var jsonColor = 'blue'
        } else if (marker[i].categoria == 'Baños') {
            var jsonColor = 'blue'
        }

        var newMarker = L.marker([coordenadasArray[0], coordenadasArray[1]], { icon: L.AwesomeMarkers.icon({ icon: jsonIcon, prefix: 'fa', markerColor: jsonColor }) }).on('click', onClick).addTo(map);
        newMarker.bindPopup(info).openPopup()
        popupMarkerArray.addLayer(newMarker)

        
    }
    
    map.addLayer(popupMarkerArray);

    // when user clicks on marker, update routing destination
    function onClick(e) {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
        map.removeLayer(endmarker);
        endmarker = new L.marker(e.latlng, { draggable: 'false', icon: L.AwesomeMarkers.icon({ icon: 'location-arrow', prefix: 'fa', markerColor: 'darkpurple' })});
        endmarker.on('dragend', function (event) {
            endmarker = event.target;
            var position = endmarker.getLatLng();
            control.spliceWaypoints(control.getWaypoints().length - 1, 1, position);
            endmarker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'false'});
        });
        map.addLayer(endmarker);
        map.closePopup();
    }
    
}


// https://stackoverflow.com/questions/37478727/how-can-i-make-a-browser-display-all-datalist-options-when-a-default-value-is-se
$('input').on('click', function () {
    $(this).attr('placeholder', $(this).val());
    $(this).val('');
});
$('input').on('mouseleave', function () {
    if ($(this).val() == '') {
        $(this).val($(this).attr('placeholder'));
    }
});

// A1 A
// A B1
// B1 C
// x0 B1
// C B
// D B
// e B
// x0 B
// B B1
// B B2
// B B3
// B B4
// B B5
// B B6
// B2 B3
// B2 B4
// B2 B1
// B2 e
// x0 B3
// B3 C
// B3 D
// B4 B1
// B4 A
// B4 C
// x0 B4
// x0 B5
// C B6
// x0 B6
// C1 C
// D D1
// D1 