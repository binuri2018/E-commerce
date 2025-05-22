import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./AllCarts.css"; // Import the new CSS file
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../Assets/logo.png'; // Import the logo

const AllCarts = () => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        axios.get("http://localhost:5000/api/cart")
            .then(response => {
                setCarts(response.data);
                setLoading(false); // Set loading to false after fetching
            })
            .catch(error => {
                console.error("Error fetching all carts:", error);
                setLoading(false); // Set loading to false on error
            });
    }, []);

    // Filter carts based on search query
    const filteredCarts = carts.filter(cart =>
        cart.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cart.items.some(item =>
            item.productId?.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const generateReport = () => {
        const doc = new jsPDF();

        const themeColor = [85, 17, 51]; // #551133 in RGB

        // Add colored background for logo
        doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F'); // Draw a filled rectangle across the top

        // Add Logo on top of the background
        const imgData = logo;
        doc.addImage(imgData, 'PNG', 15, 5, 50, 30); // Increased width to 50 and adjusted position

        // Add title below the colored background
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255); // White text for title on dark background (or keep themeColor if preferred)
        doc.text('All Customer Carts Report', 105, 30, { align: 'center' }); // Adjust position below background

        // Reset text color for table content if necessary (autoTable handles its own styles)
        doc.setTextColor(0, 0, 0); // Black text for general content

        // Add cart data as a table
        const tableColumn = ["Cart ID", "Customer ID", "Items", "Subtotal"];
        const tableRows = [];

        filteredCarts.forEach(cart => {
            const cartItems = cart.items.map(item => 
                `${item.productId?.name || 'N/A'} (Qty: ${item.quantity}, Price: Rs.${item.price})`
            ).join('\n'); // Join items with newline

            const cartData = [
                cart._id,
                cart.customerId,
                cartItems,
                `Rs.${cart.subtotal}`,
            ];
            tableRows.push(cartData);
        });

        doc.autoTable(tableColumn, tableRows, {
            startY: 50, // Adjust start position below title
            headStyles: { fillColor: themeColor, fontStyle: 'bold' }, // Apply theme color to table header, make font bold
            bodyStyles: { fontSize: 10 }, // Smaller font size for body content
            alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray for alternate rows
            styles: { cellPadding: 3 }, // Add cell padding
            columnStyles: { // Specific column styles if needed
                 0: { cellWidth: 20 }, // Adjust width for Cart ID
                 1: { cellWidth: 30 }, // Adjust width for Customer ID
                 3: { cellWidth: 25, halign: 'right' } // Example: set width and right align for Subtotal column
            }
        });

        // Save the PDF
        doc.save('all-carts-report.pdf');
    };

    return (
        <div className="all-carts-container">
            <h2>All Customer Carts</h2>

            {/* Search Input */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Customer ID or Item Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Generate Report Button */}
            <button onClick={generateReport} className="generate-report-button">
                Generate Report
            </button>

            {loading ? (
                <div className="loading-message">Loading carts...</div>
            ) : filteredCarts.length === 0 ? (
                <div className="empty-carts-message">No carts found matching your search.</div>
            ) : (
                <div className="carts-list">
                    {filteredCarts.map(cart => (
                        <div key={cart._id} className="cart-card">
                            <div className="cart-card-header">
                                <h3>Cart ID: {cart._id}</h3>
                                <p>Customer ID: {cart.customerId}</p>
                            </div>
                            <div className="cart-card-body">
                                <h4>Items:</h4>
                                <ul className="cart-items-list">
                                    {cart.items.map(item => (
                                        <li key={item.productId?._id || item._id} className="cart-item">
                                            <span>{item.productId?.name ? item.productId.name : "Item name not available"}</span>
                                            <span>Quantity: {item.quantity}</span>
                                            <span>Price: Rs.{item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="cart-card-footer">
                                <h4>Subtotal: Rs.{cart.subtotal}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllCarts;