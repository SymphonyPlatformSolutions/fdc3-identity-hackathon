import { useRef, useEffect, useState } from 'react';
import * as perspective from '@finos/perspective';
import '@finos/perspective-viewer';
import '@finos/perspective-viewer-datagrid';
import './Portfolio.css';
import data from './data';

const Portfolio = ({ userContext }) => {
    const worker = perspective.default.shared_worker();
    const viewer = useRef(null);
    const table = worker.table(data);

    let clicks = 0;
    let loading = false;

    const reset = () => setTimeout(() => {
        clicks = 0;
        loading = false;
    }, 1000);

    useEffect(() => {
        viewer.current.load(table);
        viewer.current.restore({});
        viewer.current.addEventListener('perspective-click', (event) => {
            if (clicks < 2) {
                clicks++;
                reset();
            } else if (!loading) {
                loading = true;
                const ticker = event.detail.row.Ticker;
                const name = event.detail.row.Name;
                window.fdc3.raiseIntent('ViewChart', {
                    type: 'fdc3.instrument',
                    name,
                    id: { ticker },
                });
                reset();
            }
        });
    }, []);

    const displayName = userContext ?
        `${userContext.firstName} ${userContext.lastName}` : 'Josh Doe';

    return (
        <div className="portfolio-container">
            <h2>Portfolio</h2>
            <h3>Welcome, { displayName }</h3>
            <perspective-viewer ref={viewer} id="perspective"></perspective-viewer>
        </div>
    )
};
export default Portfolio;
