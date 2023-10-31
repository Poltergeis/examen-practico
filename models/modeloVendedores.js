const mongoose = require("mongoose");

const modeloVendedores = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    asociaciones:{
        type: {
            marcas: {
                nombreMarca: {
                    type: String,
                    required: true
                },
                webMarca: {
                    type: URL,
                    required: false
                },
                direccionSucursal: {
                    type: String,
                    required: false
                }
            },
        },
        required: false
    },
    vehiculosEnVenta: {
        type: {
            vehiculo: {
                idVehiculo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Vehiculos'
                },
                descripcionGeneral: String //atributo que se construira automaticamente en las consultas
            }
        }
    },
    ventas: {
        type: {
            venta: {
                _id: mongoose.Schema.Types.ObjectId,
                idCliente: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Clientes'
                },
                costo: {
                    type: Number,
                    required: true
                },
                pago: {
                    type: {
                        pago: {
                            pagado: Number,
                            adeudo: Number
                        }
                    },
                    required: true
                }
            }
        },
        validate: [
            {
              validator: function(venta) {
                return venta.costo === venta.pago.pagado + venta.pago.adeudo;
              },
              message: 'El valor de "costo" debe ser igual a la suma de "pagado" y "adeudo".'
            }
          ]
    },
    devoluciones: {
        type: {
            devolucion: {
                idCliente: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Clientes'
                },
                idVehiculo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Vehiculos'
                },
                cantidadDevuelta: {
                    type: Number,
                    required: true
                }
            }
        },
        required: true
    }
});

module.exports = mongoose.model("vendedores", modeloVendedores, "Vendedores");