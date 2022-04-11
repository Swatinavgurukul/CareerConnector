import React from 'react';

const ChatHistoryContext = React.createContext();

const ChatHistoryProvider = ChatHistoryContext.Provider;
const ChatHistoryConsumer = ChatHistoryContext.Consumer;

export {
    ChatHistoryProvider, ChatHistoryConsumer, ChatHistoryContext
}
