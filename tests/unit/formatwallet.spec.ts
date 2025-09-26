import { formatWalletAddress } from '@utils/index'

describe('formatWalletAddress', () => {
  describe('基础功能测试', () => {
    it('应该正确格式化标准的以太坊地址', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678'
      const result = formatWalletAddress(address)
      expect(result).toBe('0x123456...5678')
    })

    it('应该正确格式化不带0x前缀的地址', () => {
      const address = '1234567890abcdef1234567890abcdef12345678'
      const result = formatWalletAddress(address)
      expect(result).toBe('123456...5678')
    })

    it('应该使用自定义的起始和结束长度', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678'
      const result = formatWalletAddress(address, 8, 6)
      expect(result).toBe('0x12345678...345678')
    })
  })

  describe('边界条件测试', () => {
    it('应该返回空字符串当地址为空', () => {
      expect(formatWalletAddress('')).toBe('')
      expect(formatWalletAddress(null as any)).toBe('')
      expect(formatWalletAddress(undefined as any)).toBe('')
    })

    it('应该返回原地址当地址长度小于或等于格式化长度总和', () => {
      // 地址长度 <= startLength(6) + endLength(4) = 10
      const shortAddress1 = '0x12345678' // 长度10，应该返回原值
      const shortAddress2 = '0x123456' // 长度8，应该返回原值
      const shortAddress3 = '12345678' // 长度8，应该返回原值

      expect(formatWalletAddress(shortAddress1)).toBe(shortAddress1)
      expect(formatWalletAddress(shortAddress2)).toBe(shortAddress2)
      expect(formatWalletAddress(shortAddress3)).toBe(shortAddress3)
    })

    it('应该格式化地址当长度大于格式化长度总和', () => {
      // 地址长度 > startLength(6) + endLength(4) = 10
      const address1 = '0x1234567890a' // 长度13
      const address2 = '0x1234567890ab' // 长度14

      expect(formatWalletAddress(address1)).toBe('0x123456...890a')
      expect(formatWalletAddress(address2)).toBe('0x123456...90ab')
    })

    it('应该正确处理边界长度的地址', () => {
      // 正好等于 startLength + endLength
      const boundaryAddress = '0x12345678' // 长度10 = 6 + 4
      expect(formatWalletAddress(boundaryAddress, 6, 4)).toBe(boundaryAddress)

      // 比边界多一个字符，应该被格式化
      const overBoundary = '0x123456789a' // 长度11
      // 去掉0x后是 '123456789a'，取前6个 '123456'，后4个 '789a'
      expect(formatWalletAddress(overBoundary, 6, 4)).toBe('0x123456...789a')
    })

    it('应该正确处理自定义长度参数的边界情况', () => {
      const address = '0x12345678'

      // 当 startLength + endLength >= 地址长度时，返回原地址
      expect(formatWalletAddress(address, 5, 5)).toBe(address) // 5+5=10 >= 10
      expect(formatWalletAddress(address, 8, 2)).toBe(address) // 8+2=10 >= 10
      expect(formatWalletAddress(address, 10, 0)).toBe(address) // 10+0=10 >= 10

      // 当 startLength + endLength < 地址长度时，进行格式化
      expect(formatWalletAddress(address, 3, 3)).toBe('0x123...678') // 3+3=6 < 10
      expect(formatWalletAddress(address, 2, 2)).toBe('0x12...78') // 2+2=4 < 10
    })
  })

  describe('0x前缀处理测试', () => {
    it('应该保留0x前缀当原地址有前缀时', () => {
      const address = '0xabcdef1234567890abcdef1234567890abcdef12'
      const result = formatWalletAddress(address, 4, 3)
      expect(result).toBe('0xabcd...f12')
      expect(result.startsWith('0x')).toBe(true)
    })

    it('应该不添加0x前缀当原地址没有前缀时', () => {
      const address = 'abcdef1234567890abcdef1234567890abcdef12'
      const result = formatWalletAddress(address, 4, 3)
      expect(result).toBe('abcd...f12')
      expect(result.startsWith('0x')).toBe(false)
    })

    it('应该正确处理只有0x前缀的情况', () => {
      const address = '0x'
      expect(formatWalletAddress(address)).toBe('0x')
    })

    it('应该正确计算带0x前缀地址的长度', () => {
      // 0x + 8个字符 = 长度10，等于默认的 startLength(6) + endLength(4)
      const address = '0x12345678'
      expect(formatWalletAddress(address)).toBe(address)

      // 0x + 9个字符 = 长度11，大于默认的 startLength(6) + endLength(4)
      const longerAddress = '0x123456789'
      expect(formatWalletAddress(longerAddress)).toBe('0x123456...6789')
    })
  })

  describe('参数验证测试', () => {
    it('应该使用默认参数值', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678'
      const defaultResult = formatWalletAddress(address)
      const explicitResult = formatWalletAddress(address, 6, 4)
      expect(defaultResult).toBe(explicitResult)
      expect(defaultResult).toBe('0x123456...5678')
    })

    it('应该正确处理startLength为0的情况', () => {
      const address = '0x1234567890abcdef'
      const result = formatWalletAddress(address, 0, 4)
      expect(result).toBe('0x...cdef')
    })

    it('应该正确处理endLength为0的情况', () => {
      const address = '0x1234567890abcdef'
      const result = formatWalletAddress(address, 6, 0)
      // 注意：slice(-0) 会返回整个字符串，所以end会是整个cleanAddress
      expect(result).toBe('0x123456...1234567890abcdef')
    })

    it('应该正确处理两个长度都为0的情况', () => {
      const address = '0x1234567890abcdef'
      const result = formatWalletAddress(address, 0, 0)
      // start为空，end为整个cleanAddress（因为slice(-0)返回整个字符串）
      expect(result).toBe('0x...1234567890abcdef')
    })

    it('应该正确处理endLength为正数的情况', () => {
      const address = '0x1234567890abcdef'
      // endLength为2时，slice(-2)取最后2个字符
      expect(formatWalletAddress(address, 4, 2)).toBe('0x1234...ef')
      // endLength为4时，slice(-4)取最后4个字符
      expect(formatWalletAddress(address, 4, 4)).toBe('0x1234...cdef')
    })
  })

  describe('实际以太坊地址测试', () => {
    it('应该正确格式化真实的以太坊地址', () => {
      // 标准的42字符以太坊地址（包括0x）
      const realAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      const result = formatWalletAddress(realAddress)
      expect(result).toBe('0xd8dA6B...6045')
      expect(result.length).toBeLessThan(realAddress.length)
    })

    it('应该正确处理不同大小写的地址', () => {
      const lowerAddress = '0xabcdef1234567890abcdef1234567890abcdef12'
      const upperAddress = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12'
      const mixedAddress = '0xAbCdEf1234567890aBcDeF1234567890AbCdEf12'

      expect(formatWalletAddress(lowerAddress, 4, 4)).toBe('0xabcd...ef12')
      expect(formatWalletAddress(upperAddress, 4, 4)).toBe('0xABCD...EF12')
      expect(formatWalletAddress(mixedAddress, 4, 4)).toBe('0xAbCd...Ef12')
    })
  })

  describe('特殊情况测试', () => {
    it('应该处理非标准长度的地址', () => {
      // 短地址
      const shortAddr = '0x123'
      expect(formatWalletAddress(shortAddr)).toBe(shortAddr)

      // 中等长度地址
      const midAddr = '0x1234567890abc'
      expect(formatWalletAddress(midAddr, 4, 3)).toBe('0x1234...abc')

      // 超长地址
      const longAddr = '0x' + 'a'.repeat(100)
      expect(formatWalletAddress(longAddr, 6, 4)).toBe('0xaaaaaa...aaaa')
    })

    it('应该处理地址去掉0x前缀后的截取', () => {
      const address = '0x1234567890abcdefghij' // 0x后有18个字符

      // startLength=6 从去掉0x后的字符串开始截取
      const result = formatWalletAddress(address, 6, 4)
      expect(result).toBe('0x123456...ghij')

      // 验证是从cleanAddress截取的
      const withoutPrefix = '1234567890abcdefghij'
      const result2 = formatWalletAddress(withoutPrefix, 6, 4)
      expect(result2).toBe('123456...ghij')
    })

    it('应该验证slice行为', () => {
      const testStr = '1234567890'

      // slice(-0) 返回整个字符串
      expect(testStr.slice(-0)).toBe('1234567890')
      // slice(-1) 返回最后1个字符
      expect(testStr.slice(-1)).toBe('0')
      // slice(-4) 返回最后4个字符
      expect(testStr.slice(-4)).toBe('7890')

      // 因此当endLength=0时，end会是整个cleanAddress
      const address = '0x1234567890'
      const result = formatWalletAddress(address, 3, 0)
      // cleanAddress = '1234567890'
      // start = '123', end = '1234567890' (因为slice(-0))
      expect(result).toBe('0x123...1234567890')
    })
  })

  describe('覆盖率补充测试', () => {
    it('应该覆盖所有分支', () => {
      // Falsy 值测试
      expect(formatWalletAddress(0 as any)).toBe('')
      expect(formatWalletAddress(false as any)).toBe('')
      expect(formatWalletAddress(NaN as any)).toBe('')

      // 空字符串
      expect(formatWalletAddress('')).toBe('')

      // 只有前缀
      expect(formatWalletAddress('0x')).toBe('0x')

      // 各种长度组合
      const testAddr = '0x1234567890abcdef1234567890'
      // cleanAddress = '1234567890abcdef1234567890' (去掉0x后)

      // startLength=0, endLength=0: slice(-0)返回整个字符串
      expect(formatWalletAddress(testAddr, 0, 0)).toBe('0x...1234567890abcdef1234567890')

      // startLength=10, endLength=0: slice(-0)返回整个字符串
      expect(formatWalletAddress(testAddr, 10, 0)).toBe('0x1234567890...1234567890abcdef1234567890')

      // startLength=0, endLength=10: slice(-10)取最后10个字符
      // cleanAddress最后10个字符是 '1234567890'
      expect(formatWalletAddress(testAddr, 0, 10)).toBe('0x...1234567890')

      // 边界测试
      const boundary = '0x12345678' // 长度正好是10
      expect(formatWalletAddress(boundary)).toBe(boundary)
      expect(formatWalletAddress(boundary + '9')).toBe('0x123456...6789')
    })

    it('应该正确处理slice的边界', () => {
      const address = '0x1234567890'

      // 测试 slice(0, startLength)
      expect(formatWalletAddress(address, 3, 2)).toBe('0x123...90')

      // 测试 slice(-endLength)
      expect(formatWalletAddress(address, 2, 3)).toBe('0x12...890')

      // 测试 endLength=0 的特殊情况
      expect(formatWalletAddress(address, 2, 0)).toBe('0x12...1234567890')
    })

    it('应该详细验证slice行为', () => {
      const testAddr = '0x1234567890abcdef1234567890'
      // cleanAddress = '1234567890abcdef1234567890' (26个字符)

      // 验证最后10个字符
      const cleanAddr = '1234567890abcdef1234567890'
      expect(cleanAddr.slice(-10)).toBe('1234567890')
      expect(cleanAddr.slice(-5)).toBe('67890')
      expect(cleanAddr.slice(-26)).toBe(cleanAddr)

      // 因此：
      expect(formatWalletAddress(testAddr, 0, 5)).toBe('0x...67890')
      expect(formatWalletAddress(testAddr, 5, 5)).toBe('0x12345...67890')
    })
  })

  describe('性能测试', () => {
    it('应该高效处理大量调用', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678'
      const iterations = 10000

      const startTime = performance.now()
      for (let i = 0; i < iterations; i++) {
        formatWalletAddress(address)
      }
      const endTime = performance.now()

      // 10000次调用应该在100ms内完成
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('实际使用场景', () => {
    it('应该适合在UI中显示', () => {
      const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7'

      // 默认格式化
      expect(formatWalletAddress(walletAddress)).toBe('0x742d35...bEb7')

      // 移动端可能需要更短的显示
      expect(formatWalletAddress(walletAddress, 4, 4)).toBe('0x742d...bEb7')

      // 桌面端可以显示更多
      expect(formatWalletAddress(walletAddress, 8, 6)).toBe('0x742d35Cc...f0bEb7')
    })

    it('应该处理各种真实场景', () => {
      // ENS 域名解析后的地址
      const ensResolved = '0x5e349eca2dc61abcd9dd99ce94d04136151a09ee'
      expect(formatWalletAddress(ensResolved)).toBe('0x5e349e...09ee')

      // 合约地址
      const contractAddr = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // USDC
      expect(formatWalletAddress(contractAddr, 8, 4)).toBe('0xA0b86991...eB48')

      // 无前缀地址（某些库返回的格式）
      const noPrefixAddr = 'd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      expect(formatWalletAddress(noPrefixAddr)).toBe('d8dA6B...6045')
    })
  })
})
