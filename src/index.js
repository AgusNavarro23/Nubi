import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));


root.render(
  <Auth0Provider
    domain="dev-g6uy57lz76wurdoi.us.auth0.com"
    clientId="gYIsdjTeRP72xUe9GJhJFnZ7M4ALM26S"
    authorizationParams={{
      redirect_uri: window.location.origin,
      cacheLocation:'localstorage',
      useRefreshTokens:true
    }}
  >
    <App />
  </Auth0Provider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
