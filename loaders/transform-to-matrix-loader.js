// 兼容不同版本的webpack和loader-utils
function getOptions(loaderContext) {
  try {
    // webpack 5+ 内置支持
    if (loaderContext.getOptions) {
      return loaderContext.getOptions() || {};
    }
    
    // 尝试使用loader-utils
    try {
      const loaderUtils = require('loader-utils');
      if (loaderUtils && loaderUtils.getOptions) {
        return loaderUtils.getOptions(loaderContext) || {};
      }
    } catch (e) {
      // loader-utils不可用，使用query参数
    }
    
    // 回退到query参数
    return loaderContext.query || {};
  } catch (error) {
    return {};
  }
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function matrixMultiply(a, b) {
  const result = [];
  for (let i = 0; i < 4; i++) {
    result[i] = [];
    for (let j = 0; j < 4; j++) {
      result[i][j] = 0;
      for (let k = 0; k < 4; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

function createIdentityMatrix() {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
}

function createTranslateMatrix(x = 0, y = 0, z = 0) {
  return [
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1]
  ];
}

function createScaleMatrix(x = 1, y = 1, z = 1) {
  return [
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1]
  ];
}

function createRotateXMatrix(angle) {
  const rad = degreesToRadians(angle);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [
    [1, 0, 0, 0],
    [0, cos, -sin, 0],
    [0, sin, cos, 0],
    [0, 0, 0, 1]
  ];
}

function createRotateYMatrix(angle) {
  const rad = degreesToRadians(angle);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [
    [cos, 0, sin, 0],
    [0, 1, 0, 0],
    [-sin, 0, cos, 0],
    [0, 0, 0, 1]
  ];
}

function createRotateZMatrix(angle) {
  const rad = degreesToRadians(angle);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [
    [cos, -sin, 0, 0],
    [sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
}

function createSkewXMatrix(angle) {
  const tan = Math.tan(degreesToRadians(angle));
  return [
    [1, tan, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
}

function createSkewYMatrix(angle) {
  const tan = Math.tan(degreesToRadians(angle));
  return [
    [1, 0, 0, 0],
    [tan, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
}

function matrixToString(matrix) {
  const values = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      values.push(parseFloat(matrix[i][j].toFixed(6)));
    }
  }
  return `matrix3d(${values.join(', ')})`;
}

function parseTransformValue(value) {
  if (!value || value === 'none') return '';
  
  let matrix = createIdentityMatrix();
  
  // 解析transform函数
  const transformFunctions = value.match(/(\w+)\([^)]+\)/g) || [];
  
  for (const func of transformFunctions) {
    const [name, paramsStr] = func.split('(');
    const params = paramsStr.slice(0, -1).split(',').map(p => p.trim());
    
    let transformMatrix;
    
    switch (name) {
      case 'translate':
      case 'translate3d': {
        const x = parseFloat(params[0]) || 0;
        const y = parseFloat(params[1]) || 0;
        const z = parseFloat(params[2]) || 0;
        transformMatrix = createTranslateMatrix(x, y, z);
        break;
      }
      case 'translateX': {
        const x = parseFloat(params[0]) || 0;
        transformMatrix = createTranslateMatrix(x, 0, 0);
        break;
      }
      case 'translateY': {
        const y = parseFloat(params[0]) || 0;
        transformMatrix = createTranslateMatrix(0, y, 0);
        break;
      }
      case 'translateZ': {
        const z = parseFloat(params[0]) || 0;
        transformMatrix = createTranslateMatrix(0, 0, z);
        break;
      }
      case 'scale':
      case 'scale3d': {
        const x = parseFloat(params[0]) || 1;
        const y = parseFloat(params[1]) || x;
        const z = parseFloat(params[2]) || 1;
        transformMatrix = createScaleMatrix(x, y, z);
        break;
      }
      case 'scaleX': {
        const x = parseFloat(params[0]) || 1;
        transformMatrix = createScaleMatrix(x, 1, 1);
        break;
      }
      case 'scaleY': {
        const y = parseFloat(params[0]) || 1;
        transformMatrix = createScaleMatrix(1, y, 1);
        break;
      }
      case 'scaleZ': {
        const z = parseFloat(params[0]) || 1;
        transformMatrix = createScaleMatrix(1, 1, z);
        break;
      }
      case 'rotate':
      case 'rotateZ': {
        const angle = parseFloat(params[0]) || 0;
        transformMatrix = createRotateZMatrix(angle);
        break;
      }
      case 'rotateX': {
        const angle = parseFloat(params[0]) || 0;
        transformMatrix = createRotateXMatrix(angle);
        break;
      }
      case 'rotateY': {
        const angle = parseFloat(params[0]) || 0;
        transformMatrix = createRotateYMatrix(angle);
        break;
      }
      case 'skew': {
        const x = parseFloat(params[0]) || 0;
        const y = parseFloat(params[1]) || 0;
        const skewXMatrix = createSkewXMatrix(x);
        const skewYMatrix = createSkewYMatrix(y);
        transformMatrix = matrixMultiply(skewXMatrix, skewYMatrix);
        break;
      }
      case 'skewX': {
        const angle = parseFloat(params[0]) || 0;
        transformMatrix = createSkewXMatrix(angle);
        break;
      }
      case 'skewY': {
        const angle = parseFloat(params[0]) || 0;
        transformMatrix = createSkewYMatrix(angle);
        break;
      }
      case 'matrix': {
        const [a, b, c, d, e, f] = params.map(p => parseFloat(p) || 0);
        transformMatrix = [
          [a, c, 0, e],
          [b, d, 0, f],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ];
        break;
      }
      case 'matrix3d': {
        const values = params.map(p => parseFloat(p) || 0);
        if (values.length === 16) {
          transformMatrix = [
            [values[0], values[4], values[8], values[12]],
            [values[1], values[5], values[9], values[13]],
            [values[2], values[6], values[10], values[14]],
            [values[3], values[7], values[11], values[15]]
          ];
        } else {
          transformMatrix = createIdentityMatrix();
        }
        break;
      }
      default:
        transformMatrix = createIdentityMatrix();
    }
    
    matrix = matrixMultiply(matrix, transformMatrix);
  }
  
  return matrixToString(matrix);
}

function transformToMatrix(source) {
  const options = getOptions(this) || {};
  
  // 匹配CSS和内联样式中的transform属性
  const transformRegex = /(?:transform\s*:\s*|style\s*=\s*["`'].*?transform:\s*)([^;"`']+)/gi;
  
  // 匹配Tailwind CSS transform相关的类名
  const tailwindTransformRegex = /(transform|translate-[xy]?-[\w.-]+|scale-[\w.-]+|rotate-[\w.-]+|skew-[xy]?-[\w.-]+)/g;
  
  let result = source;
  
  // 处理CSS transform属性
  result = result.replace(transformRegex, (match, transformValue) => {
    const matrixValue = parseTransformValue(transformValue.trim());
    if (matrixValue) {
      return match.replace(transformValue, matrixValue);
    }
    return match;
  });
  
  // 如果开启了Tailwind模式，处理Tailwind类名
  if (options.tailwind !== false) {
    // 这里可以扩展处理Tailwind CSS类名的逻辑
    // 由于Tailwind的transform类名最终也会生成CSS，主要处理CSS即可
  }
  
  return result;
}

module.exports = transformToMatrix;
module.exports.raw = false;