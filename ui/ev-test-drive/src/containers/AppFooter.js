import {connect} from 'react-redux';
import Footer from '../components/Footer';

const mapStateToProps = state => ({
  isVisible: state.appFooter.isVisible
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
