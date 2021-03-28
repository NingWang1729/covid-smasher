import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import COVID_SMASHER from './covid_smasher.js';

function App() {
  return (
    <div className="App" style={{ backgroundColor: "beige", height: "100vh" }}>
      <header className="App-header" >
         <script src="https://apis.google.com/js/platform.js" async defer></script>
        <meta name="google-signin-client_id" content="130407574445-7d1gjhpe6u5pj04fe4794hmbq7mtl9c1.apps.googleusercontent.com" />
        <h1 style={{ textAlign: "center", paddingTop: "10px", fontSize: "40px", }}>
          Covid Crusher
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
