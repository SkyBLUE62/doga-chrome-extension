import "./App.css";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { TestTabs } from "./components/test-tabs";
import { BackgroundBeams } from "./components/ui/background-beams";
import { ThemeProvider } from "./provider/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <div className="h-full w-full overflow-x-hidden">
        <BackgroundBeams className="h-full w-full" />

        <Header />
        <TestTabs />
        {/* <TabsContainer /> */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
