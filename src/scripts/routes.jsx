// dependencies ----------------------------------------------------------

import React from 'react';
import {NotFoundRoute, DefaultRoute, Route} from 'react-router';
import requireAuth from './utils/requireAuth';

// views
import Index         from './common/index.jsx';
import Signin        from './user/signin.component.jsx';
import Admin         from './user/user.admin.jsx';
import Upload        from './upload/upload.component.jsx';
import Dashboard     from './dashboard/dashboard.component.jsx';
import Notifications from './dashboard/notifications.component.jsx';
import Datasets      from './dashboard/datasets.component.jsx';
import Jobs          from './dashboard/jobs.component.jsx';
import Home          from './common/views/home.component.jsx';

// redirects -------------------------------------------------------------

class RedirectHome extends React.Component {
	static willTransitionTo(transition) {
		transition.redirect('home');
	}
}

class RedirectNotifications extends React.Component {
	static willTransitionTo(transition) {
		transition.redirect('notifications');
	}
}

// routes ----------------------------------------------------------------

// authenticated routes
Upload    = requireAuth(Upload);
Dashboard = requireAuth(Dashboard);
Admin     = requireAuth(Admin);

let routes = (
	<Route name="app" path="/" handler={Index}>
		
		<Route name="signIn" path="sign-in" handler={Signin}/>
		<Route name="admin" path="admin" handler={Admin}/>
		<Route name="dashboard" path="dashboard"  handler={Dashboard} >
			<Route name="notifications" path="notifications" handler={Notifications}/>
			<Route name="datasets" path="datasets" handler={Datasets}/>
			<Route name="jobs" path="jobs" handler={Jobs}/>
			<NotFoundRoute handler={RedirectNotifications}/>	
		</Route>
		<Route name="home"   path="/"    handler={Home}/>
		<DefaultRoute handler={RedirectHome}/>
		<NotFoundRoute handler={RedirectHome}/>	

	</Route>
);

export default routes;

