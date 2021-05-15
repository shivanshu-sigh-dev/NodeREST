import http from 'http';
import {URL} from 'url';
import {StringDecoder} from 'string_decoder';
import EnvDetails from './configure/configure';

const server = http.createServer((req, res) => {
    // Parse the URL
    const urlObject = new URL(req.url, `http://${req.headers.host}/`);

    // Get the pathname and replace the trailing forward slash
    let pathName = urlObject.pathname;
    pathName = pathName.replace(/^\/+|\/+$/g, '');

    // Parse the query string and get the response type
    const responseType = urlObject.searchParams.get('responseType') == 'html' ? 'html' : 'json';

    // Use string decoder to parse the payload of request, if any
    const decoder = new StringDecoder("utf8");
    let buffer = '';
    req.on('data', data => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Select the route on the basis of pathName
        const selectedRouteHandler = typeof(router[pathName]) !== 'undefined' ? router[pathName] : routeHandlers.notFound;
        selectedRouteHandler({
            pathName: pathName,
            responseType: responseType,
            requestMethod: req.method,
            buffer: buffer
        }, (statusCode, rt, payload) => {
            // Set the default statusCode if passed one is wrong
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            // Set the default payload if passed one is wrong
            if(rt === 'html'){
                payload = typeof(payload) == 'object' ? payload.message : {};
                res.setHeader('Content-Type', 'text/html');
            } else if(rt === 'json'){
                payload = typeof(payload) == 'object' ? payload : {};
                payload = JSON.stringify(payload);
                res.setHeader('Content-Type', 'application/json');
            } else {
                payload = {}
                payload = JSON.stringify(payload);
                res.setHeader('Content-Type', 'application/json');
            }
            // Set the response statusCode
            res.writeHead(statusCode);
            res.end(payload);
        });
    });
});

// Set the route handlers as per pathName
const routeHandlers = {
    hello: (data, callBack) => {
        callBack(406, data.responseType, {message: '<h1>Welcome !!!</h1>'});
    },
    notFound: (data, callBack) => {
        callBack(404);
    }
}

// Set the router as per the pathName
const router = {
    hello: routeHandlers.hello
};

// Start the server to listen for the request
server.listen(EnvDetails.port, () => {
    console.log(`Server started an listenign on Port: ${EnvDetails.port} Environment: ${EnvDetails.envName}`);
});