export type IQueryState = {
  status: IStatus;
  data: any;
  error: Error | any;
};

export type IActionTypes = 'ERROR' | 'SUCCESS' | 'LOADING';
export type IStatus = 'loading' | 'error' | 'success' | 'idle';
export type IAction = {
  type: IActionTypes;
  payload: any;
};

export const fetchReducer = (
  state: IQueryState,
  action: IAction
): IQueryState => {
  switch (action.type) {
    case 'ERROR':
      return { ...state, status: 'error', error: action.payload };
    case 'LOADING':
      return { ...state, status: 'loading', error: undefined };
    case 'SUCCESS':
      return { ...state, status: 'success', data: action.payload };
    default:
      return state;
  }
};
