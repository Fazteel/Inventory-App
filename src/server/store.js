// src/store.js
import { createStore } from 'redux';
import rootReducer from '../reducers/index'; // Pastikan Anda memiliki rootReducer

// Membuat store dengan rootReducer
const store = createStore(rootReducer);

export default store;