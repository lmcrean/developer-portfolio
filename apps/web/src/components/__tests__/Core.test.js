"use strict";
/**
 * @jest-environment jsdom
 */
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Core_1 = require("../api/Core");
// Axios is mocked automatically via __mocks__/axios.ts
describe('Core API Client', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('Configuration', function () {
        it('should have correct base URL', function () {
            expect(Core_1.API_BASE_URL).toBe('https://api-github-main-329000596728.us-central1.run.app');
        });
        it('should have axios create method available', function () {
            expect(axios_1.default.create).toBeDefined();
            expect(typeof axios_1.default.create).toBe('function');
        });
        it('should export apiClient as default', function () {
            expect(Core_1.default).toBeDefined();
            expect(typeof Core_1.default).toBe('object');
        });
        it('should export API_BASE_URL constant', function () {
            expect(Core_1.API_BASE_URL).toBe('https://api-github-main-329000596728.us-central1.run.app');
        });
    });
    describe('API Client Methods', function () {
        it('should have get method', function () {
            expect(Core_1.default.get).toBeDefined();
            expect(typeof Core_1.default.get).toBe('function');
        });
        it('should have post method', function () {
            expect(Core_1.default.post).toBeDefined();
            expect(typeof Core_1.default.post).toBe('function');
        });
        it('should have interceptors configured', function () {
            expect(Core_1.default.interceptors).toBeDefined();
            expect(Core_1.default.interceptors.request).toBeDefined();
            expect(Core_1.default.interceptors.response).toBeDefined();
        });
    });
});
