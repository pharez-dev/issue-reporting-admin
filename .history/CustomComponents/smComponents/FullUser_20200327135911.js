import { Button, Modal, Form, Input, Radio, Select, Message, Spin } from "antd";
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
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      s;
      const {} = this.state;

      return (
        <Modal
          visible={visible}
          title="Add an Official"
          okText="Submit"
          okButtonProps={{
            disabled: true
          }}
          onCancel={onCancel}
          onOk={this.handleSubmit}
        ></Modal>
      );
    }
  }
);
export default NewOfficial;
