/* ARCHIVO: js/perfil.js */

document.addEventListener('DOMContentLoaded', () => {
    protegerRuta();
    const usuario = obtenerUsuarioActivo();
    if(!usuario) return;

    // 1. Activar botón de Cerrar Sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);

    // 2. Pintar los datos en la interfaz
    document.getElementById('perfilFoto').src = usuario.foto || 'assets/img/default-alumno.png';
    document.getElementById('perfilNombreCorto').textContent = usuario.nombre;
    
    const badgeRol = document.getElementById('perfilRolBadge');
    badgeRol.textContent = usuario.rol;
    badgeRol.classList.add(`badge-${usuario.rol}`);

    document.getElementById('perfilNombreCompleto').textContent = usuario.nombre;
    document.getElementById('perfilCorreo').textContent = usuario.correo;

    // 3. Mostrar campos exclusivos si es alumno
    if (usuario.rol === 'alumno') {
        document.getElementById('cajaCodigo').style.display = 'block';
        document.getElementById('cajaCarrera').style.display = 'block';
        document.getElementById('perfilCodigo').textContent = usuario.codigoUniversitario || 'No registrado';
        document.getElementById('perfilCarrera').textContent = usuario.carrera || 'Ingeniería de Sistemas';
    }

    // 4. Lógica para Cambiar Contraseña
    const formPassword = document.getElementById('formCambiarPassword');
    if(formPassword) {
        formPassword.addEventListener('submit', (e) => {
            e.preventDefault();
            const nuevaPassword = document.getElementById('nuevaPassword').value;
            const msg = document.getElementById('msgPassword');

            // Obtenemos todos los usuarios
            let usuariosDB = obtenerDatos('usuarios') || [];
            
            // Buscamos la posición (índice) del usuario actual en la base de datos
            const index = usuariosDB.findIndex(u => u.id === usuario.id);

            if(index !== -1) {
                // Actualizamos la contraseña
                usuariosDB[index].password = nuevaPassword;
                guardarDatos('usuarios', usuariosDB);
                
                // Actualizamos la sesión actual para que no se cierre por error de datos
                usuario.password = nuevaPassword;
                sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));
                if(localStorage.getItem('usuarioActivo')) {
                    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
                }

                // Feedback visual
                msg.textContent = "¡Contraseña actualizada con éxito!";
                msg.style.color = "var(--verde-exito)";
                msg.style.display = "block";
                
                // Limpiamos el formulario
                formPassword.reset();
                
                setTimeout(() => { msg.style.display = 'none'; }, 3000);
            }
        });
    }
});