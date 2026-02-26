import {serve} from 'bun'
import index from '@/index.html'
import {api} from '@/api.ts'

export function runServer() {
	const server = serve({
		routes: {
			// Route all /api/* requests to Elysia
			'/api/*': req => api.handle(req),

			// Serve index.html for all unmatched routes.
			'/*': index,
		},

		development: process.env.NODE_ENV !== 'production' && {
			// Enable browser hot reloading in development
			hmr: true,

			// Echo console logs from the browser to the server
			console: true,
		},
	})

	console.log(`🚀 Server running at ${server.url}`)
}