import {PAGES} from '../actions';

const initialState = PAGES.LANDING;

const activePage = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_VISIBLE_PAGE':
      return action.page;
    default:
      return state;
  }
}

export default activePage;
