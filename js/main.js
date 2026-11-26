// =====================================================
// Simulador de Ahorro Personal
// Pre-Entrega 5: Instanciando Objetos (Clases)
// (continúa lo hecho en las pre-entregas 2, 3 y 4)
// =====================================================


// ---------- CONSTANTES GLOBALES ----------
const MESES_POR_ANIO = 12;
const OPCION_SALIR = "9";


// =====================================================
// CLASE: MetaDeAhorro
// Es la "fábrica" de metas. Cada meta sabe cuánto necesita,
// cuánto lleva ahorrado y puede calcular su propio progreso.
// =====================================================
class MetaDeAhorro {
    // El constructor recibe 4 parámetros y los guarda en el objeto con "this"
    constructor(id, nombre, montoObjetivo, montoAhorrado) {
        this.id = id;                       // número que identifica a la meta
        this.nombre = nombre;               // ej: "Notebook"
        this.montoObjetivo = montoObjetivo; // cuánto dinero necesita
        this.montoAhorrado = montoAhorrado; // cuánto lleva juntado hasta ahora
    }

    // MÉTODO: suma dinero a la meta (MODIFICA el estado del objeto)
    aportar(monto) {
        this.montoAhorrado = this.montoAhorrado + monto;
        return this.montoAhorrado;
    }

    // MÉTODO: informa cuánto falta para cumplir la meta (nunca menos de 0)
    calcularFaltante() {
        const faltante = this.montoObjetivo - this.montoAhorrado;
        return faltante > 0 ? faltante : 0;
    }

    // MÉTODO: informa el porcentaje de avance (máximo 100%)
    calcularPorcentaje() {
        const porcentaje = Math.round((this.montoAhorrado * 100) / this.montoObjetivo);
        return porcentaje > 100 ? 100 : porcentaje;
    }

    // MÉTODO: informa si la meta ya se cumplió (true / false)
    estaCumplida() {
        return this.montoAhorrado >= this.montoObjetivo;
    }

    // MÉTODO: calcula cuántos meses faltan según el ahorro mensual del usuario
    calcularMesesRestantes(ahorroMensual) {
        return Math.ceil(this.calcularFaltante() / ahorroMensual);
    }

    // MÉTODO: arma un texto corto con el estado de la meta
    describir() {
        const estado = this.estaCumplida() ? " ✅ ¡Cumplida!" : "";
        return this.nombre + ": " + formatearPesos(this.montoAhorrado) + " de " +
            formatearPesos(this.montoObjetivo) + " (" + this.calcularPorcentaje() + "%)" + estado;
    }
}


// =====================================================
// INSTANCIAS: creamos objetos reales con "new"
// y los guardamos en constantes
// =====================================================
const fondoDeEmergencia = new MetaDeAhorro(1, "Fondo de emergencia", 300000, 120000);
const cursoDeIngles = new MetaDeAhorro(2, "Curso de inglés", 90000, 30000);
const notebook = new MetaDeAhorro(3, "Notebook", 800000, 0);
const vacaciones = new MetaDeAhorro(4, "Vacaciones", 500000, 50000);
const bicicleta = new MetaDeAhorro(5, "Bicicleta", 250000, 250000);

// ARRAY DE OBJETOS: la lista de metas, ordenada por prioridad
// (la primera, índice 0, es la más importante)
const metasDeAhorro = [fondoDeEmergencia, cursoDeIngles, notebook, vacaciones, bicicleta];

// Contador para darle un id nuevo a cada meta que se agregue
let proximoId = metasDeAhorro.length + 1;


// =====================================================
// FUNCIONES DE ENTRADA DE DATOS
// =====================================================

// FUNCIÓN DECLARADA: pide un texto que no puede quedar vacío.
function pedirTexto(mensaje) {
    let texto = prompt(mensaje);

    while (texto === null || texto.trim() === "") {
        alert("Este dato no puede quedar vacío. Intentá de nuevo.");
        texto = prompt(mensaje);
    }

    return texto;
}

// FUNCIÓN DECLARADA: pide un número mayor a 0.
function pedirNumeroPositivo(mensaje) {
    let numero;

    do {
        numero = parseFloat(prompt(mensaje));

        if (isNaN(numero)) {
            alert("Eso no es un número. Escribí solo números, sin $ ni puntos de miles.");
        } else if (numero <= 0) {
            alert("El número tiene que ser mayor a 0.");
        }
    } while (isNaN(numero) || numero <= 0);

    return numero;
}

