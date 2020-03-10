import {
  Table,
  Card,
  Divider,
  Carousel,
  Descriptions,
  Timeline,
  Form,
  Input,
  Button,
  Radio,
  Message
} from "antd";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import moment from "moment";
import { withRouter } from "next/router";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import styled from "styled-components";
const FormItem = Form.Item;
const { TextArea } = Input;
const Content = styled.div`
  margin-left: 30px;
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;

class Full extends React.Component {
  state = {
    data: this.props.data,
    reportedBy: this.props.reportedBy,
    adding: false,
    pagination: {},
    loading: false,
    photoIndex: 0,
    isOpen: false,
    radioStatus: ["pending", "resolved", "closed", "reviewed"]
  };

  // handleTableChange = (pagination, filters, sorter) => {
  //   const pager = { ...this.state.pagination };
  //   pager.current = pagination.current;
  //   this.setState({
  //     pagination: pager
  //   });
  //   this.fetch({
  //     results: pagination.pageSize,
  //     page: pagination.current,
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     ...filters
  //   });
  // };

  // fetch = (params = {}) => {
  //   // console.log("params:", params);
  //   this.setState({ loading: true });
  //   reqwest({
  //     url: `${globals.BASE_URL}/api/issues/all`,
  //     method: "post",
  //     data: {
  //       limit: 10,
  //       ...params
  //     },
  //     type: "json"
  //   }).then(data => {
  //     //  console.log("[server data]", data);
  //     const pagination = { ...this.state.pagination };
  //     // Read total count from server
  //     // pagination.total = data.totalCount;
  //     pagination.total = data.meta.totalDocs;
  //     this.setState({
  //       loading: false,
  //       data: data.issues,
  //       pagination
  //     });
  //   });
  // };
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    console.log("props", this.props);
    //const { signIn } = useContext(UserContext);
    if (this.state.loading) return;
    form.validateFields(async (err, values) => {
      if (!err) {
        console.log(values, "token", this.props.token);
        values._id = this.state.data._id;
        this.setState({ loading: true });
        try {
          const response = await fetch(
            `${globals.BASE_URL}/api/admin/update_issue`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: this.props.token
              },

              body: JSON.stringify(values)
            }
          );
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.success) {
              Message.success("Response was saved and user has been notified");
              this.setState({ loading: false, adding: false });
            } else {
              Message.error(data.message);
              this.setState({ loading: false });
            }
          } else {
            this.setState({ loading: false });
            //console.log("");
            // https://github.com/developit/unfetch#caveats
            Message.error("An error occured.Check console.log");
          }
        } catch (error) {
          this.setState({ loading: false });
          Message.error("Failed to reach server!");
          console.error(
            "You have an error in your code or there are Network issues.",
            error
          );
          //  throw new Error(error);
        }
      }
    });
  };
  componentDidMount() {
    // this.fetch();
    //console.log("[received Params]", this.props.router.query);
  }

  render() {
    const { state } = this;
    const { form } = this.props;
    const { data, photoIndex, isOpen, reportedBy, radioStatus } = state;
    const {
      images,
      type,
      description,
      county,
      sub_county,
      reportId,
      status,
      locationInfo,
      createdAt,
      response
    } = data;
    //console.log("[reportedBY]", reportedBy);

    const { fname, lname, email, phoneNumber } = reportedBy;

    const carocss = `
    text-align: center;
    height: 300px;
    margin-right:10px;
    background: #000;
    overflow: hidden;
   
  `;
    const subt = `
    color: black;
    font-size: 14px;
  `;
    const imageccs = `  object-fit: contain;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;`;
    // console.log(this.state.data);
    const renderStatus = radioStatus.map((each, i) => {
      if (status !== each) {
        if (status == "pending") {
          return (
            <Radio.Button key={i + "status"} value={each}>
              {each}
            </Radio.Button>
          );
        } else if (status == "reviewed" && each !== "pending") {
          return (
            <Radio.Button key={i + "status"} value={each}>
              {each}
            </Radio.Button>
          );
        }
      }
    });
    const renderImages = images.map((each, i) => {
      each.replace("/upload/", "/upload/h_720,q_auto,f_auto/");
      // console.log(each);
      return (
        <div
          key={i + "img"}
          css={carocss}
          onClick={() => {
            this.setState({ isOpen: true, photoIndex: i });
          }}
        >
          <img src={each} alt="Report image" css={imageccs} />
        </div>
      );
    });
    return (
      <>
        <Card bodyStyle={{ padding: 0 }} id="components-button-demo">
          <Divider orientation="left">
            <large>Images</large>
          </Divider>
          <div
            css={`
              margin: 0 20px;
              width: fit-content;
              height: fit-content;
              display: flex;
              flex-direction: row;
              justify-content: center;
              padding: 10px;
              padding-right: 0;
              background: #000;
            `}
          >
            {renderImages}
          </div>
          <Divider orientation="left">
            <large>Details</large>
          </Divider>
          <div
            css={`
              padding-left: 30px;
            `}
          >
            <Timeline>
              <Timeline.Item
                color={
                  status == "pending"
                    ? "gray"
                    : status == "reviewed"
                    ? "green"
                    : null
                }
              >
                <b css={subt}>Status</b>
                <p>{status}</p>
              </Timeline.Item>

              <Timeline.Item>
                <div
                  css={`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <div
                    css={`
                      width: 200px;
                    `}
                  >
                    <b css={subt}>Type</b>
                    <p>{type}</p>
                  </div>
                  <div>
                    <b css={subt}>Description</b>
                    <p>{description}</p>
                  </div>
                </div>
              </Timeline.Item>

              <Timeline.Item>
                <div
                  css={`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <div
                    css={`
                      width: 200px;
                    `}
                  >
                    <b css={subt}>County</b>
                    <p>{county}</p>
                  </div>
                  <div>
                    <b css={subt}>Sub County</b>
                    <p>{sub_county ? sub_county : "NA"}</p>
                  </div>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div
                  css={`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <div
                    css={`
                      width: 200px;
                    `}
                  >
                    <b css={subt}>Report ID</b>
                    <p>{reportId}</p>
                  </div>
                  <div>
                    <b css={subt}>Reported On</b>
                    <p>{moment(createdAt).format("YYYY-MM-DD")}</p>
                  </div>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div
                  css={`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <div
                    css={`
                      width: 200px;
                    `}
                  >
                    <b css={subt}>Reported By</b>
                    <p>
                      {fname} {lname}
                    </p>
                  </div>
                  <div
                    css={`
                      margin-right: 100px;
                      display: flex;
                      flex-direction: row;
                      padding-top: 20px;
                    `}
                  >
                    <b css={subt}>Phone number: </b>
                    <p>{phoneNumber}</p>
                  </div>
                  <div
                    css={`
                      margin-right: 100px;
                      display: flex;
                      flex-direction: row;
                      padding-top: 20px;
                    `}
                  >
                    <b css={subt}>Email:</b>
                    <p>{email}</p>
                  </div>
                </div>
              </Timeline.Item>
            </Timeline>
          </div>
          <Divider orientation="left">
            <large>Response</large>
          </Divider>
          <div
            css={`
              color: black;
              margin-left: 30px;
            `}
          >
            {response ? (
              response.length == 0 ? (
                <>
                  <b
                    css={`
                      margin-right: 20px;
                    `}
                  >
                    No response yet.{" "}
                  </b>
                  <Button
                    style={{ display: "inline-flex" }}
                    type="link"
                    icon={state.adding ? "close" : "plus"}
                    onClick={() => this.setState({ adding: !state.adding })}
                  >
                    {!state.adding ? "Add Response" : "cancel"}
                  </Button>
                </>
              ) : null
            ) : (
              <>
                <b
                  css={`
                    margin-right: 20px;
                  `}
                >
                  No response yet.{" "}
                </b>
                <Button
                  style={{ display: "inline-flex" }}
                  type="link"
                  icon={state.adding ? "close" : "plus"}
                  onClick={() => this.setState({ adding: !state.adding })}
                >
                  {!state.adding ? "Add Response" : "cancel"}
                </Button>
              </>
            )}
          </div>

          {state.adding && (
            <Content>
              <Form layout="vertical" onSubmit={this.handleSubmit}>
                <FormItem label="Message">
                  {form.getFieldDecorator("message", {
                    rules: [
                      // {
                      //   type: "email",
                      //   message: "The input is not valid E-mail!"
                      // },
                      {
                        required: true,
                        message: "Please input your message!"
                      }
                    ]
                  })(<TextArea rows={4} />)}
                </FormItem>
                <Form.Item label="Status">
                  {form.getFieldDecorator("radio-button", {
                    rules: [
                      {
                        required: true,
                        message: "Please select status!"
                      }
                    ]
                  })(<Radio.Group>{renderStatus}</Radio.Group>)}
                </Form.Item>
                <FormItem style={{ display: "flex", "flex-direction": "row" }}>
                  {/* {form.getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox>Remember me</Checkbox>)}
              <Link href="/forgot">
                <a className="text-xs-right">
                  <small>Forgot password</small>
                </a>
              </Link> */}

                  <Button
                    loading={this.state.loading}
                    type="primary"
                    htmlType="submit"
                    block
                    className="mt-3"
                  >
                    Submit
                  </Button>
                </FormItem>
              </Form>
            </Content>
          )}
          <div className="p-4"></div>
        </Card>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length
              })
            }
          />
        )}
      </>
    );
  }
}

export default withRouter(Form.create()(Full));
