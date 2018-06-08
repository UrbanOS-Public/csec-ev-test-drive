export const setHeaderVisibility = isVisible => ({
  type: 'SET_HEADER_VISIBILITY',
  isVisible
});

export const setFooterVisibility = isVisible => ({
  type: 'SET_FOOTER_VISIBILITY',
  isVisible
});

export const setVisiblePage = page => ({
  type: 'SET_VISIBLE_PAGE',
  page
});

export const PAGES = {
  LANDING: 'LANDING',
  DRIVER_INFO: 'DRIVER_INFO'
}
