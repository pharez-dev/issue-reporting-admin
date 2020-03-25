import { Component } from "react";
import { Icon } from "antd";
class Response extends Component {
  state = {
    responses: this.props.responses
  };

  render() {
    const { responses } = this.state;
    return (
      <div
        css={`
          heigh: 400px;
        `}
      >
        {responses.length > 0 ? null : (
          <div
            css={`
              text-align: center;

              border-radius: 4px;
              margin-bottom: 20px;
              padding: 169px 50px;
              margin: 20px 0;
            `}
          >
            No responses yet
          </div>
        )}
      </div>
    );
  }
}

export default Response;
