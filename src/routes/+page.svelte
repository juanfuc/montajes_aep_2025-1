<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3'
    import { base } from '$app/paths'; // Importar base para usarlo en los enlaces
    
    let data = [];
    let isLoading = true;
    let imgUrl = "https://drive.google.com/uc?export=view&id=";
    let imgPath = "assets/img/"
     
    // Función para cargar los datos desde Google Sheets
    async function loadData() {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQU6PjWzqXNeb4P4KdhZ64Z_1ImvEd0NOQv0itGFV3hM89oZdBG3zQYuc9aXbfmxLj13HPOyDt7dO_O/pub?output=csv";
        try {
            const fetchedData = await d3.csv(url);
            data = fetchedData;
    
            // Verificar los datos cargados, incluyendo el ID
            console.log('Datos cargados:', data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            isLoading = false;
        }
    }
    
    onMount(() => {
        loadData();
    
        // Crear el lienzo SVG dentro del header
        const svg = d3.select("#header-sketch")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", "0 0 1800 200")
            .attr("preserveAspectRatio", "xMidYMid meet");
    
        const width = 1800;
        const height = 200;
        const numParticles = 100;
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
    
        // Generar partículas con posiciones iniciales aleatorias
        const particles = d3.range(numParticles).map(() => {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                angle: Math.random() * 2 * Math.PI
            };
        });
    
        // Crear elementos de línea para representar las trayectorias
        const lines = svg.selectAll("line")
            .data(particles)
            .enter()
            .append("line")
            .attr("x1", d => d.x)
            .attr("y1", d => d.y)
            .attr("x2", d => d.x + Math.cos(d.angle) * 10)
            .attr("y2", d => d.y + Math.sin(d.angle) * 10)
            .attr("stroke", secondaryColor)
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.7);
    
        // Añadir el título y el subtítulo al lienzo
        svg.append("text")
            .attr("x", 0)
            .attr("y", 100)
            .attr("font-family", "Helvetica, sans-serif")
            .attr("font-size", "6rem")
            .attr("fill", "black")
            .text("Montajes");
    
        svg.append("text")
            .attr("x", 1600)
            .attr("y", 100)
            .attr("font-family", "Helvetica, sans-serif")
            .attr("font-size", "1.4rem")
            .attr("fill", "black")
            .text("Arte, ética y política");
    
        // Función de actualización de las partículas
        function updateParticles() {
            particles.forEach(p => {
                p.x += Math.cos(p.angle) * 2;
                p.y += Math.sin(p.angle) * 2;
    
                // Cambiar ligeramente el ángulo para darle más dinamismo
                p.angle += (Math.random() - 0.5) * 0.2;
    
                // Mantener las partículas dentro de los límites del SVG
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;
                if (p.y > height) p.y = 0;
                if (p.y < 0) p.y = height;
            });
    
            // Actualizar las posiciones de las líneas
            lines
                .attr("x1", d => d.x)
                .attr("y1", d => d.y)
                .attr("x2", d => d.x + Math.cos(d.angle) * 10)
                .attr("y2", d => d.y + Math.sin(d.angle) * 10)
                .attr("stroke", d => {
                    const distanceToText = Math.sqrt((d.x - 20) ** 2 + (d.y - 50) ** 2);
                    return distanceToText < 100 ? primaryColor : secondaryColor;
                });
        }
    
        // Crear una animación continua
        d3.timer(updateParticles);
    
        // Manejar el movimiento del ratón para interactuar con las partículas
        svg.on("mousemove", function (event) {
            const [mouseX, mouseY] = d3.pointer(event);
            particles.forEach(p => {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    p.angle = Math.atan2(dy, dx);
                }
            });
        });
    });
    </script>
    
    <div class="container">
        <header id="header-sketch" style="width: 100%; height: 200px; background: #fff;"></header>
    
        <div class="galeria">
            {#each data as item}
                <div class="card">
                    <a href={`#obra/${item.id}`} target="_self">
                        <img alt="Imgs de los proyectos" src={imgPath + item.path} loading="lazy">
                    </a>
                </div>
            {/each}
        </div>
    </div>
    
    <style>
        .container {
            background-color: var(--background-color);
            margin: 2%;
        }
    
        header {
            display: flex;
            justify-content: space-around;
            align-items: baseline;
            font-size: 1em;
            color: var(--text-color);
            margin-bottom: 20px;
            border-bottom: 2px solid var(--primary-color);
            padding: 0;
        }
    
        .container {
            font-family: "Montserrat", sans-serif;
            text-align: justify;
            max-width: auto;
        }
    
        .galeria {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 250px;
            gap: 20px;
        }
    
        .card {
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    
        .card img {
            max-width: 100%;
            height: auto;
            transition: all 0.5s ease;
            border: none;
            filter: grayscale(100%) brightness(80%) contrast(120%);
        }
    
        .card img:hover {
            box-shadow: 0 0 32px #333;
            transform: scale(1.05);
            filter: none;
        }

        @media screen and (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: center;
    font-size: 0.8em; /* Ajusta el tamaño del texto del menú para móviles */
  }



  .galeria {
    grid-template-columns: 1fr; /* Una sola columna para pantallas pequeñas */
    grid-auto-rows: auto;
  }
}
    </style>
    