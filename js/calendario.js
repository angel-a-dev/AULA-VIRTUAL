/* ARCHIVO: js/calendario.js */

document.addEventListener('DOMContentLoaded', () => {
    protegerRuta();
    const usuarioActual = obtenerUsuarioActivo();
    if(!usuarioActual) return;

    // Header
    document.getElementById('header-user-name').textContent = usuarioActual.nombre;
    document.getElementById('header-user-role').textContent = usuarioActual.rol;
    if (usuarioActual.foto) document.getElementById('header-user-avatar').src = usuarioActual.foto;

    // Mostrar botón de crear evento solo a Admin y Profesores
    if (usuarioActual.rol === 'admin' || usuarioActual.rol === 'profesor') {
        document.getElementById('btnNuevoEvento').style.display = 'block';
    }

    // Inicializamos datos vacíos si no existen
    if (!localStorage.getItem('eventos')) {
        guardarDatos('eventos', []);
    }

    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth(); // 0 a 11
    const añoActual = fechaActual.getFullYear();

    const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    document.getElementById('mesAñoTexto').textContent = `${mesesNombres[mesActual]} ${añoActual}`;

    renderizarCalendario(mesActual, añoActual);

    // LOGICA: GUARDAR EVENTO
    const formEvento = document.getElementById('formEvento');
    if (formEvento) {
        formEvento.addEventListener('submit', (e) => {
            e.preventDefault();
            const fecha = document.getElementById('eventoFecha').value; // Formato YYYY-MM-DD
            const titulo = document.getElementById('eventoTitulo').value;
            const tipo = document.getElementById('eventoTipo').value;

            const eventosDB = obtenerDatos('eventos') || [];
            
            eventosDB.push({
                id: generarID('EVT'),
                creadorId: usuarioActual.id,
                fecha: fecha,
                titulo: titulo,
                tipo: tipo
            });

            guardarDatos('eventos', eventosDB);
            cerrarModalEvento();
            renderizarCalendario(mesActual, añoActual); // Recargamos para ver el nuevo evento
        });
    }
});

function renderizarCalendario(mes, año) {
    const grid = document.getElementById('calendarGrid');
    const eventosDB = obtenerDatos('eventos') || [];
    
    // Obtenemos el primer día del mes (para saber en qué casilla empezar)
    const primerDia = new Date(año, mes, 1).getDay();
    // Obtenemos cuántos días tiene el mes
    const diasEnMes = new Date(año, mes + 1, 0).getDate();

    // Limpiamos las celdas de días anteriores (conservando las 7 cabeceras)
    const cabeceras = `
        <div class="calendar-header-day">Dom</div>
        <div class="calendar-header-day">Lun</div>
        <div class="calendar-header-day">Mar</div>
        <div class="calendar-header-day">Mié</div>
        <div class="calendar-header-day">Jue</div>
        <div class="calendar-header-day">Vie</div>
        <div class="calendar-header-day">Sáb</div>
    `;
    let diasHTML = cabeceras;

    // 1. Cajas vacías antes del primer día del mes
    for (let i = 0; i < primerDia; i++) {
        diasHTML += `<div class="calendar-day empty"></div>`;
    }

    // 2. Cajas para los días reales del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        // Formateamos la fecha a YYYY-MM-DD para buscar eventos coincidentes
        // padStart(2, '0') asegura que el día 5 se escriba como "05"
        const fechaFormateada = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        
        // Buscamos los eventos de este día en específico
        const eventosDelDia = eventosDB.filter(e => e.fecha === fechaFormateada);
        let eventosHTML = '';

        eventosDelDia.forEach(evento => {
            eventosHTML += `<div class="event-badge event-${evento.tipo}" title="${evento.titulo}">${evento.titulo}</div>`;
        });

        diasHTML += `
            <div class="calendar-day">
                <span class="day-number">${dia}</span>
                ${eventosHTML}
            </div>
        `;
    }

    grid.innerHTML = diasHTML;
}

function abrirModalEvento() {
    document.getElementById('modalEvento').style.display = 'flex';
}

function cerrarModalEvento() {
    document.getElementById('modalEvento').style.display = 'none';
    document.getElementById('formEvento').reset();
}