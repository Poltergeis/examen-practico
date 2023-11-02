const express = require("express");//terminado
const router = express.Router();
const Vehiculo = require("../models/modeloVehiculo");
const Vendedor = require("../models/modeloVendedores");
const Cliente = require("../models/modeloClientes");

router.post('/agregar', async (req,res) => {
    const {modelo,color,precio,estado} = req.body;
    try{

        const vehiculo = new Vehiculo({
            modelo: modelo,
            color: color,
            precio: precio,
            estado: estado
        });

        await vehiculo.save();
        res.status(201).json({ message: "vehiculo guardado exitosamente" });

    }catch(error){
        console.error("error al agregar usaurio", error);
        res.status(500).json({ error: "error al agregar usuario" });
    }
});

router.get('/buscar/:modelo/:precio', async (req,res) => {
    const {modelo,precio} = req.params;
    try{
        const vehiculo = await Vehiculo.findOne({
            modelo: modelo,
            precio: precio
        });
        if(vehiculo){
            res.status(200).json(vehiculo);
        }else{
            res.status(404).json({ message: "no se ha encontrado el vehiculo" });
        }
    }catch(error){
        console.error("error al buscar el vehiculo",error);
        res.status(500).json({ error: "error al buscar el vehiculo" });
    }
});

router.put('/actualizar/:modelo/:precio', async (req,res) => {
    const {modelo,precio} = req.params;
    try{
        const vehiculo = await Vehiculo.findOneAndUpdate(
            {modelo: modelo, precio: precio},
             req.body,
             { new: true }
        );
        if(!vehiculo){
            res.status(404).json({ message: "no se ha encontrado el vehiculo" });
        }
        res.status(200).json({ vehiculo: "cliente actualizado con exito" }); 
    }catch(error){
        console.error("error al actualizar el vehiculo",error);
        res.status(500).json({ error: "error al actualizar el vehiculo" });
    }
});

router.delete('/eliminar/:modelo/:precio', async (req,res) => {
    const { modelo, precio } = req.params;
    try{
        const vehiculo = await Vehiculo.findOne({
            modelo: modelo,
            precio: precio
        });

        if(!vehiculo){
            res.status(404).json({ message: "no se ha encontrado el vehiculo" });
        }
        const vehiculoId = vehiculo._id;

        await Cliente.updateMany({ 'historialCompras.compra': { $in: vehiculo.ventas.map(venta => venta._id) } }, { $set: { 'historialCompras.$.compra': null } });
        await Vendedor.updateMany({ 'ventas.venta.idVehiculo': vehiculoId }, { $set: { 'ventas.venta.idVehiculo': null } });
        
        await Vehiculo.findByIdAndRemove(vehiculoId);

        res.status(200).json({ message: 'Vehículo y sus asociaciones eliminados con éxito' });

    }catch(error){
        console.error("error al borrar el vehiculo y sus asociaciones",error);
        res.status(500).json({ error: "error al borrar el vehiculo y sus asociaciones" });
    }
});

module.exports = router;