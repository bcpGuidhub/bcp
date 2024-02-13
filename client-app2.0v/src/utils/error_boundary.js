import { Component } from 'react';
import { Navigate } from 'react-router';
import { PATH_AUTH } from '../routes/paths';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    const { error, errorInfo } = this.state;
    if (error) {
      return <Navigate to={PATH_AUTH.login} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
