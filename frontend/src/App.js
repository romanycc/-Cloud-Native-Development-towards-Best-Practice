import './App.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import EarthquakePage from './earthquake';
import EntryPage from './Entry';
import WaterPage from './water';
import ElectronicPage from './electronic';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<EntryPage />}/>
      <Route path="/earthquake" element={<EarthquakePage />}/>
      <Route path="/water" element={<WaterPage />}/> 
      <Route path="/electronic" element={<ElectronicPage />}/>
    </Routes>
  );
}

export default App;
