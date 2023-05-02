import { createRoot } from 'react-dom/client';
import './index.css';

const Index = () => (
    <>Hello FDC3 Identity</>
);

createRoot(document.querySelector("#root")).render(<Index />);
