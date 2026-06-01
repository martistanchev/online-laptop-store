document.addEventListener("DOMContentLoaded", function() {
    loadAdminData();
});

function loadAdminData() {
    fetch('/api/admin/data')
        .then(res => res.json())
        .then(data => {
            
            const productsBody = document.getElementById('products-body');
            productsBody.innerHTML = '';
            data.laptops.forEach(laptop => {
                productsBody.innerHTML += `
                    <tr>
                        <td>${laptop._id}</td>
                        <td>${laptop.title}</td>
                        <td>€${laptop.price.toFixed(2)}</td>
                        <td><strong>${laptop.purchaseCount}</strong></td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editPrice('${laptop._id}', ${laptop.price})">Edit Price</button>
                            <button class="action-btn" onclick="deleteLaptop('${laptop._id}')">Delete</button>
                        </td>
                    </tr>
                `;
            });

            const ordersBody = document.getElementById('orders-body');
            ordersBody.innerHTML = '';
            data.purchases.forEach(order => {
                const date = new Date(order.purchaseDate).toLocaleString();
                ordersBody.innerHTML += `
                    <tr>
                        <td>${order.customerName}</td>
                        <td>${order.customerAddress}</td>
                        <td>Laptop ${order.laptopId}</td>
                        <td>${date}</td>
                    </tr>
                `;
            });
        });
}

function editPrice(id, currentPrice) {
    const newPrice = prompt("Enter new price for this laptop in Euros:", currentPrice);
    if (newPrice && !isNaN(newPrice)) {
        fetch(`/api/laptops/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: Number(newPrice) })
        }).then(() => {
            alert("Price updated in MongoDB!");
            loadAdminData();
        });
    }
}

function deleteLaptop(id) {
    if (confirm("Are you sure you want to delete this laptop from the database?")) {
        fetch(`/api/laptops/${id}`, { method: 'DELETE' })
            .then(() => {
                alert("Laptop deleted!");
                loadAdminData();
            });
    }
}