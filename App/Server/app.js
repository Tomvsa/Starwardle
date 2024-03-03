const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { emit } = require('process');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

//Endpoint para guardar información del personaje y la imagen
app.post('/persona', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error en procesar la solicitud.');
            return;
        }

        const character = JSON.parse(fields.characterInfo);
        if (files['image']) {
            const image = files['image'][0];
            const fileExtension = image.originalFilename.split('.')[1];
            const imageName = character.name.replace(/\s/g, '_').toLowerCase() + '.' + fileExtension;
            const imagePath = path.join(__dirname, 'images', imageName); // Ruta donde guarda la imagen
            // Guarda la imagen
            fs.rename(image.filepath, imagePath, err => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error en guardar la imagen.');
                    return;
                }
                console.log('Imagen guardada correctamente.');
            });
        }
        // Guarda la información del personaje en un JSON
        fs.writeFile(path.join(__dirname, 'data', `${character.name.replace(/\s/g, '_').toLowerCase()}.json`), JSON.stringify(character), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Error en guardar la información del personaje.');
                return;
            }
            console.log('Información del personaje guardada correctamente.');
        });


        res.status(200).send('Información del personaje y la imagen guardadas correctamente.');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})