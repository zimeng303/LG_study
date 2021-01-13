import { request } from '@/plugins/request' 

// 获取文章标签列表
export const getTags = () => {
    // params 是可选的
    return request({
        method: 'GET',
        url: '/api/tags'
    }) 
}

