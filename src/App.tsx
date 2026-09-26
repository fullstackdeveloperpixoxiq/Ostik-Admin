import { RouterProvider } from 'react-router';
import router from './routes/Router';
import './css/globals.css';
import { ThemeProvider } from './components/provider/theme-provider';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster position='top-right' richColors/>
      </ThemeProvider>
    </>
  );
}

export default App;
