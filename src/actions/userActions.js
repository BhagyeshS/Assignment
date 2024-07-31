//Action Types
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
 
//Action Creator
export const fetchUsersRequest = () =>({type: FETCH_USERS_REQUEST});
export const fetchUsersSuccess = (data) =>({type: FETCH_USERS_SUCCESS, payload:data});
export const fetchUsersFailure = (error) =>({type: FETCH_USERS_FAILURE, payload:error});
 
//Async Action Creator
 
export const fetchUsers = (limit,skip) => async dispatch => {
  dispatch({type:'FETCH_USERS_REQUEST'});
 
  try{
    const response = await fetch (`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
    const data = await response.json();
    dispatch({type:'FETCH_USERS_SUCCESS', payload:data});
  }catch(error){
    dispatch({type:'FETCH_USERS_FAILURE', payload:error});
  }
};