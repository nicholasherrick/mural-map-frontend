import ReactDOM from 'react-dom';
import { useState, useContext } from 'react';
import MuralService from '../services/MuralService';
import { AuthContext } from '../context/AuthContext';

const CreateMuralModal = ({ isShowing, hide, lat, lng }) => {
  const { user } = useContext(AuthContext);
  const [muralData, setMuralData] = useState({
    title: '',
    artist: '',
    instagram: '',
  });
  const [file, setFile] = useState();
  const fileInput = React.createRef();

  const handleChange = (e) => {
    setMuralData({ ...muralData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    // e.preventDefault();

    const formData = new FormData();
    formData.append('title', muralData.title);
    formData.append('artist', muralData.artist);
    formData.append('instagram', muralData.instagram);
    formData.append('lattitude', lat);
    formData.append('longitude', lng);

    if (file) {
      formData.append('file', file);
    }
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    MuralService.createMural(formData, user._id).then((res) => {
      console.log(res.status);
      if (res.status === 200) {
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
    });
  };

  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className='modal-overlay' />
          <div
            className='modal-wrapper'
            aria-modal
            aria-hidden
            tabIndex={-1}
            role='dialog'
          >
            <div className='modal'>
              <div className='modal-header'>
                <button
                  type='button'
                  className='modal-close-button'
                  data-dismiss='modal'
                  aria-label='Close'
                  onClick={hide}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <input
                    placeholder='title'
                    type='text'
                    name='title'
                    onChange={handleChange}
                  />
                  <input
                    placeholder='artist'
                    type='text'
                    name='artist'
                    onChange={handleChange}
                  />
                  <input
                    placeholder='instagram'
                    type='text'
                    name='instagram'
                    onChange={handleChange}
                  />
                  <input
                    ref={fileInput}
                    type='file'
                    name='file'
                    id='file'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFile(file);
                    }}
                  />
                  <button type='submit'>Submit</button>
                </form>
              </div>
            </div>
          </div>
          <style jsx>{`
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              z-index: 1040;
              width: 100vw;
              height: 100vh;
              background-color: #000;
              opacity: 0.5;
            }

            .modal-wrapper {
              position: fixed;
              top: 0;
              left: 0;
              z-index: 1050;
              width: 100%;
              height: 100%;
              overflow-x: hidden;
              overflow-y: auto;
              outline: 0;
            }

            .modal {
              z-index: 100;
              background: white;
              position: relative;
              margin: 1.75rem auto;
              border-radius: 3px;
              max-width: 500px;
              padding: 2rem;
            }

            .modal-header {
              display: flex;
              justify-content: flex-end;
            }

            .modal-close-button {
              font-size: 1.4rem;
              font-weight: 700;
              line-height: 1;
              color: #000;
              opacity: 0.3;
              cursor: pointer;
              border: none;
            }

            button {
              font-size: 0.9rem;
              font-weight: 700;
              border-radius: 3px;
              padding: 0.3rem 1rem;
              margin-left: 0.5rem;
              margin-top: 0.5rem;
            }
          `}</style>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default CreateMuralModal;
{
  /* <style jsx>{`
          .modal {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            margin: auto;
            font-size 50px;
          }
        `}</style> */
}
