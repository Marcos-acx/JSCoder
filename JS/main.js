const carrito = [];
const infoPago =
    {
        subtotal: 0,
        costoEnvio: 0,
        cuotas: 1,
        interes: 0,
    };
const optIncorrecta = () => {
    alert("La opción elegida es incorrecta.")
}

const mostrarProductos = (listProductos) => {
    const listaOrdenada = listProductos.map(producto => {
        return '- '+producto.nombre+': $'+producto.precio});
    alert("Productos en stock:\n\n"+listaOrdenada.join('\n\n'))
}

const mostrarCarrito = () => {
    
    const carritoAlert = carrito.map(producto => {
        return '\t '+producto.cantidad+' '+producto.nombre+': $'+producto.precio
    });
    let subtotal = calcSubtotal()
    alert("Carrito:\n\n"+carritoAlert.join('\n\n')+"\n\n\t Subtotal: $"+infoPago.subtotal)
    return carritoAlert
}

const ordenar = () => {
    let listProductos = []
    const ordenar = parseInt(prompt("¿Cómo deseas ordenar la lista de productos?\n\t 1: Mayor a menor.\n\t 2: Menor a mayor.\nEn caso de no querer ordenar ingrese '0' (Cero)."))

    switch (ordenar) {
        case 1:
            listProductos = productos.sort((a,b) => b.precio - a.precio);
            break;
        case 2:
            listProductos = productos.sort((a,b) => a.precio - b.precio);
            break;
        case 0:
            break;
        default:
            optIncorrecta();
    }
    return listProductos;
}

const buscarProductos = (productosFilt, productosOrd) => {
    let tipoProducto = '';
    do{
        tipoProducto = prompt("Ingrese el tipo de producto que desea buscar: \n\t Mother\n\t Ram\n\t Procesador\n\t Placa de video")
        productosFilt = productosOrd.filter(producto => producto.tipo === tipoProducto.toLowerCase())

        if (productosFilt.length == 0)
            optIncorrecta()
    } while (productosFilt.length == 0)
    return productosFilt;
}

const agregarProductos = (listProductos) => {
    let indiceProd
    let producto
    let cantidad

    do{
        const listaOrdenada = listProductos.map(producto => {
            return listProductos.indexOf(producto)+'- '+producto.nombre+': $'+producto.precio
        });
        indiceProd = parseInt(prompt("Ingrese el número del producto que desee agregar al carrito:\n\nProductos en stock:\n\n "+listaOrdenada.join('\n\n')))
    } while (indiceProd < 0 && indiceProd >= listProductos.length)

    producto = listProductos[indiceProd]

    do {
        cantidad = parseInt(prompt("Cuántas unidades desea agregar del producto "+listProductos[indiceProd].nombre+"?"))
        if (cantidad <= 0)
            alert("¡La cantidad debe ser mayor que 0!")
    } while(cantidad <= 0)

    agregarCarrito(producto, cantidad)
} 

const agregarCarrito = (producto, cantidad) => {

    if (carrito.includes(producto))
        carrito[carrito.indexOf(producto)].cantidad += cantidad;
    
    else
    {
        producto.cantidad += cantidad
        carrito.push(producto)
    }
}

const quitarCarrito = () => {
    let indiceProd, cantidad

    const carritoAlert = carrito.map(producto => {
        return carrito.indexOf(producto)+': '+producto.nombre+': $'+producto.precio+'\n\t Cantidad: '+producto.cantidad
    });

    do {
        indiceProd = parseInt(prompt("Ingresa el número de producto que deseas retirar del carrito.\n\n\nCarrito:\n\n"+carritoAlert.join("\n\n")))
        if (indiceProd < 0 || indiceProd >= carrito.length)
            optIncorrecta
    } while (indiceProd < 0 || indiceProd >= carrito.length)

    do {
        cantidad = parseInt(prompt("¿Cuántas unidades de "+carrito[indiceProd].nombre+" deseas retirar del carrito?\n\t Unidades en carrito: "+carrito[indiceProd].cantidad))
        if (cantidad > carrito[indiceProd].cantidad)
            alert("La cantidad ingresada excede a la cantidad disponible en el carrito.")
    } while(cantidad > carrito[indiceProd].cantidad)

    if (cantidad == carrito[indiceProd].cantidad)
        carrito.splice(indiceProd, 1);
    else
        carrito[indiceProd].cantidad -= cantidad;

    mostrarCarrito()
}

