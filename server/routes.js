import config from "./config.js";
import { logger } from "./util.js";
import { Controller } from './controller.js';

async function routes( request, response) {

    const controller = new Controller();

    const { method, url } = request;

    if(method === 'GET' && url === '/') {
        //redireciona para a home
        response.writeHead(302, {
            'Location': config.location.home
        })
        response.end();
    }

    if(method === 'GET' && url === '/home') {
        const { stream } = await controller.getFileStream(config.pages.homeHTML);

        // padrão do response é text/html
        return stream.pipe(response)
    }

    if(method === 'GET' && url === '/controller') {
        const { stream } = await controller.getFileStream(config.pages.controllerHTML);

        // padrão do response é text/html
        return stream.pipe(response)
    }

    //FILES
    if( method === 'GET') {

        const  { stream, type } = await controller.getFileStream(url);
        return stream.pipe(response);
    }

    response.writeHead(404)

    return response.end();
}

function handleError( error, response) {
    if(error.message.includes('ENOENT')) {
        logger.warn(`assets not found: ${error.stack}`);
        response.writeHead(404);
        return response.end();
    }

    logger.error(`caught error on API ${error.stack}`);
    response.writeHead(500);
    return response.end();
}
// createServer não manipula promises, por isso a criação da function routes
export function handler( request, response) {
    return routes( request, response).catch(error => handleError(error, response));

}