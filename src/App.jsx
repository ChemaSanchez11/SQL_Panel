import { useState } from 'react'
import reactLogo from './assets/react.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from "./components/Nav.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        {console.log("SI")}
    </div>
  )
}

export default App
