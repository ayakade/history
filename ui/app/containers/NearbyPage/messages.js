import { defineMessages } from 'react-intl';

export const scope = 'app.containers.NearbyPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the NearbyPage container!',
  },

  error: {
    id: `${scope}.error`,
    defaultMessage: 'Ooops, something went wrong :(',
  }
});