// FUNCIÓN EXPRESADA: muestra el menú y devuelve la opción elegida.
const mostrarMenu = function (nombre, ahorroMensual) {
    return prompt(
        "MENÚ - ¿Qué querés hacer, " + nombre + "?\n" +
        "Ahorro actual: " + formatearPesos(ahorroMensual) + " por mes\n\n" +
        "--- AHORRO ---\n" +
        "1. Ver mi ahorro mes a mes durante un año\n" +
        "2. Calcular en cuántos meses llego a un monto\n" +
        "3. Cambiar mi ahorro mensual\n" +
        "--- MIS METAS ---\n" +
        "4. Ver mis metas y su progreso\n" +
        "5. Agregar una meta\n" +
        "6. Buscar una meta\n" +
        "7. Aportar dinero a una meta\n" +
        "8. Quitar una meta\n\n" +
        "9. Salir"
    );
};


// =====================================================
// FUNCIONES DE PROCESAMIENTO
// =====================================================

// FUNCIÓN FLECHA: agrega el signo $ a un monto.
const formatearPesos = (monto) => "$" + monto;

// FUNCIÓN FLECHA: calcula cuánto se junta en una cantidad de meses.
const calcularAhorroAcumulado = (ahorroMensual, meses) => ahorroMensual * meses;

// FUNCIÓN FLECHA: deja el texto con la primera letra en mayúscula y el resto en minúscula.
const normalizarTexto = (texto) => texto.trim().charAt(0).toUpperCase() + texto.trim().slice(1).toLowerCase();

// FUNCIÓN EXPRESADA: devuelve los meses necesarios para llegar a un monto.
const calcularMesesParaMonto = function (monto, ahorroMensual) {
    let meses = 0;

    while (calcularAhorroAcumulado(ahorroMensual, meses) < monto) {
        meses++;
    }

    return meses;
};

// FUNCIÓN DECLARADA: busca una meta por su nombre y devuelve su ÍNDICE en el array.
// Como ahora el array guarda OBJETOS, comparamos la propiedad "nombre" de cada uno.
// Si no la encuentra, devuelve -1.
function buscarIndicePorNombre(lista, nombreBuscado) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].nombre.toLowerCase() === nombreBuscado.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

// FUNCIÓN DECLARADA: pide un número de la lista (1, 2, 3...) y devuelve su ÍNDICE (0, 1, 2...).
// Si el número no existe en la lista, devuelve -1.
function pedirIndiceDeMeta(lista, mensaje) {
    const numero = parseInt(prompt(mensaje));

    if (isNaN(numero) || numero < 1 || numero > lista.length) {
        return -1;
    }

    return numero - 1; // los índices de un array empiezan en 0
}


// =====================================================
// FUNCIONES DE SALIDA (mostrar resultados)
// =====================================================

// FUNCIÓN DECLARADA: muestra el ahorro acumulado de cada mes del año.
function mostrarProyeccionAnual(ahorroMensual) {
    console.log("===== AHORRO MES A MES =====");

    for (let mes = 1; mes <= MESES_POR_ANIO; mes++) {
        const acumulado = calcularAhorroAcumulado(ahorroMensual, mes);

        if (mes === 6) {
            console.log("Mes " + mes + ": " + formatearPesos(acumulado) + "  <-- ¡Mitad de año!");
        } else if (mes === MESES_POR_ANIO) {
            console.log("Mes " + mes + ": " + formatearPesos(acumulado) + "  <-- ¡Total del año!");
        } else {
            console.log("Mes " + mes + ": " + formatearPesos(acumulado));
        }
    }

    const totalAnual = calcularAhorroAcumulado(ahorroMensual, MESES_POR_ANIO);
    alert("En un año vas a juntar " + formatearPesos(totalAnual) + ". Mirá el detalle mes a mes en la consola (F12).");
}

// FUNCIÓN DECLARADA: arma un mensaje según cuánto tiempo lleve llegar al monto.
function mostrarResultadoMonto(monto, meses) {
    const anios = Math.ceil(meses / MESES_POR_ANIO);
    let mensaje = "Llegás a " + formatearPesos(monto) + " en " + meses + " meses";

    if (meses <= MESES_POR_ANIO) {
        mensaje = mensaje + ". ¡En menos de un año! 🎉";
    } else if (meses <= MESES_POR_ANIO * 3) {
        mensaje = mensaje + " (unos " + anios + " años). ¡Se puede!";
    } else {
        mensaje = mensaje + " (unos " + anios + " años). Probá aumentar tu ahorro mensual.";
    }

    console.log(mensaje);
    alert(mensaje);
}

