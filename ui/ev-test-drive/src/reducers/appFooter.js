const initialState = {
  isVisible: false,
};

const appFooter = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_FOOTER_VISIBILITY':
      return {
        ...state,
        isVisible: action.isVisible
      };
    default:
      return state;
  }
}

export default appFooter;
