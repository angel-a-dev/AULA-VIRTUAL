/* ARCHIVO: js/admin.js */

function cargarDashboardAdmin(menu, contenido) {
    menu.innerHTML = `
        <a href="#" class="menu-item active" id="btn-vista-panel">Panel General</a>
        <a href="#" class="menu-item" id="btn-vista-usuarios">Gestión de Usuarios</a>
        <a href="#" class="menu-item" id="btn-vista-cursos">Gestión de Cursos</a>
        <a href="mensajes.html" class="menu-item">Mensajes</a>
        <a href="calendario.html" class="menu-item">Calendario</a>
    `;

    const btnPanel = document.getElementById('btn-vista-panel');
    const btnUsuarios = document.getElementById('btn-vista-usuarios');
    const btnCursos = document.getElementById('btn-vista-cursos');

    function actualizarMenuActivo(botonActivo) {
        document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
        botonActivo.classList.add('active');
    }

    btnPanel.addEventListener('click', () => { actualizarMenuActivo(btnPanel); renderizarPanelGeneral(contenido); });
    btnUsuarios.addEventListener('click', () => { actualizarMenuActivo(btnUsuarios); renderizarGestionUsuarios(contenido); });
    btnCursos.addEventListener('click', () => { actualizarMenuActivo(btnCursos); renderizarGestionCursos(contenido); });

    renderizarPanelGeneral(contenido);

    const formUsuario = document.getElementById('formUsuario');
    if(formUsuario) {
        formUsuario.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('modalNombre').value;
            const correo = document.getElementById('modalCorreo').value;
            const password = document.getElementById('modalPassword').value;
            const rol = document.getElementById('modalRol').value;

            const usuariosDB = obtenerDatos('usuarios') || [];
            if(usuariosDB.some(u => u.correo === correo)) { alert("Error: Correo ya registrado."); return; }

            usuariosDB.push({
                id: generarID('USR'), nombre: nombre, correo: correo, password: password, rol: rol, foto: `assets/img/default-${rol}.png`
            });
            guardarDatos('usuarios', usuariosDB);
            cerrarModal();
            renderizarGestionUsuarios(document.getElementById('dashboard-content'));
        });
    }

    const formMatricula = document.getElementById('formMatricula');
    if(formMatricula) {
        formMatricula.addEventListener('submit', function(e) {
            e.preventDefault();
            const cursoId = document.getElementById('matriculaCursoId').value;
            const profesorId = document.getElementById('selectProfesor').value;
            const checkboxes = document.querySelectorAll('.check-alumno:checked');
            const alumnosIds = Array.from(checkboxes).map(cb => cb.value);

            let cursosDB = obtenerDatos('cursos') || [];
            const index = cursosDB.findIndex(c => c.id === cursoId);

            if(index !== -1) {
                cursosDB[index].profesorId = profesorId;
                cursosDB[index].alumnosIds = alumnosIds;
                guardarDatos('cursos', cursosDB);
                cerrarModalMatricula();
                renderizarGestionCursos(document.getElementById('dashboard-content'));
            }
        });
    }
}

function renderizarPanelGeneral(contenido) {
    const usuarios = obtenerDatos('usuarios') || [];
    const cursos = obtenerDatos('cursos') || [];
    const totalAlumnos = usuarios.filter(u => u.rol === 'alumno').length;
    const totalProfesores = usuarios.filter(u => u.rol === 'profesor').length;

    contenido.innerHTML = `
        <h2 style="margin-bottom: 20px; color: var(--azul-oscuro);">Resumen Administrativo</h2>
        <div class="dashboard-grid">
            <div class="stat-card"><h3>Total Usuarios</h3><p>${usuarios.length}</p></div>
            <div class="stat-card"><h3>Alumnos</h3><p>${totalAlumnos}</p></div>
            <div class="stat-card"><h3>Profesores</h3><p>${totalProfesores}</p></div>
            <div class="stat-card"><h3>Cursos Activos</h3><p>${cursos.length}</p></div>
        </div>
    `;
}

