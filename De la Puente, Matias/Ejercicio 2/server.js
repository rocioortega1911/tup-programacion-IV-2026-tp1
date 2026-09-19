const express = require("express");

const app = express();

const PORT = 3001;

app.use(express.json());

// Arreglo interno de alumnos
const alumnos = [
    {
        nombre: "Juan",
        notas: [8, 7, 9]
    },
    {
        nombre: "Maria",
        notas: [5, 6, 4]
    }
];

// Calcular promedio
function calcularPromedio(notas) {
    const suma = notas[0] + notas[1] + notas[2];
    return suma / 3;
}

// Determinar condición académica
function determinarCondicion(promedio) {
    if (promedio < 6) {
        return "reprobado";
    }

    if (promedio < 8) {
        return "aprobado";
    }

    return "promocionado";
}

// Consultar todos los alumnos
app.get("/alumnos", (req, res) => {
    res.json(alumnos);
});

// Consultar un alumno
app.get("/alumnos/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const alumno = alumnos.find(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!alumno) {
        return res.status(404).json({
            error: "Alumno no encontrado."
        });
    }

    const promedio = calcularPromedio(alumno.notas);
    const condicion = determinarCondicion(promedio);

    res.json({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio: promedio,
        condicion: condicion
    });
});

// Crear un alumno
app.post("/alumnos", (req, res) => {
    const { nombre, notas } = req.body;

    // Validar nombre
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            error: "El nombre es obligatorio."
        });
    }

    // Validar que existan exactamente 3 notas
    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "El alumno debe tener exactamente 3 notas."
        });
    }

    // Validar que las notas sean números entre 0 y 10
    if (notas.some(nota => typeof nota !== "number" || nota < 0 || nota > 10)) {
        return res.status(400).json({
            error: "Las notas deben ser números entre 0 y 10."
        });
    }

    // Validar nombre único
    const existe = alumnos.some(
        alumno => alumno.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (existe) {
        return res.status(409).json({
            error: "Ya existe un alumno con ese nombre."
        });
    }

    const nuevoAlumno = {
        nombre: nombre.trim(),
        notas: notas
    };

    alumnos.push(nuevoAlumno);

    res.status(201).json(nuevoAlumno);
});

// Modificar un alumno
app.put("/alumnos/:nombre", (req, res) => {
    const nombreActual = req.params.nombre;
    const { nombre, notas } = req.body;

    const indice = alumnos.findIndex(
        alumno => alumno.nombre.toLowerCase() === nombreActual.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Alumno no encontrado."
        });
    }

    // Validar nuevo nombre
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({
            error: "El nombre es obligatorio."
        });
    }

    // Validar notas
    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({
            error: "El alumno debe tener exactamente 3 notas."
        });
    }

    if (notas.some(nota => typeof nota !== "number" || nota < 0 || nota > 10)) {
        return res.status(400).json({
            error: "Las notas deben ser números entre 0 y 10."
        });
    }

    // Validar que el nuevo nombre no pertenezca a otro alumno
    const nombreDuplicado = alumnos.some(
        (alumno, i) =>
            i !== indice &&
            alumno.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (nombreDuplicado) {
        return res.status(409).json({
            error: "Ya existe otro alumno con ese nombre."
        });
    }

    alumnos[indice] = {
        nombre: nombre.trim(),
        notas: notas
    };

    res.json(alumnos[indice]);
});

// Eliminar un alumno
app.delete("/alumnos/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const indice = alumnos.findIndex(
        alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Alumno no encontrado."
        });
    }

    const alumnoEliminado = alumnos.splice(indice, 1);

    res.json({
        mensaje: "Alumno eliminado correctamente.",
        alumno: alumnoEliminado[0]
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});