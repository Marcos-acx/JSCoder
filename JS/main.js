 let carrito = [];
 let pedidos = [];

 function toLocalStorage(clave, variable) {
    let valor = JSON.stringify(variable)
    localStorage.setItem(clave, valor)
}

function leerDatosProducto(producto) {
    const productoAgregado = {
        nombre: producto.querySelector(".lista-prod__nombre").textContent,
        precio: Number(producto.querySelector(".lista-prod__precio").textContent.replace("$", "").replace(".", "")),
        img: producto.querySelector(".lista-prod__img").src,
        cantidad: Number(producto.querySelector(".cantidad").textContent),
        subtotal: Number(producto.querySelector(".lista-prod__precio").textContent.replace("$", "").replace(".", ""))
    }
    return productoAgregado;
}

const actualizarRendProd = (lista_prod, contenedor) => {
    contenedor.innerHTML = ""
    carrito = JSON.parse(localStorage.getItem('carrito')) || []

    lista_prod.forEach((producto) => {
        cant_act = (carrito.find(prod => prod.nombre === producto.nombre)) && "activo"
        cant = (carrito.find((prod) => prod.nombre === producto.nombre))?.cantidad || 1

        const div = document.createElement('div')
        div.classList.add('col')
        const div1 = document.createElement('div')
        div1.classList.add('card')
        div1.classList.add('prod')
        div1.innerHTML += `
                        <img class="lista-prod__img" src="${producto.img}" alt="${producto.nombre}">
                        <p class="lista-prod__nombre">${producto.nombre}</p>
                        <p class="lista-prod__precio">$${producto.precio.toLocaleString("es-ES")}</p>
                        <button><i class="fa-solid fa-cart-plus agregar-carrito"></i></button>
                        <span class="cantidad agregar-carrito ${cant_act}">${cant}</span>
                        `;
        div.appendChild(div1)
        contenedor.appendChild(div)
    })
}

const crearListaProd = () => {
    let contenedor = document.querySelector('.lista-productos .productos');
    if (contenedor)
        actualizarRendProd(productos, contenedor)

    contenedor = document.querySelector('.productos.nov');
    if (contenedor){
        let lista_prod = productos.filter(producto => producto.precio > 25000)
        lista_prod.forEach((producto) => {
            producto.img = producto.img.replace("..", ".")
        })
        actualizarRendProd(lista_prod, contenedor)
    }
}

function escucharEventos() {
    let contProductos = document.querySelector(".productos")
    contProductos ? contProductos.addEventListener("click", agregarProducto) : contProductos

    let contCant = document.querySelector(".productos_carrito")
    contCant ? contCant.addEventListener("click", editarCarrito) : contCant
}

const sumProductos = (productoAgregado) => {
    const productosCarrito = carrito.map(producto => {
        if (producto.nombre === productoAgregado.nombre)
        {
            producto.cantidad++
            producto.subtotal = producto.precio*producto.cantidad
            return producto
        }
        else
            return producto
    })
    carrito = [...productosCarrito];
}

const restProductos = (productoAgregado) => {
    const productosCarrito = carrito.map(producto => {
        if (producto.nombre === productoAgregado.nombre)
        {
            producto.cantidad--
            producto.subtotal -= producto.precio
            return producto
        }
        else
            return producto
    })
    carrito = [...productosCarrito];
}

const eliminarPod = (productoEliminado) => {
    let index = carrito.findIndex(producto => producto.nombre === productoEliminado.nombre)
    carrito.splice(index, 1)
}

/* Verifica si el producto ya estaba o no en el carrito y lo agrega según sea el caso */
function agregarProducto(e){
    let productoAgregado, producto

    producto = e.target.classList.contains("agregar-carrito") && e.target.parentElement.parentElement
    producto ? productoAgregado = leerDatosProducto(producto) : productoAgregado

    if (producto)
        carrito.find((producto) => producto.nombre === productoAgregado.nombre) ? sumProductos(productoAgregado) : carrito.push(productoAgregado)
    
    toLocalStorage("carrito", carrito)
    actualizarRendCarrito()
    crearListaProd()
    cantProdCarrito()
}

const editarCarrito = (e) => {
    let productoEditado 

    let producto = e.target.classList.contains("edit") && e.target.parentElement.parentElement.parentElement.parentElement
    producto ? productoEditado = leerDatosProducto(producto) : productoEditado

    if (e.target.classList.contains('cant-sum'))
    {
        if (producto.classList.contains('min')) {
            producto.classList.remove('min')
        }
        sumProductos(productoEditado)
    }
    else if (e.target.classList.contains('cant-rest'))
    {
            if (productoEditado.cantidad > 1) {
                restProductos(productoEditado)
            }
    }

    else if (e.target.classList.contains('eliminar-prod'))
    {
        let producto = e.target.parentElement.parentElement.parentElement
        productoEditado = leerDatosProducto(producto)
        eliminarPod(productoEditado)
    }

    toLocalStorage("carrito", carrito)
    actualizarRendCarrito()
    crearListaProd()
    cantProdCarrito()
}

