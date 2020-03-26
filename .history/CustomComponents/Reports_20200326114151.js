import {
  Table,
  Card,
  Divider,
  Button,
  Message,
  Icon,
  Modal,
  Form,
  Input,
  Radio,
  Select,
  Alert,
  Spin,
  Descriptions,
  Badge
} from "antd";
import dynamic from "next/dynamic";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import moment from "moment";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import Capitalized from "../lib/Capitalize";
import Capitalize from "../lib/Capitalize";
const columns = [
  {
    title: "Report ID",
    dataIndex: "reportId",
    sorter: true,
    // render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    sorter: true,
    title: "Issue Type",
    dataIndex: "type",
    filters: [
      { text: "Water and sanitation", value: "Water and sanitation" },
      { text: "Housing and land", value: "Housing and land" },
      { text: "Agriculture and livestock", value: "Agriculture and livestock" }
    ]
  },
  {
    sorter: true,
    title: "Issue Status",
    dataIndex: "status",
    filters: [
      { text: "Pending", value: "pending" },
      { text: "Planned", value: "planned" },
      { text: "In Progress", value: "in progress" },
      { text: "Resolved", value: "resolved" },
      { text: "Escalated", value: "escalated" },
      { text: "Closed", value: "closed" }
    ],
    render: stat => (
      <b>
        <Capitalize text={stat ? stat : "Pending"} />
      </b>
    )
  },
  {
    sorter: true,
    title: "County",
    dataIndex: "county"
  },
  {
    sorter: true,
    title: "Sub County",
    dataIndex: "sub_county",
    render: sub => (sub ? sub : "NA")
  },
  {
    title: "Reported On",
    dataIndex: "createdAt",
    sorter: true,
    render: at => moment(at).format("YYYY-MM-DD")
  },
  {
    title: "",
    dataIndex: "",
    render: () => <Icon type="select" />,
    width: "100px"
  }
];

class App extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
    filters: [],
    visible: false
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      sortField: sorter.field,
      sortOrder: sorter.order,
      tfilters: filters
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };
  set = value => {
    const { filters } = this.state;
    if (filters.includes(value)) {
      filters.splice(filters.indexOf(value), 1);
    } else {
      filters.push(value);
    }
    this.setState({ filters }, () => {
      this.fetch();
    });
  };
  clearFilters = () => {
    this.setState({ filters: [] }, () => {
      this.fetch();
    });
  };
  fetch = async (params = {}) => {
    if (Object.entries(params).length == 0) params = this.state.tfilters;
    console.log("params:", params);
    this.setState({ loading: true });
    try {
      reqwest({
        url: `${globals.BASE_URL}/api/issues/all`,
        method: "post",
        data: {
          limit: 10,
          ...params,
          type: this.state.filters
        },
        type: "json"
      }).then(data => {
        //  console.log("[server data]", data);
        const pagination = { ...this.state.pagination };
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = data.meta.totalDocs;
        this.setState({
          loading: false,
          data: data.issues,
          pagination
        });
      });
    } catch (err) {
      Message.error(err.message);
      this.setState({ loading: false });
    }
  };
  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { state } = this;
    //  console.log("report props", this.props);
    return (
      <Card bodyStyle={{ padding: 0 }} id="components-button-demo">
        <Divider orientation="left">
          <large>Reported Issues</large>
        </Divider>

        <div className="p-4">
          <div
            css={`
              margin-bottom: 16px;
              margin-top: -1.5rem !important;
            `}
          >
            <div
              css={`
                width: 100%;
              `}
            >
              <b
                css={`
                  font-size: 20px;
                `}
              ></b>
              <div
                css={`
                  margin-top: 10px;
                  flex-direction: row;
                `}
              >
                <Button
                  type={
                    state.filters.includes("Housing and land")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Housing and land")}
                >
                  Housing and land
                </Button>{" "}
                <Button
                  type={
                    state.filters.includes("Water and sanitation")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Water and sanitation")}
                >
                  Water and sanitation
                </Button>{" "}
                <Button
                  type={
                    state.filters.includes("Roads and Transport")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Roads and Transport")}
                >
                  Roads and Transport
                </Button>
                <Button
                  type={
                    state.filters.includes("Agriculture and livestock")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Agriculture and livestock")}
                >
                  Agriculture and livestock
                </Button>
                <Button
                  type={
                    state.filters.includes("Bursery allocations")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Bursery allocations")}
                >
                  Bursery allocations
                </Button>
                <Button
                  type={state.filters.includes("Other") ? "primary" : "default"}
                  onClick={() => this.set("Other")}
                >
                  Other
                </Button>
              </div>
            </div>

            <Button onClick={this.clearFilters}>Clear filters</Button>
          </div>
          <Table
            bordered
            size="middle"
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  this.setState({ mdRecord: record._id }), this.showModal();

                  // Router.push({
                  //   pathname: "/reports/full",
                  //   query: { record: record._id }
                  // });
                } // click row
              };
            }}
            columns={columns}
            rowKey={record => record._id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
        {state.visible && (
          <CollectionCreateForm
            token={this.props.token}
            record={state.mdRecord}
            wrappedComponentRef={this.saveFormRef}
            confirmLoading={this.state.confirmLoading}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            //  onCreate={this.handleSubmit}
          />
        )}
      </Card>
    );
  }
}

