import { useEffect, useContext, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { SingleTourContext } from './TourPage'

function Map() {
    const { locations } = useContext(SingleTourContext).tour;
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        mapboxgl.accessToken =
            'pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A';

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/jonasschmedtmann/cjvi9q8jd04mi1cpgmg7ev3dy',
            scrollZoom: false,
            center: [35.8623, 33.8547],
            // center: [-118.113491, 34.111745], center used to make the ui map where to start
            // zoom: 4, // zoom degre
            // interactive: false // the map only dispay as photo (in case interaction : false)
        });

        const bounds = new mapboxgl.LngLatBounds();

        locations.forEach(loc => {
            const el = document.createElement('div');
            el.className = 'marker';

            new mapboxgl.Marker({
                element: el,
                anchor: 'center'
            }).setLngLat(loc.coordinates).addTo(map);

            // Extend map bounds to include current location
            bounds.extend(loc.coordinates);
        });

        map.fitBounds(bounds, {
            padding: {
                top: 0,
                bottom: 100,
                left: 0,
                right: 0
            }
        });

        setMapInstance(map);
        return () => { map.remove() } // Clean up the map instance when the component unmounts
    }, []);

    const handleZoomIn = () => {
        if (mapInstance) {
            mapInstance.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (mapInstance) {
            mapInstance.zoomOut();
        }
    };

    return (
        <div id="map">
            <div className="zoom-buttons">
                <button onClick={handleZoomIn}>+</button>
                <button onClick={handleZoomOut}>-</button>
            </div>
        </div>
    );
}

export default Map;
