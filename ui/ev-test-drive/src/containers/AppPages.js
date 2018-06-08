import {connect} from 'react-redux';
import Pages from '../components/Pages';

const mapStateToProps = state => ({
  activePage: state.activePage
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pages);