export default App;

import ImageGallery from "react-image-gallery";
//SCSS
//import "react-image-gallery/styles/scss/image-gallery.scss";

// CSS
import "react-image-gallery/styles/css/image-gallery.css";
import { Tabs, Timeline } from "antd";
import Responses from "./smComponents/Reponses";
const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false
});

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      loading: true,
      data: null,
      key: 1,
      selectedAction: "respond",
      departments: [
        "Agriculture, Livestock Veterinary Services & Fisheries",
        "Finance, Public Planning and ICT",
        "Health Services and Public Health",
        "Education and VocationTraining",
        "Lands and Physical Planning and Urban Development",
        "Roads, Public Works, Housing and Energy",
        "Trade, Co-operatives and Enterprise Development",
        "Water, Irrigation, Environment and Natural Resources",
        "Public Service, Administration and Citizen Participation",
        "Roads, Public Works, Housing and Energy"
      ],
      radioStatus: [
        "pending", // Before review
        "planned",
        "in progress", //Seen by county official
        "resolved" // Closed with resolution
        //  "closed", //
      ]
    };
    handleSubmit = async () => {
      const { form } = this.props;
      const { state } = this;
      form.validateFields(async (err, values) => {
        if (err) {
          return;
        }
        this.setState({ confirmLoading: true });
        try {
          const get = await fetch(
            `${globals.BASE_URL}/api/admin/issue_action`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: this.props.token
              },
              body: JSON.stringify({
                record: this.props.record,
                action: state.selectedAction,
                ...values
              })
            }
          );
          let data = await get.json();

          if (!data.success) throw new Error(data.message);
          form.resetFields();
          console.log("re fetched:data", data);
          let record = data.issue;
          let selectedAction = "respond";
          if (record.status == "resolved") selectedAction = "close";
          this.setState({
            data: data.issue,
            selectedAction,
            //  reportedBy: data.reportedBy,
            // wards: data.wards,
            confirmLoading: false
          });
        } catch (err) {
          console.error(err);
          this.setState({ confirmLoading: false });
          Message.error(err.message);
          // this.props.onCancel();
        }

        // console.log("Received values of form: ", values);

        // this.setState({ visible: false });
      });
    };
    fetch = async () => {
      try {
        const get = await fetch(`${globals.BASE_URL}/api/issues/single`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.props.token
          },
          body: JSON.stringify({ record: this.props.record })
        });
        let data = await get.json();
        console.log("fetched:data", data);
        let record = data.data;
        let selectedAction = "respond";
        if (record.status == "resolved") selectedAction = "close";
        this.setState({
          data: data.data,
          selectedAction,
          reportedBy: data.reportedBy,
          wards: data.wards,
          loading: false
        });
      } catch (err) {
        console.error(err);
        Message.error(err.message + " Closing Modal!");
        this.props.onCancel();
      }
    };

    selectAction = e => {
      this.setState({ selectedAction: e.target.value });
    };
    handleSelect = value => {
      //console.log(`selected ${value}`);
    };
    componentDidMount = () => {
      this.fetch();
      console.log("mount called");
    };
    callback = key => {
      console.log(key);
      this.setState({ key });
    };
    render() {
      if (this.state.loading) {
        return (
          <Modal
            centered
            width={"60%"}
            visible={true}
            title="Reported Issue"
            okButtonProps={{
              disabled: true
            }}
            cancelButtonProps={{
              disabled: true
            }}
            okText={"Submit"}
            cancelText="Close"
            onCancel={onCancel}
            onOk={this.handleSubmit}
          >
            <div
              css={`
                text-align: center;

                border-radius: 4px;
                margin-bottom: 20px;
                padding: 30px 50px;
                margin: 20px 0;
              `}
            >
              <Spin />
            </div>
          </Modal>
        );
      }
      const { visible, onCancel, onCreate, form } = this.props;
      //  console.log("props:", this.props);
      //   const { images } = this.state.data;
      //  console.log("images", this.state.data);
      const { getFieldDecorator } = form;
      const images =
        this.state.data && this.state.data.images.length > 0
          ? this.state.data.images.map(image => {
              let image2 = image;
              image = image.replace("/upload/", "/upload/h_400/");
              let thumbnail = image.replace(
                "/upload/",
                "/upload/w_100,h_100,c_scale/"
              );
              let fullscreen = image2.replace(
                "/upload/",
                "/upload/h_1080,q_auto,f_auto/"
              );
              console.log(thumbnail);
              return {
                original: image,
                thumbnail: thumbnail,
                fullscreen: fullscreen
              };
            })
          : null;
      const {
        type,
        description,
        county,
        sub_county,
        reportId,
        status,
        locationInfo,
        createdAt,
        response,
        proposedSolution,
        escalated
      } = this.state.data;
      const {
        reportedBy,
        selectedAction,
        radioStatus,
        wards,
        departments,
        confirmLoading
      } = this.state;
      const { fname, lname, email, phoneNumber } = reportedBy;

      const subt = `
                    color: black;
                    font-size: 14px;
                  `;
      const renderDepartments = departments.map((each, i) => {
        return (
          <Option key={i + each} value={each}>
            {each}
          </Option>
        );
      });
      const renderWards = wards.map((each, i) => {
        return (
          <Option key={i + each.name} value={each.name}>
            {each.name}
          </Option>
        );
      });
      const renderStatus = radioStatus.map((each, i) => {
        if (status !== each) {
          if (status == "pending") {
            return (
              <Radio.Button key={i + "status"} value={each}>
                <Capitalize text={each} />
              </Radio.Button>
            );
          } else if (status == "planned" && each !== "pending") {
            return (
              <Radio.Button key={i + "status"} value={each}>
                <Capitalize text={each} />
              </Radio.Button>
            );
          } else if (
            status == "in progress" &&
            each !== "planned" &&
            each !== "pending"
          ) {
            return (
              <Radio.Button key={i + "status"} value={each}>
                <Capitalize text={each} />
              </Radio.Button>
            );
          }
        }
      });
      return (
        <Modal
          //  style={{ marginTop: "-75px" }}
          centered
          width={"60%"}
          visible={visible}
          title="Reported Issue"
          okText={"Submit"}
          okButtonProps={{
            disabled:
              this.state.key == 5 && escalated.to.length == 0 ? false : true
          }}
          confirmLoading={confirmLoading}
          cancelText="Close"
          onCancel={onCancel}
          onOk={this.handleSubmit}
        >
          <Tabs
            style={{ marginTop: "-24px", marginBottom: "-20px" }}
            defaultActiveKey="1"
            onChange={this.callback}
          >
            <TabPane tab="Details" key="1">
              <Descriptions bordered>
                <Descriptions.Item label="Status" span={1.5}>
                  <Badge
                    status={
                      status == "pending"
                        ? "warning"
                        : status == "in progress"
                        ? "processing"
                        : status == "resolved"
                        ? "green"
                        : "default"
                    }
                    text={status}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Type" span={1.5}>
                  {type}
                </Descriptions.Item>
                <Descriptions.Item label="Description " span={1.5}>
                  {description}
                </Descriptions.Item>
                {proposedSolution && (
                  <Descriptions.Item label="Proposed solution" span={1.5}>
                    {proposedSolution}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="County" span={1.5}>
                  {county}
                </Descriptions.Item>
                <Descriptions.Item label="Sub County" span={1.5}>
                  {sub_county}
                </Descriptions.Item>

                <Descriptions.Item label="Report ID" span={1.5}>
                  {reportId}
                </Descriptions.Item>
                <Descriptions.Item label="Reported On" span={1.5}>
                  {moment(createdAt).format("YYYY-MM-DD")}}
                </Descriptions.Item>

                <Descriptions.Item label="Reported By" span={3}>
                  Name: {fname} {lname}
                  <br />
                  Phone number: {"\u00a0" + phoneNumber}
                  <br />
                  Email: {"\u00a0" + "\u00a0" + email}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Images" key="2">
              <div
                style={{
                  backgroundColor: "#000",
                  height: "400px"
                  //  overflow: "hidden"
                }}
              >
                {this.state.data && this.state.data.images.length > 0 && (
                  <ImageGallery
                    items={images}
                    showPlayButton={false}
                    showThumbnails={false}
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="Map" key="3">
              <DynamicMap location={locationInfo.coords} />
            </TabPane>
            <TabPane
              tab="Activity"
              key="4"
              style={{
                "background-color": "#efefef",
                padding: "10px",
                "border-radius": "3px"
              }}
            >
              <Responses responses={response} />
            </TabPane>
            {status !== "closed" && (
              <TabPane tab="Actions" key="5">
                {escalated.to.length > 0 ? (
                  escalated.bool && (
                    <div
                      css={`
                        padding: 110px 50px;
                        margin: 20px 0;
                      `}
                    >
                      <Alert
                        message="Info"
                        description={`This issue has been escalated to ${escalated.to[0]}. You can no longer perfom any actions on this issue.`}
                        type="info"
                      />
                    </div>
                  )
                ) : (
                  <Form layout="vertical">
                    <Form.Item label="Option">
                      <Radio.Group
                        defaultValue="respond"
                        onChange={this.selectAction}
                        buttonStyle="solid"
                        size="large"
                      >
                        {status !== "resolved" && (
                          <>
                            <Radio.Button value={"respond"}>
                              Update status
                            </Radio.Button>
                            <Radio.Button value={"escalate"}>
                              Escalate Issue
                            </Radio.Button>
                          </>
                        )}
                        <Radio.Button value={"close"}>Close Issue</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    {selectedAction == "respond" ? (
                      <>
                        {" "}
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
                      </>
                    ) : selectedAction == "escalate" ? (
                      <>
                        <Form.Item label="To">
                          {form.getFieldDecorator("escalateTo", {
                            rules: [
                              // {
                              //   type: "email",
                              //   message: "The input is not valid E-mail!"
                              // },
                              {
                                required: true,
                                message:
                                  "Please select where to escalate the issue!"
                              }
                            ]
                          })(
                            <Select
                              // defaultValue="lucy"
                              style={{ width: 400 }}
                              onChange={this.handleSelect}
                            >
                              <OptGroup label="Departments">
                                {renderDepartments}
                              </OptGroup>
                              <OptGroup label="Wards">{renderWards}</OptGroup>
                            </Select>
                          )}
                        </Form.Item>
                      </>
                    ) : (
                      selectedAction == "close" && (
                        <>
                          <Form.Item>
                            <Alert
                              message="Warning"
                              description="This action cannot be reversed. Please provide the reason for
closing this issue."
                              type="warning"
                            />
                          </Form.Item>
                          <Form.Item label="Reason">
                            {form.getFieldDecorator("reason", {
                              rules: [
                                // {
                                //   type: "email",
                                //   message: "The input is not valid E-mail!"
                                // },
                                {
                                  required: true,
                                  message: "Please input your reason!"
                                }
                              ]
                            })(<TextArea rows={4} />)}
                          </Form.Item>
                        </>
                      )
                    )}

                    {selectedAction !== "close" && (
                      <Form.Item label="Message">
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
                      </Form.Item>
                    )}
                  </Form>
                )}
              </TabPane>
            )}
            {/* <TabPane tab="Respond" key="3">
              Content of Tab Pane 3
            </TabPane> */}
          </Tabs>
        </Modal>
      );
    }
  }
);
