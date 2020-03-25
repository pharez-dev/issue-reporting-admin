import { Component } from "react";
import { Icon } from "antd";
class Response extends Component {
  state = {
    responses: this.props.responses
  };

  render() {
    return (
      <div
        css={`
          text-align: center;

          border-radius: 4px;
          margin-bottom: 20px;
          padding: 30px 50px;
          margin: 20px 0;
        `}
      >
        No responses yet
      </div>
    );
  }
}

export default Response;
