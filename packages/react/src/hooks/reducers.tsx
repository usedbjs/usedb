export type IQueryState = {
  status: IStatus;
  data: any;
  error: Error | any;
};

export type IActionTypes = 'ERROR' | 'SUCCESS' | 'LOADING' | 'REVALIDATING';
export type IStatus = 'loading' | 'error' | 'success' | 'idle' | 'revalidating';
export type IAction = {
  type: IActionTypes;
  payload?: any;
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
    case 'REVALIDATING':
      return { ...state, status: 'revalidating' };
    default:
      return state;
  }
};
