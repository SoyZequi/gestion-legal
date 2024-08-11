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
                <p><strong>Ubicación:</strong> ${c.location}</p>
            </div>
        `).join('');

        cases.forEach(c => {
            L.marker([c.lat, c.lng]).addTo(map)
                .bindPopup(`<b>${c.name}</b><br>${c.description}<br><strong>Ubicación:</strong> ${c.location}`);
        });
    }

    const caseForm = document.getElementById('caseForm');
    const caseList = document.getElementById('caseList');

    let currentMarker = null;

    map.on('click', async function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        currentMarker = L.marker([lat, lng]).addTo(map);

        // Obtener nombre de ubicación usando geocodificación inversa
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await response.json();
        const locationName = data.display_name || "Ubicación desconocida";

        document.getElementById('caseLocation').value = locationName;

        currentMarker.bindPopup(`<b>Ubicación</b><br>${locationName}`).openPopup();
    });

    caseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const caseName = document.getElementById('caseName').value;
        const caseDescription = document.getElementById('caseDescription').value;
        const caseLocation = document.getElementById('caseLocation').value;

        const response = await fetch('/cases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: caseName,
                description: caseDescription,
                location: caseLocation,
                // lat y lng no se envían, solo location
            }),
        });

        if (response.ok) {
            alert('Caso registrado con éxito');
            fetchCases();
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            caseForm.reset();
        } else {
            alert('Error al registrar el caso');
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

