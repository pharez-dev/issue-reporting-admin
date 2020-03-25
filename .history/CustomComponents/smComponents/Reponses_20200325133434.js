import { Component } from "react";
import { Card, Avatar } from "antd";

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
              <Card hoverable bordered style={{ width: "100%" }}>
                <Meta
                  avatar={
                    <Avatar
                      src={`https://ui-avatars.com/api/?name=${
                        each.by ? each.by.fname : ""
                      }+${
                        each.by ? each.by.lname : ""
                      }&background=0D8ABC&color=fff`}
                    />
                  }
                  description={
                    <div>
                      <b>
                        Updated status to:
                        <span style={{ marginLeft: "20px", color: "#000" }}>
                          {each.statusTo}
                        </span>
                      </b>
                      <br />
                      {each.message}
                    </div>
                  }
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
