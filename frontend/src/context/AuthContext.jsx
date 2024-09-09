import { createContext, useEffect, useReducer } from "react";

const initialState = {
  user:
    localStorage.getItem("user") !== undefined
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
  user1:
    localStorage.getItem("user1") !== undefined
      ? JSON.parse(localStorage.getItem("user1"))
      : null, // Add user1 to the initial state
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
        user1: null, // Reset user1 when login starts
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
        user1: action.payload.user1, // Set user1 from action payload
      };
    case "LOGOUT":
    case "Delete":
      return {
        user: null,
        role: null,
        token: null,
        user1: null, // Clear user1 when logging out or deleting
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user) || null);
    localStorage.setItem("token", state.token || null);
    localStorage.setItem("role", state.role || null);
    localStorage.setItem("user1", JSON.stringify(state.user1) || null); // Store user1 in local storage
  }, [state]);

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        user1: state.user1, // Include user1 in the context value
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
