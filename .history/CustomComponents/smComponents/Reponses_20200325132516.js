import { Component } from "react";
import { Card } from "antd";

const { Meta } = Card;
class Response extends Component {
  state = {
    responses: this.props.responses
  };

  render() {
    const { responses } = this.state;
    return (
      <div
        css={`
          height: 400px;
        `}
      >
        {responses.length > 0 ? (
          responses.map(each => {
            return (
              <Card hoverable style={{ width: "100%" }}>
                <Meta
                  title="Europe Street beat"
                  description="www.instagram.com"
                />
              </Card>
            );
          })
        ) : (
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
