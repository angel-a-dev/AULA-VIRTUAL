/*
 * ARCHIVO: js/session.js
 * QUÉ HACE: Controla el estado de la sesión del usuario (quién está logueado).
 * PARA QUÉ SIRVE: Para proteger las páginas internas y saber qué Dashboard mostrar.
 * QUÉ FUNCIONES CONTIENE: iniciarSesion(), obtenerUsuarioActivo(), cerrarSesion(), protegerRuta().
 */

/**
 * FUNCIÓN: iniciarSesion()
 * QUÉ RECIBE: 'usuario' (Objeto con los datos del usuario) y 'recordar' (Booleano).
 * QUÉ DEVUELVE: Nada.
 * POR QUÉ EXISTE: Guarda los datos del usuario logueado. Si 'recordar' es true, usa LocalStorage 
 * (persiste al cerrar el navegador). Si es false, usa SessionStorage (se borra al cerrar la pestaña).
 * QUÉ PASARÍA SI SE ELIMINARA: El usuario iniciaría sesión, pero al cambiar de página, el sistema lo olvidaría.
 */
function iniciarSesion(usuario, recordar) {
    const datosSesion = JSON.stringify(usuario);
    if (recordar) {
        localStorage.setItem('usuarioActivo', datosSesion);
    } else {
        sessionStorage.setItem('usuarioActivo', datosSesion);
    }
}

/**
 * FUNCIÓN: obtenerUsuarioActivo()
 * QUÉ RECIBE: Nada.
 * QUÉ DEVUELVE: El objeto del usuario si está logueado, o null si no lo está.
 * POR QUÉ EXISTE: Permite a cualquier parte del sistema saber quién está usando la plataforma.
 * QUÉ PASARÍA SI SE ELIMINARA: No podríamos mostrar el nombre en el perfil ni saber sus permisos.
 */
function obtenerUsuarioActivo() {
    // Buscamos en ambos almacenamientos
    const usuarioLS = localStorage.getItem('usuarioActivo');
    const usuarioSS = sessionStorage.getItem('usuarioActivo');
    
    if (usuarioLS) return JSON.parse(usuarioLS);
    if (usuarioSS) return JSON.parse(usuarioSS);
    
    return null;
}
/**
 * FUNCIÓN: protegerRuta()
 * QUÉ RECIBE: Nada.
 * QUÉ DEVUELVE: Nada.
 * POR QUÉ EXISTE: Actúa como un "guardia de seguridad". Si alguien intenta escribir 
 * 'dashboard.html' directamente en el navegador sin haberse logueado, 
 * esta función lo detecta y lo patea de vuelta al login.
 */
function protegerRuta() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) {
        // Si no hay usuario, redirigimos al login inmediatamente
        window.location.replace('login.html');
    }
}

/**
 * FUNCIÓN: cerrarSesion()
 * QUÉ RECIBE: Nada.
 * QUÉ DEVUELVE: Nada.
 * POR QUÉ EXISTE: Borra el rastro del usuario en el navegador para que otra persona 
 * no pueda usar su cuenta.
 */
function cerrarSesion() {
    // Eliminamos los datos de ambas memorias por seguridad
    localStorage.removeItem('usuarioActivo');
    sessionStorage.removeItem('usuarioActivo');
    // Redirigimos al login
    window.location.replace('login.html');
}