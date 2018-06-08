import React from 'react';
import PropTypes from 'prop-types';

const LandingPage = ({isActive}) => (
  <div
    style={{
      visibility: isActive ? 'visible' : 'hidden',
      display: isActive ? 'inherit' : 'none'
    }}
  >
    Landing Page
  </div>
);

LandingPage.propTypes = {
  isActive: PropTypes.bool.isRequired
}

export default LandingPage;
