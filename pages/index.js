import Layout from '../components/Layout';
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
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
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

function Locate({ panTo }) {
  const [location, setLocation] = useState({ lat: '', lng: '' });

  return (
    <div>
      <button
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => null
          );
        }}
      >
        <img src='person.svg' alt='locate me' />
      </button>
      <small>Get Current Location</small>

      <style jsx>{`
        button {
          position: absolute;
          top: 6rem;
          right: 2.7rem;
          background: none;
          border: none;
          z-index: 10;
        }

        small {
          position: absolute;
          top: 8rem;
          right: 0.5rem;
          background: none;
          border: none;
          z-index: 10;
        }

        img {
          width: 30px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 39.739235, lng: () => -104.99025 },
      radius: 200 * 1000,
    },
  });
  return (
    <div className='search'>
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();

          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);

            panTo({ lat, lng });
          } catch (err) {
            console.log('error!');
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder='search locations'
        />

        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>

      <style jsx>{`
        .search {
          position: absolute;
          top: 6rem;
          left: 60%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 400px;
          z-index: 10;
        }

        .search > input {
          padding: 5rem;
          font-size: 1.5rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default Index;
