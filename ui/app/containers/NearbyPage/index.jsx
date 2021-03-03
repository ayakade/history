import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

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

  const [photos, setPhotos] = useState([]);
  // set default active photo
  const [activePhoto, setActivePhoto] = useState({ "id": "50983182567", "owner": "13032456@N05", "secret": "32384b7446", "server": "65535", "farm": 66, "title": "Coast Mountain Bus Company", "ispublic": 1, "isfriend": 0, "isfamily": 0 }
  );

  useEffect(() => {
    fetch(url)
    .then(res => res.json())
    .then(data => {
      setPhotos(data.photos.photo)
      // setActivePhoto(photos[0])
      // setActivePhoto(data.photos.photo[0])
    })
  }, []);

  return (
    <article>
      <Helmet>
        <title>Nearby</title>
        <meta name="description" content="Description of Nearby" />
      </Helmet>
      <FormattedMessage {...messages.header} />

      <p>Location: {coordinates}<br/>Within 2km we found these photos</p>
      <div className="container">
        <div className="mainPhoto">
          <img
            src={"https://live.staticflickr.com/" + activePhoto.server + "/" + activePhoto.id + "_" + activePhoto.secret + "_c.jpg" }
            alt={activePhoto.title}
          />
          <p>{activePhoto.title}</p>
        </div>

          <div className="title">
            <h2>Photo List</h2>
            <p>Click photo to see big image</p>
          </div>

          <div className="photoList">
          {photos.map((photo, index) => {
            return (
              <div key={index} className="thumbnail">
                <img
                  onClick={() => setActivePhoto(photo)} src={"https://live.staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_t.jpg" }
                  alt={photo.title}
                />
                <p>{photo.title}</p>
                {/* <Link to="/">AlbumViewPage</Link> */}
              </div>
            )
          })}
          </div>
        </div>

    </article>
  );
}

export default memo(NearbyPage);
