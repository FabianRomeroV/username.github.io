const historial = [];

// Agregar evento para el formulario
document.getElementById('liquidacionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue
    calcularLiquidacion(); // Llama a la función de cálculo
});

// Función para calcular la liquidación
function calcularLiquidacion() {
    // Obtener valores de los inputs
    const leyOz = parseFloat(document.getElementById('leyOz').value);
    const recuperacion = parseFloat(document.getElementById('recuperacion').value) / 100;
    const precioInter = parseFloat(document.getElementById('precioInter').value);
    const maquila = parseFloat(document.getElementById('maquila').value);
    
    // Validar que todos los campos necesarios estén llenos
    if (isNaN(leyOz) || isNaN(recuperacion) || isNaN(precioInter) || isNaN(maquila)) {
        return; // Salir de la función si falta información
    }

    // Cálculo del precio por tonelada
    const liquidacionPorTonelada = ((leyOz * recuperacion * (precioInter - 80)) - maquila) * 1.1023;
    
    // Obtener toneladas y porcentaje de H2O
    const tonHumedas = parseFloat(document.getElementById('tonHumedas').value) || 0;
    const porcentajeH2O = parseFloat(document.getElementById('porcentajeH2O').value) / 100;

    // Cálculo final de la liquidación
    const liquidacionFinal = liquidacionPorTonelada * tonHumedas * (1 - porcentajeH2O);
    
    // Actualiza resultados en pantalla
    document.getElementById('resultado').innerText = `PRECIO($/TM): $${liquidacionPorTonelada.toFixed(2)}`;
    document.getElementById('resultadoLiquidacion').innerText = `LIQUIDACIÓN: $${liquidacionFinal.toFixed(2)}`;

    // Crear una entrada para el historial
    const nuevaEntrada = `
        Ley Oz: ${leyOz}, 
        Recuperación %: ${recuperacion * 100}%, 
        Precio Inter: $${precioInter}, 
        Penalización: $80, 
        Maquila: $${maquila}, 
        Factor: 1.1023, 
        Precio($/TM): $${liquidacionPorTonelada.toFixed(2)}, 
        Ton.Humedas: ${tonHumedas}, 
        % H2O: ${porcentajeH2O * 100}%, 
        Liquidación: $${liquidacionFinal.toFixed(2)}
    `;

    // Comprobar si ya existe en el historial
    if (!historial.includes(nuevaEntrada.trim())) {
        historial.push(nuevaEntrada.trim());
        // Limitar a 15 entradas
        if (historial.length > 15) {
            historial.shift(); // Elimina la entrada más antigua
        }
        actualizarHistorial();
    }
}

// Actualiza el historial en el modal
function actualizarHistorial() {
    const historialDiv = document.getElementById('historial');
    historialDiv.innerHTML = historial.map(entry => `<div>${entry}</div>`).join('<hr>');
}

// Escuchar cambios en el campo de % H2O
document.getElementById('porcentajeH2O').addEventListener('input', calcularLiquidacion);

// Escuchar cambios en el campo de Ton.Humedas
document.getElementById('tonHumedas').addEventListener('input', calcularLiquidacion);

// Reiniciar formulario
document.getElementById('reiniciar').addEventListener('click', function() {
    document.getElementById('liquidacionForm').reset();
    document.getElementById('resultado').innerText = 'PRECIO($/TM): ';
    document.getElementById('resultadoLiquidacion').innerText = 'LIQUIDACIÓN: $0.00';
});

// Mostrar u ocultar campos ocultos
document.getElementById('toggleKey').addEventListener('click', function() {
    const hiddenFields = document.getElementById('hiddenFields');
    hiddenFields.style.display = hiddenFields.style.display === 'none' ? 'block' : 'none'; // Alternar visibilidad
});

// Abrir modal
document.getElementById('abrirHistorial').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block';
});

// Cerrar modal
document.getElementsByClassName('close')[0].addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Agregar evento para el botón de exportación
document.getElementById('exportarHistorial').addEventListener('click', function() {
    exportarHistorial();
});

// Función para exportar historial a CSV
function exportarHistorial() {
    const csvContent = "data:text/csv;charset=utf-8," + historial.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historial.csv");
    document.body.appendChild(link); // Requerido para Firefox
    link.click(); // Descargar el archivo
    document.body.removeChild(link); // Eliminar el enlace
}

// Nueva funcionalidad para modificar penalización y factor
document.getElementById('toggleKey').addEventListener('click', function() {
    const clave = prompt("Ingrese la clave para modificar los valores:");
    if (clave === "9832") {
        document.getElementById('penalizacion').readOnly = false;
        document.getElementById('factor').readOnly = false;
    } else {
        alert("Clave incorrecta. No se pueden modificar los valores.");
        document.getElementById('penalizacion').readOnly = true;
        document.getElementById('factor').readOnly = true;
    }
});
