export default () => {
    const elemnet = document.createElement('h2')

    elemnet.textContent = 'hello world'
    elemnet.addEventListener('click', () => {
        alert('Hello webpack')
    })

    return elemnet
}