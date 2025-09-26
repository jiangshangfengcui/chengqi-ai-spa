import { atom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useImmer } from '@hooks/useImmer'
import * as styles from './style.module.css'

const countAtom = atom(0)

const Index = () => {
  const count = useAtomValue(countAtom)
  console.log('test index', count) // 执行两遍，解决状态撕裂

  // 无意义的渲染
  // const [text, setText] = useState({ data: 'hello', info: '123' })
  const [text, setText] = useImmer({ data: 'hello', info: '123' })

  // immer 不可变对象 把变化的部分抽出来，把不变的部分引用过来，对象不用动
  // immutable.js immer immerjs 避免不必要的渲染
  useEffect(() => {
    // immer 会把 info 变成 "456"， data 还是 "hello"
    // 为什么创建不可变对象？因为我们希望在不改变原有对象的基础上，创建一个新的对象，
    // setText({ data: 'hello', info: '123' })

    setText(draft => {
      draft.info = '789'
    })

    // 同一个组件里 不涉及对象 使用useState
    // 涉及到对象，useImmer
    // 涉及到多个组件跨用，使用jotai
    // 涉及到组件间共享状态，使用zustand
  }, [setText])

  // 按钮点击处理函数
  const handleUpdate = () => {
    // 没有做到web3大学 种调用方式
    //contractInstance ==》类型
    // const contractInstance = new Contract(
    //   CONTRACT_ADDRESS,
    //   InfoContractABI.abi,
    //   signer,
    // ) as unknown as InfoContract

    // contractInstance.setInfo();

    // const contractInstance = InfoContract__factory.connect(CONTRACT_ADDRESS, signer);
    // contractInstance.setInfo()

    setText(draft => {
      draft.data = Math.random().toString(36).substring(7) // 生成随机字符串
      draft.info = new Date().toLocaleTimeString() // 更新时间
    })
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{text.data} 测试数据</h1>
      <p className="text-gray-600 mb-4">更新时间: {text.info}</p>
      <button
        onClick={handleUpdate}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        更新数据
      </button>
      <div className={`${styles.element} ${styles.animated} `}></div>
    </div>
  )
}
// 给这个组件增加监控
Index.whyDidYouRender = true
export default Index
