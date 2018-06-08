import {connect} from 'react-redux';
import Header from '../components/Header';

const mapStateToProps = state => ({
  isVisible: state.appHeader.isVisible
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
