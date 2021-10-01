import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    name: "",
    username: "",
    email: "",
    expoToken: "NO DATA",
    imageUrl: "",
    friends:[],
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
                  imageUrl: state.imageUrl,
                  friends: state.friends,
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
                  imageUrl: state.imageUrl,
                  friends: state.friends,
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
                  imageUrl: state.imageUrl,
                  friends: state.friends,
              }
        },
        setImageUrl: (state, action) => {
            return {
                ...state,
                  id: state.id,
                  name: state.name,
                  username: state.username,
                  email: state.email,
                  expoToken: state.expoToken,
                  imageUrl: action.payload,
                  friends: state.friends,
              }
        },
        setFriends: (state, action) => {
            return {
                ...state,
                  id: state.id,
                  name: state.name,
                  username: state.username,
                  email: state.email,
                  expoToken: state.expoToken,
                  imageUrl: state.imageUrl,
                  friends: action.payload,
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
                  imageUrl:"",
                  friends: [],
              }
            // state = initialState;
            // console.log("initial state")
        }
    }
});

export const {login, logout, setExpoToken, setName, setImageUrl, setFriends} = userSlice.actions;

export default userSlice.reducer;