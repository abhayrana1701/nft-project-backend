"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUi = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
/**
 * Swagger definition
 * This defines the basic information about your API, like title, description, etc.
 */
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'NFT Marketplace API',
        version: '1.0.0',
        description: 'API documentation for NFT Marketplace backend',
        contact: {
            name: 'Abhay Rana',
            email: 'abhayrana@gmail.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local API Server',
        },
    ],
};
/**
 * Options for Swagger JSDoc to define the paths and components.
 * This is where you specify which files or directories Swagger should parse for the routes.
 */
const options = {
    swaggerDefinition,
    apis: ['./src/user/user.route.ts', './src/nft/nft.route.ts'],
};
/**
 * Swagger JSDoc generates the OpenAPI spec (JSON format) based on the configuration above.
 */
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
