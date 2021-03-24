import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import COVID_SMASHER from './covid_smasher.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Covid-Smasher!
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
