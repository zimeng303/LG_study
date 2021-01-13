/**
 * 如果已登录，重定向至首页
 */
export default function ({ store, redirect }) {
    // If the user is authenticated redirect to home page
    if (store.state.user) {
        return redirect('/')
    }
}