import ReactDOM from 'react-dom';
import { useState, useContext } from 'react';
import MuralService from '../services/MuralService';
import { AuthContext } from '../context/AuthContext';

const CreateMuralModal = ({ isEditShowing, hide, lat, lng, mural }) => {
  const { user } = useContext(AuthContext);
  const [muralData, setMuralData] = useState({
    title: null,
    artist: null,
    instagram: null,
    oldCloudinaryURL: null,
    oldCloudinaryPublicId: null,
  });
  const [file, setFile] = useState();
  const fileInput = React.createRef();

  const handleChange = (e) => {
    setMuralData({ ...muralData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    // e.preventDefault();

    const formData = new FormData();
    if (muralData.title) {
      formData.append('title', muralData.title);
    } else {
      formData.append('title', mural.title);
    }
    if (muralData.artist) {
      formData.append('artist', muralData.artist);
    } else {
      formData.append('artist', mural.artist);
    }
    if (muralData.instagram) {
      formData.append('instagram', muralData.instagram);
    } else {
      formData.append('instagram', mural.instagram);
    }
    formData.append('lattitude', lat);
    formData.append('longitude', lng);

    if (file) {
      formData.append('oldCloudinaryUrl', mural.cloudinaryUrl);
      formData.append('oldCloudinaryPublicId', mural.cloudinaryPublicId);
      formData.append('file', file);
    }

    MuralService.editMural(mural.id, user._id, formData).then((res) => {
      console.log(res.status);
      if (res.status === 200) {
        window.location.reload();
      }
    });
  };

  return isEditShowing
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
                  <div className='group'>
                    <label htmlFor='title'>Title</label>
                    <input
                      placeholder={mural.title}
                      type='text'
                      name='title'
                      onChange={handleChange}
                    />
                  </div>
                  <div className='group'>
                    <label htmlFor='artist'>Artist</label>
                    <input
                      placeholder={mural.artist}
                      type='text'
                      name='artist'
                      onChange={handleChange}
                    />
                  </div>
                  <div className='group'>
                    <label htmlFor='instagram'>Instagram</label>
                    <input
                      placeholder={mural.instagram}
                      type='text'
                      name='instagram'
                      onChange={handleChange}
                    />
                  </div>
                  <img src={mural.cloudinaryUrl} alt='' />
                  <div className='group'>
                    <label htmlFor='file'>Change image?</label>
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
                  </div>

                  <button type='submit'>Submit Changes</button>
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

            .group {
              display: flex;
              flex-direction: column;
            }

            img {
              max-width: 200px;
              margin: 1rem;
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
