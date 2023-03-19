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
        subtotal: Number(producto.querySelector(".lista-prod__precio").textContent.replace("$", "").replace(".", "")),
        id: Number(producto.dataset.productId)
    }
    return productoAgregado;
}

const actualizarRendProd = (lista_prod, contenedor) => {
    contenedor.innerHTML = ""
    carrito = JSON.parse(localStorage.getItem('carrito')) || []
    let cant_act = ""
    let cant

    lista_prod.forEach((producto) => {
        cant_act = (carrito.find(prod => prod.id === producto.id)) && "activo"
        cant = (carrito.find((prod) => prod.id === producto.id))?.cantidad || 1

        const div = document.createElement('div')
        div.classList.add('col')
        const div1 = document.createElement('div')
        div1.classList.add('card')
        div1.classList.add('prod')
        div1.dataset.productId = producto.id
        div1.innerHTML += `
                        <img class="lista-prod__img infoProd" src="${producto.img}" alt="${producto.nombre}">
                        <p class="lista-prod__nombre infoProd">${producto.nombre}</p>
                        <p class="lista-prod__precio">$${producto.precio.toLocaleString("es-ES")}</p>
                        <button><i class="fa-solid fa-cart-plus agregar-carrito"></i>
                        <span class="cantidad agregar-carrito ${cant_act}">${cant}</span></button>
                        `;
        div.appendChild(div1)
        contenedor.appendChild(div)
    })
}

async function cargarStock() {
    let response
    let rutaActual = window.location.pathname
    if (rutaActual.includes("paginas"))
        response = await fetch("../data/stock.json")
    else {
        response = await fetch("./data/stock.json")
    }
    let productosStock = await response.json()
    return productosStock
}



async function crearListaProd() {
    let productosStock = await cargarStock()

    contenedor = document.querySelector('.productos.nov');
    if (contenedor){
        let lista_prod = productosStock.filter(producto => producto.precio > 25000)
        lista_prod.forEach((producto) => {
            producto.img = producto.img.replace("..", ".")
        })
        actualizarRendProd(lista_prod, contenedor)
    }
}

function rendCantProd(productoHtml, producto) {
    let cantidad = carrito.find((prod) => prod.id === producto.id)?.cantidad
    
    let prodCant = productoHtml.querySelector(".cantidad")
    prodCant.innerHTML = cantidad

    if (!prodCant.classList.contains("activo")){
        cantidad >= 1 ? prodCant.classList.add("activo") : prodCant.classList.remove("activo")
    }
    else {
        cantidad == 0 ?? prodCant.classList.remove("activo")
    }
}

function escucharEventos() {
    let contProductos = document.querySelector(".productos")
    if (contProductos)
    {
        contProductos.addEventListener("click", agregarProducto)
        contProductos.addEventListener("click", guardarInfoProd)
    }


    let contCant = document.querySelector(".productos_carrito")
    if (contCant)
    {
        contCant.addEventListener("click", editarCarrito)
    }
}

const listarProducto = () => {
    let contenedor = document.querySelector(".contenedorProducto")
    if (contenedor)
    {
        let producto = JSON.parse(localStorage.getItem("infoProducto"))
        document.querySelector(".id").textContent = producto.id
        document.querySelector(".nombreProd").textContent = producto.nombre
        document.querySelector(".precio").textContent = "$"+producto.precio.toLocaleString("ES-es")
        document.querySelector(".descripcion").textContent = producto.descripcion
        document.querySelector(".img").innerHTML = `<img class="card-img-top mb-5 mb-md-0" src=${producto.img} alt="${producto.nombre}" />`
    }

}
let editCant = document.querySelector(".editCant")
const sumRestCant = (e) => {
    let cantidad = Number(document.querySelector(".cantidadProd").textContent)
    if (e.target.classList.contains("edit"))
    {
        if (e.target.classList.contains('cant-sum'))
        {
            editCant.classList.contains("min") ? editCant.classList.remove('min') : null
            cantidad++
        }
        else if (e.target.classList.contains('cant-rest'))
        {
            cantidad > 1 ? cantidad-- : Toastify({
                text: "¡No puedes restar mas unidades de este producto!",
                gravity: "bottom",
                style: {
                    background: "red",
                }
            }).showToast()
            !editCant.classList.contains("min") && cantidad == 1 ? editCant.classList.add('min') : null
        }
        document.querySelector(".cantidadProd").textContent = cantidad.toString()
    }
}
if (editCant)
    editCant.addEventListener("click", sumRestCant)
