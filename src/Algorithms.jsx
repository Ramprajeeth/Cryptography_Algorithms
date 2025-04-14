import React, { useState } from 'react';


    function EncryptionApp() {
      const [inputText, setInputText] = useState('');
      const [outputText, setOutputText] = useState('');
      const [selectedAlgorithm, setSelectedAlgorithm] = useState('atbash');
      const [mode, setMode] = useState('encrypt'); // encrypt or decrypt
      const [key, setKey] = useState('3');
      const [a, setA] = useState('5');
      const [b, setB] = useState('7');
      const [hillMatrix, setHillMatrix] = useState('2,1,1,3');
      const [rails, setRails] = useState('3');
      const [routeRows, setRouteRows] = useState('3');
      const [routeCols, setRouteCols] = useState('3');
      const [columns, setColumns] = useState('3,1,4,2');
      const [keyword, setKeyword] = useState('KEYWORD');

      const algorithms = {
        atbash: {
          encrypt: (text) => {
            return text
              .split('')
              .map((char) => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(155 - code);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(219 - code);
                }
                return char;
              })
              .join('');
          },
          decrypt: (text) => {
            return algorithms.atbash.encrypt(text); // Atbash is its own inverse
          }
        },

        caesar: {
          encrypt: (text, shift = parseInt(key) || 3) => {
            return text
              .split('')
              .map((char) => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
                }
                return char;
              })
              .join('');
          },
          decrypt: (text, shift = parseInt(key) || 3) => {
            return algorithms.caesar.encrypt(text, -shift);
          }
        },

        affine: {
          encrypt: (text) => {
            const aValue = parseInt(a) || 5;
            const bValue = parseInt(b) || 7;
            const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
            if (gcd(aValue, 26) !== 1) {
              return "Error: 'a' must be coprime with 26";
            }
            return text
              .split('')
              .map((char) => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((aValue * (code - 65) + bValue) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((aValue * (code - 97) + bValue) % 26) + 97);
                }
                return char;
              })
              .join('');
          },
          decrypt: (text) => {
            const aValue = parseInt(a) || 5;
            const bValue = parseInt(b) || 7;
            const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
            if (gcd(aValue, 26) !== 1) {
              return "Error: 'a' must be coprime with 26";
            }
            const modInverse = (a, m) => {
              for (let x = 1; x < m; x++) {
                if ((a * x) % m === 1) return x;
              }
              return 1;
            };
            const aInverse = modInverse(aValue, 26);
            return text
              .split('')
              .map((char) => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode((aInverse * ((code - 65 - bValue + 26) % 26)) % 26 + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode((aInverse * ((code - 97 - bValue + 26) % 26)) % 26 + 97);
                }
                return char;
              })
              .join('');
          }
        },

        vigenere: {
          encrypt: (text) => {
            if (!key) return "Error: Key is required";
            const keyUpper = key.toUpperCase();
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                const keyChar = keyUpper[i % keyUpper.length];
                const shift = keyChar.charCodeAt(0) - 65;
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((code - 97 + shift) % 26) + 97);
                }
                return char;
              })
              .join('');
          },
          decrypt: (text) => {
            if (!key) return "Error: Key is required";
            const keyUpper = key.toUpperCase();
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                const keyChar = keyUpper[i % keyUpper.length];
                const shift = keyChar.charCodeAt(0) - 65;
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                }
                return char;
              })
              .join('');
          }
        },

        gronsfeld: {
          encrypt: (text) => {
            if (!key) return "Error: Numeric key is required";
            const keyDigits = key.split('').map(Number);
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                const shift = keyDigits[i % keyDigits.length];
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((code - 97 + shift) % 26) + 97);
                }
                return char;
              })
              .join('');
          },
          decrypt: (text) => {
            if (!key) return "Error: Numeric key is required";
            const keyDigits = key.split('').map(Number);
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                const shift = keyDigits[i % keyDigits.length];
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                }
                return char;
              })
              .join('');
          }
        },

        beaufort: {
          encrypt: (text) => {
            if (!key) return "Error: Key is required";
            const keyUpper = key.toUpperCase();
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                const keyChar = keyUpper[i % keyUpper.length];
                const keyCode = keyChar.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((keyCode - code + 26) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((keyCode - 65 - (code - 97) + 26) % 26) + 97);
                }
                return char;
              })
              .join('');
          },
          decrypt: (text) => {
            return algorithms.beaufort.encrypt(text); // Beaufort is its own inverse
          }
        },

        autokey: {
          encrypt: (text) => {
            if (!key) return "Error: Key is required";
            let keyStream = key.toUpperCase();
            const textUpper = text.replace(/[^A-Za-z]/g, '').toUpperCase();
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90 || code >= 97 && code <= 122) {
                  const plainIndex = textUpper.indexOf(char.toUpperCase());
                  const keyChar = i < keyStream.length ? keyStream[i] : textUpper[i - keyStream.length];
                  const shift = keyChar.charCodeAt(0) - 65;
                  if (code >= 65 && code <= 90) {
                    return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                  } else {
                    return String.fromCharCode(((code - 97 + shift) % 26) + 97);
                  }
                }
                return char;
              })
              .join('');
          },
          decrypt: (text) => {
            if (!key) return "Error: Key is required";
            let keyStream = key.toUpperCase();
            let result = '';
            let plainText = '';
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                if (code >= 65 && code <= 90 || code >= 97 && code <= 122) {
                  const keyChar = i < keyStream.length ? keyStream[i] : plainText[plainText.length - keyStream.length];
                  const shift = keyChar.charCodeAt(0) - 65;
                  let plainChar;
                  if (code >= 65 && code <= 90) {
                    plainChar = String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                  } else {
                    plainChar = String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                  }
                  plainText += plainChar.toUpperCase();
                  return plainChar;
                }
                return char;
              })
              .join('');
          }
        },

        runningkey: {
          encrypt: (text) => {
            if (!key) return "Error: Running key text is required";
            const keyUpper = key.toUpperCase();
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                const keyChar = keyUpper[i % keyUpper.length];
                const shift = keyChar.charCodeAt(0) - 65;
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((code - 97 + shift) % 26) + 97);
                }
                return char;
              })
              .join('');
          },
          decrypt: (text) => {
            if (!key) return "Error: Running key text is required";
            const keyUpper = key.toUpperCase();
            return text
              .split('')
              .map((char, i) => {
                const code = char.charCodeAt(0);
                const keyChar = keyUpper[i % keyUpper.length];
                const shift = keyChar.charCodeAt(0) - 65;
                if (code >= 65 && code <= 90) {
                  return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                } else if (code >= 97 && code <= 122) {
                  return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                }
                return char;
              })
              .join('');
          }
        },

        hill: {
          encrypt: (text) => {
            try {
              const matrix = hillMatrix.split(',').map(Number);
              if (matrix.length !== 4) return "Error: Hill cipher requires a 2x2 matrix";
              let processedText = text.replace(/[^A-Za-z]/g, '').toUpperCase();
              if (processedText.length % 2 !== 0) processedText += 'X';
              let result = '';
              for (let i = 0; i < processedText.length; i += 2) {
                const p1 = processedText.charCodeAt(i) - 65;
                const p2 = processedText.charCodeAt(i + 1) - 65;
                const c1 = (matrix[0] * p1 + matrix[1] * p2) % 26;
                const c2 = (matrix[2] * p1 + matrix[3] * p2) % 26;
                result += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
              }
              return result;
            } catch (error) {
              return "Error: Invalid Hill cipher configuration";
            }
          },
          decrypt: (text) => {
            try {
              const matrix = hillMatrix.split(',').map(Number);
              if (matrix.length !== 4) return "Error: Hill cipher requires a 2x2 matrix";
              const det = (matrix[0] * matrix[3] - matrix[1] * matrix[2]) % 26;
              const modInverse = (a, m) => {
                for (let x = 1; x < m; x++) {
                  if ((a * x) % m === 1) return x;
                }
                return null;
              };
              const detInv = modInverse(det < 0 ? det + 26 : det, 26);
              if (!detInv) return "Error: Matrix is not invertible";
              const adjMatrix = [
                matrix[3],
                -matrix[1],
                -matrix[2],
                matrix[0]
              ].map(x => (x < 0 ? x + 26 : x) % 26);
              const invMatrix = adjMatrix.map(x => (x * detInv) % 26);
              let result = '';
              for (let i = 0; i < text.length; i += 2) {
                const c1 = text.charCodeAt(i) - 65;
                const c2 = text.charCodeAt(i + 1) - 65;
                const p1 = (invMatrix[0] * c1 + invMatrix[1] * c2) % 26;
                const p2 = (invMatrix[2] * c1 + invMatrix[3] * c2) % 26;
                result += String.fromCharCode(p1 + 65) + String.fromCharCode(p2 + 65);
              }
              return result;
            } catch (error) {
              return "Error: Invalid Hill cipher configuration";
            }
          }
        },

        railfence: {
          encrypt: (text) => {
            const numRails = parseInt(rails) || 3;
            if (numRails < 2) return "Error: Rails must be at least 2";
            const fence = Array(numRails).fill('').map(() => []);
            let rail = 0;
            let direction = 1;
            for (let i = 0; i < text.length; i++) {
              fence[rail].push(text[i]);
              rail += direction;
              if (rail === 0 || rail === numRails - 1) direction = -direction;
            }
            return fence.flat().join('');
          },
          decrypt: (text) => {
            const numRails = parseInt(rails) || 3;
            if (numRails < 2) return "Error: Rails must be at least 2";
            const fence = Array(numRails).fill().map(() => Array(text.length).fill(null));
            let rail = 0;
            let direction = 1;
            for (let i = 0; i < text.length; i++) {
              fence[rail][i] = '*';
              rail += direction;
              if (rail === 0 || rail === numRails - 1) direction = -direction;
            }
            let index = 0;
            for (let r = 0; r < numRails; r++) {
              for (let i = 0; i < text.length; i++) {
                if (fence[r][i] === '*' && index < text.length) {
                  fence[r][i] = text[index++];
                }
              }
            }
            let result = '';
            rail = 0;
            direction = 1;
            for (let i = 0; i < text.length; i++) {
              if (fence[rail][i]) {
                result += fence[rail][i];
              }
              rail += direction;
              if (rail === 0 || rail === numRails - 1) direction = -direction;
            }
            return result;
          }
        },

        route: {
          encrypt: (text) => {
            const rows = parseInt(routeRows) || 3;
            const cols = parseInt(routeCols) || 3;
            const grid = [];
            for (let i = 0; i < rows; i++) {
              grid[i] = [];
              for (let j = 0; j < cols; j++) {
                const index = i * cols + j;
                grid[i][j] = index < text.length ? text[index] : ' ';
              }
            }
            let result = '';
            let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
            while (top <= bottom && left <= right) {
              for (let i = left; i <= right; i++) result += grid[top][i];
              top++;
              for (let i = top; i <= bottom; i++) result += grid[i][right];
              right--;
              if (top <= bottom) {
                for (let i = right; i >= left; i--) result += grid[bottom][i];
                bottom--;
              }
              if (left <= right) {
                for (let i = bottom; i >= top; i--) result += grid[i][left];
                left++;
              }
            }
            return result;
          },
          decrypt: (text) => {
            const rows = parseInt(routeRows) || 3;
            const cols = parseInt(routeCols) || 3;
            const grid = Array(rows).fill().map(() => Array(cols).fill(null));
            let index = 0;
            let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
            while (top <= bottom && left <= right) {
              for (let i = left; i <= right; i++) grid[top][i] = '*';
              top++;
              for (let i = top; i <= bottom; i++) grid[i][right] = '*';
              right--;
              if (top <= bottom) {
                for (let i = right; i >= left; i--) grid[bottom][i] = '*';
                bottom--;
              }
              if (left <= right) {
                for (let i = bottom; i >= top; i--) grid[i][left] = '*';
                left++;
              }
            }
            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                if (grid[i][j] === '*' && index < text.length) {
                  grid[i][j] = text[index++];
                }
              }
            }
            let result = '';
            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                if (grid[i][j] !== ' ' && grid[i][j] !== null) {
                  result += grid[i][j];
                }
              }
            }
            return result;
          }
        },

        columnar: {
          encrypt: (text) => {
            const order = columns.split(',').map(Number);
            const numCols = order.length;
            const numRows = Math.ceil(text.length / numCols);
            const grid = [];
            for (let i = 0; i < numRows; i++) {
              grid[i] = [];
              for (let j = 0; j < numCols; j++) {
                const index = i * numCols + j;
                grid[i][j] = index < text.length ? text[index] : ' ';
              }
            }
            let result = '';
            for (let i = 1; i <= numCols; i++) {
              const colIndex = order.indexOf(i);
              for (let j = 0; j < numRows; j++) {
                if (grid[j][colIndex] !== ' ') {
                  result += grid[j][colIndex];
                }
              }
            }
            return result;
          },
          decrypt: (text) => {
            const order = columns.split(',').map(Number);
            const numCols = order.length;
            const numRows = Math.ceil(text.length / numCols);
            const grid = Array(numRows).fill().map(() => Array(numCols).fill(null));
            let index = 0;
            for (let i = 1; i <= numCols; i++) {
              const colIndex = order.indexOf(i);
              for (let j = 0; j < numRows; j++) {
                if (index < text.length) {
                  grid[j][colIndex] = text[index++];
                }
              }
            }
            let result = '';
            for (let i = 0; i < numRows; i++) {
              for (let j = 0; j < numCols; j++) {
                if (grid[i][j] !== null && grid[i][j] !== ' ') {
                  result += grid[i][j];
                }
              }
            }
            return result;
          }
        },

        doubleTransposition: {
          encrypt: (text) => {
            const firstPass = algorithms.columnar.encrypt(text);
            return algorithms.columnar.encrypt(firstPass);
          },
          decrypt: (text) => {
            const firstPass = algorithms.columnar.decrypt(text);
            return algorithms.columnar.decrypt(firstPass);
          }
        },

        myszkowski: {
          encrypt: (text) => {
            if (!keyword) return "Error: Keyword is required";
            const key = keyword.toUpperCase();
            const keyOrder = [];
            const chars = {};
            for (let i = 0; i < key.length; i++) {
              if (!chars[key[i]]) {
                chars[key[i]] = Object.keys(chars).length + 1;
              }
              keyOrder.push(chars[key[i]]);
            }
            const numCols = key.length;
            const numRows = Math.ceil(text.length / numCols);
            const grid = [];
            for (let i = 0; i < numRows; i++) {
              grid[i] = [];
              for (let j = 0; j < numCols; j++) {
                const index = i * numCols + j;
                grid[i][j] = index < text.length ? text[index] : ' ';
              }
            }
            let result = '';
            const uniqueOrders = [...new Set(keyOrder)].sort();
            for (const order of uniqueOrders) {
              const columns = [];
              for (let i = 0; i < keyOrder.length; i++) {
                if (keyOrder[i] === order) {
                  columns.push(i);
                }
              }
              for (let row = 0; row < numRows; row++) {
                for (const col of columns) {
                  if (grid[row][col] !== ' ') {
                    result += grid[row][col];
                  }
                }
              }
            }
            return result;
          },
          decrypt: (text) => {
            if (!keyword) return "Error: Keyword is required";
            const key = keyword.toUpperCase();
            const keyOrder = [];
            const chars = {};
            for (let i = 0; i < key.length; i++) {
              if (!chars[key[i]]) {
                chars[key[i]] = Object.keys(chars).length + 1;
              }
              keyOrder.push(chars[key[i]]);
            }
            const numCols = key.length;
            const numRows = Math.ceil(text.length / numCols);
            const grid = Array(numRows).fill().map(() => Array(numCols).fill(null));
            let index = 0;
            const uniqueOrders = [...new Set(keyOrder)].sort();
            for (const order of uniqueOrders) {
              const columns = [];
              for (let i = 0; i < keyOrder.length; i++) {
                if (keyOrder[i] === order) {
                  columns.push(i);
                }
              }
              for (let row = 0; row < numRows; row++) {
                for (const col of columns) {
                  if (index < text.length) {
                    grid[row][col] = text[index++];
                  }
                }
              }
            }
            let result = '';
            for (let i = 0; i < numRows; i++) {
              for (let j = 0; j < numCols; j++) {
                if (grid[i][j] !== null && grid[i][j] !== ' ') {
                  result += grid[i][j];
                }
              }
            }
            return result;
          }
        }
      };

      const handleProcess = () => {
        const algorithm = algorithms[selectedAlgorithm];
        if (algorithm) {
          setOutputText(algorithm[mode](inputText));
        } else {
          setOutputText("Error: Algorithm not implemented");
        }
      };

      const renderKeyInput = () => {
        switch (selectedAlgorithm) {
          case 'caesar':
            return (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Shift (Default: 3)</label>
                <input
                  type="number"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter shift value"
                />
              </div>
            );
          case 'affine':
            return (
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">A (must be coprime with 26, Default: 5)</label>
                  <input
                    type="number"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">B (Default: 7)</label>
                  <input
                    type="number"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            );
          case 'vigenere':
          case 'beaufort':
          case 'autokey':
          case 'runningkey':
            return (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Key (Default: KEY)</label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter key"
                />
              </div>
            );
          case 'gronsfeld':
            return (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Numeric Key (Default: 31415)</label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter numeric key"
                />
              </div>
            );
          case 'hill':
            return (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Hill Matrix (2x2, comma-separated, Default: 2,1,1,3)</label>
                <input
                  type="text"
                  value={hillMatrix}
                  onChange={(e) => setHillMatrix(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Example: 2,1,1,3"
                />
              </div>
            );
          case 'railfence':
            return (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Number of Rails (Default: 3)</label>
                <input
                  type="number"
                  value={rails}
                  onChange={(e) => setRails(e.target.value)}
                  className="w-full p-2 border rounded"
                  min="2"
                />
              </div>
            );
          case 'route':
            return (
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Rows (Default: 3)</label>
                  <input
                    type="number"
                    value={routeRows}
                    onChange={(e) => setRouteRows(e.target.value)}
                    className="w-full p-2 border rounded"
                    min="2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Columns (Default: 3)</label>
                  <input
                    type="number"
                    value={routeCols}
                    onChange={(e) => setRouteCols(e.target.value)}
                    className="w-full p-2 border rounded"
                    min="2"
                  />
                </div>
              </div>
            );
          case 'columnar':
          case 'doubleTransposition':
            return (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Column Order (comma-separated, Default: 3,1,4,2)</label>
                <input
                  type="text"
                  value={columns}
                  onChange={(e) => setColumns(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Example: 3,1,4,2"
                />
              </div>
            );
          case 'myszkowski':
            return (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Keyword (Default: KEYWORD)</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                  className="w-full p-2 border rounded"
                  placeholder="Example: KEYWORD"
                />
              </div>
            );
          default:
            return null;
        }
      };

      return (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Encryption/Decryption App</h1>
          
          <div className="mb-6 flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="encrypt">Encrypt</option>
                <option value="decrypt">Decrypt</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Select Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="atbash">1. Atbash Cipher</option>
                <option value="caesar">2. Caesar Cipher</option>
                <option value="affine">3. Affine Cipher</option>
                <option value="vigenere">4. Vigenère Cipher</option>
                <option value="gronsfeld">5. Gronsfeld Cipher</option>
                <option value="beaufort">6. Beaufort Cipher</option>
                <option value="autokey">7. Auto Key Cipher</option>
                <option value="runningkey">8. Running Key Cipher</option>
                <option value="hill">9. Hill Cipher</option>
                <option value="railfence">10. Rail Fence Cipher</option>
                <option value="route">11. Route Cipher</option>
                <option value="columnar">12. Columnar Cipher</option>
                <option value="doubleTransposition">13. Double Transposition Cipher</option>
                <option value="myszkowski">14. Myszkowski Cipher</option>
              </select>
            </div>
          </div>
          
          {renderKeyInput()}
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">{mode === 'encrypt' ? 'Plain Text' : 'Encrypted Text'}</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder={mode === 'encrypt' ? 'Enter text to encrypt' : 'Enter text to decrypt'}
            />
          </div>
          
          <button
            onClick={handleProcess}
            className="w-full p-2 bg-blue-600 text-white rounded font-medium mb-6 hover:bg-blue-700"
          >
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
          
          <div>
            <label className="block text-sm font-medium mb-1">{mode === 'encrypt' ? 'Encrypted Text' : 'Plain Text'}</label>
            <textarea
              value={outputText}
              readOnly
              className="w-full p-2 border rounded h-32 bg-gray-50"
            />
          </div>
        </div>
      );
    }

    export default EncryptionApp;
  