import ReactDOM from 'react-dom';
import { useState, useContext } from 'react';
import MuralService from '../services/MuralService';
import { AuthContext } from '../context/AuthContext';

const CreateMuralModal = ({ isShowing, hide, lat, lng }) => {
    const { user } = useContext(AuthContext);
    const [muralData, setMuralData] = useState({
        title: '',
        artist: '',
        instagram: ''
    });
    const [file, setFile] = useState();
    const fileInput = React.createRef();

    const handleChange = (e) => {
        setMuralData({ ...muralData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', muralData.title);
        formData.append('artist', muralData.artist);
        formData.append('instagram', muralData.instagram.toLowerCase());
        formData.append('lattitude', lat);
        formData.append('longitude', lng);

        if (file) {
            formData.append('file', file);
        }

        MuralService.createMural(formData, user._id).then((res) => {
            if (res.status === 200) {
                setTimeout(function () {
                    window.location.reload();
                }, 4000);
            }
        });
    };

    return isShowing
        ? ReactDOM.createPortal(
              <React.Fragment>
                  <div className="create-mural-modal">
                      <div className="modal-overlay" />
                      <div
                          className="modal-wrapper"
                          aria-modal
                          aria-hidden
                          tabIndex={-1}
                          role="dialog">
                          <div className="modal">
                              <div className="modal-header">
                                  <h2>Create New Mural</h2>
                                  <button
                                      type="button"
                                      className="modal-close-button"
                                      data-dismiss="modal"
                                      aria-label="Close"
                                      onClick={hide}>
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                              </div>
                              <div>
                                  <form onSubmit={handleSubmit}>
                                      <div className="group">
                                          <label htmlFor="title">Title</label>
                                          <input
                                              placeholder="title"
                                              type="text"
                                              name="title"
                                              onChange={handleChange}
                                          />
                                      </div>
                                      <div className="group">
                                          <label htmlFor="artist">Artist</label>
                                          <input
                                              placeholder="artist"
                                              type="text"
                                              name="artist"
                                              onChange={handleChange}
                                          />
                                      </div>
                                      <div className="group">
                                          <label htmlFor="instagram">Instagram</label>
                                          <input
                                              placeholder="instagram"
                                              type="text"
                                              name="instagram"
                                              onChange={handleChange}
                                          />
                                      </div>
                                      <div className="group">
                                          <label htmlFor="file">Choose Image</label>
                                          <input
                                              ref={fileInput}
                                              accept="image/*"
                                              type="file"
                                              name="file"
                                              id="file"
                                              onChange={(e) => {
                                                  const file = e.target.files[0];
                                                  setFile(file);
                                              }}
                                          />
                                      </div>
                                      <button className="submit" type="submit">
                                          Submit
                                      </button>
                                  </form>
                              </div>
                          </div>
                      </div>
                  </div>
              </React.Fragment>,
              document.body
          )
        : null;
};

export default CreateMuralModal;
