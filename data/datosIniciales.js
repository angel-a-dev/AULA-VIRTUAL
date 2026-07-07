/*
 * ARCHIVO: data/datosIniciales.js
 * QUÉ HACE: Contiene los datos por defecto del sistema (usuarios, cursos, etc.).
 * PARA QUÉ SIRVE: Si el sistema se abre por primera vez y el LocalStorage está vacío,
 *                 utilizará estos datos para que la plataforma no aparezca en blanco.
 * QUÉ FUNCIONES CONTIENE: Ninguna función, solo exporta un objeto constante (datos).
 */

const datosIniciales = {
    // Array de usuarios. Simulamos nuestra tabla de 'Usuarios' en la base de datos.
    usuarios: [
        {
            id: "USR-001",
            nombre: "Admin Principal",
            correo: "admin@universidad.edu.pe",
            password: "123", // Contraseña simple para pruebas. ¡Nunca hacer esto en la vida real!
            rol: "admin", // Define los permisos
            foto: "assets/img/default-admin.png"
        },
        {
            id: "USR-002",
            nombre: "Ing. Carlos Mendoza",
            correo: "cmendoza@universidad.edu.pe",
            password: "123",
            rol: "profesor",
            foto: "assets/img/default-profesor.png"
        },
        {
            id: "USR-003",
            nombre: "Juan Pérez",
            correo: "jperez@alumno.edu.pe",
            password: "123",
            rol: "alumno",
            codigoUniversitario: "20230001",
            carrera: "Ingeniería de Sistemas",
            foto: "assets/img/default-alumno.png"
        }
    ],

    // Array de cursos. Simulamos nuestra tabla de 'Cursos'.
    cursos: [
        // CICLO I
        {
            id: "CUR-101",
            codigo: "SIS-101",
            nombre: "Introducción a la Ingeniería de Sistemas",
            descripcion: "Fundamentos de la ingeniería, enfoque sistémico y teoría general de sistemas.",
            ciclo: "I",
            profesorId: "USR-002",
            alumnosIds: ["USR-003"],
            horario: "Lunes 08:00 - 10:00",
            estado: "activo",
            imagen: "assets/img/cursos/intro-sistemas.jpg"
        },
        {
            id: "CUR-102",
            codigo: "SIS-102",
            nombre: "Algoritmos y Estructuras de Datos I",
            descripcion: "Lógica de programación, diagramas de flujo y pseudocódigo.",
            ciclo: "I",
            profesorId: "USR-002",
            alumnosIds: ["USR-003"],
            horario: "Miércoles 10:00 - 13:00",
            estado: "activo",
            imagen: "assets/img/cursos/algoritmos.jpg"
        },
        // CICLO II
        {
            id: "CUR-201",
            codigo: "SIS-201",
            nombre: "Programación Orientada a Objetos",
            descripcion: "Conceptos de clases, objetos, herencia, polimorfismo y encapsulamiento.",
            ciclo: "II",
            profesorId: "USR-002",
            alumnosIds: [],
            horario: "Martes 08:00 - 11:00",
            estado: "activo",
            imagen: "assets/img/cursos/poo.jpg"
        },
        // CICLO III
        {
            id: "CUR-301",
            codigo: "SIS-301",
            nombre: "Análisis y Diseño de Sistemas",
            descripcion: "Metodologías de desarrollo, UML y levantamiento de requerimientos.",
            ciclo: "III",
            profesorId: "USR-002",
            alumnosIds: [],
            horario: "Viernes 14:00 - 17:00",
            estado: "activo",
            imagen: "assets/img/cursos/analisis.jpg"
        }
    ]
};