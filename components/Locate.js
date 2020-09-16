import { useState } from 'react';

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
          background-color: white;
          font-size: 1rem;
        }

        img {
          width: 30px;
          cursor: pointer;
        }

        @media screen and (max-width: 720px) {
          button {
            top: 14rem;
          }

          small {
            top: 16rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Locate;
