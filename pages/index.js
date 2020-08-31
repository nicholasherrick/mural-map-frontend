import Layout from '../components/Layout';
import Search from '../components/Search';
import Locate from '../components/Locate';
import { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MuralService } from '../services/MuralService';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { formatRelative } from 'date-fns';
import mapStyles from '../mapStyles';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};
const center = {
  lat: 39.739235,
  lng: -104.99025,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const Index = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [mural, setMural] = useState({
    title: '',
    artist: '',
    instagram: '',
    latitude: '',
    longitude: '',
    picture: '',
  });
  const [murals, setMurals] = useState([]);
  const [location, setLocation] = useState({ lat: '', lng: '' });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const onMapClick = useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
    // MuralService.getMurals().then((data) => {
    // setMurals(data)
    // setMarkers(data)
    // console.log(data);
    // });
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Map';

  return (
    <Layout>
      <div>
        {!isAuthenticated ? <h1>Welcome to Mural Map</h1> : <h1>Mural Map</h1>}

        <div>
          <Search panTo={panTo} />
          <Locate panTo={panTo} />

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
          >
            {navigator.geolocation ? (
              <Marker
                key='1'
                position={location}
                icon={{
                  url: 'marker.svg',
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
              />
            ) : null}
            {markers.map((marker) => (
              <Marker
                key={marker.time.toISOString()}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: '/museum.svg',
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                onClick={() => {
                  setSelected(marker);
                }}
              />
            ))}

            {selected ? (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                }}
              >
                <div>
                  <h2>Mural Here</h2>
                  <p>Added {formatRelative(selected.time, new Date())}</p>
                </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </div>
      </div>
      <style jsx>{`
        h1 {
          position: absolute;
          top: 6rem;
          left: 1rem;
          z-index: 10;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </Layout>
  );
};

export default Index;