// FUNCIÓN DECLARADA: recorre el array de objetos con for...of y arma la lista numerada.
// Usa el método describir() de cada objeto.
// Return: el texto de la lista, para mostrarlo también en un alert o prompt.
function listarMetas(lista) {
    let texto = "";
    let numero = 1;

    console.log("===== MIS METAS DE AHORRO =====");

    for (const meta of lista) {
        const linea = numero + ". " + meta.describir();
        console.log(linea);
        texto = texto + linea + "\n";
        numero++;
    }

    console.log("Total: " + lista.length + " metas");
    return texto;
}

// FUNCIÓN DECLARADA: se despide del usuario.
function despedir(nombre) {
    console.log("El usuario " + nombre + " salió del simulador.");
    alert("¡Gracias por usar el simulador, " + nombre + "! Seguí ahorrando 💰");
}


// =====================================================
// FUNCIONES QUE TRABAJAN CON EL ARRAY DE OBJETOS
// =====================================================

// AGREGAR: crea un objeto nuevo con "new" y lo suma al array
// con unshift (al principio, si es prioritaria) o push (al final)
function agregarMeta(lista) {
    const nombreMeta = normalizarTexto(pedirTexto("¿Qué meta querés agregar? (ej: Auto, Mudanza)"));

    // evitamos metas repetidas
    if (buscarIndicePorNombre(lista, nombreMeta) !== -1) {
        alert("La meta \"" + nombreMeta + "\" ya está en tu lista.");
        return;
    }

    const montoObjetivo = pedirNumeroPositivo("¿Cuánto dinero necesitás para \"" + nombreMeta + "\"?");

    // Nueva instancia de la clase
    const nuevaMeta = new MetaDeAhorro(proximoId, nombreMeta, montoObjetivo, 0);
    proximoId++;

    const esPrioritaria = prompt("¿Es tu meta más importante? (si / no)");

    if (esPrioritaria !== null && esPrioritaria.trim().toLowerCase() === "si") {
        lista.unshift(nuevaMeta);
        alert("\"" + nuevaMeta.nombre + "\" quedó como tu meta número 1.");
    } else {
        lista.push(nuevaMeta);
        alert("\"" + nuevaMeta.nombre + "\" se agregó al final de tu lista.");
    }

    console.log("Meta creada:", nuevaMeta);
    listarMetas(lista);
}

// BUSCAR: encuentra el objeto y usa sus métodos para informar su estado
function buscarMeta(lista, ahorroMensual) {
    const buscada = pedirTexto("¿Qué meta querés buscar?");
    const indice = buscarIndicePorNombre(lista, buscada);
    let mensaje;

    if (indice === -1) {
        mensaje = "❌ \"" + normalizarTexto(buscada) + "\" no está en tu lista de metas.";
    } else {
        const meta = lista[indice];
        mensaje = "🔎 " + meta.describir() + "\nPosición en la lista: " + (indice + 1);

        if (meta.estaCumplida()) {
            mensaje = mensaje + "\n¡Ya juntaste todo lo que necesitabas!";
        } else {
            mensaje = mensaje + "\nTe faltan " + formatearPesos(meta.calcularFaltante()) +
                ". Ahorrando " + formatearPesos(ahorroMensual) + " por mes, la cumplís en " +
                meta.calcularMesesRestantes(ahorroMensual) + " meses.";
        }
    }

    console.log(mensaje);
    alert(mensaje);
}

// APORTAR: usa el método aportar() que MODIFICA el objeto elegido
function aportarAMeta(lista) {
    if (lista.length === 0) {
        alert("No tenés metas cargadas.");
        return;
    }

    const listaTexto = listarMetas(lista);
    const indice = pedirIndiceDeMeta(lista, "¿A qué meta querés aportar? Escribí su número:\n\n" + listaTexto);

    if (indice === -1) {
        alert("Ese número no está en la lista.");
        return;
    }

    const meta = lista[indice];

    if (meta.estaCumplida()) {
        alert("\"" + meta.nombre + "\" ya está cumplida. ¡Elegí otra meta!");
        return;
    }

    const monto = pedirNumeroPositivo("¿Cuánto querés aportar a \"" + meta.nombre + "\"?");
    meta.aportar(monto);

    let mensaje = "Aportaste " + formatearPesos(monto) + ".\n" + meta.describir();

    if (meta.estaCumplida()) {
        mensaje = mensaje + "\n🎉 ¡Felicitaciones, cumpliste tu meta!";
    }

    console.log(mensaje);
    alert(mensaje);
}

