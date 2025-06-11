import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VentasPorMes from '../components/graficos/VentasPorMes';
import ClientesFrecuentes from '../components/graficos/ClientesFrecuentes';

const Estadisticas = () => {
    const [meses, setMeses] = useState([]);
    const [totalesPorMes, setTotalesPorMes] = useState([]);
    const [clientes, setClientes] = useState([]); // Estado añadido
    const [cantidadCompras, setCantidadCompras] = useState([]);

useEffect(() => { 
    const cargaVentas = async () => { 
            try { 
                const response = await fetch('http://localhost:3000/api/totalventaspormes'); 
                const datos = await response.json(); 
                setMeses(datos.map(item => item.mes)); 
                setTotalesPorMes(datos.map(item => item.total_ventas));

                } catch (error) { 
                console.error('Error al cargar ventas:', error); 
                alert('Error al cargar ventas: + error.message ');
                } 
                }; 
                cargaVentas(); 
                }, []);

       const cargaClientesFrecuentes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/clientesfrecuentes');
        const datos = await response.json();
        setClientes(datos.map(item => `${item.primer_nombre} ${item.primer_apellido}`));
        setCantidadCompras(datos.map(item => item.cantidad_compras));
        
      } catch (error) {
        console.error('Error al cargar clientes frecuentes:', error);
        alert('Error al cargar clientes frecuentes: ' + error.message);
      }
    };
cargaClientesFrecuentes(); // Llamada a la función añadida

return ( 
    <Container className="mt-5"> 
        <br /> 
        <h4>Estadísticas</h4> 
            <Row className="mt-4"> 
                <Col xs={12} sm={12} md={12} lg={6} className="mb-4"> 
                <VentasPorMes meses={meses} totales_por_mes={totalesPorMes} /> 
                </Col> 
                <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
          <ClientesFrecuentes clientes={clientes} cantidades={cantidadCompras} /> {/* Componente añadido */}
        </Col>
            </Row> 
    </Container> 
);
};
export default Estadisticas;