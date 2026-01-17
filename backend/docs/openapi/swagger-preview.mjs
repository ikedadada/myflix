import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { getAbsoluteFSPath } from "swagger-ui-dist";

const port = Number.parseInt(process.env.PORT ?? "8080", 10);
const swaggerRoot = getAbsoluteFSPath();
const specPath = path.resolve("docs/openapi/openapi.yaml");

const contentTypes = new Map([
	[".html", "text/html; charset=utf-8"],
	[".js", "application/javascript; charset=utf-8"],
	[".css", "text/css; charset=utf-8"],
	[".png", "image/png"],
	[".svg", "image/svg+xml"],
	[".json", "application/json; charset=utf-8"],
	[".yaml", "application/yaml; charset=utf-8"],
	[".yml", "application/yaml; charset=utf-8"],
]);

const swaggerInitializer = `window.onload = function() {
  window.ui = SwaggerUIBundle({
    url: '/openapi.yaml',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'BaseLayout'
  });
};\n`;

const readFileSafe = async (filePath) => {
	try {
		return await fs.readFile(filePath);
	} catch {
		return null;
	}
};

const server = http.createServer(async (req, res) => {
	const url = new URL(
		req.url ?? "/",
		`http://${req.headers.host ?? "localhost"}`,
	);
	const pathname = decodeURIComponent(url.pathname);

	if (pathname === "/openapi.yaml") {
		const data = await readFileSafe(specPath);
		if (!data) {
			res.writeHead(404);
			res.end("openapi.yaml not found");
			return;
		}
		res.writeHead(200, { "Content-Type": "application/yaml; charset=utf-8" });
		res.end(data);
		return;
	}

	if (pathname === "/swagger-initializer.js") {
		res.writeHead(200, {
			"Content-Type": "application/javascript; charset=utf-8",
		});
		res.end(swaggerInitializer);
		return;
	}

	const safePath = pathname === "/" ? "/index.html" : pathname;
	const resolved = path.normalize(path.join(swaggerRoot, safePath));
	if (!resolved.startsWith(swaggerRoot)) {
		res.writeHead(400);
		res.end("Bad request");
		return;
	}

	const data = await readFileSafe(resolved);
	if (!data) {
		res.writeHead(404);
		res.end("Not found");
		return;
	}

	const ext = path.extname(resolved);
	res.writeHead(200, {
		"Content-Type": contentTypes.get(ext) ?? "application/octet-stream",
	});
	res.end(data);
});

server.listen(port, () => {
	console.log(`Swagger UI is running at http://localhost:${port}`);
});