// QUITAR: shift (la primera), pop (la última) o splice (una elegida por número)
function quitarMeta(lista) {
    if (lista.length === 0) {
        alert("No tenés metas para quitar.");
        return;
    }

    const opcion = prompt(
        "¿Qué meta querés quitar?\n\n" +
        "1. La primera de la lista (" + lista[0].nombre + ")\n" +
        "2. La última de la lista (" + lista[lista.length - 1].nombre + ")\n" +
        "3. Elegir una por su número"
    );

    let eliminada;

    if (opcion === "1") {
        eliminada = lista.shift();
    } else if (opcion === "2") {
        eliminada = lista.pop();
    } else if (opcion === "3") {
        const indice = pedirIndiceDeMeta(lista, "Escribí el número de la meta:\n\n" + listarMetas(lista));
        if (indice === -1) {
            alert("Ese número no está en la lista.");
            return;
        }
        eliminada = lista.splice(indice, 1)[0];
    } else {
        alert("Opción inválida. No se quitó ninguna meta.");
        return;
    }

    alert("Se ha eliminado la meta: " + eliminada.nombre);
    console.log("Se ha eliminado la meta:", eliminada);
    listarMetas(lista);
}


// =====================================================
// VERIFICACIÓN DE LA CLASE (en consola)
// Probamos los métodos de las instancias y mostramos
// cómo quedaron sus propiedades.
// =====================================================
console.log("===== PRUEBA DE LA CLASE MetaDeAhorro =====");
console.log("Curso de inglés ANTES:", cursoDeIngles.montoAhorrado);
cursoDeIngles.aportar(15000);
console.log("Curso de inglés DESPUÉS de aportar $15000:", cursoDeIngles.montoAhorrado);
console.log("Le falta:", formatearPesos(cursoDeIngles.calcularFaltante()));
console.log("Progreso:", cursoDeIngles.calcularPorcentaje() + "%");
console.log("¿Bicicleta cumplida?", bicicleta.estaCumplida());
console.log("¿Notebook cumplida?", notebook.estaCumplida());
console.log(fondoDeEmergencia);


// =====================================================
// PROGRAMA PRINCIPAL: acá se INVOCAN las funciones
// =====================================================

const nombre = pedirTexto("¡Bienvenido al Simulador de Ahorro! ¿Cuál es tu nombre?");
let ahorroMensual = pedirNumeroPositivo(nombre + ", ¿cuánto podés ahorrar por mes? (ej: 15000)");

console.log("Usuario: " + nombre);
console.log("Ahorro mensual: " + formatearPesos(ahorroMensual));
listarMetas(metasDeAhorro);

let opcion = "";

while (opcion !== OPCION_SALIR) {
    opcion = mostrarMenu(nombre, ahorroMensual);

    switch (opcion) {
        case "1":
            mostrarProyeccionAnual(ahorroMensual);
            break;

        case "2": {
            const monto = pedirNumeroPositivo("¿Cuánto dinero querés juntar?");
            const meses = calcularMesesParaMonto(monto, ahorroMensual);
            mostrarResultadoMonto(monto, meses);
            break;
        }

        case "3": {
            const nuevoAhorro = pedirNumeroPositivo("¿Cuál es tu nuevo ahorro mensual?");
            console.log("Ahorro mensual actualizado: de " + formatearPesos(ahorroMensual) + " a " + formatearPesos(nuevoAhorro));
            ahorroMensual = nuevoAhorro;
            alert("¡Listo! Tu nuevo ahorro mensual es " + formatearPesos(ahorroMensual) + ".");
            break;
        }

        case "4":
            alert("Tus metas, de la más importante a la menos importante:\n\n" + listarMetas(metasDeAhorro));
            break;

        case "5":
            agregarMeta(metasDeAhorro);
            break;

        case "6":
            buscarMeta(metasDeAhorro, ahorroMensual);
            break;

        case "7":
            aportarAMeta(metasDeAhorro);
            break;

        case "8":
            quitarMeta(metasDeAhorro);
            break;

        case OPCION_SALIR:
            despedir(nombre);
            break;

        default:
            if (opcion === null) {
                opcion = OPCION_SALIR;
                despedir(nombre);
            } else {
                alert("Opción inválida. Elegí un número del 1 al 9.");
            }
    }
}
