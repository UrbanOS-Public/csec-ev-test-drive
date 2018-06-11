import {connect} from 'react-redux';
import {setVisiblePage} from '../actions';
import Pages from '../components/Pages';

const mapStateToProps = state => ({
  activePage: state.activePage
});

const mapDispatchToProps = dispatch => ({
  setVisiblePage: page => dispatch(setVisiblePage(page))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pages);
