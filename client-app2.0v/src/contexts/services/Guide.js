import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import sidebarSolutionsDisplay from '../../layouts/dashboard/SidebarSolutionsDisplay';
import { GuideNavMenu } from '../../layouts/service/guide/Guide';

// ----------------------------------------------------------------------

const initialState = {
  guideMenu: sidebarSolutionsDisplay,
  guide: null
};

const handlers = {
  MENU: (state, action) => {
    const { guide } = action.payload;

    return { ...state, guideMenu: guide ? GuideNavMenu[guide] : sidebarSolutionsDisplay };
  },
  GUIDE: (state, action) => {
    const { guide } = action.payload;
    return { ...state, guide };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const GuideContext = createContext({
  ...initialState
});

GuideProvider.propTypes = {
  children: PropTypes.node
};

function GuideProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.split('/');
    let guide = null;
    if (path.includes('faire-son-previsionnel-financier')) {
      guide = 'faire-son-previsionnel-financier';
    }
    if (path.includes('faire-son-business-plan')) {
      guide = 'faire-son-business-plan';
    }
    if (path.includes('faire-choix-creation-entreprise')) {
      guide = 'faire-choix-creation-entreprise';
    }
    if (path.includes('creer-sa-micro-entreprise')) {
      guide = 'creer-sa-micro-entreprise';
    }
    dispatch({
      type: 'MENU',
      payload: {
        guide
      }
    });
    dispatch({
      type: 'GUIDE',
      payload: {
        guide
      }
    });
  }, [dispatch, pathname]);
  return (
    <GuideContext.Provider
      value={{
        ...state
      }}
    >
      {children}
    </GuideContext.Provider>
  );
}

export { GuideContext, GuideProvider };
