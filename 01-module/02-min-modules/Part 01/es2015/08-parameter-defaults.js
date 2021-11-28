function foo (bar, enable = false) {
    // enable = enable || true
    // enable = enable === undefined ? true : false
    console.log('foo invoked - enable');
    console.log(enable);
}

foo(false)