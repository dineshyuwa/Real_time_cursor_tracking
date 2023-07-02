import { combineReducers } from 'redux';
import { CursorPosition } from './types';

const usernameReducer = (state = '', action: any) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return action.payload;
    default:
      return state;
  }
};

const cursorPositionsReducer = (state: { [key: string]: CursorPosition } = {}, action: any) => {
  switch (action.type) {
    case 'UPDATE_CURSOR_POSITIONS':
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  username: usernameReducer,
  cursorPositions: cursorPositionsReducer,
});

export default rootReducer;