/* Verifica en qué posición relativa del proyecto está y cambia la ruta hacia la página del prod */
const crearRutaRelativa = (nombreArchivo) => {
    let rutaActual = window.location.pathname
    let directorioActual = rutaActual.substring(0, rutaActual.lastIndexOf('/'))
    let rutaRelativa = !directorioActual.includes("paginas") ? ("./paginas/"+nombreArchivo) : directorioActual + "/" + nombreArchivo 
    return rutaRelativa;
}

async function guardarInfoProd (e){
    let producto = e.target.classList.contains("infoProd") && e.target.parentElement
    if (producto)
    {
        let id = Number(producto.dataset.productId)
        let listaStock = await cargarStock()
        producto = listaStock.find((prod) => prod.id === id)
 
        toLocalStorage("infoProducto", producto)
        let finRuta = "./paginas/producto.html"
        let rutaRelativa = crearRutaRelativa(finRuta, "producto.html")

        window.open(rutaRelativa, '_blank')
    }
}
/* Agregar producto desde su página de detalles */
let btnAgregarCarrito = document.querySelector(".agregar-carritoProd")
if (btnAgregarCarrito)
{
    btnAgregarCarrito.addEventListener("click", async () => {
        let cantidad = Number(document.querySelector(".cantidadProd").textContent)
        let id = Number(document.querySelector(".id").textContent)
        let producto = (await cargarStock()).find((prod) => prod.id === id)
        producto.cantidad = cantidad
        producto.subtotal *= cantidad

        carrito.find((prod) => prod.id === id) ? sumProductos(producto, cantidad) : carrito.push(producto)
        Toastify({
            text: "¡Producto agregado correctamente!",
            duration: "3000",
            gravity: "bottom",
            style: {
                background: "green",
            }
        }).showToast()
        toLocalStorage("carrito", carrito)
        cantProdCarrito()
    })
}

const sumProductos = (productoAgregado, cantidad) => {
    const prod = carrito.find(p => p.id === productoAgregado.id)
    prod.cantidad += cantidad
    prod.subtotal = prod.precio*prod.cantidad
}