/* Carrito de compras */
const btnAbrirCarrito = document.querySelector(".header__cart")
const btnCerrarCarrito = document.querySelector(".cerrar_carrito")
const ventana_carrito = document.querySelector(".ventana_carrito")
const main = document.querySelector(".main")

const abrirCerrarCarrito = () => {

    btnAbrirCarrito.addEventListener("click", function() {
        actualizarRendCarrito()

        if (!ventana_carrito.classList.contains("abierto"))
        {
            ventana_carrito.classList.add("abierto")
            main.classList.add("ocultar")
        }
        else
            cerrarCarrito()
    })

    btnCerrarCarrito.addEventListener("click", cerrarCarrito)
    function cerrarCarrito() {
        ventana_carrito.classList.remove("abierto")
        main.classList.remove("ocultar")
    }
    
}

const cantProdCarrito = () => {
    let cantidadTotal = 0;

    carrito = JSON.parse(localStorage.getItem('carrito')) || carrito

    carrito.forEach(producto => {
      cantidadTotal += producto.cantidad;
    });

    const iconoCart = document.querySelector(".cantidad-carrito")
    const msjVacio = document.querySelector(".carrito_vacio")
    iconoCart.innerHTML = parseInt(cantidadTotal)
    
    if (carrito.length == 0)
    {
        document.querySelector(".productos_carrito").classList.add("ocultar-ventana")
        document.querySelector(".info_compra").classList.add("ocultar-ventana")
        if (iconoCart.classList.contains("activo")) {
            iconoCart.classList.remove("activo")
            if (msjVacio.classList.contains("no"))
                msjVacio.classList.remove("no")
        }
    }
    else
    {
        document.querySelector(".productos_carrito").classList.remove("ocultar-ventana")
        document.querySelector(".info_compra").classList.remove("ocultar-ventana")
        msjVacio.classList.add("no")
        if (!iconoCart.classList.contains("activo")) {
            iconoCart.classList.add("activo")
           
        }
    }
    return cantidadTotal;
}

const calcTotalCarrito = () => {
    let total = 0
    carrito.forEach((producto) => {
       total += producto.subtotal
    })
    return total;
}

const actualizarRendCarrito = () => {
    const contenedor = document.querySelector(".productos_carrito")
    contenedor.innerHTML = ""
    carrito = JSON.parse(localStorage.getItem('carrito')) || carrito

    carrito.forEach((producto) => {
        let min = ""
        
        min = producto.cantidad === 1 && "min"

        const contenedor = document.querySelector(".productos_carrito")
        const div = document.createElement('div')
        div.classList.add('card')
        div.classList.add('prod')
        div.classList.add('carrito')
        div.innerHTML += `
                        <img class="lista-prod__img" src="${producto.img}" alt="">
                        <p class="lista-prod__nombre">${producto.nombre}</p>
                        <p class="lista-prod__precio">$${producto.subtotal.toLocaleString("es-ES")}</p> 
                        <div class="carrito-cant">
                            <button><span><i class="fa-solid fa-plus edit cant-sum"></i></span></button>
                            <span class="cantidad">${producto.cantidad}</span>
                            <button><span><i class="fa-solid fa-minus edit cant-rest ${min}"></i></span></button>
                        </div>
                        <button><span><i class="fa-solid fa-trash-can edit eliminar-prod"></i></span></button>
                        `
        contenedor.appendChild(div)
    })

    let contTotal = document.querySelector("#precio_final")
    let total = calcTotalCarrito()
    contTotal.innerHTML = `$${total.toLocaleString("es-ES")}`
}




/* Cargar datos de envío y de tarjetas*/

let infoEnvio = document.querySelector(".infoEnvio")
infoEnvio.addEventListener("click", () => {
    Swal.fire({
        html: "El costo del envío varía según su lugar de residencia:<br>CABA: $900<br>Provincia de Buenos Aires: $1300<br>Envíos a interior: $1600<br>¡Por compras a partir de los $100.000 el envío es gratis!",
        background: '#080b22',
        color: 'white',
    })
})



let formEnvio = document.querySelector("#form_direccion")
let formTarj = document.querySelector(".datosTarjeta")
let inputEnvio = document.querySelectorAll("#form_direccion input")
let inputTarj = document.querySelectorAll(".datosTarjeta input")


