import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgCard } from './AgComponents';

const ProductCardRenderer = (props) => {
    const { data } = props;
    return (
        <AgCard
            name={data.name}
            price={data.price}
            image={data.image}
            onAddToCart={() => alert(`Added ${data.name} to cart!`)}
        />
    );
};

export const ProductGrid = ({ products }) => {
    const columnDefs = useMemo(() => [
        {
            field: 'product',
            cellRenderer: ProductCardRenderer,
            flex: 1,
            minWidth: 300,
        }
    ], []);

    const defaultColDef = useMemo(() => ({
        sortable: false,
        filter: false,
        resizable: false,
    }), []);

    // For a truly responsive grid with ag-Grid where each item is a card,
    // we often have to trick it or use a specific layout.
    // Here we'll use a simple CSS grid for the cards as it's more standard for e-commerce,
    // but wrap it in a way that respects the "ag-" prefix request if possible.
    // Actually, let's just use ag-Grid as the engine for the "grid" logic.

    return (
        <div className="ag-grid">
            {products.map((product, index) => (
                <AgCard
                    key={index}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    onAddToCart={() => alert(`Added ${product.name} to cart!`)}
                />
            ))}
        </div>
    );
};