const restProductos = (productoAgregado) => {
    const productosCarrito = carrito.map(producto => {
        if (producto.nombre === productoAgregado.nombre)
        {
            producto.cantidad--
            producto.subtotal -= producto.precio
            Toastify({
                text: "¡Producto restado correctamente!",
                gravity: "bottom",
            }).showToast()
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
    Toastify({
        text: "¡Producto eliminado correctamente!",
        duration: "3000",
        gravity: "bottom",
        style: {
            background: "orange",
        }
    }).showToast()
}

/* Verifica si el producto ya estaba o no en el carrito y lo agrega según sea el caso */
function agregarProducto(e){
    let producto = e.target.classList.contains("agregar-carrito") && e.target.parentElement.parentElement

    if (producto) {
        let productoAgregado = leerDatosProducto(producto)

        carrito.find((producto) => producto.id === productoAgregado.id) ? sumProductos(productoAgregado, 1) : carrito.push(productoAgregado)
        Toastify({
            text: "¡Producto agregado correctamente!",
            duration: "3000",
            gravity: "bottom",
            style: {
                background: "green",
            }
        }).showToast()
        rendCantProd(producto, productoAgregado)

        toLocalStorage("carrito", carrito)
        cantProdCarrito()
    }
}



const editarCarrito = (e) => {
    let producto = e.target.classList.contains("edit") && e.target.parentElement.parentElement.parentElement.parentElement

    if (producto)
    {
        let productoEditado = leerDatosProducto(producto)
        if (e.target.classList.contains('cant-sum'))
        {
            producto.classList.contains("min") ? producto.classList.remove('min') : null

            sumProductos(productoEditado, 1)

            Toastify({
                text: "¡Producto sumado correctamente!",
                duration: "3000",
                gravity: "bottom",
                style: {
                    background: "green",
                }
            }).showToast()
            rendCantProd(producto, productoEditado)
        }
        else if (e.target.classList.contains('cant-rest'))
        {
            productoEditado.cantidad > 1 ? restProductos(productoEditado) : Toastify({
                text: "¡No puedes restar mas unidades de este producto! Aprieta el ícono de cesto de basura para eliminar del carrito.",
                gravity: "bottom",
                style: {
                    background: "red",
                }
            }).showToast()
            rendCantProd(producto, productoEditado)
        }
        else if (e.target.classList.contains('eliminar-prod'))
        {
            let producto = e.target.parentElement.parentElement.parentElement
            productoEditado = leerDatosProducto(producto)
            eliminarPod(productoEditado)
            producto.remove()
        }
        toLocalStorage("carrito", carrito)
        rendPrecioTotal()
        cantProdCarrito()
        costoEnvio()
        selecInteres()
    }
}

/* Carrito de compras */

const cantProdCarrito = () => {
    let cantidadTotal = 0;

    carrito = JSON.parse(localStorage.getItem('carrito')) || carrito

    carrito.forEach(producto => {
      cantidadTotal += producto.cantidad;
    })

    const iconoCart = document.querySelector(".cantidad-carrito")
    const msjVacio = document.querySelector(".carrito_vacio")
    iconoCart.textContent = parseInt(cantidadTotal)
    
    if (carrito.length === 0)
    {
        iconoCart.classList.contains("activo") ? iconoCart.classList.remove("activo") : null
        if (msjVacio && msjVacio.classList.contains("no"))
            msjVacio.classList.remove("no")
    }
    
    else
    {
        !iconoCart.classList.contains("activo") ? iconoCart.classList.add("activo") : null
        if (msjVacio)
            msjVacio.classList.add("no")
    }


    return cantidadTotal;
}

const calcTotalCarrito = () => {
    let total = 0
    carrito = JSON.parse(localStorage.getItem('carrito')) || carrito
    carrito.forEach((producto) => {
       total += producto.subtotal
    })
    return total;
}



const actualizarRendCarrito = () => {
    const contenedor = document.querySelector(".productos_carrito")
    carrito = JSON.parse(localStorage.getItem('carrito')) || carrito

    carrito.forEach((producto) => {
        let min = ""
        
        min = producto.cantidad === 1 && "min"

        const contenedor = document.querySelector(".productos_carrito")
        const div = document.createElement('div')
        div.classList.add('card')
        div.classList.add('prod')
        div.classList.add('carrito')
        div.dataset.productId = producto.id
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
}
const contenedorCarrito = document.querySelector(".productos_carrito")

const rendPrecioTotal = () => {
    let contTotal = document.querySelector("#precio_final")
    let total = calcTotalCarrito()
    contTotal.innerHTML = `$${total.toLocaleString("es-ES")}`
}

if (contenedorCarrito)
{
    rendPrecioTotal()
    actualizarRendCarrito()
}


/* Cargar datos de envío y de tarjetas*/

let infoEnvio = document.querySelector(".infoEnvio")
if (infoEnvio)
{
    infoEnvio.addEventListener("click", () => {
        Swal.fire({
            html: "El costo del envío varía según su lugar de residencia:<br>CABA: $900<br>Provincia de Buenos Aires: $1300<br>Envíos a interior: $1600<br>¡Por compras a partir de los $100.000 el envío es gratis!",
            background: '#080b22',
            color: 'white',
        })
    })
}

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
            costoEnvio()
            tipoEntrega = e.target
            break;
        case "entregaRetiro": 
            document.querySelector("#form_direccion").classList.remove("mostrar")
            document.querySelector("#form_direccion").classList.add("ocultar")
            document.querySelector("#entregaCorreo").classList.remove("marcado")
            e.target.classList.add("marcado")
            rendCostoEnvio(0)
            tipoEntrega = e.target
            break;
        default:
            break;
    }
}

let datosCompra = document.querySelector(".datosCompra")
if(datosCompra)
{
    tipoEntrega.addEventListener("click", validarTipoEntrega)

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
    tipoEntrega.addEventListener("click", validarTipoEntrega)
}

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
            case "pred":
                break;
            default:
                costoEnvio = 1750
                break;
        }
    }
    if (tipoEntrega.id ==="entregaRetiro")
        costoEnvio = 0

    total >= 100000 ? costoEnvio = 0 : switcEnvio()
    rendCostoEnvio(costoEnvio)
    return costoEnvio
}
selectProv ? selectProv.addEventListener("click", costoEnvio) : null

