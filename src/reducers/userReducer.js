import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE
} from '../actions/userActions';
 
const initialState = {
  loading: false,
  users: [],
  error: '',
  hasMore: true,
  skip: 0,
  limit: 10
};
 
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...state.users, ...action.payload.users],
        skip: state.skip + state.limit,
        hasMore: action.payload.users.length === state.limit
      };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
 
export default userReducer;
 
 