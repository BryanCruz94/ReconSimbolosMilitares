

let model, drawingCanvas, labelContainer, maxPredictions;

//crea un objeto con 10 simbolos militares y sus nombres y su probabilidad que sera 0
let simbolos = [
    { nombre: "Infanteria", probabilidad: 0 },
    { nombre: "Caballeria", probabilidad: 0 },
    { nombre: "Artilleria", probabilidad: 0 },
    { nombre: "Ingenieria", probabilidad: 0 },
    { nombre: "Comunicaciones", probabilidad: 0 },
    { nombre: "Inteligencia", probabilidad: 0 },
    { nombre: "Aviacion", probabilidad: 0 },
    { nombre: "Transportes", probabilidad: 0 },
    { nombre: "Intendencia", probabilidad: 0 },
    { nombre: "Mantenimiento", probabilidad: 0 },
    { nombre: "Sanidad", probabilidad: 0 }
];

async function init() {
    const modelURL = "modelo/model.json";
    const metadataURL = "modelo/metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    drawingCanvas = new fabric.Canvas('drawing-canvas', { isDrawingMode: true });
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    limpiar();
}



async function realizarPrediccionDesdeImagen(img) {
    // Limpiar el contenido anterior del contenedor de etiquetas
    labelContainer.innerHTML = "";

    // Realizar la predicción
    const prediction = await model.predict(img);

    // Mostrar las predicciones en el contenedor de etiquetas
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

function cargarImagen(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            // Volver a dibujar la nueva imagen en el canvas
            drawingCanvas.clear();
            drawingCanvas.setBackgroundImage(img.src, drawingCanvas.renderAll.bind(drawingCanvas));

            img.onload = function () {
                // Crear un nuevo canvas temporal para redimensionar la imagen
                const canvasTemp = document.createElement("canvas");
                const ctx = canvasTemp.getContext("2d");
                canvasTemp.width = 200;
                canvasTemp.height = 200;

                // Dibujar la imagen redimensionada en el canvas temporal
                ctx.drawImage(img, 0, 0, 200, 200);

                // Volver a dibujar la nueva imagen en el canvas principal
                drawingCanvas.clear();
                drawingCanvas.setBackgroundImage(canvasTemp.toDataURL(), drawingCanvas.renderAll.bind(drawingCanvas));
            };
        };
        reader.readAsDataURL(file);
    }
}

async function predecir() {
    // Convertir el dibujo del canvas a una imagen base64
    const drawingDataUrl = drawingCanvas.toDataURL();
    
    // Crear una nueva imagen HTML para alimentar al modelo
    const img = new Image();
    img.src = drawingDataUrl;

    // Esperar a que la nueva imagen se cargue antes de predecir
    img.onload = async function () {
        // Volver a dibujar la nueva imagen en el canvas
        drawingCanvas.clear();
        drawingCanvas.setBackgroundImage(img.src, drawingCanvas.renderAll.bind(drawingCanvas));

        console.log("Realizando la predicción...");
        console.log("La imagen tiene un tamaño de " + img.width + "x" + img.height + " pixeles");
        console.log(img.src);

        // Realizar la predicción
        const prediction = await model.predict(img);
        

        // Mostrar las predicciones en el contenedor de etiquetas
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
            simbolos[i].nombre = prediction[i].className;
            simbolos[i].probabilidad = prediction[i].probability.toFixed(2);
        }

        // Devolver el simbolo con mayor probabilidad
        let simbolo = simbolos.reduce((prev, current) => (prev.probabilidad > current.probabilidad) ? prev : current);

        armaServicioElegido = simbolo.nombre;
        console.log("El símbolo escogido es: " + armaServicioElegido);

        switch (armaServicioElegido) {
            case "Infanteria":
                infanteria();
                break;
            case "Caballeria":
                caballeria();
                break;
            case "Artilleria":
                artilleria();
                break;
            case "Ingenieria":
                ingenieria();
                break;
            case "Comunicaciones":
                comunicaciones();
                break;
            case "Inteligencia":
                inteligencia();
                break;
            case "Aviacion":
                aviacion();
                break;
            case "Transportes":
                transportes();
                break;
            case "Intendencia":
                intendencia();
                break;
            case "Mantenimiento":
                mantenimiento();
                break;
            case "Sanidad":
                sanidad();
                break;
            default:
                console.log("No se ha escogido ningun simbolo");

        }


    };
    document.getElementById("infoSimbolo").style.display = "block";
    document.getElementById("contSimbolo").style.display = "block";
}

function limpiar() {
    // Limpiar el canvas y el contenedor de etiquetas
    drawingCanvas.clear();
    //drawingCanvas  debe tener cargada la imagen de assets/img/fondo.jpg con una dimensión de 200x200
    drawingCanvas.setBackgroundImage("assets/logos/fondo.jpg", drawingCanvas.renderAll.bind(drawingCanvas));



    document.getElementById("infoSimbolo").style.display = "none";
    document.getElementById("contSimbolo").style.display = "none";

    // Limpiar el espacio de predicción
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].innerHTML = "";
    }
}

//SE CREARÁ FUNCIONES POR CADA SÍMBOLO
function infanteria() {
    document.getElementById("simboloArma").src = "assets/simbolos/Infantería.jpg";

    document.getElementById("infoSimbolo").innerHTML = `
    <div class="col-12 text-center" >
                <h3>El símbolo dibujado le pertenece a Infantería</h3>
                <img src="assets/logos/infanteria.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                <p class="">
                    La infantería es la rama de las fuerzas armadas especializada en 
                    el combate a pie. Los soldados de infantería son los que luchan en 
                    el frente de batalla, cuerpo a cuerpo, con armas ligeras y apoyo de armas pesadas.
                </p>
            </div>
     `
}

