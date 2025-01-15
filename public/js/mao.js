mapboxgl.accessToken = mapToken;
console.log(mapToken);

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates, 
    zoom: 11 
});
console.log(coordinates);

const marker = new mapboxgl.Marker({ color: 'red'})
.setLngLat(coordinates)
.addTo(map);