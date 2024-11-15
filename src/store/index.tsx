// store/index.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminSlice, { AdminState } from "./slices/adminSlice";
import registerSlice, { RegisterState } from "./slices/registerSlice";
import chatSlice, { ChatState } from "./slices/chatSlice";
import SettingSlice, { SettingState } from "./slices/SettingSlice";

const persistConfig = {
  key: "we_sign_app",
  storage,
};

const rootReducer = combineReducers({
  admin: adminSlice,
  register: registerSlice,
  setting: SettingSlice,
  chat: chatSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = {
  admin: AdminState;
  register: RegisterState;
  chat: ChatState;
  setting: SettingState;
};

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
