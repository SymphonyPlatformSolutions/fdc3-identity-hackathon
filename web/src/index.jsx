import { createRoot } from 'react-dom/client';
import './index.css';

const Index = () => (
    <>Hello World</>
);

createRoot(document.querySelector("#root")).render(<Index />);
