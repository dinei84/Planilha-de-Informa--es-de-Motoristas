import { db } from './firebase.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

let drivers = [];
let editIndex = null;

// Funções para manipular dados no Firestore
async function addDriver(driver, phone, owner) {
    try {
        const docRef = await addDoc(collection(db, "drivers"), {
            driver,
            phone,
            owner
        });
        console.log("Documento escrito com ID:", docRef.id);
        getDrivers(); // Atualizar a tabela após adicionar um novo motorista
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('table-container').style.display = 'block';
        document.getElementById('driverForm').reset(); // Limpar o formulário
    } catch (error) {
        console.error("Erro ao adicionar documento:", error);
    }
}

async function getDrivers() {
    const querySnapshot = await getDocs(collection(db, "drivers"));
    drivers = []; // Limpar array antes de buscar novos dados
    querySnapshot.forEach((doc) => {
        drivers.push({
            id: doc.id,
            ...doc.data() // Obter todos os campos do documento
        });
    });
    sortAndRenderTable(); // Atualizar a tabela com os dados recuperados
}

async function editDriver(index, updatedDriver) {
    try {
        const driverRef = doc(db, "drivers", drivers[index].id);
        await updateDoc(driverRef, updatedDriver);
        getDrivers();
        console.log("Motorista atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao editar motorista:", error);
    }
}

async function deleteDriver(index) {
    try {
        const driverRef = doc(db, "drivers", drivers[index].id);
        await deleteDoc(driverRef);
        drivers.splice(index, 1); // Remover o motorista do array
        sortAndRenderTable();
        console.log("Motorista excluído com sucesso!");
    } catch (error) {
        console.error("Erro ao excluir motorista:", error);
    }
}

// Funções para gerenciar a interface do usuário
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
    tableBody.innerHTML = ''; // Limpar o corpo da tabela antes de renderizar

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
        editButton.addEventListener('click', () => startEditDriver(index));
        actionsCell.appendChild(editButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Apagar';
        deleteButton.addEventListener('click', () => deleteDriver(index));
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });
}

function startEditDriver(index) {
    editIndex = index;
    const driverData = drivers[index];
    document.getElementById('driver').value = driverData.driver;
    document.getElementById('phone').value = driverData.phone;
    document.getElementById('owner').value = driverData.owner;
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('table-container').style.display = 'none';
}

// Event listeners
document.getElementById('submitBtn').addEventListener('click', function() {
    const driver = document.getElementById('driver').value;
    const phone = document.getElementById('phone').value;
    const owner = document.getElementById('owner').value;

    if (driver && phone && owner) {
        if (editIndex !== null) {
            const updatedDriver = { driver, phone, owner };
            editDriver(editIndex, updatedDriver);
            editIndex = null;
        } else {
            addDriver(driver, phone, owner);
        }
        document.getElementById('driverForm').reset();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

document.getElementById('viewListBtn').addEventListener('click', function() {
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('table-container').style.display = 'block';
    getDrivers(); // Buscar e mostrar os motoristas ao clicar no botão
});

document.getElementById('backBtn').addEventListener('click', function() {
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('table-container').style.display = 'none';
});

document.getElementById('clearBtn').addEventListener('click', function() {
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

document.getElementById('downloadBtn').addEventListener('click', function() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(drivers);
    XLSX.utils.book_append_sheet(wb, ws, "Motoristas");
    XLSX.writeFile(wb, 'motoristas.xlsx');
});
