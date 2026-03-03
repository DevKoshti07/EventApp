import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Toast from 'react-native-toast-message'
import RootNavigation from './src/routes/RootNavigation'
import { store, persistor } from './src/store'
import toastConfig, { has_Notch } from './src/services/UIs/toastConfig'

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigation />
        <Toast
          config={toastConfig}
          topOffset={has_Notch ? 0 : 20}
          position={'bottom'}
        />
      </PersistGate>
    </Provider>
  )
}
