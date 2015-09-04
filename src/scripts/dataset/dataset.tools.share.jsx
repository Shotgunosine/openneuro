// dependencies -------------------------------------------------------

import React   from 'react';
import Actions from './dataset.actions.js';
import bids    from '../utils/bids';
import scitran from '../utils/scitran';

export default class Share extends React.Component {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			edit: false,
			users: [],
			results: []
		};
	}

	componentDidMount() {
		scitran.getUsers((err, res) => {
			this.setState({users: res.body});
		});
	}

	render() {
		let dataset = this.props.dataset;

		let permissions = this.props.dataset.permissions.map((user) => {
			let deleteBtn;
			if (this.state.edit) {deleteBtn = <button onClick={this._removeUser.bind(this, user._id)}>x</button>;}
			return (
				<div key={user._id}>{user._id} <span>{user.access}</span>{deleteBtn}</div>
			);
		});

		let typeAheadResults = this.state.results.map((result) => {
			return (<li key={result} onClick={this._select.bind(this, result)}>{result}</li>);
		});

		let button;
		let edit;
		if (this.state.edit) {
			button = <button onClick={this._toggleEdit.bind(this)}>done</button>
			edit = (
				<div>
					<div className="typeahead">
						<input ref="input" onChange={this._handleChange.bind(this)}/>
						<ul className="typeahead-results">{typeAheadResults}</ul>
					</div>
					<select ref="select">
						<option value="" selected disabled>select permissions</option>
						<option value="ro">Read only</option>
						<option value="rw">Read write</option>
						<option value="admin">Admin</option>
					</select>
					<button onClick={this._addUser.bind(this)}>add</button>
				</div>
			);
		} else {
			button = <button onClick={this._toggleEdit.bind(this)}>edit</button>
		}

		return (
			<div>
				<div>Members {button}</div>
				{permissions}
				{edit}
			</div>
    	);
	}

// custon methods -----------------------------------------------------

	_handleChange(e) {
		let value = e.target.value;
		let users = this.state.users;
		let results = [];
		for (let user of users) {
			if (user._id.indexOf(value) > -1) {
				results.push(user._id);
			} else if (user.firstname.indexOf(value) > -1) {
				results.push(user._id);
			} else if (user.lastname.indexOf(value) > -1) {
				results.push(user._id);
			}
		}
		this.setState({results});
	}

	_select(result) {
		this.refs.input.getDOMNode().value = result;
		this.setState({results: []});
	}

	_toggleEdit() {
		this.setState({edit: !this.state.edit});
	}

	_addUser() {
		let role = {
			_id: this.refs.input.getDOMNode().value,
			access: this.refs.select.getDOMNode().value
		};
		bids.addPermission(this.props.dataset._id, role, (err, res) => {

		});
		this.refs.input.getDOMNode().value = '';
		this.refs.select.getDOMNode().value = '';
	}

	_removeUser(userId) {
		bids.removePermission(this.props.dataset._id, userId, (err, res) => {

		});
	}

}