import React from 'react';
import PropTypes from 'prop-types';

const DriverInfoPage = ({isActive}) => (
  <div
    style={{
      visibility: isActive ? 'visible' : 'hidden',
      display: isActive ? 'inherit' : 'none'
    }}
  >
    Driver Info Page
  </div>
);

DriverInfoPage.propTypes = {
  isActive: PropTypes.bool.isRequired
}

export default DriverInfoPage;
