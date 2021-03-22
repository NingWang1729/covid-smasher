import logo from './logo.svg';
import './App.css';
import './base_classes/locations.js';
import './base_classes/timezones.js';
import './base_classes/player.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Don't Learn React yet
        </a>
      </header>
    </div>
  );
}

export default App;
