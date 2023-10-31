const mongoose = require("mongoose");

const modeloVehiculo = mongoose.Schema({
    modelo: {
        type: String,
        required: true
    },
    año: Date,
    color: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    estado:{
        type: String,
        validate: {
            validator: function(value) {
              const coloresAceptados = ["nuevo", "usado","Nuevo","Usado"];
              return coloresAceptados.includes(value);
            },
            message: props => `${props.value} no es un estado válido. Los estados del vehiculo aceptados son "nuevo" y "usado".`
          },
          required: true
    }
});

module.exports = mongoose.model("vehiculo", modeloVehiculo, "Vehiculos");