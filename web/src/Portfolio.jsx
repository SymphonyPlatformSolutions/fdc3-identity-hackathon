import { useRef, useEffect } from 'react';
import * as perspective from '@finos/perspective';
import '@finos/perspective-viewer';
import '@finos/perspective-viewer-datagrid';
import './Portfolio.css';
import data from './data';

const Portfolio = ({ userContext }) => {
    const worker = perspective.default.shared_worker();
    const viewer = useRef(null);
    const table = worker.table(data);

    useEffect(() => {
        viewer.current.load(table);
        viewer.current.restore({
            group_by: [ 'Sector' ],
        });
    }, []);

    return (
        <div className="portfolio-container">
            <h2>Portfolio</h2>
            <h3>Welcome, { userContext?.displayName || 'Josh Doe' }</h3>
            <perspective-viewer ref={viewer} id="perspective"></perspective-viewer>
        </div>
    )
};
export default Portfolio;
