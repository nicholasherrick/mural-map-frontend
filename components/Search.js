import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

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
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 400px;
          z-index: 10;
        }

        @media screen and (max-width: 1024px) {
          .search {
            left: 30%;
          }
        }

        @media screen and (max-width: 720px) {
          .search {
            left: 50%;
            top: 12rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Search;
