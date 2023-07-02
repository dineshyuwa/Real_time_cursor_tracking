import { AnyAction } from 'redux';

export const setUsername = (username: string): AnyAction => ({
  type: 'SET_USERNAME',
  payload: username,
});

export const updateCursorPositions = (positions: any): AnyAction => ({
  type: 'UPDATE_CURSOR_POSITIONS',
  payload: positions,
});
