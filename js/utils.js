/*
 * ARCHIVO: js/utils.js
 * QUÉ HACE: Provee funciones de ayuda que se pueden reutilizar en múltiples partes del código.
 * PARA QUÉ SIRVE: Evita que repitamos código (Principio DRY: Don't Repeat Yourself).
 * QUÉ FUNCIONES CONTIENE: generarID()
 */

/**
 * FUNCIÓN: generarID()
 * QUÉ RECIBE: Un prefijo de texto opcional (Ej: 'USR' para usuario).
 * QUÉ DEVUELVE: Una cadena de texto única (Ej: 'USR-1692134567890').
 * POR QUÉ EXISTE: En una base de datos real, los IDs se generan solos. Aquí en LocalStorage 
 *                 debemos fabricarlos nosotros para que cada registro no se confunda con otro.
 * QUÉ PASARÍA SI SE ELIMINARA: No podríamos crear nuevos usuarios o cursos porque no 
 *                              sabríamos cómo identificarlos de forma única.
 */
function generarID(prefijo = "ID") {
    // Date.now() obtiene la fecha actual en milisegundos.
    // Math.random() genera un número aleatorio para mayor seguridad.
    // .toString(36) convierte los números en texto alfanumérico.
    const identificadorUnico = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    
    // Unimos el prefijo con el identificador único
    return `${prefijo}-${identificadorUnico.toUpperCase()}`;
}