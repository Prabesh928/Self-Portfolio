import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import PageTransition from "./Pages/PageTransition";

function AppContent() {

  const [introPlayed, setIntroPlayed] = useState(false);

  return (
    <PageTransition
      introPlayed={introPlayed}
      setIntroPlayed={setIntroPlayed}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;