import ReactDOM from 'react-dom';
import { useState, useContext } from 'react';
import MuralService from '../services/MuralService';
import { AuthContext } from '../context/AuthContext';

const EditMuralModal = ({ isEditShowing, hide, lat, lng, mural, getMarkers, setSelected }) => {
    const { user } = useContext(AuthContext);
    const [muralData, setMuralData] = useState({
        title: null,
        artist: null,
        instagram: null,
        oldCloudinaryURL: null,
        oldCloudinaryPublicId: null
    });
    const [file, setFile] = useState();
    const fileInput = React.createRef();

    const handleChange = (e) => {
        setMuralData({ ...muralData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
            formData.append('instagram', muralData.instagram.toLowerCase());
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
            if (res.status === 200) {
                let updatedMural = {
                    ...res.data,
                    lat: res.data.lattitude,
                    lng: res.data.longitude
                };
                delete updatedMural.lattitude;
                delete updatedMural.longitude;
                getMarkers();
                setSelected(updatedMural);
                hide();
            }
        });
    };

    return isEditShowing
        ? ReactDOM.createPortal(
              <React.Fragment>
                  <div className="edit-mural-modal">
                      <div className="modal-overlay" />
                      <div
                          className="modal-wrapper"
                          aria-modal
                          aria-hidden
                          tabIndex={-1}
                          role="dialog">
                          <div className="modal">
                              <div className="modal-header">
                                  <h2>Edit Mural</h2>
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
                                              defaultValue={mural.title ? mural.title : null}
                                              placeholder={
                                                  mural.title ? mural.title : 'enter title'
                                              }
                                              type="text"
                                              name="title"
                                              onChange={handleChange}
                                          />
                                      </div>
                                      <div className="group">
                                          <label htmlFor="artist">Artist</label>
                                          <input
                                              defaultValue={mural.artist ? mural.artist : null}
                                              placeholder={
                                                  mural.artist ? mural.artist : 'enter artist'
                                              }
                                              type="text"
                                              name="artist"
                                              onChange={handleChange}
                                          />
                                      </div>
                                      <div className="group">
                                          <label htmlFor="instagram">Instagram</label>
                                          <input
                                              defaultValue={
                                                  mural.instagram ? mural.instagram : null
                                              }
                                              placeholder={
                                                  mural.instagram
                                                      ? mural.instagram
                                                      : 'enter instagram handle'
                                              }
                                              type="text"
                                              name="instagram"
                                              onChange={handleChange}
                                          />
                                      </div>
                                      <img
                                          src={mural.cloudinaryUrl ? mural.cloudinaryUrl : ''}
                                          alt=""
                                      />
                                      <div className="group">
                                          <label htmlFor="file">Change image?</label>
                                          <input
                                              ref={fileInput}
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
                                          Submit Changes
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

export default EditMuralModal;