function caballeria() {
    document.getElementById("simboloArma").src = "assets/simbolos/Caballería Blindada.jpg";
    
    document.getElementById("infoSimbolo").innerHTML = `
    <div class="col-12 text-center" >
                <h3>El símbolo dibujado le pertenece a Caballería Blindada</h3>
                <img src="assets/logos/caballeria.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                <p class="">
                    La caballería blindada es una rama de las fuerzas armadas que utiliza vehículos blindados 
                    para el combate. La caballería blindada es una evolución de la caballería tradicional, 
                    que utilizaba caballos para el combate.
                </p>
            </div>
     `
}

function artilleria() {
    document.getElementById("simboloArma").src = "assets/simbolos/Artilleria.jpg";
    
    document.getElementById("infoSimbolo").innerHTML = `
    <div class="col-12 text-center" >
                <h3>El símbolo dibujado le pertenece a Artillería</h3>
                <img src="assets/logos/artilleria.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                <p class="">
                    La artillería es la rama de las fuerzas armadas especializada en el uso de armas de gran calibre 
                    para el combate a larga distancia. La artillería es una de las ramas más antiguas de las fuerzas armadas.
                </p>
            </div>
     `
}

function ingenieria() {
    document.getElementById("simboloArma").src = "assets/simbolos/Ingenieria.jpg";
    
    document.getElementById("infoSimbolo").innerHTML = `
    <div class="col-12 text-center" >
                <h3>El símbolo dibujado le pertenece a Ingeniería</h3>
                <img src="assets/logos/ingenieria.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                <p class="">
                    La ingeniería militar es la rama de las fuerzas armadas especializada en la construcción de 
                    fortificaciones, caminos, puentes y otras estructuras necesarias para el combate.
                </p>
            </div>
     `
}

function comunicaciones() {
    document.getElementById("simboloArma").src = "assets/simbolos/Comunicaciones.jpg";
    
    document.getElementById("infoSimbolo").innerHTML = `
    <div class="col-12 text-center" >
                <h3>El símbolo dibujado le pertenece a Comunicaciones</h3>
                <img src="assets/logos/comunicaciones.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                <p class="">
                    Las comunicaciones militares son la rama de las fuerzas armadas especializada en la 
                    transmisión de información entre unidades militares en el campo de batalla.
                </p>
            </div>
     `
}

function inteligencia() {
    document.getElementById("simboloArma").src = "assets/simbolos/Inteligencia Militar.jpg";
    
    document.getElementById("infoSimbolo").innerHTML = `
    <div class="col-12 text-center" >
                <h3>El símbolo dibujado le pertenece a Inteligencia</h3>
                <img src="assets/logos/inteligencia.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                <p class="">
                    La inteligencia militar es la rama de las fuerzas armadas especializada en la recopilación, 
                    análisis y distribución de información sobre las fuerzas enemigas.
                </p>
            </div>
     `
}

function aviacion() {
document.getElementById("simboloArma").src = "assets/simbolos/Aviacion.jpg";
        
        document.getElementById("infoSimbolo").innerHTML = `
        <div class="col-12 text-center" >
                    <h3>El símbolo dibujado le pertenece a Aviación</h3>
                    <img src="assets/logos/aviacion.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                    <p class="">
                        La aviación militar es la rama de las fuerzas armadas especializada en el uso de aeronaves 
                        para el combate y el transporte de tropas y suministros.
                    </p>
                </div>
        `
}

function transportes() {
    document.getElementById("simboloArma").src = "assets/simbolos/Transportes.jpg";
            
            document.getElementById("infoSimbolo").innerHTML = `
            <div class="col-12 text-center" >
                        <h3>El símbolo dibujado le pertenece a Transportes</h3>
                        <img src="assets/logos/transportes.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                        <p class="">
                            La rama de transporte militar es la encargada de transportar tropas, armas y suministros 
                            a las zonas de combate.
                        </p>
                    </div>
            `
}

function intendencia() {
    document.getElementById("simboloArma").src = "assets/simbolos/Intendencia.jpg";
                
                document.getElementById("infoSimbolo").innerHTML = `
                <div class="col-12 text-center" >
                            <h3>El símbolo dibujado le pertenece a Intendencia</h3>
                            <img src="assets/logos/logisticos.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                            <p class="">
                                La intendencia militar es la rama de las fuerzas armadas encargada de la administración 
                                de los recursos humanos, financieros y materiales.
                            </p>
                        </div>
                `
}

function mantenimiento() {
    document.getElementById("simboloArma").src = "assets/simbolos/Material de Guerra.jpg";
                    
                    document.getElementById("infoSimbolo").innerHTML = `
                    <div class="col-12 text-center" >
                                <h3>El símbolo dibujado le pertenece a Material de Guerra</h3>
                                <img src="assets/logos/logisticos.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                                <p class="">
                                    La rama de mantenimiento militar es la encargada de mantener y reparar el equipo 
                                    y las instalaciones militares.
                                </p>
                            </div>
                    `
}

function sanidad() {
    document.getElementById("simboloArma").src = "assets/simbolos/Sanidad.jpg";
                        
                        document.getElementById("infoSimbolo").innerHTML = `
                        <div class="col-12 text-center" >
                                    <h3>El símbolo dibujado le pertenece a Sanidad</h3>
                                    <img src="assets/logos/sanidad.jpg" alt="simbolo " class="img img-fluid mx-auto m-2" >
                                    <p class="">
                                        La sanidad militar es la rama de las fuerzas armadas encargada de proporcionar 
                                        atención médica a los soldados heridos en combate.
                                    </p>
                                </div>
                        `
}









// Iniciar el modelo y configurar el canvas al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    init();
});