let comprar = document.querySelector(".btn_comprar")
const comprarProd = () => {
    let camposCorrectos = true

    document.querySelectorAll(".div_input.direc").forEach((campo) => {
        campo.classList.contains("correcto") ? camposCorrectos : camposCorrectos = false
    })
    if (selectProv.value == "pred")
        camposCorrectos = false
    
    modal = document.getElementById("animatedModal")

    if ((camposCorrectos || tipoEntrega.id == "entregaRetiro") && carrito.length > 0)
    {
        modal.classList.remove("ocultar-ventana")
    }
    else if ((!camposCorrectos && tipoEntrega.id == "entregaCorreo") || (tipoEntrega.id != "entregaRetiro" && tipoEntrega.id != "entregaCorreo"))
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
    else if (carrito.length === 0)
    {
        modal.classList.add("ocultar-ventana")
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Debes tener al menos 1 producto en el carrito!',
            background: '#080b22',
            color: 'white'
        })
    }
    selecInteres()
}
if(comprar)
{
    comprar.addEventListener("click", comprarProd)
}

/* Recibir numero de cuotas */
const seleCuotas = document.getElementById("cantCuotas")


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
if (seleCuotas)
{
    let cantCuotas = seleCuotas.value
    seleCuotas.addEventListener("click", selecInteres)
}


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
    tipoEnvio = (tipoEnvio === "entregaCorreo") ? "Envio por Correo" : "Retira por local"
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
if (btnFinalizarCompra)
{
    btnFinalizarCompra.addEventListener("click", () => {
        let camposCorrectos = true
        document.querySelectorAll(".div_input_pago").forEach((campo) => {
            campo.classList.contains("correcto") ? camposCorrectos : camposCorrectos = false
        })
        
        if (camposCorrectos)
        {
            animacionFinCompra()
        }
    })
}

