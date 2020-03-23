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
  Radio
} from "antd";
import dynamic from "next/dynamic";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import moment from "moment";
import Router from "next/router";

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
      pagination: pager
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
    // console.log("params:", params);
    this.setState({ loading: true });
    try {
      reqwest({
        url: `${globals.BASE_URL}/api/issues/all`,
        method: "post",
        data: {
          limit: 10,
          ...params
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

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log("Received values of form: ", values);
      form.resetFields();
      this.setState({ visible: false });
    });
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
            `}
          >
            <div
              css={`
                width: 600px;
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
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
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
const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false
});

const { TabPane } = Tabs;
const CollectionCreateForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      loading: true,
      data: null,
      key: 1
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
        this.setState({
          data: data.data,
          reportedBy: data.reportedBy,
          loading: false
        });
      } catch (err) {
        console.error(err);
        Message.error(err.message + " Closing Modal!");
        this.props.onCancel();
      }
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
        return <div></div>;
      }
      const { visible, onCancel, onCreate, form, record } = this.props;
      //  console.log("props:", this.props);
      //   const { images } = this.state.data;
      console.log("images", this.state.data);
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
        proposedSolution
      } = this.state.data;
      const { reportedBy } = this.state;
      const { fname, lname, email, phoneNumber } = reportedBy;

      const subt = `
    color: black;
    font-size: 14px;
  `;
      return (
        <Modal
          width={"60%"}
          visible={visible}
          title="Reported Issue"
          okText={"Submit"}
          okButtonProps={{
            disabled: this.state.key == 4 ? false : true
          }}
          cancelText="Close"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="Details" key="1">
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
                    {" "}
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
                        <b css={subt}>Status</b>
                        <p>{status}</p>
                      </div>
                      <div>
                        <b css={subt}>Type</b>
                        <p>{type}</p>
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
                      <div css={``}>
                        <b css={subt}>Description</b>
                        <p>{description}</p>
                      </div>
                    </div>
                  </Timeline.Item>
                  {proposedSolution && (
                    <Timeline.Item>
                      <div
                        css={`
                          display: flex;
                          flex-direction: row;
                        `}
                      >
                        <div css={``}>
                          <b css={subt}>Proposed solution</b>
                          <p>{proposedSolution}</p>
                        </div>
                      </div>
                    </Timeline.Item>
                  )}

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
                        width: 100%;
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
                          margin-right: 80px;
                          display: flex;
                          flex-direction: row;
                          padding-top: 20px;
                        `}
                      >
                        <b css={subt}>Phone number: </b>
                        <p>{"\u00a0" + phoneNumber}</p>
                      </div>
                      <div
                        css={`
                          display: flex;
                          flex-direction: row;
                          padding-top: 20px;
                        `}
                      >
                        <b css={subt}>Email: </b>
                        <p>{"\u00a0" + "\u00a0" + email}</p>
                      </div>
                    </div>
                  </Timeline.Item>
                </Timeline>
              </div>
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
            <TabPane tab="Actions" key="4">
              <Form layout="vertical">
                <Form.Item label="Status">
                  {form.getFieldDecorator("radio-button", {
                    rules: [
                      {
                        required: true,
                        message: "Please select status!"
                      }
                    ]
                  })(
                    <Radio.Group>
                       <Radio.Button value={""}>Respond to Citizen</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="Title">
                  {getFieldDecorator("title", {
                    rules: [
                      {
                        required: true,
                        message: "Please input the title of collection!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Description">
                  {getFieldDecorator("description")(<Input type="textarea" />)}
                </Form.Item>
                <Form.Item className="collection-create-form_last-form-item">
                  {getFieldDecorator("modifier", {
                    initialValue: "public"
                  })(
                    <Radio.Group>
                      <Radio value="public">Public</Radio>
                      <Radio value="private">Private</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Form>
            </TabPane>
            {/* <TabPane tab="Respond" key="3">
              Content of Tab Pane 3
            </TabPane> */}
          </Tabs>
        </Modal>
      );
    }
  }
);