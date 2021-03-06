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
const { Option } = Select;
const NewOfficial = Form.create({ name: "form_in_modal" })(
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
      const { getFieldDecorator } = form;

      const {} = this.state;

      return (
        <Modal
          visible={visible}
          title="User"
          okText="Submit"
          okButtonProps={{
            disabled: true
          }}
          onCancel={onCancel}
          onOk={this.handleSubmit}
        >
          <Descriptions size={"small"} bordered>
            <Descriptions.Item label="Type">{}</Descriptions.Item>
          </Descriptions>
        </Modal>
      );
    }
  }
);
export default NewOfficial;
