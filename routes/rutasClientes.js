const express = require("express");
const router = express.Router();
const Cliente = require("../models/modeloClientes");
const Vendedores = require("../models/modeloVendedores");//terminado

router.post('/agregar', async (req,res) => {
    const {nombre,apellidos,email,telefono,historialCompra} = req.body;

    try {
        const cliente = new Cliente({
            nombre: nombre,
            apellidos: apellidos,
            email: email,
            telefono: telefono,
            historialCompras: historialCompra || null
        });

        await cliente.save();
        res.status(201).json({ message: "cliente cargado con exito" });

    }catch(error){
        console.error("error al cargar el cliente", error);
        res.status(500).json({ error: "error al cargar el cliente" });
    }

});

router.get('/buscar/:email', async (req,res) => {
    try{
        const cliente = await Cliente.findOne({ email: req.params.email });
        if(cliente){
            res.status(200).json(cliente);
        }else{
            res.status(404).json({ message: "no se ha encontrado al cliente" });
        }
    }catch(error){
        console.error("error al buscar el cliente", error);
        res.status(500).json({ error: "error al buscar el cliente" });
    }
});

router.put('/actualizar/:email', async (req,res) => {
    const {email} = req.params;
    try{
        const cliente = await Cliente.findOneAndUpdate(
            { email: email },
            req.body,
            { new: true }
          );
        if(!cliente){
            res.status(404).json({ message: "no se ha encontrado al cliente" });
        }
        res.status(200).json({ cliente: "cliente actualizado con exito" });
    }catch(error){
        console.error("error al actualizar el cliente", error);
        res.status(500).json({ error: "error al actualizar el cliente" });
    }
});

router.delete('/eliminar/:email', async (req,res) => {
    const email = req.params.email;
    try{
        const cliente = await Cliente.findOne({ email: req.params.email });

        if(!cliente){
            res.status(404).json({ cliente: "no se ha encontrado al cliente" });
        }

        await Vendedores.updateMany(
            { 'ventas.venta.idCliente': cliente._id },
            { $set: { 'ventas.$[].venta.idCliente': null } }
        );

        await Vendedores.updateMany(
            { 'devoluciones.devolucion.idCliente': cliente._id },
            { $set: { 'devoluciones.$[].devolucion.idCliente': null } }
        );

        await Cliente.findByIdAndDelete(cliente._id);

        res.status(200).json({ message: 'Cliente eliminado con éxito' });

    }catch(error){
        console.error("error al eliminar el cliente", error);
        res.status(500).json({ error: "error al eliminar el cliente" });
    }
});

module.exports = router;