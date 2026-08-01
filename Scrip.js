document.addEventListener('DOMContentLoaded', function () {

    // ==============================================
    // 🛒 CARRITO
    // ==============================================
    const contadorElemento = document.getElementById('contador-carrito');
    let productosEnCarrito = JSON.parse(localStorage.getItem('carritoProductos')) || [];

    function actualizarContadorCarrito() {
        const total = productosEnCarrito.reduce((suma, item) => suma + (Number(item.cantidad) || 0), 0);
        if (contadorElemento) contadorElemento.textContent = total;
    }
    actualizarContadorCarrito();

    const botonesComprar = document.querySelectorAll('.comprar');
    botonesComprar.forEach(boton => {
        boton.addEventListener('click', function () {
            const datos = new URLSearchParams(this.dataset);
            window.location.href = `producto.html?${datos.toString()}`;
        });
    });


    // ==============================================
    // ❤️ FAVORITOS
    // ==============================================
    const contenedorFavoritos = document.getElementById('lista-favoritos');
    let listaFavoritos = JSON.parse(localStorage.getItem('listaFavoritos')) || [];

    function inicializarFavoritos() {
        document.querySelectorAll('.boton-favorito').forEach(boton => {
            boton.classList.toggle('activo', listaFavoritos.some(f => f.nombre === boton.dataset.nombre));
            boton.addEventListener('click', function () {
                const datos = {...this.dataset};
                const indice = listaFavoritos.findIndex(f => f.nombre === datos.nombre);
                indice === -1 ? listaFavoritos.push(datos) : listaFavoritos.splice(indice, 1);
                this.classList.toggle('activo', indice === -1);
                localStorage.setItem('listaFavoritos', JSON.stringify(listaFavoritos));
            });
        });
    }

    if (contenedorFavoritos) {
        contenedorFavoritos.innerHTML = '';
        listaFavoritos.forEach(prod => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'box-producto';
            tarjeta.innerHTML = `
                <div class="producto-item">
                    <div class="boton-favorito activo" data-nombre="${prod.nombre}" data-peso="${prod.peso}" data-precio="${prod.precio}" data-imagen="${prod.imagen}" data-imagenes="${prod.imagenes}" data-descripcion="${prod.descripcion}" data-colores="${prod.colores}" data-aromas="${prod.aromas}">
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
                            <div class="comprar" data-nombre="${prod.nombre}" data-peso="${prod.peso}" data-precio="${prod.precio}" data-imagen="${prod.imagen}" data-imagenes="${prod.imagenes}" data-descripcion="${prod.descripcion}" data-colores="${prod.colores}" data-aromas="${prod.aromas}">
                                <span>COMPRAR</span>
                                <img src="IMAGENES/flecha arriba.png" alt="flecha-arriba">
                            </div>
                        </div>
                    </div>
                </div>`;
            contenedorFavoritos.appendChild(tarjeta);
        });
    }
    inicializarFavoritos();


    // ==============================================
    // 🔍 BÚSQUEDA QUE SÍ FUNCIONA EN TODAS LAS PÁGINAS
    // ==============================================
    const inputBuscar = document.getElementById('texto-busqueda');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', function () {
            const texto = this.value.trim();
            if (texto.length >= 2) {
                // Al buscar, te lleva a la página principal con tu búsqueda
                window.location.href = `index.html?buscar=${encodeURIComponent(texto)}`;
            }
        });
    }

    // ==============================================
    // 🧑 LÓGICA DE PERFIL (solo en perfil.html)
    // ==============================================
    const listaDatos = document.getElementById('mostrar-datos');
    if (listaDatos) {
        let listaDatosGuardados = JSON.parse(localStorage.getItem('lista_usuarios')) || [];

        function mostrarDatos() {
            listaDatos.innerHTML = '';
            if (listaDatosGuardados.length === 0) {
                listaDatos.innerHTML = `<p class="texto-vacio">Aún no has guardado tus datos.</p>`;
                return;
            }
            listaDatosGuardados.forEach((dato, i) => {
                const item = document.createElement('div');
                item.className = 'entrada-datos';
                item.innerHTML = `
                    <div><strong>Nombre:</strong> ${dato.nombre || '—'}</div>
                    <div><strong>Correo:</strong> ${dato.correo || '—'}</div>
                    <div><strong>Teléfono:</strong> ${dato.telefono || '—'}</div>
                    <div><strong>Dirección:</strong> ${dato.direccion || '—'}</div>
                    <button class="btn-eliminar" data-indice="${i}">Eliminar</button>
                `;
                listaDatos.appendChild(item);
            });
            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.onclick = () => {
                    listaDatosGuardados.splice(btn.dataset.indice, 1);
                    localStorage.setItem('lista_usuarios', JSON.stringify(listaDatosGuardados));
                    mostrarDatos();
                };
            });
        }
        mostrarDatos();

        document.getElementById('form-datos')?.addEventListener('submit', e => {
            e.preventDefault();
            const nuevo = {
                nombre: document.getElementById('perfil-nombre').value.trim(),
                correo: document.getElementById('perfil-correo').value.trim(),
                telefono: document.getElementById('perfil-telefono').value.trim(),
                direccion: document.getElementById('perfil-direccion').value.trim()
            };
            if (nuevo.nombre || nuevo.correo || nuevo.telefono || nuevo.direccion) {
                listaDatosGuardados.push(nuevo);
                localStorage.setItem('lista_usuarios', JSON.stringify(listaDatosGuardados));
                mostrarDatos();
                alert('✅ Datos guardados');
                e.target.reset();
            }
        });

        document.querySelectorAll('.opcion-perfil').forEach(opt => {
            opt.onclick = () => {
                document.querySelectorAll('.opcion-perfil').forEach(o => o.classList.remove('activa'));
                document.querySelectorAll('.seccion-perfil').forEach(s => s.style.display = 'none');
                opt.classList.add('activa');
                document.getElementById(opt.dataset.seccion).style.display = 'block';
            };
        });

        function mostrarPedidos() {
            const listaPedidos = document.getElementById('lista-pedidos');
            if (!listaPedidos) return;
            const carrito = JSON.parse(localStorage.getItem('carritoProductos')) || [];
            if (carrito.length === 0) {
                listaPedidos.innerHTML = `<p class="texto-vacio">Aún no has realizado compras.</p>`;
                return;
            }
            listaPedidos.innerHTML = '';
            carrito.forEach(ped => {
                const item = document.createElement('div');
                item.className = 'item-pedido';
                item.innerHTML = `
                    <img src="${ped.imagen}" alt="${ped.nombre}" class="img-pedido">
                    <div class="detalle-pedido">
                        <h4>${ped.nombre}</h4>
                        <p>Cantidad: ${ped.cantidad} | Precio: Q${parseFloat(ped.precio).toFixed(2)}</p>
                        <p>Color: ${ped.color || 'Único'} | Aroma: ${ped.aroma || 'Sin aroma'}</p>
                        <span class="estado-pedido">✅ Pendiente de confirmación</span>
                    </div>`;
                listaPedidos.appendChild(item);
            });
        }
        mostrarPedidos();
    }

    // ==============================================
    // 📄 EN INDEX.HTML: CARGA LOS RESULTADOS RECIBIDOS
    // ==============================================
    if (window.location.pathname.includes('index.html')) {
        const params = new URLSearchParams(window.location.search);
        const buscar = params.get('buscar');
        if (buscar && buscar.length >= 2) {
            // Aquí cargas y filtras tus productos locales
            console.log('Buscando:', buscar);
            // Tu lógica de filtrado aquí
        }
    }
});