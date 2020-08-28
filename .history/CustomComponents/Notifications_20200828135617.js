import {
  AutoComplete,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Menu,
  Progress,
  Row,
  Select,
  Timeline,
  Tooltip,
  Tag,
  List,
  Message,
} from "antd";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import MockActivity from "../demos/mock/activity";
import MockContacts from "../demos/mock/contacts";
import { Share } from "react-feather";
import { useAppState } from "../components/shared/AppProvider";
import { useState } from "react";
import { MessageCircle } from "react-feather";
import Router from "next/router";
import moment from "moment";

import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
const cookies = new Cookies();
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const DescriptionItem = ({ title, content }) => (
  <div className="text-muted mb-2">
    <p
      className="text-body mr-3"
      css={`
        display: inline-block;
      `}
    >
      {title}:
    </p>
    <small>{content}</small>
  </div>
);

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Notification = ({ form, data, token }) => {
  console.log("[notification prop]", data);
  let Utoken = cookies.get("token");
  let user;
  if (Utoken) user = jwt_decode(token);
  console.log(user);
  const [state] = useAppState();
  const [activeTab, setActiveTab] = useState("1");
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const { getFieldDecorator } = form;

  const prefixSelector = getFieldDecorator("prefix", {
    initialValue: "+86",
  })(
    <Select style={{ width: "auto" }}>
      <Option value="86">+86</Option>
      <Option value="87">+87</Option>
    </Select>
  );

  const handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = [".com", ".org", ".net"].map(
        (domain) => `${value}${domain}`
      );
    }
    setAutoCompleteResult(autoCompleteResult);
  };

  const websiteOptions = autoCompleteResult.map((website) => (
    <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
  ));
  const read = async (id) => {
    console.log(id);
    try {
      const get = await fetch(
        `${globals.BASE_URL}/api/admin/update_notifications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ record: id }),
        }
      );
      data = await get.json();
    } catch (err) {
      Message.error(err.message);
      // this.setState({ loading: false });
    }
  };

  return (
    <div>
      <Col md={18} sm={24}>
        <Card
          // headStyle={{
          //   backgroundImage: "url(/static/images/23.jpg)",
          //   backgroundSize: "cover",
          //   backgroundRepeat: "no-repeat",
          //   backgroundPosition: "center center"
          // }}
          bodyStyle={{ padding: 0 }}
          className="mb-4 overflow-hidden w-100"
          title={
            <Row type="flex" align="middle">
              {/* <Avatar size={64} src="/static/images/avatar.jpg" /> */}
              {!state.mobile && (
                <div
                  className="px-4 text-light"
                  css={`
                    display: inline-block;
                  `}
                >
                  <h5 className="my-0 text">
                    {/* <span>John</span> */}
                    <b> Notifications</b>
                  </h5>
                  {/* <small>UX Developer</small> */}
                </div>
              )}
            </Row>
          }
          // extra={
          //   <Row type="flex" align="middle" className="p-4">
          //     <Button type="dashed" shape="circle" ghost>
          //       <Share size={20} strokeWidth={1} />
          //     </Button>
          //     <span className="px-2" />
          //     <Button type="primary">Follow</Button>
          //   </Row>
          // }
        >
          <Menu
            onClick={(tab) => {
              if (activeTab !== tab.key) setActiveTab(tab.key);
            }}
            selectedKeys={[activeTab]}
            mode="horizontal"
            className="border-bottom-0"
          >
            <Menu.Item key="1">Reports</Menu.Item>
            {/* <Menu.Item key="2">About me</Menu.Item>
          <Menu.Item key="3">Friends</Menu.Item>
          <Menu.Item key="4">Account & profile</Menu.Item> */}
          </Menu>
        </Card>
      </Col>
      <Col md={24}></Col>
      <Row type="flex" gutter={16}>
        {/* <Col
          xl={8}
          lg={12}
          md={24}
          sm={24}
          xs={24}
          order={state.mobile ? 1 : 2}
        >
       
            <div className="px-4 pt-4">
              <Row type="flex" align="top" justify="space-between">
                <Col>
                  <h5 className="m-0">
                    <span>John</span> <b>Doe</b>
                  </h5>
                  <p className="mb-0">UX Developer</p>
                  <a
                    href="javascript:;"
                    css={`
                      display: block;
                    `}
                  >
                    john@doe.com
                  </a>
                  <a
                    href="javascript:;"
                    css={`
                      display: block;
                    `}
                  >
                    www.johndoe.com
                  </a>
                  <a
                    href="javascript:;"
                    css={`
                      display: block;
                    `}
                  >
                    +86 181 0000 0000
                  </a>
                </Col>
                <Col>
                  <div className="text-center">
                    <Avatar size={80} src="/static/images/avatar.jpg" />
                  </div>
                  <div className="m-1 text-center">
                    <p className="mb-1">Account Storage</p>
                    <Tooltip title="3 done / 3 in progress / 4 to do">
                      <Progress percent={60} successPercent={30} />
                    </Tooltip>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider orientation="left">
              <small>Stats</small>
            </Divider>

            <Row
              className="text-center w-100 px-4"
              type="flex"
              align="middle"
              justify="space-between"
            >
              <Col span={8}>
                <h2 className="m-0">
                  <b>23,8K</b>
                </h2>
                <small>Followers</small>
              </Col>
              <Col span={8}>
                <h2 className="m-0">
                  <b>569</b>
                </h2>
                <small>Following</small>
              </Col>
              <Col span={8}>
                <h2 className="m-0">
                  <b>67</b>
                </h2>
                <small>Posts</small>
              </Col>
            </Row>

            <Divider />
            <div className="px-4 pb-4">
              <p className="text-uppercase mb-4">
                <strong>About Me</strong>
              </p>
              <p>
                Maecenas sed diam eget risus varius blandit sit amet non magna.
                Curabitur blandit tempus porttitor. Vestibulum id ligula porta
                felis euismod semper.
              </p>
            </div>
          </Card>
        </Col> */}

        <Col md={18} sm={24} order={state.mobile ? 2 : 1}>
          {activeTab === "1" && (
            <Card>
              <List
                // className="header-notifications"
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <Card
                    bodyStyle={{ padding: 10 }}
                    style={{
                      backgroundColor: "#f1f1f1",
                    }}
                    // css={`
                    //   hover: {
                    //     backgroundcolor: red;
                    //   }
                    // `}
                    className="mb-4"
                  >
                    <a href="#">
                      <List.Item>
                        <List.Item.Meta
                          onClick={() => {
                            let base;
                            if (user.role == "admin") base = "/admin";
                            else if (user.role == "subcounty admin")
                              base = "/subcounty_admin";
                            else if (user.role == "ward admin")
                              base = "/ward_admin";

                            read(item._id);
                            Router.push(
                              base + "/reports?open_record=" + item.doc._id
                            );
                          }}
                          avatar={
                            <Avatar
                              size="large"
                              style={{
                                color: item.opened ? "grey" : "white",
                                backgroundColor: item.opened
                                  ? "#efefef"
                                  : "rgb(34, 245, 0)",
                              }}
                            >
                              <MessageCircle size={24} strokeWidth={1} />
                            </Avatar>
                          }
                          title={<b>{item.title}</b>}
                          description={
                            <div
                              css={`
                                color: black;
                              `}
                            >
                              <div
                                css={`
                                  color: black;
                                  display: flex;
                                  flex-direction: row;
                                `}
                              >
                                <b
                                  css={`
                                    margin-right: 5px;
                                  `}
                                >
                                  Type:
                                </b>
                                <p>{item.doc.type}.</p>
                              </div>
                              <div
                                css={`
                                  display: flex;
                                  flex-direction: row;
                                `}
                              >
                                <b
                                  css={`
                                    margin-right: 5px;
                                  `}
                                >
                                  Description:
                                </b>
                                <p>{item.body}</p>
                              </div>
                              <div
                                style={{
                                  float: "right",
                                  marginTop: "-40px",
                                }}
                              >
                                <small>
                                  {moment(item.createdAt).fromNow()}
                                </small>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    </a>
                  </Card>
                )}
              />
              {/* <Timeline className="p-3">
                {data.map((item, index) => {
                  item.avatar = (
                    <Avatar
                      size="large"
                      style={{
                        color: item.opened ? "grey" : "rgb(34, 245, 0)",
                        backgroundColor: item.opened
                          ? "#efefef"
                          : "rgb(207, 253, 219)"
                      }}
                    >
                      <MessageCircle size={24} strokeWidth={1} />
                    </Avatar>
                  );
                  return (
                    <Timeline.Item
                      key={index}
                      onClick={() => {
                        Router.push("/reports");
                      }}
                      dot={item.avatar && item.avatar}
                    >
                      <div className="ml-4">
                        <span
                          css={`
                            display: block;
                          `}
                        >
                          <b>{item.title}</b>
                          {!item.opened && (
                            <Tag
                              style={{ marginLeft: "100px" }}
                              color="rgb(34, 245, 0)"
                            >
                              new
                            </Tag>
                          )}
                        </span>
                        <b>Type</b>
                        <p>{item.doc.type}.</p>
                        <b>Description</b>
                        <p>{item.body}</p>

                        <small style={{ position: "absolute", right: 0 }}>
                          {item.createdAt}
                        </small>
                      </div>
                    </Timeline.Item>
                  );
                })}
              </Timeline> */}
            </Card>
          )}

          {activeTab === "2" && (
            <Card bodyStyle={{ padding: 0 }}>
              <div className="p-4">
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="Full Name" content="Lily" />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Account"
                      content="AntDesign@example.com"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="City" content="HangZhou" />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="Country" content="China🇨🇳" />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="Birthday"
                      content="February 2,1900"
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="Website" content="-" />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Message"
                      content="Make things as simple as possible but no simpler."
                    />
                  </Col>
                </Row>
              </div>

              <Divider orientation="left">
                <small>Company</small>
              </Divider>

              <div className="p-4">
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="Position" content="Programmer" />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Responsibilities"
                      content="Coding"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem title="Department" content="AFX" />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Skills"
                      content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
                    />
                  </Col>
                </Row>
              </div>

              <Divider orientation="left">
                <small>Contacts</small>
              </Divider>

              <div className="p-4">
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="Email"
                      content="AntDesign@example.com"
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="Phone Number"
                      content="+86 181 0000 0000"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Github"
                      content={
                        <a href="http://github.com/ant-design/ant-design/">
                          github.com/ant-design/ant-design/
                        </a>
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          )}

          {activeTab === "3" && (
            <Card>
              <Row>
                {MockContacts.map((contact, index) => (
                  <Col xs={24} sm={12} lg={12} xl={8} key={index}>
                    <Row type="flex" align="middle" className="w-100 mb-4">
                      {contact.avatar}
                      <span className="ml-4">
                        <span
                          css={`
                            display: block;
                          `}
                        >
                          {contact.name}
                        </span>
                        <small className="text-muted">
                          <span>{contact.status}</span>
                        </small>
                      </span>
                    </Row>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          {activeTab === "4" && (
            <Card>
              <Form>
                <FormItem {...formItemLayout} label="First name">
                  {getFieldDecorator("fname", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your First name!",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Last name">
                  {getFieldDecorator("lname", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your Last name!",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="E-mail">
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Phone Number">
                  {getFieldDecorator("phone", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ],
                  })(
                    <Input
                      addonBefore={prefixSelector}
                      style={{ width: "100%" }}
                    />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="Company name">
                  {getFieldDecorator("company", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your company",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Website">
                  {getFieldDecorator("website", {
                    rules: [
                      { required: true, message: "Please input website!" },
                    ],
                  })(
                    <AutoComplete
                      dataSource={websiteOptions}
                      onChange={handleWebsiteChange}
                      placeholder="website"
                    >
                      <Input />
                    </AutoComplete>
                  )}
                </FormItem>

                <Divider />

                <FormItem {...formItemLayout} label="Address line">
                  {getFieldDecorator("addline", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your address",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Address line cont">
                  {getFieldDecorator("addlinecont")(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="City">
                  {getFieldDecorator("city", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your city",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="State/Province">
                  {getFieldDecorator("state", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your state",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Postal code">
                  {getFieldDecorator("postal", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your postal code",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Country">
                  {getFieldDecorator("country", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your country",
                      },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    Save information
                  </Button>
                </FormItem>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Form.create()(Notification);
