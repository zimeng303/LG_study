/* @flow */

import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions: CompilerOptions = {
  expectHTML: true,
  modules,
  directives,
  // 是否是 pre 标签
  isPreTag,
  // 是否是 一元标签，即自闭合标签
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  // 是否是 HTML 中的保留标签
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
}