const expresiones = {
    direccion: /^[a-zA-ZÁ-ÿ0-9\s\,]{10,40}$/,
    cp: /^\d{4,6}$/,
    municipio: /^[a-zA-ZÁ-ÿ\s]{4,40}$/,
    tarjeta: /^(?:\d{15,16}|\d{4}(?:(?:\s+\d{4}){3}|\s+\d{6}\s\d{5}))$/,
    nombre: /^[a-zA-ZÁ-ÿ\s]{7,40}$/
}

const cambiarInput = (expresion, grupo, e) => {
    if (expresion.test(e.target.value)) {
        document.querySelector(grupo).classList.remove("incorrecto")
        document.querySelector(grupo).classList.add("correcto")
    } else {
        document.querySelector(grupo).classList.remove("correcto")
        document.querySelector(grupo).classList.add("incorrecto")
    }
}

const validarInput = (e) => {
    switch (e.target.name) {
        case "direccion":
            cambiarInput(expresiones.direccion, ".grupo_direccion", e)
            break;
        case "cp":
            cambiarInput(expresiones.cp, ".grupo_cp", e)
            break;
        case "municipio":
            cambiarInput(expresiones.municipio, ".grupo_municipio", e)
            break;
        case "nombre":
            cambiarInput(expresiones.nombre, ".grupo_nombre", e)
            break;
        case "tarjeta":
            cambiarInput(expresiones.tarjeta, ".grupo_numeroTarj", e)
            break;
        default:
            break;
    }
}

inputEnvio.forEach((input) => {
    input.addEventListener("keyup", validarInput)
    input.addEventListener("blur", validarInput)
})
inputTarj.forEach((input) => {
    input.addEventListener("keyup", validarInput)
    input.addEventListener("blur", validarInput)
})
/* Controlar input de fecha de expiración */
const inputFechaExp = document.querySelector(".fechaExp")
inputFechaExp.addEventListener("input", (e) => {
    const input = e.target.value
  
    // Remover todos los dígitos no números
    const inputValue = input.replace(/\D/g,'')
    
    // Sólo permitir 4 dígitos
    if (inputValue.length > 4) {
      e.target.value = `${inputValue.slice(0,2)}/${inputValue.slice(2,4)}`
      return;
    }
    
    // Añadir una barra después del 2do dígito
    else if (inputValue.length > 2) {
      e.target.value = `${inputValue.slice(0,2)}/${inputValue.slice(2)}`
      return;
    }
    
    // Solo setear el value si es de 2 dígitos o menos
    e.target.value = inputValue
})

/* Controlar input del cvv */
const inputCvv = document.querySelector(".cvv")
inputCvv.addEventListener("input", (e) => {
    const input = e.target.value
    const inputValue = input.replace(/\D/g,'')

    if (inputValue.length > 3)
    {
        e.target.value = inputValue.slice(0,3)
        return;
    }
    e.target.value = inputValue
})


const rendCostoEnvio = (costoEnvio) => {
    document.getElementById("precio_envio").innerHTML = `$${costoEnvio.toLocaleString("es-ES")}`
}

let tipoEntrega = document.querySelector(".tipo_envio")
const validarTipoEntrega = (e) => {
    switch (e.target.id) {
        case "entregaCorreo":
            document.querySelector("#form_direccion").classList.remove("ocultar")
            document.querySelector("#form_direccion").classList.add("mostrar")
            document.querySelector("#entregaRetiro").classList.remove("marcado")
            e.target.classList.add("marcado")
            break;
        case "entregaRetiro": 
            document.querySelector("#form_direccion").classList.remove("mostrar")
            document.querySelector("#form_direccion").classList.add("ocultar")
            document.querySelector("#entregaCorreo").classList.remove("marcado")
            e.target.classList.add("marcado")
            rendCostoEnvio(0)
            break;
        default:
            break;
    }
}
tipoEntrega.addEventListener("click", validarTipoEntrega)

let selectProv = document.getElementById("select-provincia")
const costoEnvio = () => {
    let prov = selectProv.value
    let costoEnvio
    let total = calcTotalCarrito()

    switcEnvio = () => {
        switch (prov) {
            case "caba":
                costoEnvio = 900
                break;
            case "pba":
                costoEnvio = 1200
            break;
            default:
                costoEnvio = 1750
                break;
        }
    }

    total >= 100000 ? costoEnvio = 0 : switcEnvio()
    rendCostoEnvio(costoEnvio)
    return costoEnvio
}
selectProv.addEventListener("click", costoEnvio)

