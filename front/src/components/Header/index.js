import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//
import {loadUserInfo} from '../../redux/actions';
import persist from '../../lib/persist';

//
import Header from './Header';

class HeaderContainer extends Component {

	componentDidMount() {
		persist.willGetSessionUser().then((value) => {
			this.props.loadUserInfoDispatch(value)
			// console.log("AAAAA"); console.log(value); console.log("AAAAA");
		})
	}

	render() {
		return (
			//
			<div>
				<Header userLocalStoreState={this.props.userLocalStoreState}/>
			</div>
		)
	}
}

HeaderContainer.propTypes = {
	userLocalStoreState: PropTypes.object.isRequired,
	loadUserInfoDispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => (
	{userLocalStoreState: state.userLocalStore}
)

const mapDispatchToProps = ({loadUserInfoDispatch: loadUserInfo})

export default compose(connect(mapStateToProps, mapDispatchToProps))(
	HeaderContainer
)
