const { parse, stringify } = require('postcss')

/**
 * 将 transform 值转换为 matrix3d
 * @param {string} transformValue - transform 属性值
 * @returns {string} - matrix3d 字符串
 */
function convertTransformToMatrix3D(transformValue) {
  // 移除多余空格和换行符
  const cleanValue = transformValue.replace(/\s+/g, ' ').trim()

  // 解析 transform 函数
  const functions = parseTransformFunctions(cleanValue)

  if (functions.length === 0) {
    return transformValue // 无法解析时返回原值
  }

  // 创建初始单位矩阵
  let matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]

  // 按顺序应用每个变换函数
  functions.forEach(func => {
    const funcMatrix = createTransformMatrix(func)
    matrix = multiplyMatrices(matrix, funcMatrix)
  })

  // 将 4x4 矩阵转换为 matrix3d 格式
  return matrix3dToString(matrix)
}

/**
 * 解析 transform 字符串中的函数
 * @param {string} value - transform 值
 * @returns {Array} - 函数对象数组
 */
function parseTransformFunctions(value) {
  const functions = []
  const functionRegex = /(\w+)\(([^)]+)\)/g
  let match

  while ((match = functionRegex.exec(value)) !== null) {
    const funcName = match[1]
    const params = match[2].split(/\s*,\s*|\s+/).map(param => {
      // 解析数值和单位
      const numMatch = param.match(/^(-?\d*\.?\d+)([a-z%]*)$/)
      if (numMatch) {
        return {
          value: parseFloat(numMatch[1]),
          unit: numMatch[2] || 'px',
        }
      }
      return { value: parseFloat(param), unit: 'px' }
    })

    functions.push({
      name: funcName,
      params: params,
    })
  }

  return functions
}

/**
 * 创建变换矩阵
 * @param {Object} func - 变换函数
 * @returns {Array} - 4x4 变换矩阵
 */
function createTransformMatrix(func) {
  const { name, params } = func

  switch (name.toLowerCase()) {
    case 'translate':
    case 'translate3d':
      const x = params[0]?.value || 0
      const y = params[1]?.value || 0
      const z = params[2]?.value || 0
      return [
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1],
      ]

    case 'translatex':
      return [
        [1, 0, 0, params[0]?.value || 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'translatey':
      return [
        [1, 0, 0, 0],
        [0, 1, 0, params[0]?.value || 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'translatez':
      return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, params[0]?.value || 0],
        [0, 0, 0, 1],
      ]

    case 'scale':
    case 'scale3d':
      const sx = params[0]?.value || 1
      const sy = params[1]?.value || sx
      const sz = params[2]?.value || 1
      return [
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1],
      ]

    case 'scalex':
      return [
        [params[0]?.value || 1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'scaley':
      return [
        [1, 0, 0, 0],
        [0, params[0]?.value || 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'scalez':
      return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, params[0]?.value || 1, 0],
        [0, 0, 0, 1],
      ]

    case 'rotate':
    case 'rotatez':
      const angleZ = ((params[0]?.value || 0) * Math.PI) / 180
      const cosZ = Math.cos(angleZ)
      const sinZ = Math.sin(angleZ)
      return [
        [cosZ, -sinZ, 0, 0],
        [sinZ, cosZ, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'rotatex':
      const angleX = ((params[0]?.value || 0) * Math.PI) / 180
      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)
      return [
        [1, 0, 0, 0],
        [0, cosX, -sinX, 0],
        [0, sinX, cosX, 0],
        [0, 0, 0, 1],
      ]

    case 'rotatey':
      const angleY = ((params[0]?.value || 0) * Math.PI) / 180
      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)
      return [
        [cosY, 0, sinY, 0],
        [0, 1, 0, 0],
        [-sinY, 0, cosY, 0],
        [0, 0, 0, 1],
      ]

    case 'skew':
      const skewX = ((params[0]?.value || 0) * Math.PI) / 180
      const skewY = ((params[1]?.value || 0) * Math.PI) / 180
      return [
        [1, Math.tan(skewX), 0, 0],
        [Math.tan(skewY), 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'skewx':
      const skewAngleX = ((params[0]?.value || 0) * Math.PI) / 180
      return [
        [1, Math.tan(skewAngleX), 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'skewy':
      const skewAngleY = ((params[0]?.value || 0) * Math.PI) / 180
      return [
        [1, 0, 0, 0],
        [Math.tan(skewAngleY), 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'matrix':
      return [
        [params[0]?.value || 1, params[2]?.value || 0, 0, params[4]?.value || 0],
        [params[1]?.value || 0, params[3]?.value || 1, 0, params[5]?.value || 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]

    case 'matrix3d':
      // 已经是 matrix3d，直接返回参数
      const matrix3d = []
      for (let i = 0; i < 16; i++) {
        matrix3d.push(params[i]?.value || (i % 5 === 0 ? 1 : 0))
      }
      return [
        matrix3d.slice(0, 4),
        matrix3d.slice(4, 8),
        matrix3d.slice(8, 12),
        matrix3d.slice(12, 16),
      ]

    default:
      // 不支持的函数返回单位矩阵
      console.warn(`Unsupported transform function: ${name}`)
      return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]
  }
}

/**
 * 矩阵乘法
 * @param {Array} a - 4x4 矩阵
 * @param {Array} b - 4x4 矩阵
 * @returns {Array} - 乘积矩阵
 */
function multiplyMatrices(a, b) {
  const result = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i][j] += a[i][k] * b[k][j]
      }
    }
  }

  return result
}

/**
 * 将 4x4 矩阵转换为 matrix3d 字符串
 * @param {Array} matrix - 4x4 矩阵
 * @returns {string} - matrix3d 字符串
 */
function matrix3dToString(matrix) {
  const values = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // 限制小数位数，避免浮点数精度问题
      values.push(parseFloat(matrix[i][j].toFixed(6)))
    }
  }
  return `matrix3d(${values.join(', ')})`
}

/**
 * 主 loader 函数
 */
module.exports = function (source) {
  // 使用 PostCSS 解析 CSS，确保准确处理 CSS 语法
  const root = parse(source)

  // 遍历所有声明
  // root.walkDecls(/^transform$/i, decl => {
  //   try {
  //     const matrix3d = convertTransformToMatrix3D(decl.value)

  //     // 只有在成功转换且与原值不同时才替换
  //     if (matrix3d && matrix3d !== decl.value) {
  //       decl.value = matrix3d

  //       // 添加注释说明原始值（可选）
  //       decl.parent.insertBefore(decl, {
  //         text: `/* Original: transform: ${decl.value} */`,
  //       })
  //     }
  //   } catch (error) {
  //     console.warn(`Transform conversion failed for: ${decl.value}`, error)
  //     // 转换失败时保持原值
  //   }
  // })

  // 返回处理后的 CSS
  return stringify(root)
}

// 导出工具函数供测试使用
module.exports.convertTransformToMatrix3D = convertTransformToMatrix3D
module.exports.parseTransformFunctions = parseTransformFunctions
module.exports.createTransformMatrix = createTransformMatrix
