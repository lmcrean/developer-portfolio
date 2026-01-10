"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDatabaseAvailable = isDatabaseAvailable;
exports.getLastDbError = getLastDbError;
exports.getDb = getDb;
exports.testConnection = testConnection;
const serverless_1 = require("@neondatabase/serverless");
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
// Load environment variables from .env file
dotenv.config({ path: (0, path_1.resolve)(__dirname, '../.env') });
// Enable connection pooling
serverless_1.neonConfig.fetchConnectionCache = true;
// Extract the connection string from NEONDB_KEY
const connectionString = process.env.NEONDB_KEY?.match(/postgresql:\/\/[^\s'"]+/)?.[0];
// Track database availability
let dbAvailable = !!connectionString;
let lastError = null;
if (!connectionString) {
    console.warn('⚠️ NEONDB_KEY environment variable not found or invalid. Database features will be disabled.');
}
/**
 * Check if database is available
 */
function isDatabaseAvailable() {
    return dbAvailable;
}
/**
 * Get the last database error
 */
function getLastDbError() {
    return lastError;
}
/**
 * Get a SQL query executor for the database
 * Uses Neon's serverless driver with connection pooling
 * Returns null if database is not configured
 */
function getDb() {
    if (!connectionString) {
        return null;
    }
    return (0, serverless_1.neon)(connectionString);
}
/**
 * Test database connection and return status
 */
async function testConnection() {
    if (!connectionString) {
        return { success: false, message: 'NEONDB_KEY not configured' };
    }
    try {
        const sql = getDb();
        if (!sql) {
            return { success: false, message: 'Database not available' };
        }
        const result = await sql `SELECT NOW() as current_time`;
        const timestamp = result[0].current_time;
        console.log('Database connected successfully at:', timestamp);
        dbAvailable = true;
        lastError = null;
        return { success: true, message: 'Connected', timestamp };
    }
    catch (error) {
        console.error('Database connection failed:', error);
        dbAvailable = false;
        lastError = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, message: lastError };
    }
}
//# sourceMappingURL=connection.js.map