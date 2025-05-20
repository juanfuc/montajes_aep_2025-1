<script>
    import "../styles/global.css";
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import "../styles/global.css";

    let obra = null;
    let imgPath = "assets/img/"

    // Función para cargar la obra seleccionada
    async function loadObraById(id) {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDcmREoBGgchu12xsYGfmZndWhOHBHrq0ekTZv2eDEfF5py8yEvQoPfvjeTMU2G18AUrI9uAiUpk1J/pub?output=csv";
        try {
            const response = await fetch(url);
            const text = await response.text();
            const data = d3.csvParse(text);
            obra = data.find(item => item.id === id);
        } catch (error) {
            console.error("Error fetching obra:", error);
        }
    }

    // Escuchar cambios en el hash de la URL
    onMount(() => {
        function handleHashChange() {
            const hash = window.location.hash.substring(1); // Obtener el hash sin el "#"
            const match = hash.match(/^obra\/(\d+)$/);
            if (match) {
                const id = match[1];
                loadObraById(id);
            } else {
                obra = null; // Si no hay hash válido, no se muestra ninguna obra
            }
        }

        // Cargar obra según el hash inicial
        handleHashChange();

        // Añadir listener para el evento hashchange
        window.addEventListener('hashchange', handleHashChange);

        // Eliminar listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    });

    // Función para renderizar el contenido basado en el tipo de archivo
    function renderContent(obra) {
        switch (obra.tipo) {
            case 'pdf':
                return `<iframe src="${obra.file_path}" style="width: 100%; height: 600px; border: none;" scrolling="yes" allowfullscreen></iframe>`;
            case 'imagen':
                return `<img src="${obra.file_path}" alt="${obra.título}" style="width: 100%; height: auto; border: none;" />`;
            case 'html':
                return `<a href="${obra.file_path}" target="-blank"><img src="${imgPath+obra.path}" style="width: 100%; height: auto; overflow: auto; border: none;" allowfullscreen></a> `;
            case 'video':
                return `<video controls style="width: 100%; height: auto; display: block; margin: 20px auto;">
                            <source src="${obra.file_path}" type="video/mp4">
                            Tu navegador no soporta la reproducción de video.
                        </video>`;
            case 'link':
                return `<a href="${obra.file_path}" target="_blank" rel="noopener">
                            <img src="${imgPath+obra.path}" alt="Imagen relacionada con ${obra.título}" style="width: 100%; height: auto; border: none;" />
                        </a>`;
            case 'iframe':
                return obra.iframe;
            default:
                return '<p>Contenido no disponible.</p>';
        }
    }
</script>

{#if obra}
    <div class="detalle-obra">
        <h1>{obra.título}</h1>
        {@html renderContent(obra)}
        <p><strong>Autor:</strong> {obra.autor}</p>
        <p><strong>Técnica:</strong> {obra.técnica}</p>
        <p><strong>Tipo de archivo:</strong> {obra.tipo_archivo}</p>
        <p><strong>Descripción:</strong> {obra.descripción}</p>
        <p><strong>Comentarios:</strong> {obra.comentarios}</p>

        <!-- Botón para volver a la galería -->
        <button on:click={() => (window.location = '')} class="btn-volver">
            Volver a la Galería
        </button>
    </div>
{:else}
    <slot /> <!-- Mostrar la galería cuando no hay obra seleccionada -->
{/if}

<style>
    .detalle-obra {
        max-width: 800px;
        margin: 0 auto;
        text-align: left;
    }

    .btn-volver {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 1em;
        cursor: pointer;
        border: 2px solid var(--primary-color);
        color: var(--text-color);
        background-color: #fff;
        transition: border 0.3s ease;
    }

    .btn-volver:hover {
        border: 2px solid var(--secondary-color);
        background-color: #fff;
    }

    @media screen and (max-width: 768px) {
        .detalle-obra {
            display: flex;
            flex-direction: column;
            margin: 10px;
        }

    }
</style>