const confirmarCompra = (productosOrd) => {
    let productosFilt = []
    let compraConfirmada = false
    let opt = parseInt(prompt("Menú de compra:\n\n\t 1: Agregar más productos al carrito.\n\n\t 2: Quitar productos del carrito.\n\n\t 3: Confirmar compra."))
    do {
        switch (opt) {
            case 1:
                productosFilt = buscarProductos(productosFilt, productosOrd)
                agregarProductos(productosFilt)
                break;
            case 2:
                if (carrito.length > 0)
                    quitarCarrito();
                else
                    alert("¡El carrito está vacío!");
                break;
            case 3:
                if (carrito.length > 0)
                    compraConfirmada = true
                else
                    alert("¡El carrito está vacío!");
                break;
            default:
                optIncorrecta()
                break;
        }
    } while (opt < 1 || opt > 3)
    return compraConfirmada;
}

const calcSubtotal = () => {
    let subtotal = 0

    for (const producto of carrito) {
        subtotal += producto.cantidad*producto.precio
    }
    infoPago.subtotal = subtotal
}

const calcEnvio = () => {
    let costoEnvio
    let opt = parseInt(prompt("Ingrese la opción que desee para la entrega del pedido:\n\t 1 - Retiro en persona.\n\t 2 - Envío por mensajería.\n(¡Para pedidos de más de $300.000 el envío es gratis para todo el país!)"))
    do {
        switch (opt)
        {
            case 1:
                costoEnvio = 0
                break;
            case 2:
                let optEnvio = parseInt(prompt("Elija su ciudad/provincia de residencia:\n\t 1 - Ciudad de Buenos Aires.\n\t 2 - Provincia de Buenos Aires.\n\t 3 - Otra provincia."))
                if (infoPago.subtotal >= 300000)
                    costoEnvio = 0
                else
                {
                    switch (optEnvio) {
                        case 1:
                            costoEnvio = 500
                            break;
                        case 2:
                            costoEnvio = 800
                            break;
                        case 3:
                            costoEnvio = 1400
                            break;
                        default:
                            alertIncorrecto()
                            break;
                    }
                }
                break;
            default:
                alertIncorrecto()
        }
    } while (opt < 1 || opt > 2)
    
    infoPago.costoEnvio += costoEnvio

}

const calCuotas = (optCuotas, interes) => {

    switch (optCuotas) {
        case 1:
            interes = 0.15
            break;
        case 3:
            interes = 0.22
            break;
        case 6:
            interes = 0.33
            break;
        case 12:
            interes = 0.46
            break;
        default:
            alertIncorrecto()
    }
    return interes;
}

const formaPago = () => {
    let interes
    let optCuotas

    let opt = parseInt(prompt("Elige tu método de pago:\n\t 1 - Transferencia/efectivo\n\t 2 - Tarjeta de débito (10% de interés).\n\t 3 - Tarjeta de crédito"))
    do {
        switch (opt)
        {
            case 1:
                interes = 0
                alert("La información para realizar la transferencia o el pago en efectivo será enviada en la brevedad a tu correo electrónico.")
                break;
            case 2:
                interes = 0.1
                break;
            case 3:
                do {
                    optCuotas = parseInt(prompt("Ingrese el número de cuotas que desee:\n\t - 1 cuota (15% de interés)\n\t - 3 cuotas (22% de interés)\n\t - 6 cuotas (33% de interés)\n\t - 12 cuotas (46% de interés)"))
                    interes = calCuotas(optCuotas, interes)
                } while (optCuotas != 1 && optCuotas != 3 && optCuotas != 6 && optCuotas != 12)

                infoPago.cuotas = optCuotas
                break;
            default:
                alertIncorrecto();
        }
    } while (opt < 1 || opt > 3)

    infoPago.interes = interes
}

const calcTotal = () => {
    let total

    calcEnvio()
    formaPago()

    total = (infoPago.subtotal*(infoPago.interes+1))+infoPago.costoEnvio

    return total;
}

const alertFinCom = (total) => {
    const carritoAlert = mostrarCarrito()
    valorCuota = (infoPago.subtotal*(1+infoPago.interes))/infoPago.cuotas

    let fin = confirm("¿Desea finalizar la compra?\n\nCarrito:\n\n"+carritoAlert.join("\n")+"\n\nSubtotal: $"+infoPago.subtotal+"\n\nCuotas: "+infoPago.cuotas+"  \t$"+valorCuota+" C/u"+"\n\nIntereses: "+(infoPago.interes*100)+"%\n\nCosto de envío: $"+infoPago.costoEnvio+"\n\n\t Total: $"+total)
    if (fin)
        alert("¡Compra completada!\n¡Gracias por confiar en nosotros!, los detalles de la compra y el recibo correspondiente será enviado a su mail.")
    else
        alert("Compra cancelada.")
}

const iniciarCompra = () => {
    let productosOrd = []
    let compraConfirmada
    let total
    mostrarProductos(productos)

    productosOrd = ordenar();
    mostrarProductos(productosOrd)
    
    do {
        compraConfirmada = confirmarCompra(productosOrd)
    } while (compraConfirmada == false)

    calcSubtotal()
    total = calcTotal()
    alertFinCom(total)
}
iniciarCompra();
