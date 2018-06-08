import React from 'react';
import PropTypes from 'prop-types';
import {PAGES} from '../actions';
import LandingPage from './LandingPage';
import DriverInfoPage from './DriverInfoPage';

const Pages = ({activePage}) => (
  <div className="Pages">
    <LandingPage isActive={activePage === PAGES.LANDING} />
    <DriverInfoPage isActive={activePage === PAGES.DRIVER_INFO} />
  </div>
);

Pages.propTypes = {
  activePage: PropTypes.string.isRequired
}

export default Pages;
