document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    async function fetchCases() {
        const response = await fetch('/cases');
        const cases = await response.json();

        caseList.innerHTML = cases.map(c => `
            <div>
                <h3>${c.name}</h3>
                <p>${c.description}</p>
            </div>
        `).join('');

        cases.forEach(c => {
            L.marker([c.lat, c.lng]).addTo(map)
                .bindPopup(`<b>${c.name}</b><br>${c.description}`);
        });
    }

    const caseForm = document.getElementById('caseForm');
    const clientForm = document.getElementById('clientForm');
    const lawyerForm = document.getElementById('lawyerForm');
    const caseList = document.getElementById('caseList');

    caseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const caseName = document.getElementById('caseName').value;
        const caseDescription = document.getElementById('caseDescription').value;
        const caseLat = parseFloat(document.getElementById('caseLat').value);
        const caseLng = parseFloat(document.getElementById('caseLng').value);

        const response = await fetch('/cases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: caseName,
                description: caseDescription,
                lat: caseLat,
                lng: caseLng
            }),
        });

        if (response.ok) {
            alert('Caso registrado con éxito');
            fetchCases();
        } else {
            alert('Error al registrar el caso');
        }
    });

    clientForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const clientName = document.getElementById('clientName').value;
        const clientEmail = document.getElementById('clientEmail').value;

        const response = await fetch('/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: clientName,
                email: clientEmail,
            }),
        });

        if (response.ok) {
            alert('Cliente registrado con éxito');
        } else {
            alert('Error al registrar el cliente');
        }
    });

    lawyerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const lawyerName = document.getElementById('lawyerName').value;
        const lawyerSpecialty = document.getElementById('lawyerSpecialty').value;

        const response = await fetch('/lawyers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: lawyerName,
                specialty: lawyerSpecialty,
            }),
        });

        if (response.ok) {
            alert('Abogado registrado con éxito');
        } else {
            alert('Error al registrar el abogado');
        }
    });

    document.getElementById('shutdownButton').addEventListener('click', async () => {
        const response = await fetch('/shutdown');

        if (response.ok) {
            alert('La aplicación se está cerrando...');
            window.location.reload();
        } else {
            alert('Error al cerrar la aplicación');
        }
    });

    fetchCases();
});