let comprar = document.querySelector(".btn_comprar")
comprar.addEventListener("click", () => {
    let camposCorrectos = true

    document.querySelectorAll(".div_input.direc").forEach((campo) => {
        campo.classList.contains("correcto") ? camposCorrectos : camposCorrectos = false
    })
    modal = document.getElementById("animatedModal")
    if (camposCorrectos || tipoEntrega.id == "entregaRetiro")
    {
        modal.classList.remove("ocultar-ventana")
    }
    else if (!camposCorrectos && tipoEntrega.id == "entregaCorreo")
    {
        modal.classList.add("ocultar-ventana")
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Debes completar correctamente todos los datos de envío!',
            background: '#080b22',
            color: 'white'
        })
    }
})
/* Recibir numero de cuotas */
const seleCuotas = document.getElementById("cantCuotas")
let cantCuotas = seleCuotas.value

const selecInteres = () => {
    let interes
    cantCuotas = Number(seleCuotas.value)
    switch (cantCuotas) {
        case 1:
            interes = 0
            break;
        case 3:
            interes = 0.1
            break;
        case 6:
            interes = 0.19
            break;
        case 12:
            interes = 0.27
            break;
        default:
            break;
    }
    let totalFinal = calcTotalFinal(interes)
    rendTotalFinal(totalFinal)
    return interes;
}
seleCuotas.addEventListener("click", selecInteres)

const calcTotalFinal = (interes) => {
    let subtotal = calcTotalCarrito()
    let costodeEnvio = costoEnvio()

    return (total = (subtotal*interes)+subtotal+costodeEnvio)
}

class pedido {
    constructor(productos, costoEnvio, subtotal, tipoEnvio, cuotas, interes, id) {
        this.productos = productos
        this.costoEnvio = costoEnvio
        this.subtotal = subtotal
        this.tipoEnvio = tipoEnvio
        this.cuotas = cuotas
        this.interes = interes
        this.total = subtotal + costoEnvio + interes
        this.id = id
    }
}

/* Obtener un número aleatorio entre el 1 y el 100.000 */
const nRandom = () => {
    let min = Math.ceil(1)
    let max = Math.floor(100000)
    return Math.floor(Math.random() * (max - min) + min)
}

/* Guardar pedido */

const crearPedido = () => {
    let subtotal = calcTotalCarrito()
    let costodeEnvio = costoEnvio() || 0
    let interes = selecInteres()
    let cuotas = Number(seleCuotas.value)
    let tipoEnvio = document.querySelector(".marcado").id
    let id = nRandom()
    const nuevoPedido = new pedido(carrito, costodeEnvio, subtotal, tipoEnvio, cuotas, interes, id)
    pedidos = JSON.parse(localStorage.getItem("pedidos")) || pedidos
    pedidos.push(nuevoPedido)
    toLocalStorage("pedidos", pedidos)
}


/* Renderizar total final */
const rendTotalFinal = (totalFinal) => {
   document.querySelector(".totalFinal").innerHTML = `$${totalFinal.toLocaleString("es-ES")}`
}

const btnFinalizarCompra = document.getElementById("finalizarCompra")
btnFinalizarCompra.addEventListener("click", () => {
    let camposCorrectos = true

    document.querySelectorAll(".div_input").forEach((campo) => {
        campo.classList.contains("correcto") ? camposCorrectos : camposCorrectos = false
    })

    if (camposCorrectos)
    {
        animacionFinCompra()
    }
})

const animacionFinCompra = () => {
    document.getElementById("animatedModal").style.zIndex = "1000"
    crearPedido()
    Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        timer: 5000,
        didClose: () => {
            Swal.fire ({
                icon: 'success',
                title: '¡Compra realizada!',
                background: '#080b22',
                color: 'white',
            }).then(() => {
                localStorage.removeItem("carrito")
                carrito = []
                location.reload()
            })
        }
      });
      Swal.showLoading();
}

/* Renderizar pedidos en página de usuario */
const rendPedidos = () => {
    let contPedidos = document.querySelector(".listaPedidos")
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || []
    console.log(pedidos);

    if (pedidos && contPedidos)
    {
        contPedidos.innerHTML = ""
        pedidos.forEach((pedido) => {
            contPedidos.innerHTML += `
                <div class="row gx-3 card">
                        <div class="col-6">
                            <div class="d-flex flex-column">
                                <p>N° de pedido: <span class="numPedido">${pedido.id}</span></p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="d-flex flex-column">
                                <p class="cantProductos">Cantidad de productos: ${pedido.productos.length}</p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="d-flex flex-column">
                                <p class="total">Monto: <span>$${pedido.total.toLocaleString("es-ES")}</span></p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="d-flex flex-column">
                                <button>Ver detalle</button>
                            </div>
                        </div>
                    </div>
                </div>`
        })
    }
}

console.log(pedidos);
$("#btnComprar").animatedModal({
    color: '#26223093'
})
crearListaProd()
abrirCerrarCarrito()
escucharEventos()
cantProdCarrito()
costoEnvio()
selecInteres()
rendPedidos()