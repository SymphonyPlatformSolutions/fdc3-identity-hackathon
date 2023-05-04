import { useEffect, useState } from 'react';
import './Portfolio.css';

const randomPosition = () => Math.floor(Math.random() * 10000);

const Trades = () => {
    const data = [];

    for (let i=0; i < Math.floor(Math.random() * 177); i++) {
        data.push({
            date: new Date(new Date().getTime() - Math.floor(Math.random() * 1000000000)),
            side: (Math.random() > 0.5 ? 'Buy' : 'Sell'),
            quantity: randomPosition(),
            price: (0.01 * randomPosition()).toFixed(2),
            status: (Math.random() > 0.1 ? 'Filled' : 'Pending'),
        })
    };

    return (
        <table>
            <tr>
                <th>Date</th>
                <th>Side</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
            </tr>
            { data.map(({ date, side, quantity, price, status }) => (
                <tr>
                    <td>{date.toLocaleString()}</td>
                    <td>{side}</td>
                    <td>{quantity}</td>
                    <td>{price}</td>
                    <td>{status}</td>
                </tr>
            ))}
        </table>
    );
};

const Transactions = () => {
    const [ context, setContext ] = useState();
    const [ displayName, setDisplayName ] = useState();

    useEffect(() => {
        fdc3.addIntentListener('ViewChart', (c) => {
            setContext(c);
            const { firstName, lastName } = c.userContext.context;
            setDisplayName(`${firstName} ${lastName}`);
            console.log('Received intent', c);
        });
    }, []);

    return !context ? 'Loading...' : (
        <div className="portfolio-container">
            <h2>Transactions</h2>
            <h3>Welcome, {displayName}</h3>
            <h4>Trades for {context.id.ticker}: {context.name}</h4>
            <Trades />
        </div>
    );
};
export default Transactions;
