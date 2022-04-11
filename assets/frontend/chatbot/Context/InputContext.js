import React from 'react';

const InputContext = React.createContext();

const InputProvider = InputContext.Provider;
const InputConsumer = InputContext.Consumer;

export {
    InputProvider, InputConsumer, InputContext
}
