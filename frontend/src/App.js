import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import MainNavigation from './components/Navigation/MainNavigation';

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />

        <main className="main-content">
          <Switch>
            <Redirect path="/" to='/auth' exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingsPage} />
          </Switch>
        </main>

      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
