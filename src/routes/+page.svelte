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
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDcmREoBGgchu12xsYGfmZndWhOHBHrq0ekTZv2eDEfF5py8yEvQoPfvjeTMU2G18AUrI9uAiUpk1J/pub?output=csv";
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

  const cellSize = 8;
  const width = 1800;
  const height = 200;
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  const colorDead = "#FFF"; // fondo blanco

  // Inicializar el tablero con estado y color
  let board = Array.from({ length: cols }, (_, x) =>
    Array.from({ length: rows }, (_, y) => ({
      state: Math.random() > 0.8 ? 1 : 0,
      color: Math.random() > 0.5 ? "#6DE1D2" : "#FFD63A"
    }))
  );

  const svg = d3.select("#header-sketch")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Dibujar celdas
  const cells = svg.selectAll("rect")
    .data(board.flat().map((d, i) => ({
      x: (i % cols) * cellSize,
      y: Math.floor(i / cols) * cellSize,
      state: d.state,
      color: d.color
    })))
    .enter()
    .append("rect")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fill", d => d.state === 1 ? d.color : colorDead);

  // Texto principal
  const title = svg.append("text")
    .attr("x", 40)
    .attr("y", 120)
    .attr("font-family", "Helvetica, sans-serif")
    .attr("font-size", "6rem")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .text("Montajes");

  // Subtítulo
  const subtitle = svg.append("text")
    .attr("x", 1300)
    .attr("y", 160)
    .attr("font-family", "Helvetica, sans-serif")
    .attr("font-size", "1.4rem")
    .attr("fill", "#000")
    .text("Arte, ética y política (2025-1)");

  // Reglas de Conway + asignación de color al revivir
  function nextGeneration(board) {
    const newBoard = board.map(col =>
      col.map(cell => ({ ...cell }))
    );

    for (let x = 1; x < cols - 1; x++) {
      for (let y = 1; y < rows - 1; y++) {
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            neighbors += board[x + i][y + j].state;
          }
        }
        neighbors -= board[x][y].state;

        if (board[x][y].state === 1 && (neighbors < 2 || neighbors > 3)) {
          newBoard[x][y].state = 0;
        } else if (board[x][y].state === 0 && neighbors === 3) {
          newBoard[x][y].state = 1;
          newBoard[x][y].color = Math.random() > 0.5 ? "#6DE1D2" : "#FFD63A";
        }
      }
    }
    return newBoard;
  }

  // Animación
  d3.timer(() => {
    board = nextGeneration(board);

    cells.data(board.flat().map((d, i) => ({
      x: (i % cols) * cellSize,
      y: Math.floor(i / cols) * cellSize,
      state: d.state,
      color: d.color
    })))
      .attr("fill", d => d.state === 1 ? d.color : colorDead);
  });

  // Movimiento del texto con el mouse
  svg.on("mousemove", function (event) {
    const [mouseX, mouseY] = d3.pointer(event);
    title.attr("transform", `translate(${mouseX * 0.02},${mouseY * 0.05})`);
    subtitle.attr("transform", `translate(${mouseX * 0.01},${mouseY * 0.03})`);
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
    