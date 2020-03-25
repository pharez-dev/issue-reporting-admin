import { Component } from "react";
import { Icon } from "antd";
class Response extends Component {
  state = {
    responses: this.props.responses
  };

  render() {
    return <div>No responses yet</div>;
  }
}

export default Response;
