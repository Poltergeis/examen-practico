const express = require("express");
const router = express.Router();
const Vendedor = require("../models/modeloVendedores");
const Cliente = require("../models/modeloClientes");

router.post('/agregar', async (req,res) => {
    const {nombre, apellidos,asociaciones,vehiculosEnVenta,ventas,devoluciones} = req.body;
    try{
        const vendedor = new Vendedor({
            nombre: nombre,
            apellidos: apellidos,
            asociaciones: asociaciones || null,
            vehiculosEnVenta: vehiculosEnVenta || null,
            ventas: ventas || null,
            devoluciones: devoluciones || null
        });
        await vendedor.save();
        res.status(201).json({ vendedor: "vendedor registrado con exito" });
    }catch(error){
        console.error("error al agregar vendedor",error);
        res.status(500).json({ error: "error al agregar vendedor" });
    }
});

router.get('/buscar/:nombre/:apellidos', async (req,res) => {
    const {nombre,apellidos} = req.body;
    try{

        const vendedor = await Vendedor.findone({ nombre: nombre, apellidos: apellidos });
        if(vendedor) res.status(200).json(vendedor);
        else res.status(404).json({ message: "no se ha encontrado al vendedor" });

    }catch(error){
        console.error("error al buscar vendedor",error);
        res.status(500).json({ error: "error al buscar vendedor" });
    }
});

router.put('/actualizar/:nombre/:apellidos', async (req,res) => {
    const {nombre,apellidos} = req.params;
    try{
        const vendedor = Vendedor.findOneAndUpdate(
            {nombre: nombre, apellidos: apellidos},
            req.body,
            { new: true }
            );
        if(!vendedor) { 
            res.status(404).json({ vendedor: "no se ha encontrado al vendedor" }); 
        }
        res.status(200).json({vendedor: "vendedor actualizado con exito" });
    }catch(error){
        console.error("error al actualizar el vendedor",error);
        res.status(500).json({ error: "error al actualizar el vendedor" });
    }
});

router.delete('/eliminar/:nombre/:apellidos', async (req,res) => {
    const {nombre,apellidos} = req.body;
    try{
        const vendedor = await Vendedor.findone({ nombre: nombre, apellidos: apellidos });

        if (!vendedor) {
            return res.status(404).json({ message: "No se ha encontrado al vendedor" });
        }

        await Cliente.updateMany(
            { 'historialCompras.compra': vendedor._id },
            { $set: { 'historialCompras.$[].compra': null } }
        );

        await Vendedor.findByIdAndUpdate(vendedor._id);

        res.status(200).json({ vendedor: 'Vendedor eliminado con éxito' });

    }catch(error){
        console.error("error al eliminarr vendedor",error);
        res.status(500).json({ error: "error al eliminarr vendedor" });
    }
});

module.exports = router;