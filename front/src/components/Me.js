import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {
  Link
} from 'react-router-dom';
import Logout from './Logout';



function Me(props) {

    return (
      <div>
        {
          props.me.fullName
          ? <Button color="contrast">Hello, {props.me.fullName} <Logout onLoginLogout={props.onLogout}/></Button>
          : <Link to="/login"><Button color="contrast">Login</Button></Link>
        }
      </div>
    );

}

Me.propTypes = () => ({
  me: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
})

export default Me;










// class Me extends React.Component {
//
//
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       me: this.props.me,
//     }
//
//   }

  // componentDidMount() {
  //   if (!this.state.me) {
  //     persist.willGetSessionUser().then(function(value) {
  //       this.setState({
  //         me: value,
  //       })
  //     }.bind(this))
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.params.me != this.state.input) {
  //
  //   }
  // }



// export const whoamIQuery = gql`
//   query WhoAmIQuery {
//     me {
//       fullName
//     }
//   }
// `;
//
// export default graphql(whoamIQuery, {
// })(Myself);
