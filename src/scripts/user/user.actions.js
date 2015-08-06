import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'checkUser',
	'signIn',
	'signOut',
	'logToken',
	'testScitran',
	'initOAuth',
	'addUser',
	'removeUser'
]);

export default Actions;