// jest.config.js
// Configuración de Jest para ES Modules

export default {
  // Usar jsdom para simular el navegador (localStorage, fetch, etc.)
  testEnvironment: 'jsdom',
  
  // Transformar archivos .js como ES Modules
  transform: {},
  
  // Extensiones de archivo que Jest debe procesar
  moduleFileExtensions: ['js', 'json'],
  
  // Patrón para encontrar archivos de test
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Mostrar cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**'
  ],
  
  // Configuración de cobertura
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  }
};
