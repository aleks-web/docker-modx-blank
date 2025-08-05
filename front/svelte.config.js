import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess({ script: true }), mdsvex()],
	kit: {
		adapter: adapter({ out: 'build' }),
		alias: {
			$components: path.resolve('./src/components'),
			$routes: path.resolve('./src/routes'),
			$migrations: path.resolve('./src/lib/server/database/migrations'),
			$entities: path.resolve('./src/lib/server/entities'),
			$enums: path.resolve('./src/lib/enums'),
			$store: path.resolve('./src/store'),
			$icons: path.resolve('./src/lib/images/pd-icons'),
			$src: path.resolve('./src')
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
