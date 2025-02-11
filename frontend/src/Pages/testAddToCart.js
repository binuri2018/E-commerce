const testAddToCart = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/cart/test', {
            customerId: 'dummyCustomerId',
            productId: 'dummyProductId',
            quantity: 1,
            price: 100,
        });
        console.log('Test success:', response.data);
    } catch (error) {
        console.error('Test failed:', error);
    }
};
