let drivers = [];
let editIndex = null;

document.getElementById('submitBtn').addEventListener('click', function() {
    const driver = document.getElementById('driver').value;
    const phone = document.getElementById('phone').value;
    const owner = document.getElementById('owner').value;

    if (driver && phone && owner) {
        if (editIndex !== null) {
            drivers[editIndex] = { driver, phone, owner };
            editIndex = null;
        } else {
            drivers.push({ driver, phone, owner });
        }
        sortAndRenderTable();
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('table-container').style.display = 'block';
        document.getElementById('driverForm').reset();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

document.getElementById('viewListBtn').addEventListener('click', function() {
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('table-container').style.display = 'block';
});

document.getElementById('backBtn').addEventListener('click', function() {
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('table-container').style.display = 'none';
});

document.getElementById('clearBtn').addEventListener('click',function(){
    document.getElementById('driver').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('owner').value = '';
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
    document.getElementById('driver').value = driverData.driver;
    document.getElementById('phone').value = driverData.phone;
    document.getElementById('owner').value = driverData.owner;
    editIndex = index;
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('table-container').style.display = 'none';
}

function deleteDriver(index) {
    drivers.splice(index, 1);
    sortAndRenderTable();
}
