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
