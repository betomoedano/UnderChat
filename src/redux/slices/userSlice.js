import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    name: "",
    username: "",
    email: "",
    expoToken: "NO DATA",
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            return {
                ...state,
                  id: action.payload.id,
                  name: state.name,
                  username: action.payload.username,
                  email: action.payload.email,
                  expoToken: state.expoToken,
              }
            // state = action.payload;
            // console.log("state from login Slice: " ,state);
        },
        setExpoToken: (state, action) => {
            return {
                ...state,
                  id: state.id,
                  name: state.name,
                  username: state.username,
                  email: state.email,
                  expoToken: action.payload,
              }
        },
        setName: (state, action) => {
            return {
                ...state,
                  id: state.id,
                  name: action.payload,
                  username: state.username,
                  email: state.email,
                  expoToken: state.expoToken,
              }
        },
        logout: (state) => {
            return {
                ...state,
                  id: "",
                  name: "",
                  username: "",
                  email: "", 
                  expoToken: "",
              }
            // state = initialState;
            // console.log("initial state")
        }
    }
});

export const {login, logout, setExpoToken, setName} = userSlice.actions;

export default userSlice.reducer;