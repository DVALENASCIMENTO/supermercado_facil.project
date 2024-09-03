document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const addRowButton = document.getElementById('add-row');
    const savePdfButton = document.getElementById('save-pdf');
    const grandTotalElement = document.getElementById('grand-total');
    const dateElement = document.getElementById('current-date');
    const storageKey = 'supermercadoFacil';

    // Adiciona a data atual
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    dateElement.textContent = `Data: ${formattedDate}`;

    // Carregar os dados do Local Storage ao iniciar
    loadTableData();

    addRowButton.addEventListener('click', () => {
        addRow();
        saveTableData();
    });

    savePdfButton.addEventListener('click', saveAsPDF);

    function addRow(item = '', quantity = 1, price = 0.00, total = 0.00) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="text" class="item" value="${item}" placeholder="Nome do Produto"></td>
            <td><input type="number" class="quantity" value="${quantity}" min="1" style="width: 50px;"></td>
            <td><input type="number" class="price" value="${price.toFixed(2)}" min="0" step="0.01" style="width: 80px;"></td>
            <td>R$ <span class="total">${total.toFixed(2)}</span></td>
            <td class="action-buttons">
                <button class="remove-row">X</button>
                <button class="check-row"></button>
            </td>
        `;

        tableBody.appendChild(row);

        const quantityInput = row.querySelector('.quantity');
        const priceInput = row.querySelector('.price');
        const totalElement = row.querySelector('.total');
        const removeButton = row.querySelector('.remove-row');
        const checkButton = row.querySelector('.check-row');

        quantityInput.addEventListener('input', updateRowTotal);
        priceInput.addEventListener('input', updateRowTotal);
        removeButton.addEventListener('click', () => {
            row.remove();
            saveTableData();
            updateGrandTotal();
        });
        checkButton.addEventListener('click', () => {
            row.classList.toggle('checked');
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
            const total = parseFloat(row.querySelector('.total').textContent.replace('R$ ', ''));
            grandTotal += total;
        });
        grandTotalElement.textContent = grandTotal.toFixed(2);
    }

    function saveTableData() {
        const tableData = [];
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const item = row.querySelector('.item').value;
            const quantity = row.querySelector('.quantity').value;
            const price = row.querySelector('.price').value;
            const total = row.querySelector('.total').textContent;
            const checked = row.classList.contains('checked');
            tableData.push({ item, quantity, price, total, checked });
        });
        localStorage.setItem(storageKey, JSON.stringify(tableData));
    }

    function loadTableData() {
        const tableData = JSON.parse(localStorage.getItem(storageKey)) || [];
        tableData.forEach(rowData => {
            addRow(rowData.item, rowData.quantity, parseFloat(rowData.price), parseFloat(rowData.total));
            const row = tableBody.lastChild;
            if (rowData.checked) {
                row.classList.add('checked');
            }
        });
        updateGrandTotal();
    }

    function saveAsPDF() {
        const element = document.querySelector('.container');
        const opt = {
            margin: 0.5,
            filename: `supermercado_facil_${formattedDate}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        if (typeof html2pdf !== 'undefined') {
            console.log('html2pdf está definido.');
            html2pdf().from(element).set(opt).save().then(() => {
                console.log('PDF gerado com sucesso!');
            }).catch(err => {
                console.error('Erro ao gerar PDF:', err);
            });
        } else {
            console.error('html2pdf não está definido. Verifique o carregamento da biblioteca.');
        }
    }
});
