const mongoose = require("mongoose");

const modeloClientes = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        validate: {
            validator: function(value) {
                const formatoValido = /^(\d{3}-\d{3}-\d{4}|\d{3}-\d{3}-\d{2}-\d{2})$/;
              return formatoValido.test(value);
            },
            message: props => `${props.value} es un formato de numero telefonico incorrecto, los formatos aceptados son XXX-XXX-XXXX o XXX-XXX-XX-XX".`
          },
          required: true
    },
    historialCompras: {
        type: {
            compra:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'vendedores.ventas'
            }]
        },
        required: false
    }
});

module.exports = mongoose.model("clientes", modeloClientes, "Clientes");