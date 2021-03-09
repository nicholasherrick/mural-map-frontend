import { useState } from 'react';

function Locate({ panTo }) {
    const [location, setLocation] = useState({ lat: '', lng: '' });

    return (
        <div className="locate">
            <button
                onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setLocation({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            });
                            panTo({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            });
                        },
                        () => null
                    );
                }}>
                <img src="person.svg" alt="locate me" />
            </button>
            <small>Get Current Location</small>
        </div>
    );
}

export default Locate;
