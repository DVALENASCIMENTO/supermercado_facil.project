document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const addRowButton = document.getElementById('add-row');
    const grandTotalElement = document.getElementById('grand-total');

    // Carregar os dados do Local Storage ao iniciar
    loadTableData();

    addRowButton.addEventListener('click', () => {
        addRow();
        saveTableData();
    });

    function addRow(item = '', quantity = 1, price = 0.00, total = 0.00) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="text" class="item" value="${item}" placeholder="Nome do Produto"></td>
            <td><input type="number" class="quantity" value="${quantity}" min="1"></td>
            <td><input type="number" class="price" value="${price.toFixed(2)}" min="0" step="0.01"></td>
            <td>R$ <span class="total">${total.toFixed(2)}</span></td>
            <td><button class="remove-row">Remover</button></td>
        `;

        tableBody.appendChild(row);

        const quantityInput = row.querySelector('.quantity');
        const priceInput = row.querySelector('.price');
        const totalElement = row.querySelector('.total');
        const removeButton = row.querySelector('.remove-row');

        quantityInput.addEventListener('input', updateRowTotal);
        priceInput.addEventListener('input', updateRowTotal);
        removeButton.addEventListener('click', () => {
            row.remove();
            saveTableData();
            updateGrandTotal();
        });

        function updateRowTotal() {
            const quantity = parseFloat(quantityInput.value);
            const price = parseFloat(priceInput.value);
            const total = quantity * price;
            totalElement.textContent = total.toFixed(2);
            updateGrandTotal();
            saveTableData();
        }

        updateRowTotal();
    }

    function updateGrandTotal() {
        let grandTotal = 0;
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const total = parseFloat(row.querySelector('.total').textContent);
            grandTotal += total;
        });
        grandTotalElement.textContent = grandTotal.toFixed(2);
    }

    function saveTableData() {
        const tableData = [];
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const item = row.querySelector('.item').value;
            const quantity = parseFloat(row.querySelector('.quantity').value);
            const price = parseFloat(row.querySelector('.price').value);
            const total = parseFloat(row.querySelector('.total').textContent);
            tableData.push({ item, quantity, price, total });
        });
        localStorage.setItem('tableData', JSON.stringify(tableData));
    }

    function loadTableData() {
        const tableData = JSON.parse(localStorage.getItem('tableData')) || [];
        tableData.forEach(data => {
            addRow(data.item, data.quantity, data.price, data.total);
        });
        updateGrandTotal();
    }
});
