import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import COVID_SMASHER from './covid_smasher.js';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{textAlign: "center"}}>
         <script src="https://apis.google.com/js/platform.js" async defer></script>
        <meta name="google-signin-client_id" content="130407574445-7d1gjhpe6u5pj04fe4794hmbq7mtl9c1.apps.googleusercontent.com" />
        <h1>
          Covid-Crusher!
        </h1>
        <br />
        <BrowserRouter basename={window.location.path || ''}>
          <Route path="/" exact={true} component={COVID_SMASHER}/>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
