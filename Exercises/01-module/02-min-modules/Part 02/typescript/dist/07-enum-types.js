"use strict";
// 枚举 [Enum]
Object.defineProperty(exports, "__esModule", { value: true });
var post = {
    title: 'Hello TypeScript',
    content: 'TypeScript is a typed superset of JavaScript.',
    status: 0 /* Draft */ // 2 // 1 // 0
};
// PostStatus[0] // =>Draft 通过索引器的形式访问对应的枚举名称
// 如果确定不会使用索引器的形式访问枚举，那么建议使用常量枚举
//# sourceMappingURL=07-enum-types.js.map