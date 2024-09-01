const express = require("express"); 
const fs = require("fs");


const app = express(); 
const port = 3000;
const cors = require('cors')

app.listen(port, () => 
    console.log("Servidor encendido en puerto 3000 listo para agregar canciones"));


app.use(express.json());
app.use(cors())



app.get("/canciones", (req, res)=>{
    const newCancion = JSON.parse(fs.readFileSync("./public/repertorio.json"));
    res.json(newCancion);
});


app.post("/canciones", (req, res)=>{
    const cancion = req.body
    const newCancion = JSON.parse(fs.readFileSync("./public/repertorio.json", "utf8"));
    newCancion.push(cancion);
    fs.writeFileSync("./public/repertorio.json", JSON.stringify(newCancion, null, 2), "utf8")
    res.status(201).send("Canción agregada correctamente.");
})


app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.delete("/canciones/:id", (req, res) => {
    const id = req.params.id;
    const repertorio = JSON.parse(fs.readFileSync("./public/repertorio.json")); 

    
    const nuevoRepertorio = repertorio.filter(c => c.id !== id);
    
    if (nuevoRepertorio.length !== repertorio.length) {
        fs.writeFileSync("./public/repertorio.json", JSON.stringify(nuevoRepertorio, null, 2)); 
        res.send(`Canción con ID ${id} eliminada correctamente.`);
    } else {
        res.status(404).send("Canción no encontrada.");
    }
});


app.put("/canciones/:id", (req, res) => {
    const id = req.params.id; 
    const cancionActualizada = req.body; 
    let newCancion = JSON.parse(fs.readFileSync("./public/repertorio.json")); 

    
    const index = newCancion.findIndex(c => c.id === id);
    
    if (index !== -1) {
        newCancion[index] = cancionActualizada;
        fs.writeFileSync("./public/repertorio.json", JSON.stringify(newCancion, null, 2)); 
        res.send(`Canción con ID ${id} actualizada.`);
    } else {
        res.status(404).send("Canción no encontrada.");
    }
});