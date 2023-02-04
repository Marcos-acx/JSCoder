/* Simulador de un carrito de compras con productos que el cliente ya ingresó con anterioridad, en el cual puede quitar y agregar productos. */
alert("¡Bienvenido a Cybertech!\n\tCarrito de compras")
const comprarProd = () => {
    let subtotal = 344500
    let seguir = false
    let opt 
    let mod_carrito
    
    seguir = confirm("Tienes los siguientes productos en el carrito:\n\t1 i7 12700kf - $105.000\n\t1 RTX 3070 Ti - $200.000\n\t1 SSD M.2 1Tb 5000Mb/s - $25.000\n\t1 RAM 8Gb 3200Mhz - $14.500\n¿Desea continuar con la compra?")

    while (seguir == true)
    {
        opt = parseInt(prompt("Ingrese el número de alguna las opciones:\n\t1 - Comprar todo.\n\t2 - Agregar o quitar productos y comprar."))
        switch (opt) {
            case 1:
                seguir = false
                break;
            case 2:
                mod_carrito = parseInt(prompt("1 - Agregar productos.\n2 - Quitar productos y comprar."))
                if (mod_carrito != 1 && mod_carrito != 2)
                    alertIncorrecto()
                else
                    if (mod_carrito == 2)
                        seguir = false
                    subtotal = calcSubtotal(subtotal, mod_carrito)
                break;
            default:
                alertIncorrecto()
        }
    }
    alert("Subtotal: $"+subtotal+".")
    return subtotal;
};

const alertIncorrecto = () => {
    alert("El número ingresado es incorrecto.")
    return 0;
}

const calcSubtotal = (subtotal, mod_carrito) => {
    let prod = 0
    let i = 1
    let seguir = false

    if (mod_carrito == 2)
        i *= (-1)
    do 
    {
        if (mod_carrito == 1)
        {
            prod = parseInt(prompt("Elige qué producto quieres sumar:\n\t1 - i7 12700kf: $105.000\n\t2 - RTX 3070 Ti: $200.000\n\t3 - SSD M.2 1Tb 5000Mb/s: $25.000\n\t4 - RAM 8Gb 3200Mhz: $14.500"))
            i *= parseInt(prompt("¿Cuántas unidades deseas sumar?"))
        }
        else
            prod = parseInt(prompt("Elige qué producto quieres restar:\n\t1 - i7 12700kf: $105.000\n\t2 - RTX 3070 Ti: $200.000\n\t3 - SSD M.2 1Tb 5000Mb/s: $25.000\n\t4 - RAM 8Gb 3200Mhz: $14.500"))
        switch (prod)
        {
            case 1:
                subtotal += i*105000
                break;
            case 2:
                subtotal += i*200000
                break;
            case 3:
                subtotal += i*25000
                break;
            case 4:
                subtotal += i*14500
                break;
            default:
                alertIncorrecto()
                seguir = true;
         }
        if (seguir == false && mod_carrito == 1)
            seguir = confirm("¿Desea sumar mas productos?")
    } while (seguir == true)

    return subtotal;
}

const calcEnvio = (subtotal) => {
    let subtotalEnvio
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
                if (subtotal >= 300000)
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
    subtotalEnvio = (costoEnvio + subtotal)
    
    alert("Costo de envío: $"+costoEnvio+".\n Costo del pedido: $"+subtotal+".\n Subtotal: $"+subtotalEnvio+".")
    return subtotalEnvio;
}

const formaPago = (subtotalEnvio) => {
    let subtotalInteres
    let costoInteres
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
                alert("1 Pago - 10% Interes: $"+(subtotalEnvio*interes)+".")
                costoInteres = subtotalEnvio*interes + subtotalEnvio
                break;
            case 3:
                do {
                    optCuotas = parseInt(prompt("Ingrese el número de cuotas que desee:\n\t - 1 cuota (15% de interés)\n\t - 3 cuotas (22% de interés)\n\t - 6 cuotas (33% de interés)\n\t - 12 cuotas (46% de interés)"))
                    interes = calCuotas(optCuotas, interes)
                } while (optCuotas != 1 && optCuotas != 3 && optCuotas != 6 && optCuotas != 12)
                costoInteres = subtotalEnvio*interes
                alert("Intereses: %"+(interes*100)+" - $"+costoInteres)
                break;
            default:
                alertIncorrecto();
        }
    } while (opt < 1 || opt > 3)
    subtotalInteres = costoInteres + subtotalEnvio
    return subtotalInteres;
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

const msjCompra = (subtotal, subtotalInteres, subtotalEnvio,) => {
    let comprar = confirm("Información final del pedido:\n\t - Costo de los productos: $"+subtotal+"\n\t - Envío: $"+(subtotalEnvio-subtotal)+".\nIntereses: $"+(subtotalInteres-subtotalEnvio)+".\nTotal Final: $"+subtotalInteres+".\n¿Desea completar esta compra?")
    if (comprar = false)
        alert("Compra cancelada.")
    else
        alert("¡Compra completada!\n¡Gracias por confiar en nosotros!, los detalles de la compra y el recibo correspondiente será enviado a su mail.")
    return
}
const subtotal = comprarProd()
const subtotalEnvio = calcEnvio(subtotal) 
const subtotalInteres = formaPago(subtotalEnvio)
const valorCuota = msjCompra(subtotal, subtotalInteres, subtotalEnvio)