const animacionFinCompra = () => {
    document.getElementById("animatedModal").style.zIndex = "1000"
    crearPedido()
    
    Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        timer: 4000,
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
let contPedidos = document.querySelector(".listaPedidos")
const rendPedidos = () => {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

    if (pedidos && contPedidos)
    {
        contPedidos.innerHTML = ""
        pedidos.forEach((pedido) => {
            contPedidos.innerHTML += `
                <div class="row gx-3 card"  data-product-id="${pedido.id}">
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
                                <button class="modalDetalles">Ver detalle</button>
                            </div>
                        </div>
                    </div>
                </div>`
        })
    }
}
if (contPedidos)
{
    contPedidos.addEventListener("click", (e) => {
        if (e.target.classList.contains("modalDetalles"))
        {
            pedidos = JSON.parse(localStorage.getItem("pedidos")) || []
            let idPedido = Number(e.target.parentElement.parentElement.parentElement.dataset.productId)
            let pedido = pedidos.find(ped => ped.id === idPedido)
            Swal.fire({
                background: "transparent",
                width: "100%",
                html: `<div class="container-fluid">

                <div class="container infoPedido">
                  <!-- Title -->
                  <div class="d-flex justify-content-between align-items-center py-3">
                    <h2 class="h5 mb-0"><a href="#" class="text-muted"></a> Pedido #${pedido.id}</h2>
                  </div>
                
                  <!-- Main content -->
                  <div class="row">
                    <div class="col-lg-8">
                      <!-- Details -->
                      <div class="card mb-4">
                        <div class="card-body">
                          <div class="mb-3 d-flex justify-content-between">
                            <div>
                              <span class="me-3">22-11-2021</span>
                              <span class="me-3">#${pedido.id}</span>
                              <span class="me-3">Visa -1234</span>
                              <span class="badge rounded-pill bg-info">${pedido.tipoEnvio}</span>
                            </div>
                            <div class="d-flex">
                              <button class="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text"><i class="bi bi-download"></i> <span class="text">Factura</span></button>
                              <div class="dropdown">
                                <button class="btn btn-link p-0 text-muted" type="button" data-bs-toggle="dropdown">
                                  <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                  <li><a class="dropdown-item" href="#"><i class="bi bi-pencil"></i> Edit</a></li>
                                  <li><a class="dropdown-item" href="#"><i class="bi bi-printer"></i> Print</a></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <table class="table table-borderless">
                            <tbody class="prodPedido productos">

                            </tbody>
                            <tfoot>
                              <tr>
                                <td colspan="2">Subtotal</td>
                                <td class="text-end">$${pedido.subtotal.toLocaleString("ES-es")}</td>
                              </tr>
                              <tr>
                                <td colspan="2">Costo de envío</td>
                                <td class="text-end">$${pedido.costoEnvio.toLocaleString("ES-es")}</td>
                              </tr>
                              <tr class="fw-bold">
                                <td colspan="2">TOTAL</td>
                                <td class="text-end">$${pedido.total.toLocaleString("ES-es")}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                      <!-- Payment -->
                      <div class="card mb-4">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-lg-6">
                              <h3 class="h6">Método de pago:</h3>
                              <p>Visa -1234 <br>
                              <span>Total: $${pedido.total.toLocaleString("ES-es")}</span> <span class="badge bg-success rounded-pill">Pago Exitoso</span></p>
                            </div>
                            <div class="col-lg-6">
                              <h3 class="h6">Información de envío</h3>
                              <address>
                                <strong>Marcos Cáceres</strong><br>
                                General Paz 1335<br>
                                Buenos Aires, Piso 4<br>
                                <abbr title="Teléfono">P:</abbr> (+54) 9 11 1234-4563
                              </address>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <!-- Customer Notes -->
                      <div class="card mb-4">
                        <div class="card-body">
                          <h3 class="h6">Notas sobre el envío</h3>
                          <p>Sed enim, faucibus litora velit vestibulum habitasse. Cras lobortis cum sem aliquet mauris rutrum. Sollicitudin. Morbi, sem tellus vestibulum porttitor.</p>
                        </div>
                      </div>
                      <div class="card mb-4">
                        <!-- Shipping information -->
                        <div class="card-body">
                          <h3 class="h6">Información de envío</h3>
                          <strong>Correo Argentino</strong>
                          <span><a href="#" class="text-decoration-underline" target="_blank">FF1234567890</a> <i class="bi bi-box-arrow-up-right"></i> </span>
                          <hr>
                          <h3 class="h6">Dirección</h3>
                          <address>
                            <strong>Marcos Cáceres</strong><br>
                            General Paz 1335<br>
                            Buenos Aires, Piso 4<br>
                            <abbr title="Teléfono">P:</abbr> (+54) 9 11 1234-4563
                          </address>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </div>`
            })
            let productosPedido = document.querySelector(".prodPedido")
            pedido.productos.forEach((producto => {
                productosPedido.innerHTML += `
                    <tr>
                        <td>
                            <div class="d-flex mb-2">
                                <div class="flex-shrink-0" data-product-id="${producto.id}">
                                    <img src=${producto.img} alt="" width="50" class="img-fluid infoProd">
                                </div>
                                <div class="flex-lg-grow-1 ms-3">
                                    <h6 class="small mb-0" data-product-id="${producto.id}"><a href="#" class="text-reset infoProd">${producto.nombre}</a></h6>
                                </div>
                            </div>
                        </td>
                        <div class="prodPedInfo">
                            <td>${producto.cantidad}</td>
                            <td class="text-end">$${producto.subtotal.toLocaleString("ES-es")}</td>
                        </div>
                    </tr>
                `
            }))
        }
    })
}
/* Buscar productos */
const btnBuscar = document.querySelector(".buscarProducto")
let inputBuscado = document.querySelector(".search__input")
async function buscarProductos() {
    let productosStock = await cargarStock()
    let busqueda = inputBuscado.value

    let prodFiltrados = productosStock.filter((producto) => producto.nombre.toLowerCase().includes(busqueda.toLowerCase()))

    if (prodFiltrados.length > 0 && busqueda.length > 0)
    {
        toLocalStorage("busquedaProd", prodFiltrados)
        toLocalStorage("busqueda", busqueda)
        let rutaRelativa = crearRutaRelativa("productos.html")
        window.location.href = rutaRelativa
    }
    else {
        Toastify({
            text: "¡No se ha encontrado el producto buscado!",
            gravity: "top",
            style: {
                background: "red"
            }
        }).showToast()
    }
}
btnBuscar.addEventListener("click", buscarProductos)
inputBuscado.addEventListener("keydown", (e) => {
    e.keyCode === 13 ? buscarProductos() : null
})

/* Ordenamiento de productos */
const ordenSelect = document.getElementById("orden")
let listaProd = []

async function ordenarProd() {
    listaProd = listaProd.length === 0 ? await cargarStock() : listaProd
    if (ordenSelect)
    {
        const contenedor = document.querySelector('.lista-productos .productos');
        const option = ordenSelect.value
        switch (option) {
            case "mayor-precio":
                listaProd.sort((a,b) => -(a.precio - b.precio))
                actualizarRendProd(listaProd, contenedor)
                break;
            case "menor-precio":
                listaProd.sort((a,b) => a.precio - b.precio)
                actualizarRendProd(listaProd, contenedor)
                break;
            default:
                break;
        }
    }
    return listaProd
}
ordenSelect ? ordenSelect.addEventListener("change", async () => {ordenarProd()}) : null

/* Filtrado de productos */

const filtrarProductos = (tipo, listaProd) => {
    let prodFitlrados = listaProd.filter((prod) => prod.tipo === tipo)
    return prodFitlrados;
}

const tipos = {
    procesador: "Procesadores",
    gpu: "Placas de Video",
    ram: "Memorias Ram",
    almacenamiento: "Almacenamiento",
    refrigeracion: "Refrigeración",
    gabinete: "Gabinete",
    psu: "Fuentes de Poder",
    monitor: "Monitores",
    mouse: "Mouses",
    teclado: "Teclados",
    auricular: "Auriculares",
}

const contCategorias = document.querySelector(".cat-lista")
let filtro = document.querySelector(".filtro")
async function listarFiltro(e) {
    let tipoProd
    if (e)
    {
        tipoProd = e.target.getAttribute('data-value') ?? null
    }
    let busqueda = localStorage.getItem("busqueda") || null
    let contenedor = document.querySelector('.lista-productos .productos');
    let prodStock = await cargarStock()

    listaProd = JSON.parse(localStorage.getItem("busquedaProd")) || [...prodStock]
    ordenSelect ? listaProd =  await ordenarProd() : null

    if (tipoProd)
    {
        listaProd = filtrarProductos(tipoProd, listaProd)
        filtro.textContent = tipos[tipoProd]
    }
    else if (busqueda)
    {
        filtro.textContent = busqueda
    }
    actualizarRendProd(listaProd, contenedor)
    localStorage.removeItem("busquedaProd")
    localStorage.removeItem("busqueda")
}

if (contCategorias)
{
    contCategorias.addEventListener("click", listarFiltro)
    listarFiltro()
}

let btnCompra = document.getElementById("btnComprar")
if (btnCompra)
    $("#btnComprar").animatedModal({
        color: '#26223093'
    })

crearListaProd()
escucharEventos()
cantProdCarrito()
rendPedidos()
listarProducto()