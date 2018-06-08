import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';

const DriverInfoPage = ({isActive}) => (
  <div
    style={{
      visibility: isActive ? 'visible' : 'hidden',
      display: isActive ? 'inherit' : 'none'
    }}
  >
    <Header />
    Driver Info Page
    <Footer />
  </div>
);

DriverInfoPage.propTypes = {
  isActive: PropTypes.bool.isRequired
}

export default DriverInfoPage;
