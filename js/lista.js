const db = firebase.firestore();
let drivers = [];

document.addEventListener('DOMContentLoaded', async function() {
    const querySnapshot = await db.collection('drivers').get();
    drivers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    sortAndRenderTable();

    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredDrivers = drivers.filter(driver => {
            return driver.driver.toLowerCase().includes(searchTerm) ||
                   driver.phone.toLowerCase().includes(searchTerm) ||
                   driver.owner.toLowerCase().includes(searchTerm);
        });
        renderTable(filteredDrivers);
    });

    document.getElementById('downloadBtn').addEventListener('click', function() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(drivers);
        XLSX.utils.book_append_sheet(wb, ws, "Motoristas");
        XLSX.writeFile(wb, 'motoristas.xlsx');
    });
});

function sortAndRenderTable() {
    drivers.sort((a, b) => {
        if (a.driver < b.driver) return -1;
        if (a.driver > b.driver) return 1;
        if (a.owner < b.owner) return -1;
        if (a.owner > b.owner) return 1;
        return 0;
    });
    renderTable(drivers);
}

function renderTable(driversToRender) {
    const tableBody = document.querySelector('#driversTable tbody');
    tableBody.innerHTML = '';

    driversToRender.forEach((driverData) => {
        const row = document.createElement('tr');

        const driverCell = document.createElement('td');
        driverCell.textContent = driverData.driver;
        row.appendChild(driverCell);

        const phoneCell = document.createElement('td');
        phoneCell.textContent = driverData.phone;
        row.appendChild(phoneCell);

        const ownerCell = document.createElement('td');
        ownerCell.textContent = driverData.owner;
        row.appendChild(ownerCell);

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'edit';
        editButton.addEventListener('click', () => editDriver(driverData.id));
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Apagar';
        deleteButton.addEventListener('click', () => deleteDriver(driverData.id));
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

async function editDriver(id) {
    localStorage.setItem('editIndex', id);
    window.location.href = 'index.html';
}

async function deleteDriver(id) {
    await db.collection('drivers').doc(id).delete();
    drivers = drivers.filter(driver => driver.id !== id);
    sortAndRenderTable();
}
