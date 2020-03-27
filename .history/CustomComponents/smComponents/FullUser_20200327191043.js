import {
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Select,
  Message,
  Spin,
  Descriptions,
  Tabs
} from "antd";
import globals from "../../constants/Globals";
import { array } from "prop-types";
import Capitalize from "../../lib/Capitalize";
import moment from "moment";
const { Option } = Select;
const { TabPane } = Tabs;
const FullUser = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      data: null,
      loading: true
    };
    fetchUser = async () => {
      try {
        const get = await fetch(`${globals.BASE_URL}/api/admin/single_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.props.token
          },
          body: JSON.stringify({ record: this.props.record })
        });
        let data = await get.json();
        console.log("fetched:data", data);
        if (!data.success) throw new Error(data.message);
        this.setState({
          data: data.data,
          loading: false
        });
      } catch (err) {
        console.error(err);
        Message.error(err.message + " Closing Modal!");
        this.props.onCancel();
      }
    };

    componentDidMount = () => {
      this.fetchUser();
    };
    render() {
      if (this.state.loading) {
        return (
          <Modal
            centered
            visible={true}
            title="User"
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
      const { getFieldDecorator } = form;
      const { data } = this.state;
      const name = data.fname + " " + data.lname;
      const {
        role,
        email,
        status,
        createdAt,
        phoneNumber,
        county,
        subCounty
      } = data;

      return (
        <Modal
          centered
          visible={visible}
          title="User"
          okText="Save"
          okButtonProps={{
            disabled: true
          }}
          onCancel={onCancel}
          onOk={this.handleSubmit}
        >
          <Tabs
            style={{ marginTop: "-24px", marginBottom: "-20px" }}
            defaultActiveKey="1"
            onChange={this.callback}
          >
            <TabPane tab="Details" key="1">
              <Descriptions size={"small"} bordered>
                <Descriptions.Item label="Name" span={3}>
                  {name}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={3}>
                  {email}
                </Descriptions.Item>
                <Descriptions.Item label="Role" span={3}>
                  <Capitalize text={role} />
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={3}>
                  <Capitalize text={status} />
                </Descriptions.Item>
                <Descriptions.Item label="Joined" span={3}>
                  {moment(createdAt).format("YYYY-MM-DD")}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>
        </Modal>
      );
    }
  }
);
export default FullUser;
