/*
 * ARCHIVO: js/storage.js
 * QUÉ HACE: Gestiona la lectura y escritura de datos en el LocalStorage del navegador.
 * PARA QUÉ SIRVE: Actúa como nuestro "Servidor / Base de Datos" simulado. Mantiene los datos
 *                 aunque el usuario apague la computadora.
 * QUÉ FUNCIONES CONTIENE: initStorage(), obtenerDatos(), guardarDatos().
 */

/**
 * FUNCIÓN: initStorage()
 * QUÉ RECIBE: Nada.
 * QUÉ DEVUELVE: Nada.
 * POR QUÉ EXISTE: Se encarga de revisar si es la primera vez que se abre la página. Si es así,
 *                 toma el archivo 'datosIniciales.js' y lo inyecta en el navegador.
 * QUÉ PASARÍA SI SE ELIMINARA: Si el usuario entra por primera vez, el sistema daría errores 
 *                              porque no encontraría el usuario Admin para iniciar sesión.
 */
/* ARCHIVO: js/storage.js */

// 1. DEFINE LA VARIABLE AQUÍ ARRIBA
const datosIniciales = {
    usuarios: [
        { id: "USR-001", nombre: "Admin Principal", correo: "admin@universidad.edu.pe", password: "123", rol: "admin", foto: "" },
        { id: "USR-002", nombre: "Carlos Mendoza", correo: "cmendoza@universidad.edu.pe", password: "123", rol: "profesor", foto: "" }
    ],
    cursos: []
};

// 2. AHORA LA FUNCIÓN PODRÁ ENCONTRARLA
function initStorage() {
    if (!localStorage.getItem('usuarios')) {
        console.log("Primera visita detectada. Inicializando base de datos...");
        localStorage.setItem('usuarios', JSON.stringify(datosIniciales.usuarios));
        localStorage.setItem('cursos', JSON.stringify(datosIniciales.cursos));
    }
}
function initStorage() {
    // Verificamos si ya existe la llave 'usuarios' en el LocalStorage
    // LocalStorage solo guarda TEXTO, no objetos.
    const usuariosExisten = localStorage.getItem('usuarios');

    if (!usuariosExisten) {
        // Si no existen (es null), usamos nuestra función guardarDatos para guardar 
        // los datos del archivo datosIniciales.js
        console.log("Primera visita detectada. Inicializando base de datos...");
        guardarDatos('usuarios', datosIniciales.usuarios);
        guardarDatos('cursos', datosIniciales.cursos);
        // Dejaremos llaves vacías preparadas para el futuro
        guardarDatos('anuncios', []);
        guardarDatos('tareas', []);
    }
}

/**
 * FUNCIÓN: obtenerDatos()
 * QUÉ RECIBE: 'clave' (String). Es el nombre de la "tabla" que queremos buscar (Ej: 'usuarios').
 * QUÉ DEVUELVE: Un Arreglo o un Objeto de JavaScript con los datos. Si no hay nada, devuelve null.
 * POR QUÉ EXISTE: Centraliza la lectura de datos. Desempaqueta el texto de LocalStorage a código JS.
 * QUÉ PASARÍA SI SE ELIMINARA: Tendríamos que escribir JSON.parse(localStorage.getItem(...)) 
 *                              repetitivamente en todo el proyecto.
 */
function obtenerDatos(clave) {
    const textoDatos = localStorage.getItem(clave);
    if (textoDatos) {
        // JSON.parse convierte el Texto de vuelta a un objeto real de JavaScript
        return JSON.parse(textoDatos);
    }
    return null;
}

/**
 * FUNCIÓN: guardarDatos()
 * QUÉ RECIBE: 'clave' (String) el nombre donde guardaremos, y 'datos' (Cualquier tipo) la información.
 * QUÉ DEVUELVE: Nada.
 * POR QUÉ EXISTE: Centraliza la escritura de datos. Empaqueta el código JS a Texto para que 
 *                 LocalStorage lo acepte.
 * QUÉ PASARÍA SI SE ELIMINARA: No podríamos guardar alumnos nuevos, cursos ni calificaciones.
 */
function guardarDatos(clave, datos) {
    // JSON.stringify convierte un objeto real de JavaScript a un Texto simple
    const textoDatos = JSON.stringify(datos);
    localStorage.setItem(clave, textoDatos);
}