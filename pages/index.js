import Layout from '../components/Layout';
import Search from '../components/Search';
import Locate from '../components/Locate';
import CreateMuralModal from '../components/CreateMuralModal';
import EditMuralModal from '../components/EditMuralModal';
import useModal from '../components/useModal';
import useEditModal from '../components/useEditModal';
import MuralService from '../services/MuralService';
import { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import moment from 'moment';
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
  const { isAuthenticated, user } = useContext(AuthContext);
  const [location, setLocation] = useState({ lat: 39.739235, lng: -104.99025 });
  const [muralLocation, setMuralLocation] = useState({ lat: '', lng: '' });
  const { isShowing, toggle } = useModal();
  const { isEditShowing, editToggle } = useEditModal();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const onMapClick = useCallback((event) => {
    if (isAuthenticated) {
      setMuralLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      toggle();
    }
  }, []);

  // useEffect(() => {});

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    MuralService.getMurals().then((data) => {
      data.map((mural) => {
        setMarkers((current) => [
          ...current,
          {
            id: mural._id,
            time: mural.createdAt,
            title: mural.title,
            artist: mural.artist,
            instagram: mural.instagram,
            lat: parseFloat(mural.lattitude),
            lng: parseFloat(mural.longitude),
            cloudinaryUrl: mural.cloudinaryUrl,
            cloudinaryPublicId: mural.cloudinaryPublicId,
          },
        ]);
        setMuralLocation({
          lat: mural.lattitude,
          lng: mural.longitude,
        });
      });
    });
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
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
        {!isAuthenticated ? <h1>Welcome to Mural Map</h1> : null}

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
            <CreateMuralModal
              isShowing={isShowing}
              hide={toggle}
              lat={muralLocation.lat}
              lng={muralLocation.lng}
            />

            <EditMuralModal
              isEditShowing={isEditShowing}
              hide={editToggle}
              lat={muralLocation.lat}
              lng={muralLocation.lng}
              mural={selected}
            />

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

            {isLoaded
              ? markers.map((marker) => (
                  <Marker
                    key={marker.id}
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
                ))
              : null}

            {selected ? (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                }}
              >
                <div>
                  {selected.cloudinaryUrl ? (
                    <img src={selected.cloudinaryUrl}></img>
                  ) : null}
                  <h2>{selected.title}</h2>
                  <p>Artist: {selected.artist}</p>
                  <p>
                    Instagram:{' '}
                    <a
                      href={`https://www.instagram.com/${selected.instagram}/`}
                      target='_blank'
                    >
                      {selected.instagram}
                    </a>
                  </p>
                  <p>Added {moment(selected.time).fromNow()}</p>
                  {isAuthenticated ? (
                    <div>
                      <button
                        onClick={() => {
                          setMuralLocation({
                            lat: selected.lat,
                            lng: selected.lng,
                          });
                          editToggle();
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          MuralService.deleteMural(selected.id, user._id).then(
                            (res) => {
                              if (res.status === 200) {
                                window.location.reload();
                              }
                            }
                          );
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
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
          background-color: white;
        }

        img {
          max-width: 200px;
        }

        button {
          margin: 0 0.5rem;
        }
      `}</style>
    </Layout>
  );
};

export default Index;
