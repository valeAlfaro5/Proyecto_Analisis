import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router';
import './Particion.css';
import './Menu.jsx';

function Particion() {

    return (
        <div className="particion-container">
            <div className="particion-header">
                <h1>Algoritmo de Partición tuki tuki</h1>
            </div>

                <p>Este algoritmo se utiliza para dividir un conjunto de datos en dos subconjuntos de manera que la diferencia entre sus sumas sea mínima.</p>
                <p>El algoritmo de partición es un enfoque común en problemas de optimización y se utiliza en diversas aplicaciones, como la programación dinámica y la teoría de grafos.</p>

            <button className="menu-option-particion">
                    <Link to="/menu" className="menu-button-particion">
                        Regresar al menu
                    </Link>
            </button>
        </div>
    );
}
export default Particion;