const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Rectángulos funcionando correctamente"
    });
});

// Consultar un rectángulo
app.get("/rectangulos", (req, res) => {
    const base = Number(req.query.base);
    const altura = Number(req.query.altura);

    // Validar que se hayan enviado números
    if (isNaN(base) || isNaN(altura)) {
        return res.status(400).json({
            error: "La base y la altura deben ser números."
        });
    }

    // Validar que sean mayores que cero
    if (base <= 0 || altura <= 0) {
        return res.status(400).json({
            error: "La base y la altura deben ser mayores que 0."
        });
    }

    // Cálculos
    const perimetro = 2 * (base + altura);
    const superficie = base * altura;

    // Un rectángulo es cuadrado cuando sus lados son iguales
    const esCuadrado = base === altura;

    res.json({
        base: base,
        altura: altura,
        perimetro: perimetro,
        superficie: superficie,
        esCuadrado: esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});