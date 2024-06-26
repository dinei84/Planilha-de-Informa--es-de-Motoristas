let drivers = JSON.parse(localStorage.getItem('drivers')) || [];
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
        localStorage.setItem('drivers', JSON.stringify(drivers));
        document.getElementById('driverForm').reset();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

document.getElementById('viewListBtn').addEventListener('click', function() {
    localStorage.setItem('drivers', JSON.stringify(drivers));
    window.location.href = 'lista.html';
});

document.getElementById('clearBtn').addEventListener('click', function() {
    document.getElementById('driver').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('owner').value = '';
});

document.addEventListener('DOMContentLoaded', function() {
    const editIndexStored = localStorage.getItem('editIndex');
    if (editIndexStored !== null) {
        const driverData = drivers[editIndexStored];
        document.getElementById('driver').value = driverData.driver;
        document.getElementById('phone').value = driverData.phone;
        document.getElementById('owner').value = driverData.owner;
        editIndex = editIndexStored;
        localStorage.removeItem('editIndex');
    }
});

// Máscara para o input de telefone
document.getElementById('phone').addEventListener('input', function(e) {
    const x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}`;
});
