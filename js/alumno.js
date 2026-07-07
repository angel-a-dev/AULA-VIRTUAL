/* ARCHIVO: js/alumno.js */
function cargarDashboardAlumno(menu, contenido) {
    menu.innerHTML = `
        <a href="#" class="menu-item active"> Mis Cursos</a>
        <a href="#" class="menu-item" onclick="alert('Pronto verás tus tareas')">Tareas Pendientes</a>
        <a href="mensajes.html" class="menu-item">Mensajes</a>
        <a href="calendario.html" class="menu-item"> Calendario</a>
    `;
    
    const cursos = obtenerDatos('cursos') || [];
    const usuarioActivo = obtenerUsuarioActivo();
    
    // Filtramos solo los cursos donde el ID del alumno esté en el arreglo de alumnosIds
    const misCursos = cursos.filter(curso => curso.alumnosIds.includes(usuarioActivo.id));

    let htmlTarjetas = '';
    
    misCursos.forEach(curso => {
        // Al hacer clic, enviamos al usuario a curso.html pasando el ID en la URL
        htmlTarjetas += `
            <div class="stat-card" style="padding: 0; cursor: pointer; border-bottom: none; overflow: hidden;" onclick="window.location.href='curso.html?id=${curso.id}'">
                <div style="height: 120px; background-color: var(--azul-oscuro); display: flex; align-items: center; justify-content: center; color: white; font-size: 40px;">
                    📘
                </div>
                <div style="padding: 20px;">
                    <h3 style="color: var(--texto-principal); font-size: 16px; margin-bottom: 5px; text-transform: none;">${curso.nombre}</h3>
                    <p style="font-size: 12px; color: var(--gris-texto); font-weight: normal; margin-top: 0;">Código: ${curso.codigo} | Ciclo ${curso.ciclo}</p>
                </div>
            </div>
        `;
    });

    contenido.innerHTML = `
        <h2 style="margin-bottom: 20px; color: var(--azul-oscuro);">Mis Cursos Matriculados</h2>
        <div class="dashboard-grid">
            ${htmlTarjetas.length > 0 ? htmlTarjetas : '<p>No estás matriculado en ningún curso aún.</p>'}
        </div>
    `;
}