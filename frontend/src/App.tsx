import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

import { AppRoutes } from './routes';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRoutes/>
      </PersistGate>
    </Provider>
  );
}

export default App;
