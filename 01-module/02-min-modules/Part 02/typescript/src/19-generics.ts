// 泛型

export {}

function createNumberArray (length: number, value: number): number[] {
    // Array 默认创建的是 any类型的数组，因此需要使用泛型进行指定，传递一个类型
    const arr = Array<number>(length).fill(value)
    return arr
}

function createStringArray (length: number, value: string): string[] {
    const arr = Array<string>(length).fill(value)
    return arr
}

// 不明确的类型，使用 T 替换，调用时传入
function createArray<T> (length: number, value: T): T[] {
    const arr = Array<T>(length).fill(value)
    return arr
}

// const res = createNumberArray(3, 100) // res => [100, 100, 100]

const res = createArray<string>(3, 'foo')