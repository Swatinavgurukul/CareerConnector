//React
import React, { Suspense, lazy, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { SessionProvider } from "../components/SessionProvider.jsx";
import { ToastContainer } from "react-toastify";

//Redux
import { connect, Provider } from "react-redux";
import { _setAuthData } from "../actions/actionsAuth.jsx";
import returnStoreAndPersistor from "../store/index.jsx";
import { PersistGate } from "redux-persist/integration/react";
import App from "./app.jsx"
import "./i18n";
const { store } = returnStoreAndPersistor();
const { persistor } = returnStoreAndPersistor();

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <SessionProvider>
                <ToastContainer
                    position="top-right"
                    // autoClose={false}
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <App />
            </SessionProvider>
        </PersistGate>
    </Provider>,
    document.getElementById("app")
);
