const initialState = {
  isVisible: false,
};

const appHeader = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_HEADER_VISIBILITY':
      return {
        ...state,
        isVisible: action.isVisible
      };
    default:
      return state;
  }
}

export default appHeader;
