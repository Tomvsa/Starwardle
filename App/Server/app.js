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
            character.imageName = imageName;
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

app.get('/persona/:name', (req, res) => {
    const characterName = req.params.name.replace(/\s/g, '_').toLowerCase();
    const filePath = path.join(__dirname, 'data', `${characterName}.json`);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send('No se ha encontrado informacion del personaje');
            return;
        }
        const character = JSON.parse(data);
        res.status(200).json(character);
    })
});

app.get('/search', (req, res) => {
    const searchTerm = req.query.term.toLocaleLowerCase();
    const searchResults = [];
    const dataDir = path.join(__dirname, 'data');

    fs.readdir(dataDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en leer los archivos');
        }

        // Leer archivos de forma asíncrona y paralela
        const promises = files.map(file => {
            const filePath = path.join(dataDir, file);
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        const character = JSON.parse(data);
                        if (character.name.toLowerCase().includes(searchTerm)) {
                            searchResults.push(character);
                        }
                        resolve();
                    }
                });
            });
        });

        // Cuando todas las promesas se resuelven, enviar los resultados
        Promise.all(promises)
            .then(() => {
                console.log(searchResults);
                res.json(searchResults);
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Error en leer el archivo de datos');
            });
    });
});


let randomCharacter = null; // Objeto para almacenar el personaje aleatorio
// Ruta para obtener un personaje aleatorio
app.get('/random', (req, res) => {
    if (randomCharacter) {
        res.json(randomCharacter); // Devuelve el personaje aleatorio almacenado
        return;
    }

    const dataDir = path.join(__dirname, 'data');
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error en leer los archivos');
            return;
        }
        const randomFileName = files[Math.floor(Math.random() * files.length)]; // Escoge un nombre de archivo aleatorio
        const randomFilePath = path.join(dataDir, randomFileName); // Ruta completa del archivo aleatorio
        fs.readFile(randomFilePath, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error en leer el archivo del personaje');
                return;
            }
            randomCharacter = JSON.parse(data); // Almacena el personaje aleatorio en el objeto
            res.json(randomCharacter); // Devuelve el personaje aleatorio como JSON
        });
    });
});


// Ruta para comparar el personaje aleatorio y el proporcionado en el input
app.get('/compare/:name', (req, res) => {
    const characterName = req.params.name.replace(/\s/g, '_').toLowerCase();
    const filePath = path.join(__dirname, 'data', `${characterName}.json`);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send('No se ha encontrado informacion del personaje');
            return;
        }
        const character = JSON.parse(data);
        const comparisonResult = {
            name: randomCharacter.name === character.name,
            height: randomCharacter.height === character.height,
            hair_color: randomCharacter.hair_color === character.hair_color,
            skin_color: randomCharacter.skin_color === character.skin_color,
            eye_color: randomCharacter.eye_color === character.eye_color,
            birth_year: randomCharacter.birth_year === character.birth_year,
            gender: randomCharacter.gender === character.gender
        };

        res.json(comparisonResult);
    })
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});