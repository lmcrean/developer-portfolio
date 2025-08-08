"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mockAxiosInstance = {
    interceptors: {
        request: {
            use: jest.fn()
        },
        response: {
            use: jest.fn()
        }
    },
    get: jest.fn(function () { return Promise.resolve({ data: {} }); }),
    post: jest.fn(function () { return Promise.resolve({ data: {} }); }),
    put: jest.fn(function () { return Promise.resolve({ data: {} }); }),
    delete: jest.fn(function () { return Promise.resolve({ data: {} }); }),
};
var axios = {
    create: jest.fn(function () { return mockAxiosInstance; }),
    interceptors: {
        request: {
            use: jest.fn()
        },
        response: {
            use: jest.fn()
        }
    },
    get: jest.fn(function () { return Promise.resolve({ data: {} }); }),
    post: jest.fn(function () { return Promise.resolve({ data: {} }); }),
    put: jest.fn(function () { return Promise.resolve({ data: {} }); }),
    delete: jest.fn(function () { return Promise.resolve({ data: {} }); }),
};
exports.default = axios;
