<script context="module">
    import * as d3 from 'd3';
    import { error } from '@sveltejs/kit'; // Importa la función de error

    console.log("Cargando el componente [id].svelte...");
    
    export async function load({ params }) {
        const { id } = params;
    
        // Verificar el ID recibido desde la URL
        console.log(`ID recibido desde la URL: ${id}`);
    
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDcmREoBGgchu12xsYGfmZndWhOHBHrq0ekTZv2eDEfF5py8yEvQoPfvjeTMU2G18AUrI9uAiUpk1J/pub?output=csv";
        const response = await fetch(url);
        const text = await response.text();
        const data = d3.csvParse(text);
    
        // Verificar los datos cargados
        console.log('Datos cargados en [id].svelte:', data);
    
        // Buscar la obra que coincide con el ID
        const obra = data.find(item => item.id === id);
    
        if (!obra) {
            throw error(404, 'Obra no encontrada');
        }
    
        // Verificar la obra encontrada
        console.log('Obra encontrada:', obra);
    
        return { props: { obra } };
    }
    </script>
    
    <script>
        export let obra;
        console.log("Obra cargada:", obra);
    </script>
    
    <div class="detalle-obra">
        <h1>{obra.título}</h1>
        <img src={`assets/img/${obra.path}`} alt={obra.título} />
        <p><strong>Autor:</strong> {obra.autor}</p>
        <p><strong>Técnica:</strong> {obra.técnica}</p>
        <p><strong>Descripción:</strong> {obra.descripción}</p>
        <p><strong>Comentarios:</strong> {obra.comentarios}</p>
    </div>
    
    <style>
        .detalle-obra {
            max-width: 800px;
            margin: 0 auto;
            text-align: left;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
    