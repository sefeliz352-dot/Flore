document.addEventListener('DOMContentLoaded', function () {

    // ==============================================
    // 🛒 LÓGICA DE CARRITO DE COMPRAS
    // ==============================================
    const contadorElemento = document.getElementById('contador-carrito');
    let productosEnCarrito = JSON.parse(localStorage.getItem('carritoProductos')) || [];

    function actualizarContadorCarrito() {
        let total = productosEnCarrito.reduce((suma, item) => suma + (item.cantidad || 0), 0);
        if(contadorElemento) contadorElemento.textContent = total;
    }
    actualizarContadorCarrito();

    // ✅ CORREGIDO: Leemos y enviamos TODOS los datos correctamente (AHORA INCLUYE IMAGENES)
    const botonesComprar = document.querySelectorAll('.comprar');
    botonesComprar.forEach(boton => {
        boton.addEventListener('click', function () {
            // 🔴 LEEMOS CADA DATO ASEGURANDO QUE NO SEA UNDEFINED
            const nombre = this.dataset.nombre || "";
            const precio = this.dataset.precio || "0.00"; 
            const imagen = this.dataset.imagen || "";
            const imagenes = this.dataset.imagenes || ""; // ✅ ¡ESTE ERA EL QUE FALTABA!
            const peso = this.dataset.peso || "";
            const descripcion = this.dataset.descripcion || "Sin descripción disponible";
            const colores = this.dataset.colores || "";
            const aromas = this.dataset.aromas || "";

            if (!nombre || !imagen) {
                console.error("Faltan datos esenciales en el producto");
                return;
            }

            // ✅ ENVIAMOS TODO CODIFICADO PARA QUE NO SE ROMPAN LOS ESPACIOS NI TILDES
            window.location.href = `producto.html?nombre=${encodeURIComponent(nombre)}&precio=${encodeURIComponent(precio)}&peso=${encodeURIComponent(peso)}&imagen=${encodeURIComponent(imagen)}&imagenes=${encodeURIComponent(imagenes)}&descripcion=${encodeURIComponent(descripcion)}&colores=${encodeURIComponent(colores)}&aromas=${encodeURIComponent(aromas)}`;
        });
    });


    // ==============================================
    // ❤️ LÓGICA DE FAVORITOS - ✅ TOTALMENTE CORREGIDA
    // ==============================================
    const contenedorFavoritos = document.getElementById('lista-favoritos');
    let listaFavoritos = JSON.parse(localStorage.getItem('listaFavoritos')) || [];

    function mostrarFavoritosEnPagina() {
        if(!contenedorFavoritos) return; 
        contenedorFavoritos.innerHTML = '';
        
        if (listaFavoritos.length === 0) {
            contenedorFavoritos.innerHTML = `<p class="texto-vacio">Aún no tienes productos guardados en favoritos.</p>`;
            return;
        }

        listaFavoritos.forEach(producto => {
            // ✅ ASEGURAMOS QUE LOS DATOS EXISTAN AL LEER DEL LOCALSTORAGE
            const datosSeguros = {
                nombre: producto.nombre || "Sin nombre",
                precio: producto.precio || "0.00",
                peso: producto.peso || "",
                imagen: producto.imagen || "",
                imagenes: producto.imagenes || "", // ✅ AGREGADO
                descripcion: producto.descripcion || "Sin descripción disponible",
                colores: producto.colores || "",
                aromas: producto.aromas || ""
            };

            const tarjeta = document.createElement('div');
            tarjeta.className = 'box-producto';
            tarjeta.innerHTML = `
                <div class="producto-item">
                    <div class="boton-favorito activo" 
                        data-nombre="${datosSeguros.nombre}" 
                        data-peso="${datosSeguros.peso}" 
                        data-precio="${datosSeguros.precio}" 
                        data-imagen="${datosSeguros.imagen}"
                        data-imagenes="${datosSeguros.imagenes}"
                        data-descripcion="${datosSeguros.descripcion}"
                        data-colores="${datosSeguros.colores}"
                        data-aromas="${datosSeguros.aromas}">
                        <svg class="corazon-icono" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                    <div class="imagen-producto"><img src="${datosSeguros.imagen}" alt="${datosSeguros.nombre}"></div>
                    <div class="contenido-producto">
                        <h3>${datosSeguros.nombre}</h3>
                        <p>${datosSeguros.descripcion}</p>
                        <p class="peso-producto">Peso: ${datosSeguros.peso || 'No especificado'}</p>
                        <div class="iconos-compra">
                            <div class="comprar" 
                                data-nombre="${datosSeguros.nombre}" 
                                data-precio="${datosSeguros.precio}" 
                                data-peso="${datosSeguros.peso}" 
                                data-imagen="${datosSeguros.imagen}"
                                data-imagenes="${datosSeguros.imagenes}"
                                data-descripcion="${datosSeguros.descripcion}"
                                data-colores="${datosSeguros.colores}"
                                data-aromas="${datosSeguros.aromas}">
                                <span>COMPRAR</span>
                                <img src="IMAGENES/flecha arriba.png" alt="flecha-arriba">
                            </div>
                        </div>
                    </div>
                </div>`;
            contenedorFavoritos.appendChild(tarjeta);
        });
        
        asignarEventoCompraFavoritos();
        activarCorazonesFavoritos();
    }

    // ✅ CORREGIDO: Evento de clic en corazones
    const botonesFavorito = document.querySelectorAll('.boton-favorito');
    botonesFavorito.forEach(boton => {
        const nombreProd = boton.dataset.nombre;
        if (listaFavoritos.some(fav => fav.nombre === nombreProd)) boton.classList.add('activo');
        
        boton.addEventListener('click', function () {
            const datos = {
                nombre: this.dataset.nombre || "",
                imagen: this.dataset.imagen || "",
                imagenes: this.dataset.imagenes || "", // ✅ AGREGADO
                peso: this.dataset.peso || "",
                precio: this.dataset.precio || "0.00",
                descripcion: this.dataset.descripcion || "Sin descripción", 
                colores: this.dataset.colores || "",
                aromas: this.dataset.aromas || ""
            };
            
            const indice = listaFavoritos.findIndex(fav => fav.nombre === datos.nombre);
            if (indice !== -1) {
                listaFavoritos.splice(indice, 1);
                this.classList.remove('activo');
            } else {
                listaFavoritos.push(datos);
                this.classList.add('activo');
            }
            localStorage.setItem('listaFavoritos', JSON.stringify(listaFavoritos));
        });
    });

    function activarCorazonesFavoritos(){
        document.querySelectorAll('.boton-favorito').forEach(corazon => {
            corazon.addEventListener('click', function() {
                const datos = {
                    nombre: this.dataset.nombre || "",
                    imagen: this.dataset.imagen || "",
                    imagenes: this.dataset.imagenes || "", // ✅ AGREGADO
                    peso: this.dataset.peso || "",
                    precio: this.dataset.precio || "",
                    descripcion: this.dataset.descripcion || "",
                    colores: this.dataset.colores || "",
                    aromas: this.dataset.aromas || ""
                };
                const existe = listaFavoritos.some(f=>f.nombre === datos.nombre);
                if(existe){
                    listaFavoritos = listaFavoritos.filter(f=>f.nombre !== datos.nombre);
                    this.classList.remove('activo');
                }else{
                    listaFavoritos.push(datos);
                    this.classList.add('activo');
                }
                localStorage.setItem('listaFavoritos', JSON.stringify(listaFavoritos));
            });
        });
    }

    // ✅ CORREGIDO: Al darle a comprar desde Favoritos, envía todo bien
    function asignarEventoCompraFavoritos() {
        const nuevosBotones = contenedorFavoritos ? contenedorFavoritos.querySelectorAll('.comprar') : [];
        nuevosBotones.forEach(boton => {
            boton.addEventListener('click', function () {
                const nombre = encodeURIComponent(this.dataset.nombre || "");
                const precio = encodeURIComponent(this.dataset.precio || "");
                const imagen = encodeURIComponent(this.dataset.imagen || "");
                const imagenes = encodeURIComponent(this.dataset.imagenes || ""); // ✅ AGREGADO
                const peso = encodeURIComponent(this.dataset.peso || "");
                const descripcion = encodeURIComponent(this.dataset.descripcion || "");
                const colores = encodeURIComponent(this.dataset.colores || "");
                const aromas = encodeURIComponent(this.dataset.aromas || "");

                window.location.href = `producto.html?nombre=${nombre}&precio=${precio}&peso=${peso}&imagen=${imagen}&imagenes=${imagenes}&descripcion=${descripcion}&colores=${colores}&aromas=${aromas}`;
            });
        });
    }
    mostrarFavoritosEnPagina();


    // ==============================================
    // 🔍 SISTEMA DE BÚSQUEDA - ✅ CORREGIDO Y UNIFICADO
    // ==============================================

    const misPaginasConProductos = [
        "FLORÉ.html", "velas.html", "ramos.html", "jabones.html"
    ];

    let baseDeDatosGlobal = [];
    let resultadosActivos = false;
    let cargando = false;

    async function cargarTodosLosProductos() {
        if(baseDeDatosGlobal.length > 0) return;
        try {
            baseDeDatosGlobal = [];
            for (const pagina of misPaginasConProductos) {
                try {
                    const respuesta = await fetch(pagina);
                    if (!respuesta.ok) continue;
                    const textoHtml = await respuesta.text();
                    const parser = new DOMParser();
                    const documento = parser.parseFromString(textoHtml, 'text/html');

                    const productosDeEstaPagina = documento.querySelectorAll('.box-producto');
                    productosDeEstaPagina.forEach(prod => {
                        const nombre = prod.querySelector('h3')?.textContent.trim() || "";
                        const parrafoDesc = prod.querySelector('.contenido-producto > p:first-of-type');
                        const descripcion = parrafoDesc ? parrafoDesc.textContent.trim() : "Sin descripción disponible";
                        const imagen = prod.querySelector('img')?.getAttribute('src') || "";
                        const botonDatos = prod.querySelector('.comprar');

                        if (nombre && botonDatos) {
                            // ✅ GUARDAMOS ABSOLUTAMENTE TODO EN LA BASE DE DATOS DE BÚSQUEDA
                            baseDeDatosGlobal.push({
                                nombre: nombre,
                                descripcion: descripcion,
                                imagen: imagen,
                                imagenes: botonDatos.dataset.imagenes || "", // ✅ AGREGADO
                                precio: botonDatos.dataset.precio || "",
                                peso: botonDatos.dataset.peso || "",
                                colores: botonDatos.dataset.colores || "",
                                aromas: botonDatos.dataset.aromas || ""
                            });
                        }
                    });
                } catch(err) {
                    console.warn("No se pudo cargar:", pagina);
                }
            }
        } catch (error) {
            console.error("❌ Error al leer archivos:", error);
        }
    }

    function quitarAcentos(texto) {
        if (!texto) return "";
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    const inputBuscar = document.getElementById('texto-busqueda');
    const titulo = document.getElementById('titulo-productos') || document.querySelector('.title');
    const contenedorOriginal = document.getElementById('todos-los-productos');
    const contenedorResultados = document.querySelector('.producto-menu .container') || document.querySelector('.contenedor-principal');
    let cajaResultados = null;

    async function buscarEnTiempoReal() {
        if(!inputBuscar || cargando) return;
        cargando = true;

        const textoBuscar = quitarAcentos(inputBuscar.value.trim());

        if (textoBuscar === "") {
            if(resultadosActivos){
                if(cajaResultados) {
                    cajaResultados.remove();
                    cajaResultados = null;
                }
                if(contenedorOriginal) contenedorOriginal.style.display = '';
                
                const headerCompleto = document.querySelector('.header-content');
                const seccionInfo = document.querySelector('.info');
                const piePagina = document.querySelector('.footer-container');
                if(headerCompleto) headerCompleto.style.display = '';
                if(seccionInfo) seccionInfo.style.display = '';
                if(piePagina) piePagina.style.display = '';
                document.body.style.backgroundColor = '';

                if(titulo) titulo.textContent = "NUESTROS PRODUCTOS";
                resultadosActivos = false;
            }
            inputBuscar.focus();
            cargando = false;
            return;
        }

        resultadosActivos = true;
        if(contenedorOriginal) contenedorOriginal.style.display = 'none';

        const headerCompleto = document.querySelector('.header-content');
        const seccionInfo = document.querySelector('.info');
        const piePagina = document.querySelector('.footer-container');
        if(headerCompleto) headerCompleto.style.display = 'none';
        if(seccionInfo) seccionInfo.style.display = 'none';
        if(piePagina) piePagina.style.display = 'none';
        document.body.style.backgroundColor = '#f2eae3';

        await cargarTodosLosProductos();

        const resultados = baseDeDatosGlobal.filter(producto => {
            const nombreLimpio = quitarAcentos(producto.nombre);
            const descLimpia = quitarAcentos(producto.descripcion);
            return nombreLimpio.includes(textoBuscar) || descLimpia.includes(textoBuscar);
        });

        if(!cajaResultados){
            cajaResultados = document.createElement('div');
            cajaResultados.className = 'box-container-general';
            contenedorResultados.appendChild(cajaResultados);
        } else {
            cajaResultados.innerHTML = "";
        }

        if(titulo) titulo.textContent = resultados.length > 0 
            ? `PRODUCTOS ENCONTRADOS (${resultados.length})` 
            : `NINGÚN PRODUCTO COINCIDE`;

        if(resultados.length === 0) {
            cajaResultados.innerHTML = `<p style="width:100%; text-align:center; padding:60px 20px; color:#5f2c19; font-size:18px; grid-column: 1 / -1;">❌ No hay productos que contengan: "${inputBuscar.value}"</p>`;
            inputBuscar.focus();
            cargando = false;
            return;
        }

        const listaFavActual = JSON.parse(localStorage.getItem('listaFavoritos') || []);
        resultados.forEach(prod => {
            const estaEnFav = listaFavActual.some(fav => fav.nombre === prod.nombre);
            const tarjeta = document.createElement('div');
            tarjeta.className = 'box-producto';
            tarjeta.innerHTML = `
                <div class="producto-item">
                    <div class="boton-favorito ${estaEnFav ? 'activo' : ''}"
                        data-nombre="${prod.nombre}"
                        data-peso="${prod.peso}"
                        data-precio="${prod.precio}"
                        data-imagen="${prod.imagen}"
                        data-imagenes="${prod.imagenes}"
                        data-descripcion="${prod.descripcion}"
                        data-colores="${prod.colores}"
                        data-aromas="${prod.aromas}">
                        <svg class="corazon-icono" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                    <div class="imagen-producto"><img src="${prod.imagen}" alt="${prod.nombre}"></div>
                    <div class="contenido-producto">
                        <h3>${prod.nombre}</h3>
                        <p>${prod.descripcion}</p>
                        <p class="peso-producto">Peso: ${prod.peso || 'Sin peso'}</p>
                        <div class="iconos-compra">
                            <div class="comprar"
                                data-nombre="${prod.nombre}"
                                data-precio="${prod.precio}"
                                data-peso="${prod.peso}"
                                data-imagen="${prod.imagen}"
                                data-imagenes="${prod.imagenes}"
                                data-descripcion="${prod.descripcion}"
                                data-colores="${prod.colores}"
                                data-aromas="${prod.aromas}">
                                <span>COMPRAR</span>
                                <img src="IMAGENES/flecha arriba.png" alt="flecha-arriba">
                            </div>
                        </div>
                    </div>
                </div>`;
            cajaResultados.appendChild(tarjeta);
        });

        activarCorazonesFavoritos();
        
        // ✅ CORREGIDO: Búsqueda también envía todos los datos
        cajaResultados.querySelectorAll('.comprar').forEach(boton => {
            boton.addEventListener('click', function () {
                const nombre = encodeURIComponent(this.dataset.nombre || "");
                const precio = encodeURIComponent(this.dataset.precio || "");
                const imagen = encodeURIComponent(this.dataset.imagen || "");
                const imagenes = encodeURIComponent(this.dataset.imagenes || ""); // ✅ AGREGADO
                const peso = encodeURIComponent(this.dataset.peso || "");
                const descripcion = encodeURIComponent(this.dataset.descripcion || "");
                const colores = encodeURIComponent(this.dataset.colores || "");
                const aromas = encodeURIComponent(this.dataset.aromas || "");
                
                window.location.href = `producto.html?nombre=${nombre}&precio=${precio}&peso=${peso}&imagen=${imagen}&imagenes=${imagenes}&descripcion=${descripcion}&colores=${colores}&aromas=${aromas}`;
            });
        });

        inputBuscar.focus();
        cargando = false;
    }

    if (inputBuscar) {
        inputBuscar.addEventListener('input', buscarEnTiempoReal);
    }

});