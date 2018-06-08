import {combineReducers} from 'redux';
import appHeader from './appHeader';
import appFooter from './appFooter';
import activePage from './activePage';

export default combineReducers({
  appHeader,
  appFooter,
  activePage
});
