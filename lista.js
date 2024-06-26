let drivers = JSON.parse(localStorage.getItem('drivers')) || [];

document.addEventListener('DOMContentLoaded', function() {
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

    driversToRender.forEach((driverData, index) => {
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
        editButton.addEventListener('click', () => editDriver(index));
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Apagar';
        deleteButton.addEventListener('click', () => deleteDriver(index));
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

function editDriver(index) {
    const driverData = drivers[index];
    localStorage.setItem('editIndex', index);
    window.location.href = 'index.html';
}

function deleteDriver(index) {
    drivers.splice(index, 1);
    localStorage.setItem('drivers', JSON.stringify(drivers));
    sortAndRenderTable();
}
