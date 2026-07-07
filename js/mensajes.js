/* ARCHIVO: js/mensajes.js */

document.addEventListener('DOMContentLoaded', () => {
    protegerRuta();
    const usuarioActual = obtenerUsuarioActivo();
    if(!usuarioActual) return;

    // Pintar Header
    document.getElementById('header-user-name').textContent = usuarioActual.nombre;
    document.getElementById('header-user-role').textContent = usuarioActual.rol;
    if (usuarioActual.foto) document.getElementById('header-user-avatar').src = usuarioActual.foto;

    // 1. CARGAR LISTA DE CONTACTOS
    const usuariosDB = obtenerDatos('usuarios') || [];
    const listaContactos = document.getElementById('listaContactos');
    
    // Filtramos para que no aparezca el usuario actual en la lista (no puedes chatear contigo mismo)
    const contactos = usuariosDB.filter(u => u.id !== usuarioActual.id);
    let htmlContactos = '';

    contactos.forEach(contacto => {
        htmlContactos += `
            <li class="contact-item" onclick="abrirConversacion('${contacto.id}', '${contacto.nombre}', '${contacto.rol}', '${contacto.foto}')">
                <img src="${contacto.foto || 'assets/img/default-alumno.png'}" class="user-avatar" style="width: 35px; height: 35px;">
                <div>
                    <h5 style="font-size: 14px; color: var(--texto-principal);">${contacto.nombre}</h5>
                    <p style="font-size: 11px; color: var(--gris-texto); text-transform: capitalize;">${contacto.rol}</p>
                </div>
            </li>
        `;
    });
    
    listaContactos.innerHTML = htmlContactos;

    // 2. ENVIAR MENSAJE
    const formEnviarMensaje = document.getElementById('formEnviarMensaje');
    if(formEnviarMensaje) {
        formEnviarMensaje.addEventListener('submit', (e) => {
            e.preventDefault();
            const receptorId = document.getElementById('receptorId').value;
            const inputTexto = document.getElementById('inputMensaje');
            
            let mensajesDB = obtenerDatos('mensajes') || [];
            
            // Creamos el nuevo mensaje
            const nuevoMensaje = {
                id: generarID('MSG'),
                remitenteId: usuarioActual.id,
                receptorId: receptorId,
                texto: inputTexto.value,
                hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            mensajesDB.push(nuevoMensaje);
            guardarDatos('mensajes', mensajesDB);
            
            inputTexto.value = ''; // Limpiamos la caja de texto
            renderizarHistorial(receptorId); // Recargamos las burbujas
        });
    }
});

// ==========================================
// FUNCIONES GLOBALES DEL CHAT
// ==========================================

// Esta función se ejecuta al hacer clic en un contacto de la lista
function abrirConversacion(contactoId, nombre, rol, foto) {
    // Cambiamos la vista (ocultamos el div vacío y mostramos el chat)
    document.getElementById('chatVacio').style.display = 'none';
    document.getElementById('chatActivo').style.display = 'flex';
    
    // Pintamos los datos del contacto en la cabecera
    document.getElementById('chatNombre').textContent = nombre;
    document.getElementById('chatRol').textContent = rol;
    document.getElementById('chatAvatar').src = foto || 'assets/img/default-alumno.png';
    document.getElementById('receptorId').value = contactoId; // Guardamos a quién le vamos a enviar

    // Dibujamos los mensajes anteriores
    renderizarHistorial(contactoId);
}

function renderizarHistorial(contactoId) {
    const usuarioActual = obtenerUsuarioActivo();
    const mensajesDB = obtenerDatos('mensajes') || [];
    const historialContainer = document.getElementById('historialMensajes');

    // Filtramos SOLO los mensajes que sean entre el usuario logueado y el contacto seleccionado
    const mensajesConversacion = mensajesDB.filter(msg => 
        (msg.remitenteId === usuarioActual.id && msg.receptorId === contactoId) || 
        (msg.remitenteId === contactoId && msg.receptorId === usuarioActual.id)
    );

    let htmlBurbujas = '';

    mensajesConversacion.forEach(msg => {
        // Si yo lo envié, va a la derecha (msg-sent). Si me lo enviaron, va a la izquierda (msg-received).
        const tipoBurbuja = msg.remitenteId === usuarioActual.id ? 'msg-sent' : 'msg-received';
        
        htmlBurbujas += `
            <div class="msg-bubble ${tipoBurbuja}">
                ${msg.texto}
                <span class="msg-time">${msg.hora}</span>
            </div>
        `;
    });

    historialContainer.innerHTML = htmlBurbujas.length > 0 ? htmlBurbujas : '<p style="text-align:center; color:var(--gris-texto); font-size:12px; margin-top:20px;">No hay mensajes previos.</p>';
    
    // Auto-scroll para que el chat siempre baje al último mensaje
    historialContainer.scrollTop = historialContainer.scrollHeight;
}