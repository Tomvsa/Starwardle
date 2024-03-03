const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

//Endpoint para guardar información del personaje y la imagen
app.post('/persona', (req, res) => {
    const character = req.body;
    const imageName = character.name.replace(/\s/g, '_').toLowerCase() + '.jpg'; // Nombre de la imagen basado en la info del personaje
    const jsonName = character.name.replace(/\s/g, '_').toLowerCase() + '.json';
    const imagePath = path.join(__dirname, 'images', imageName); // Ruta donde guarda la imagen
    const jsonPath = path.join(__dirname, 'data', jsonName);

    //Guarda la información en un JSON
    fs.writeFile(path.join(__dirname, 'data', `${character.name.replace(/\s/g, '_').toLowerCase()}.json`), JSON.stringify(character), err => {
        if (err) {
            console.log(err);
            res.status(500).send('Error en guardar la información del personaje');
            return;
        }
        console.log("Información del personaje guardada correctamente");
    })



    //Guarda la imagen
    if (req.body.image) {
        if (!fs.existsSync(imagePath)) {
            fs.writeFile(imagePath, req.body.image, 'base64', err => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error en guardar la imagen');
                }
                console.log('Imagen guardada correctamente')
            })
        } else {
            console.log("Ya existe la imagen asociada al personaje");
        }
    } else {
        console.log("No hay imagen seleccionada");
    }


    res.status(200).send('Información del personaje guardada correctamente.');
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})