- Syntax for route definition in express
- - app.METHOD(PATH, Handler)
- - Where app is: app = express

- Syntax to register a middleware in express
- - app.use(optional_virtual_path_prefix, express.static(path_to_static_files))

- Syntax for HTTP Handler in expressjs
- - (req: Request, resp: Response) => Promise<void>
- - Request: Contains information about: HTTP method, path, headers, and body.
- - Response: Contains methods to construct the metadata and body of a response.

- Syntax for writting custom middleware in expressjs
- - (req: Request, resp: Response, next: NextFunction) => void;
- - Register a middleware at the application level using app.use(middleware)
- - Register a middleware at the route level by passing along with the route handler when registering the route handler: app.get("/path", middleware, routeHandler)