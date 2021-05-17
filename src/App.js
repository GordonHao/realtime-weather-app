// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
// const { useState } = React;

function App() {
  const [count, setCount] = useState(5);
  const clickEvent = (type) => () => setCount( type === 'increment' ? count + 1 : count - 1 );
  const counters = Array.from({length: 10}, (_, index) => index);

  return (
    <div className="container">
      <div
        className="chevron chevron-up"
        style={{
          visibility: count >= 10 && 'hidden',
        }}
        onClick={clickEvent('increment')}
      />

      <div className="number">{count}</div>

      <div
        className="chevron chevron-down"
        style={{
          visibility: count <= 0 && 'hidden',
        }}
        onClick={clickEvent('decrement')}
      />
    </div>
  );

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
}

export default App;