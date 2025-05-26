import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import { Container, Button, Alert, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const estadoInicialProducto = {
    id_producto: null,
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  };
  const [productoActual, setProductoActual] = useState(estadoInicialProducto);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  useEffect(() => {
    const resultados = listaProductos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      producto.descripcion_producto?.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    setProductosFiltrados(resultados);
    establecerPaginaActual(1); // Resetea a la primera página al buscar
  }, [filtroBusqueda, listaProductos]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setProductoActual(prev => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    if (
      !productoActual.nombre_producto ||
      !productoActual.id_categoria ||
      !productoActual.precio_unitario ||
      !productoActual.stock
    ) {
      setErrorCarga('Por favor, completa todos los campos requeridos.');

      const generarPDFProductos = () => {
        const doc=new jsPDF();

        // Encabezado del PDF
        doc,setFillcolor(28,41,51);
        doc,React(0,0,220,30,'F' );//ancho completo, alto completo

        // Título centrado con texto blanco
       doc.setTextColor(255, 255, 255); // Color del titulo
       doc.setFontSize(28);
       doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = [ "ID", "Nombre", "Descripción", "Categoria", "Precio", "Stock"];
    const filas = productosFiltrados.map( (producto) => [
      producto.id_producto,
      producto.nombre_producto,
      producto.descripcion_producto,
      producto.id_categoria,
      `C$ ${producto.precio_unitario}`,
      producto.stock,
]);

//Marcador para mostrar el total de paginas 
const totalPaginas = "{total_pages_count_string}";

//Configuración de la tabla
autoTable(doc, {
  head: [columnas],
  body: filas,
  startY: 40,
  theme: "grid",
  styles: { fontSize: 10, cellPadding: 2 },
  margin: { top: 20, left: 14, right: 14 },
  tableWidth: "auto", // Ajuste de ancho automatico
  columnStyles: {
    0: { cellWidth: 'auto' }, // Ajuste de ancho automatico
    1: { cellWidth: 'auto' },
    2: { cellWidth: 'auto' },
  },
  pageBreak: "auto",
  rowPageBreak: "auto",
  // Hook que se ejecuta al dibujar cada página
  didDrawPage: function (data) {
    // Altura y ancho de la pagina actual
    const alturaPagina = doc.internal.pageSize.getHeight();
    const anchoPagina = doc.internal.pageSize.getWidth();

    // Número de página actual
    const numeroPagina = doc.internal.getNumberOfPages();

    // Definir texto de número de página en el centro del documento
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
    doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
  },
});

//Actualizar el marcador 
if (typeof doc.putTotalPages === 'function' ) {
  doc.putTotalPages(totalPaginas);
}

// Guardar el PDF con un nombre basado en la fecha actual
const fecha = new Date();
const dia = String(fecha.getDate()).padStart(2, '0');
const mes = String(fecha.getMonth() + 1).padStart(2, '0');
const anio = fecha.getFullYear();
const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;

//Guardar el documento PDF
doc.save(nombreArchivo);

      }
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproductos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActual),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');
      await obtenerProductos();
      setProductoActual(estadoInicialProducto);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarProducto = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproducto/${productoActual.id_producto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActual),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar el producto');
      await obtenerProductos();
      setModoEdicion(false);
      setMostrarModal(false);
      setProductoActual(estadoInicialProducto);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (confirmar) {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/eliminarproducto/${id}`, {
          method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar el producto');
        await obtenerProductos();
        setErrorCarga(null);
      } catch (error) {
        setErrorCarga(error.message);
      }
    }
  };

  const manejarActualizar = (producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  // Calcular productos paginados
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Productos</h4>

      <Button
        variant="primary"
        onClick={() => {
          setMostrarModal(true);
          setModoEdicion(false);
          setProductoActual(estadoInicialProducto);
        }}
      >
        Nuevo Producto
      </Button>

      

      <Form.Group controlId="formBusqueda" className="mt-3 mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre o descripción"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </div>
      </Form.Group>

      {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

      <TablaProductos
        productos={productosPaginados}
        cargando={cargando}
        error={errorCarga}
        onActualizar={manejarActualizar}
        onEliminar={eliminarProducto}
        totalElementos={productosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={productoActual}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={modoEdicion ? actualizarProducto : agregarProducto}
        actualizarProducto={actualizarProducto}
        errorCarga={errorCarga}
        categorias={listaCategorias}
        esEdicion={modoEdicion}
      />
    </Container>
  );
};

export default Productos;