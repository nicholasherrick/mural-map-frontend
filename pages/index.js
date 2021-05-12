import getConfig from 'next/config';
import Layout from '../components/Layout';
import Search from '../components/Search';
import Locate from '../components/Locate';
import CreateMuralModal from '../components/CreateMuralModal';
import EditMuralModal from '../components/EditMuralModal';
import useModal from '../helpers/useModal';
import useEditModal from '../helpers/useEditModal';
import MuralService from '../services/MuralService';
import { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import moment from 'moment';
import mapStyles from '../mapStyles';

const { publicRuntimeConfig } = getConfig(); // Grab ENV variables

const libraries = ['places'];

const mapContainerStyle = {
    width: '100%',
    height: '100vh'
};

const center = {
    lat: 39.739235,
    lng: -104.99025
};

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true
};

const Index = () => {
    // Pass API keys
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
            publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries
    });

    // State
    const { isAuthenticated, user } = useContext(AuthContext);
    const [location, setLocation] = useState({ lat: 39.739235, lng: -104.99025 });
    const [muralLocation, setMuralLocation] = useState({ lat: '', lng: '' });
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);

    // Modal toggles
    const { isShowing, toggle } = useModal();
    const { isEditShowing, editToggle } = useEditModal();

    const onMapClick = useCallback((event) => {
        if (isAuthenticated) {
            setMuralLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
            toggle();
        }
    }, []);

    const getMarkers = () => {
        MuralService.getMurals().then((data) => {
            data.map((mural) => {
                setMarkers((current) => [
                    ...current,
                    {
                        id: mural._id,
                        userId: mural.userId,
                        time: mural.createdAt,
                        title: mural.title,
                        artist: mural.artist,
                        instagram: mural.instagram,
                        lat: parseFloat(mural.lattitude),
                        lng: parseFloat(mural.longitude),
                        cloudinaryUrl: mural.cloudinaryUrl,
                        cloudinaryPublicId: mural.cloudinaryPublicId
                    }
                ]);
                setMuralLocation({
                    lat: mural.lattitude,
                    lng: mural.longitude
                });
            });
        });
    };

    const mapRef = useRef();

    const onMapLoad = useCallback((map) => {
        getMarkers();
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            mapRef.current.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
            mapRef.current.setZoom(9);
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
        <Layout background="none" title={isAuthenticated ? 'Murals' : 'Welcome'}>
            <div className="map-container">
                <div>
                    <Search panTo={panTo} />
                    <Locate panTo={panTo} />

                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={4}
                        center={center}
                        options={options}
                        onClick={onMapClick}
                        onLoad={onMapLoad}>
                        <CreateMuralModal
                            isShowing={isShowing}
                            hide={toggle}
                            lat={muralLocation.lat}
                            lng={muralLocation.lng}
                            getMarkers={getMarkers}
                        />

                        <EditMuralModal
                            isEditShowing={isEditShowing}
                            hide={editToggle}
                            lat={muralLocation.lat}
                            lng={muralLocation.lng}
                            mural={selected}
                            getMarkers={getMarkers}
                            setSelected={setSelected}
                        />

                        {navigator.geolocation ? (
                            <Marker
                                key="1"
                                position={location}
                                icon={{
                                    url: 'marker.svg',
                                    scaledSize: new window.google.maps.Size(30, 30),
                                    origin: new window.google.maps.Point(0, 0),
                                    anchor: new window.google.maps.Point(15, 15)
                                }}
                            />
                        ) : null}

                        {isLoaded
                            ? markers.map((marker, i) => (
                                  <Marker
                                      key={i}
                                      position={{ lat: marker.lat, lng: marker.lng }}
                                      icon={{
                                          url: '/museum.svg',
                                          scaledSize: new window.google.maps.Size(30, 30),
                                          origin: new window.google.maps.Point(0, 0),
                                          anchor: new window.google.maps.Point(15, 15)
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
                                }}>
                                <div className="info-window">
                                    {selected.cloudinaryUrl ? (
                                        <img src={selected.cloudinaryUrl}></img>
                                    ) : null}
                                    <h2>{selected.title}</h2>
                                    <strong>Artist</strong>
                                    <p>{selected.artist}</p>
                                    <strong>Instagram</strong>
                                    <br />
                                    <a
                                        href={`https://www.instagram.com/${selected.instagram}/`}
                                        target="_blank">
                                        {selected.instagram}
                                    </a>
                                    <p>Added {moment(selected.time).fromNow()}</p>
                                    {isAuthenticated ? (
                                        <div>
                                            {user._id === selected.userId ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setMuralLocation({
                                                            lat: selected.lat,
                                                            lng: selected.lng
                                                        });
                                                        editToggle();
                                                    }}>
                                                    Edit
                                                </button>
                                            ) : null}
                                            {user._id === selected.userId ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        MuralService.deleteMural(
                                                            selected.id,
                                                            user._id
                                                        )
                                                            .then((res) => {
                                                                if (res.status === 200) {
                                                                    setMarkers([]);
                                                                    getMarkers();
                                                                }
                                                            })
                                                            .then(() => {
                                                                setSelected(null);
                                                            });
                                                    }}>
                                                    Delete
                                                </button>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </InfoWindow>
                        ) : null}
                    </GoogleMap>
                </div>
            </div>
        </Layout>
    );
};

export default Index;
