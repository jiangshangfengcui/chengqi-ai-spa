import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './wdyr.tsx' // <--- first import
import './style.css'
import App from '@pages/App'
// import { App } from '@pages/App'
// const App = () => <div>Hello, World!</div>

const container = document.getElementById('app')
if (!container) throw new Error('Failed to find the root element')
const root = createRoot(container)
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

/* function App() {
  const [state, setState] = useState(false)
  setState(true)

  正确的更新方法
  useEffect(() => {
    setState(true);
  }, []);

  useEffect(() => {
    console.log('effect')
  }, [])
  useCallback(() => {
    console.log('callback')
  }, [])
  useMemo(() => {}, [])
  useTransition(() => {}, [])
  状态撕裂


  return <div>App</div>
} */
