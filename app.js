document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo
    const users = {
        'Jason2311': 'Elmasterrealpe!',
        'Jota234': 'Elmasterreal23!',
        'Jota345': 'Elmasterreal23!'
    };

    let currentUser = null;
    let editIndex = null; // Índice del cliente a editar
    let clients = []; // Inicialmente vacío, se cargará desde la API

    // Elementos del DOM
    const loginSection = document.getElementById('login-section');
    const controlPanel = document.getElementById('control-panel');
    const enterClientSection = document.getElementById('enter-client-section');
    const viewScheduledSection = document.getElementById('view-scheduled-section');
    const clientDetailSection = document.getElementById('client-detail-section');

    const loginForm = document.getElementById('login-form');
    const clientForm = document.getElementById('client-form');
    const btnBack = document.getElementById('btn-back');
    const btnBackView = document.getElementById('btn-back-view');
    const btnBackDetail = document.getElementById('btn-back-detail');

    const btnEnterClient = document.getElementById('btn-enter-client');
    const btnViewScheduled = document.getElementById('btn-view-scheduled');
    const btnLogout = document.getElementById('btn-logout');

    const clientList = document.getElementById('client-list');
    const clientDetails = document.getElementById('client-details');

    // Funciones
    const showSection = (section) => {
        loginSection.classList.add('hidden');
        controlPanel.classList.add('hidden');
        enterClientSection.classList.add('hidden');
        viewScheduledSection.classList.add('hidden');
        clientDetailSection.classList.add('hidden');
        section.classList.remove('hidden');
    };

    const hideSection = (section) => {
        section.classList.add('hidden');
    };

    const authenticateUser = (username, password) => {
        return users[username] === password;
    };

    const checkDuplicateDocument = (docNumber) => {
        return clients.some(client => client.docNumber === docNumber && client !== clients[editIndex]);
    };

    // Función para guardar datos del cliente
    const saveClientData = async (data) => {
        try {
            const response = await fetch('http://localhost:3000/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Error al guardar los datos del cliente');
            }
            alert('Cliente guardado con éxito');
            updateClientList();
        } catch (error) {
            console.error(error);
            alert('No se pudo guardar el cliente');
        }
    };

    // Función para actualizar la lista de clientes
    const updateClientList = async () => {
        try {
            const response = await fetch('http://localhost:3000/clients');
            const clientsData = await response.json();
            clients = clientsData; // Actualiza el array de clientes
            clientList.innerHTML = '';
            clients.forEach((client, index) => {
                const clientDiv = document.createElement('div');
                clientDiv.classList.add('client');
                clientDiv.innerHTML = `
                    <p><strong>${client.name}</strong></p>
                    <p>Documento: ${client.docNumber}</p>
                    <p>Plan: ${client.plan}</p>
                    <p>Hora de Liberación: ${client.releaseTime}</p>
                    <button class="whatsapp" onclick="sendWhatsapp('${client.phone}')">WhatsApp</button>
                    <button class="secondary" onclick="editClient(${index})">Editar</button>
                    ${currentUser === 'Jason2311' ? `<button class="danger" onclick="deleteClient(${index})">Eliminar</button>` : ''}
                    <button class="info" onclick="viewDetails(${index})">Ver Detalle</button>
                `;
                clientList.appendChild(clientDiv);
            });
        } catch (error) {
            console.error(error);
            alert('No se pudo actualizar la lista de clientes');
        }
    };

    const calculateReleaseTime = (crmStatusTime) => {
        const crmDate = new Date(crmStatusTime);
        crmDate.setHours(crmDate.getHours() + 72);
        return crmDate.toISOString().slice(0, 16);
    };

    window.sendWhatsapp = (phone) => {
        window.open(`https://wa.me/51${phone}`);
    };

    window.viewDetails = (index) => {
        const client = clients[index];
        clientDetails.innerHTML = `
            <p><strong>Nombre Completo:</strong> ${client.name}</p>
            <p><strong>Tipo de Documento:</strong> ${client.docType}</p>
            <p><strong>Número de Documento:</strong> ${client.docNumber}</p>
            <p><strong>Dirección:</strong> ${client.address}</p>
            <p><strong>Distrito:</strong> ${client.district}</p>
            <p><strong>Teléfono:</strong> ${client.phone}</p>
            <p><strong>Correo:</strong> ${client.email}</p>
            <p><strong>Plan:</strong> ${client.plan}</p>
            <p><strong>Último Estado de CRM:</strong> ${client.crmStatus}</p>
            <p><strong>Horario de Liberación:</strong> ${client.releaseTime}</p>
            <p><strong>Observaciones:</strong> ${client.observations}</p>
            <p><strong>Estado de Pedido:</strong> ${client.orderStatus}</p>
        `;
        showSection(clientDetailSection);
    };

    window.editClient = (index) => {
        const client = clients[index];
        editIndex = index; // Establece índice de edición
        document.getElementById('name').value = client.name;
        document.getElementById('doc-type').value = client.docType;
        document.getElementById('doc-number').value = client.docNumber;
        document.getElementById('address').value = client.address;
        document.getElementById('district').value = client.district;
        document.getElementById('phone').value = client.phone;
        document.getElementById('email').value = client.email;
        document.getElementById('plan').value = client.plan;
        document.getElementById('crm-status').value = client.crmStatus;
        document.getElementById('release-time').value = client.releaseTime;
        document.getElementById('observations').value = client.observations;
        document.getElementById('order-status').value = client.orderStatus;
        hideSection(viewScheduledSection);
        showSection(enterClientSection);
    };

    window.deleteClient = async (index) => {
        try {
            const response = await fetch(`http://localhost:3000/clients/${clients[index].id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el cliente');
            }
            alert('Cliente eliminado con éxito');
            updateClientList();
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el cliente');
        }
    };

    // Eventos
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (authenticateUser(username, password)) {
            currentUser = username;
            loginSection.classList.add('hidden');
            controlPanel.classList.remove('hidden');
            updateClientList(); // Actualiza la lista de clientes al iniciar sesión
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    });

    clientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const docType = document.getElementById('doc-type').value;
        const docNumber = document.getElementById('doc-number').value;
        const address = document.getElementById('address').value;
        const district = document.getElementById('district').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const plan = document.getElementById('plan').value;
        const crmStatus = document.getElementById('crm-status').value;
        const releaseTime = calculateReleaseTime(new Date().toISOString());
        const observations = document.getElementById('observations').value;
        const orderStatus = document.getElementById('order-status').value;

        if (checkDuplicateDocument(docNumber)) {
            alert('El número de documento ya existe en la base de datos. Intente con otro número.');
            return;
        }

        const clientData = { name, docType, docNumber, address, district, phone, email, plan, crmStatus, releaseTime, observations, orderStatus };
        await saveClientData(clientData);
        hideSection(enterClientSection);
    });

    btnBack.addEventListener('click', () => {
        hideSection(enterClientSection);
        showSection(viewScheduledSection);
    });

    btnBackView.addEventListener('click', () => {
        hideSection(viewScheduledSection);
        showSection(controlPanel);
    });

    btnBackDetail.addEventListener('click', () => {
        hideSection(clientDetailSection);
        showSection(viewScheduledSection);
    });

    btnEnterClient.addEventListener('click', () => {
        hideSection(viewScheduledSection);
        showSection(enterClientSection);
    });

    btnViewScheduled.addEventListener('click', () => {
        hideSection(controlPanel);
        showSection(viewScheduledSection);
    });

    btnLogout.addEventListener('click', () => {
        currentUser = null;
        loginSection.classList.remove('hidden');
        controlPanel.classList.add('hidden');
    });
});