function renderizarGestionUsuarios(contenido) {
    const usuarios = obtenerDatos('usuarios') || [];
    let filasHTML = '';
    usuarios.forEach(usuario => {
        let botonEliminar = usuario.id === 'USR-001' ? '<span style="color:#999;font-size:12px;">Protegido</span>' : `<button class="btn-small btn-delete" onclick="eliminarUsuario('${usuario.id}')">Eliminar</button>`;
        filasHTML += `<tr><td>${usuario.id}</td><td><strong>${usuario.nombre}</strong><br><span style="font-size:12px;color:var(--gris-texto)">${usuario.correo}</span></td><td><span class="badge badge-${usuario.rol}">${usuario.rol}</span></td><td>${botonEliminar}</td></tr>`;
    });

    contenido.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: var(--azul-oscuro);">Gestión de Usuarios</h2>
            <button class="btn-primary" style="width: auto;" onclick="abrirModal()">+ Nuevo Usuario</button>
        </div>
        <div class="table-container"><table class="data-table"><thead><tr><th>ID</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>${filasHTML}</tbody></table></div>
    `;
}

function renderizarGestionCursos(contenido) {
    const cursos = obtenerDatos('cursos') || [];
    const usuarios = obtenerDatos('usuarios') || [];
    let filasHTML = '';
    
    cursos.forEach(curso => {
        const profesor = usuarios.find(u => u.id === curso.profesorId);
        const nombreProfe = profesor ? profesor.nombre : '<span style="color:var(--rojo-error); font-weight:bold;">Sin asignar</span>';

        filasHTML += `
            <tr>
                <td><strong>${curso.nombre}</strong><br><span style="font-size:12px; color:var(--gris-texto)">Código: ${curso.codigo} | Ciclo ${curso.ciclo}</span></td>
                <td>${nombreProfe}</td>
                <td><span class="badge badge-alumno">${curso.alumnosIds.length} Alumnos</span></td>
                <td>
                    <button class="btn-small" style="background-color: var(--azul-claro);" onclick="abrirModalMatricula('${curso.id}')">Matricular / Editar</button>
                </td>
            </tr>
        `;
    });

    contenido.innerHTML = `
        <h2 style="margin-bottom: 20px; color: var(--azul-oscuro);">Gestión de Cursos y Matrículas</h2>
        <div class="table-container">
            <table class="data-table">
                <thead><tr><th>Curso</th><th>Profesor Asignado</th><th>Matriculados</th><th>Acciones</th></tr></thead>
                <tbody>${filasHTML}</tbody>
            </table>
        </div>
    `;
}

function abrirModal() { document.getElementById('modalUsuario').style.display = 'flex'; document.getElementById('formUsuario').reset(); }
function cerrarModal() { document.getElementById('modalUsuario').style.display = 'none'; }
function eliminarUsuario(id) {
    if(confirm('¿Eliminar usuario?')) {
        let usuariosDB = obtenerDatos('usuarios') || [];
        usuariosDB = usuariosDB.filter(u => u.id !== id);
        guardarDatos('usuarios', usuariosDB);
        renderizarGestionUsuarios(document.getElementById('dashboard-content'));
    }
}

function abrirModalMatricula(cursoId) {
    const cursos = obtenerDatos('cursos') || [];
    const usuarios = obtenerDatos('usuarios') || [];
    const curso = cursos.find(c => c.id === cursoId);

    if(!curso) return;

    document.getElementById('matriculaCursoId').value = curso.id;
    document.getElementById('tituloModalMatricula').textContent = `Matricular: ${curso.nombre}`;

    const profesores = usuarios.filter(u => u.rol === 'profesor');
    let opcionesProfe = '<option value="">-- Seleccionar Profesor --</option>';
    profesores.forEach(p => {
        const seleccionado = p.id === curso.profesorId ? 'selected' : '';
        opcionesProfe += `<option value="${p.id}" ${seleccionado}>${p.nombre}</option>`;
    });
    document.getElementById('selectProfesor').innerHTML = opcionesProfe;

    const alumnos = usuarios.filter(u => u.rol === 'alumno');
    let checksAlumnos = '';
    alumnos.forEach(a => {
        const marcado = curso.alumnosIds.includes(a.id) ? 'checked' : '';
        checksAlumnos += `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                <input type="checkbox" class="check-alumno" value="${a.id}" id="chk-${a.id}" ${marcado}>
                <label for="chk-${a.id}" style="margin: 0; font-weight: normal; font-size: 13px;">${a.nombre} (${a.correo})</label>
            </div>
        `;
    });
    
    document.getElementById('listaAlumnosMatricula').innerHTML = checksAlumnos.length > 0 ? checksAlumnos : '<p style="font-size:12px; color:var(--gris-texto);">No hay alumnos registrados.</p>';
    document.getElementById('modalMatricula').style.display = 'flex';
}

function cerrarModalMatricula() {
    document.getElementById('modalMatricula').style.display = 'none';
}