const productos =
[
    {
        id: 1, 
        nombre: "Procesador Intel i5 11600k",
        tipo: "procesador",
        socket: "LGA 1200",
        descripcion: "Pensado para el uso más versátil, es el procesador más potente de la linea i5 de la 11va generación, ideal para edición, multitareas y ser compatible con cualquier placa de video del mercado sin problemas.",
        precio: 55000,
        cantidad: 0,
        img: "../imagenes/producto-ej.png"

    },
    {
        id: 2,
        nombre: "Kingston Hyperx Cloud ii",
        tipo: "auriculares",
        descripcion: "Con los HyperX Cloud II no te perdés ningún detalle y escuchás el audio tal y como fue diseñado por los creadores. El diseño over-ear brinda una comodidad insuperable gracias a sus suaves almohadillas. Al mismo tiempo, su sonido envolvente del más alto nivel se convierte en el protagonista de la escena.",
        precio: 17000,
        cantidad: 0,
        img: "../imagenes/producto-ej4.png"
    },
    {
        id: 3,
        nombre: "Nvidia Geforce GTX 1050ti Gigabyte",
        tipo: "placa de video",
        descripcion: "Este componente electrónico procesa la información que llega al dispositivo y los transforma en imágenes o videos para mostrarla visualmente. Es ideal para trabajar con aplicaciones gráficas ya que permite obtener imágenes más nítidas.",
        precio: 45700,
        cantidad: 0,
        img: "../imagenes/producto-ej5.png"
    },
    {
        id: 4,
        nombre: "2x8 GB Ram ddr4 Hyperx Fury 2666Mhz",
        tipo: "ram",
        ddr: 4,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 14500,
        cantidad: 0,
        img: "../imagenes/producto-ej3.png"
    },
    {
        id: 5,
        nombre: "2x8 GB Ram G-Skill Patriot TridentZ 3200Mhz",
        tipo: "ram",
        ddr: 4,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 18560,
        cantidad: 0,
        img: "../imagenes/ram-gskill.png"
    },
    {
        id: 9,
        nombre: "2x8 GB Ram XPG Spectrix Rog 3600Mhz",
        tipo: "ram",
        ddr: 4,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 22340,
        cantidad: 0,
        img: "../imagenes/ram-vengance.png"
    },
    {
        id: 6,
        nombre: "AMD Ryzen 5 5600G",
        tipo: "procesador",
        socket: "AM4",
        descripcion: "La serie 5000 de Ryzen llegó para romper todos los esquemas. Esta vez con su Ryzen 5 5600G y Gráficos integrados vas a poder utilizarlo para la tarea que desees, como edición, render, gaming, TODO LO QUE QUIERAS.compatible a partir de chipset 5xx, B450 y superiores (B450, B550, A520, X470, X570)",
        precio: 55350,
        cantidad: 0,
        img: "../imagenes/producto-ej2.png"
    },
    {
        id: 10,
        nombre: "Gigabyte x399 Aorus Gaming 7",
        tipo: "mother",
        socket: "TR4",
        descripcion: "Placa madre gigabyte x399 Aorus Gaming 7",
        precio: 26230,
        cantidad: 0,
        img: "../imagenes/producto-ej1.png"
    },
    {
        id: 7,
        nombre: "1x16 GB Ram Corsair Vengance Led",
        tipo: "ram",
        ddr: 4,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 15000,
        cantidad: 0,
        img: "../imagenes/ram-spectrix_d50_rog.png"
    },
    {
        id: 8,
        nombre: "4x8 GB Ram G-Skill Patriot TridentZ 3200Mhz",
        tipo: "ram",
        ddr: 4,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 38000,
        cantidad: 0,
        img: "../imagenes/ram-gskill32.png"
    },
    {
        id: 11,
        nombre: "2x16 GB Ram Caster RGB DDR5 7000Mhz",
        tipo: "ram",
        ddr: 5,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 62000,
        cantidad: 0,
        img: "../imagenes/ram-xpg_ddr5.png"
    },
    {
        id: 12,
        nombre: "1x8 GB Ram XPG Gammix D45 3600Mhz",
        tipo: "ram",
        ddr: 4,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 19000,
        cantidad: 0,
        img: "../imagenes/ram-xpg_gammixd45.png"
    },
    {
        id: 13,
        nombre: "1x16 GB Ram Spectrix D60 CL 14",
        tipo: "ram",
        ddr: 4,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 24000,
        cantidad: 0,
        img: "../imagenes/ram-xpg_spectrixd60.png"
    },
    {
        id: 14,
        nombre: "1x16 GB Ram XPG Gammix D30 2666Mhz",
        tipo: "ram",
        ddr: 4,
        descripcion: "Si notás que tu computadora tiene bajo rendimiento o que su capacidad no se adapta a tus necesidades de uso, es momento de renovar su memoria RAM. Aumentarás su productividad y podrás trabajar de manera rápida y en simultáneo con múltiples aplicaciones.",
        precio: 15000,
        cantidad: 0,
        img: "../imagenes/ram-xpg_gammixd30.png"
    }
]