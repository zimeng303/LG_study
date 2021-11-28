import { 
  BrowserRouter, 
  Route, 
  Link, 
  Redirect, 
  Switch 
} from 'react-router-dom'
import Home from './Home'
import About from './About'

export default function Root(props) {
  return (
    <BrowserRouter basename="/todos">
      <div>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
      </div>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
