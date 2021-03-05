import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

// import style
import "./style.css";

/**
 * Parse querystring from route
 * @param {string} find query name
 * @param {string} from route or URL
 * @returns {string}
 */
function parseQueryString(find, from) {
  if (!find || !from) return '';
  const parts = RegExp(`[?&]${find}(=([^&#]*)|&|#|$)`).exec(from);
  return parts ? parts[2] : '';
}

// location is provided by react-router-dom
function NearbyPage({ location: { search: query } }) {
  const coordinates = parseQueryString('coordinates', query);
  const lat = coordinates.split(',')[0]; // latitude
  const lon = coordinates.split(',')[1]; // longitude
  const radius = 2; // within 2km radius
  const api_key = 'e22ebf08bb524f58dca9ba399af80a69';

  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}&lat=${lat}&lon=${lon}&radius=${radius}&format=json&nojsoncallback=1`;

  // photo lists
  const [photos, setPhotos] = useState(null);
  // active (big display) photo
  const [activePhoto, setActivePhoto] = useState({});
  // error
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // if succeeded
        if (data.stat !== 'fail') {
        setPhotos(data.photos.photo);
        // set 1st photo from photolist as a default active photo
        setActivePhoto(data.photos.photo[0]);
        } else {
          // if unsucceeded
          setError(data.message);
        }
      })
      .catch(error => (
        <div className="error">
          <h1>Ooops, something went wrong :(</h1>
          <p>{error}</p>
        </div>
      ));
    return null;
  }, []);

  // if there's no photo found, give an error message
  if (!photos) {
    return (
      <div className="error">
        <h1>Ooops, something went wrong :(</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <article>
      <Helmet>
        <title>Nearby</title>
        <meta name="description" content="Description of Nearby" />
      </Helmet>
      <FormattedMessage {...messages.header} />

      <p>Location: {coordinates}<br/>Within 2km we found these photos</p>
      <div className="container">
        <div className="largePhoto">
          <img
            src={`https://live.staticflickr.com/${activePhoto.server}/${activePhoto.id}_${activePhoto.secret}_c.jpg`}
            alt={activePhoto.title}
          />
          <p>{activePhoto.title}</p>
        </div>

          <div className="title">
            <h2>Photo List</h2>
            <p>Click photo to see big image</p>
          </div>

          <div className="photoList">
          {photos.map(photo => (
            <div
              // change main photo when photo is clicked
              onClick={() => setActivePhoto(photo)}
              // chenge main photo when photo is highlighted / hover
              onMouseEnter={() => setActivePhoto(photo)}
              key={photo.id}
              className={photo.id === activePhoto.id ? 'active thumbnail' : 'thumbnail'}
            >
              <img
                src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`}
                alt={photo.title}
              />
              <p>{photo.title}</p>
            </div>
          ))}
          </div>
        </div>

    </article>
  );
}

export default memo(NearbyPage);
