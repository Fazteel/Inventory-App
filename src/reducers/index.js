// src/reducers/index.js
import { combineReducers } from 'redux';

// Contoh reducer sederhana
const initialState = {
  user: {
    permissions: [] // Ganti dengan state yang sesuai
  }
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    // Tambahkan case untuk menangani action
    default:
      return state;
  }
};

// Menggabungkan semua reducer
const rootReducer = combineReducers({
  user: userReducer,
  // Tambahkan reducer lain di sini
});

export default rootReducer;