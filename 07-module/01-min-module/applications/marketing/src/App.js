import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Landing from "./components/Landing"
import Pricing from "./components/Pricing"

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/pricing">
          <Pricing />
        </Route>
        <Route path="/landing">
          <Landing />
        </Route>
        <Redirect to="/landing" />
      </Switch>
    </BrowserRouter>
  )
}

export default App
