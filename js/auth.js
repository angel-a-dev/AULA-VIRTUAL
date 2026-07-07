/*
 * ARCHIVO: js/auth.js
 * QUÉ HACE: Maneja los eventos de los formularios de login y registro.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializamos la base de datos si no existe
    initStorage();

    // ==========================================
    // LÓGICA DE INICIO DE SESIÓN (LOGIN)
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    const mostrarPasswordCheckbox = document.getElementById('mostrarPassword');
    const passwordInput = document.getElementById('password');

    if (mostrarPasswordCheckbox && passwordInput) {
        mostrarPasswordCheckbox.addEventListener('change', function() {
            passwordInput.type = this.checked ? 'text' : 'password';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(evento) {
            evento.preventDefault(); 

            const correo = document.getElementById('correo').value;
            const password = document.getElementById('password').value;
            const recordar = document.getElementById('recordar').checked;
            const mensajeError = document.getElementById('mensajeError');

            const usuariosDB = obtenerDatos('usuarios');
            const usuarioEncontrado = usuariosDB.find(u => u.correo === correo && u.password === password);

            if (usuarioEncontrado) {
                iniciarSesion(usuarioEncontrado, recordar);
                window.location.href = 'dashboard.html'; 
            } else {
                mensajeError.style.display = 'block';
            }
        });
    }

    // ==========================================
    // LÓGICA DE REGISTRO
    // ==========================================
    const registroForm = document.getElementById('registroForm');

    if (registroForm) {
        registroForm.addEventListener('submit', function(evento) {
            evento.preventDefault(); 

            const nombre = document.getElementById('regNombre').value;
            const codigo = document.getElementById('regCodigo').value;
            const correo = document.getElementById('regCorreo').value;
            const password = document.getElementById('regPassword').value;
            const confirmarPassword = document.getElementById('regConfirmarPassword').value;
            
            const mensajeError = document.getElementById('mensajeErrorReg');
            const mensajeExito = document.getElementById('mensajeExitoReg');

            // Validar contraseñas
            if (password !== confirmarPassword) {
                mensajeError.textContent = "Las contraseñas no coinciden.";
                mensajeError.style.display = 'block';
                return;
            }

            const usuariosDB = obtenerDatos('usuarios');

            // Validar si el correo existe
            const existeCorreo = usuariosDB.some(u => u.correo === correo);
            if (existeCorreo) {
                mensajeError.textContent = "Este correo ya está registrado.";
                mensajeError.style.display = 'block';
                return;
            }

            // Crear nuevo alumno
            const nuevoUsuario = {
                id: generarID('USR'), 
                nombre: nombre,
                correo: correo,
                password: password,
                rol: 'alumno', 
                codigoUniversitario: codigo,
                carrera: "Ingeniería de Sistemas",
                foto: "assets/img/default-alumno.png"
            };

            // Guardar
            usuariosDB.push(nuevoUsuario);
            guardarDatos('usuarios', usuariosDB);

            // Éxito y redirección
            mensajeError.style.display = 'none';
            mensajeExito.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
});