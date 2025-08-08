"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
/**
 * Simple Test Component
 *
 * A basic component to test if React components render in MDX
 */
var SimpleTest = function () {
    return (<div style={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #2196f3',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            textAlign: 'center'
        }}>
      <h3 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>✅ React Component Working!</h3>
      <p style={{ margin: '0', color: '#555' }}>If you can see this blue box, React components are rendering correctly in MDX.</p>
    </div>);
};
exports.default = SimpleTest;
