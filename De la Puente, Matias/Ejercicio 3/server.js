const express = require("express");

const app = express();
const PORT = 3002;

app.use(express.json());

let tareas = [
    {
        nombre: "Estudiar",
        completada: false
    },
    {
        nombre: "Entregar TP",
        completada: true
    }
];

// Ver todas las tareas
app.get("/tareas", (req, res) => {
    res.json(tareas);
});

// Ver tareas completadas
app.get("/tareas/completadas", (req, res) => {
    res.json(tareas.filter(tarea => tarea.completada));
});

// Ver tareas pendientes
app.get("/tareas/pendientes", (req, res) => {
    res.json(tareas.filter(tarea => !tarea.completada));
});

// Crear una tarea
app.post("/tareas", (req, res) => {
    const { nombre, completada } = req.body;

    if (!nombre || typeof nombre !== "string") {
        return res.status(400).json({
            error: "El nombre es obligatorio."
        });
    }

    if (typeof completada !== "boolean") {
        return res.status(400).json({
            error: "Completada debe ser true o false."
        });
    }

    const existe = tareas.some(
        tarea => tarea.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (existe) {
        return res.status(409).json({
            error: "Ya existe una tarea con ese nombre."
        });
    }

    const tarea = {
        nombre: nombre.trim(),
        completada: completada
    };

    tareas.push(tarea);

    res.status(201).json(tarea);
});

// Modificar una tarea
app.put("/tareas/:nombre", (req, res) => {
    const nombreActual = req.params.nombre;
    const { nombre, completada } = req.body;

    const indice = tareas.findIndex(
        tarea => tarea.nombre.toLowerCase() === nombreActual.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        });
    }

    if (!nombre || typeof nombre !== "string") {
        return res.status(400).json({
            error: "El nombre es obligatorio."
        });
    }

    if (typeof completada !== "boolean") {
        return res.status(400).json({
            error: "Completada debe ser true o false."
        });
    }

    const existe = tareas.some(
        (tarea, i) =>
            i !== indice &&
            tarea.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (existe) {
        return res.status(409).json({
            error: "Ya existe otra tarea con ese nombre."
        });
    }

    tareas[indice] = {
        nombre: nombre.trim(),
        completada: completada
    };

    res.json(tareas[indice]);
});

// Eliminar una tarea
app.delete("/tareas/:nombre", (req, res) => {
    const nombre = req.params.nombre;

    const indice = tareas.findIndex(
        tarea => tarea.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        });
    }

    const eliminada = tareas.splice(indice, 1);

    res.json(eliminada[0]);
});

// Rutas que no existen
app.use((req, res) => {
    res.status(404).json({
        error: "Tarea no encontrada."
    });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});