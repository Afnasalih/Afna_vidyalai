import React from 'react';
import { WindowWidthProvider } from '../context/WindowWidthContext';

const App = ({ Component, pageProps }) => (
  <WindowWidthProvider>
    <Component {...pageProps} />
    </WindowWidthProvider>
);

export default App;
