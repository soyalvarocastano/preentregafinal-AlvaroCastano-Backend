const socket = io();

// Agregar logs para debug
console.log('Script realTimeProducts.js cargado');

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Formulario enviado');
    
    const formData = new FormData(e.target);
    const product = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        code: formData.get('code'),
        stock: Number(formData.get('stock')),
        category: formData.get('category'),
        status: true
    };

    console.log('Datos del producto a crear:', product);

    try {
        const response = await fetch('/api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear el producto');
        }

        const newProduct = await response.json();
        console.log('Producto creado:', newProduct);

        // Emitir evento al servidor
        socket.emit('productAdded', newProduct);
        
        // Limpiar formulario
        e.target.reset();
        
    } catch (error) {
        console.error('Error en la creación del producto:', error);
        alert(error.message);
    }
});

// Escuchar actualizaciones de productos
socket.on('updateProducts', (products) => {
    console.log('Productos actualizados recibidos:', products);
    const productList = document.getElementById('productList');
    
    const productsHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Código: ${product.code}</p>
            <p>Categoría: ${product.category}</p>
            <button onclick="deleteProduct(${product.id})" class="delete-btn">Eliminar</button>
        </div>
    `).join('');
    
    productList.innerHTML = productsHTML;
});

// Función para eliminar producto
async function deleteProduct(id) {
    console.log('Intentando eliminar producto:', id);
    try {
        const response = await fetch(`/api/product/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }

        console.log('Producto eliminado correctamente');
        socket.emit('productAdded');
        
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert(error.message);
    }
}

// Manejo de errores de socket
socket.on('error', error => {
    console.error('Socket error:', error)
    showNotification(error, 'error');
});