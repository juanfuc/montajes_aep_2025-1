import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            pages: 'docs',  // Directorio donde se generarán los archivos
            assets: 'docs', // Coloca los activos en docs también
            fallback: null, // Puede ser útil para rutas no encontradas
        }),
        paths: {
            base: '/montajes_aep_2025-1'  // Solo necesario si estás en producción con esa base
        },
        prerender: {
            entries: ['*']  // Prerender todas las rutas encontradas automáticamente
        }
    }
};

export default config;
