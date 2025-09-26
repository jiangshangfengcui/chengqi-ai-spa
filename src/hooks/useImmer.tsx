/*
 * 1.方便做diff 避免无意义的渲染
 * 2.只拷贝变动的节点，其余部分保持引用不变（结构共享）
 * 3.不会意外地“改坏”原始数据
 * 4.创建新结构 属于V8底层的快对象 性能更好
 * 5.hooks + ts + 如上  ahooks变大
 * const [state, setState] = useImmer(function () {
    return { a: 123 };
    });

    const [state1, setState1] = useImmer({ a: 123 });

    const [state1, setState1] = useImmer(5);

    setState(draft => {
    draft.a = 456;
    });
    setState(6)

    setState1=(updater: T | DraftFunction<T>) => {
        if (typeof updater === 'function') {
            updateValue(produce(updater as DraftFunction<T>));
        } else {
            updateValue(freeze(updater));
        }
        }
 */

import { Draft, freeze, produce } from 'immer'
import { useCallback, useState } from 'react'

export type DraftFunction<S> = (draft: Draft<S>) => void
export type Updater<S> = (arg: S | DraftFunction<S>) => void
export type ImmerHook<S> = [S, Updater<S>]
export function useImmer<S = unknown>(initialValue: S | (() => S)): ImmerHook<S>

export function useImmer<T>(initialValue: T) {
  const [val, updateValue] = useState(
    freeze(typeof initialValue === 'function' ? initialValue() : initialValue, true),
  )
  return [
    val,
    useCallback((updater: Updater<T> | T) => {
      if (typeof updater === 'function') {
        updateValue(produce(updater as (draft: T) => void))
      } else {
        // 应该比较一下是否是同一个对象，否则则强制更新
        updateValue(freeze(updater, true))
      }
    }, []),
  ]
}
// immer 是一个用于简化不可变数据操作的库
// https://immerjs.github.io/immer/docs/introduction

// const [state, setState] = useImmer({ a: 1, b: { c: 2 } })
// setState(draft => {
//   draft.a = 2
//   draft.b.c = 3
// })

// immer 的原理
// 1. 创建一个不可变对象
// 2. 使用 Proxy 监听对象的变化
// 3. 当对象变化时，生成一个新的对象
// 4. 返回新的对象

// immer 的优点
// 1. 简化不可变对象的操作
// 2. 提高代码的可读性
// 3. 减少不必要的渲染

// immer 的缺点
// 1. 增加了额外的依赖
// 2. 增加了学习成本
// 3. 在某些场景下性能不如手动操作不可变对象

// 使用场景
// 1. 对象嵌套层级较深
// 2. 对象属性较多且频繁变化
// 3. 希望代码更简洁易读

// 不适用场景
// 1. 对象属性较少且变化不频繁
// 2. 性能要求较高的场景
// 3. 团队成员对 immer 不熟悉
