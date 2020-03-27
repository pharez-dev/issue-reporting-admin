import { Button, Modal, Form, Input, Radio, Select } from "antd";

const NewOfficial = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      roles: ["sub-county-admin", "ward-admin"]
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
            `${globals.BASE_URL}/api/admin/issue_assss`,
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
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { roles } = this.state;
      const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 30 }
      };
      const prefixSelector = getFieldDecorator("prefix", {
        initialValue: "254"
      })(
        <Select style={{ width: 70 }}>
          <Option value="254">+254</Option>
        </Select>
      );
      const renderRoles = roles.map((each, i) => {
        return (
          <Option key={i + each} value={each}>
            {each}
          </Option>
        );
      });
      return (
        <Modal
          visible={visible}
          title="Add an Official"
          okText="Submit"
          onCancel={onCancel}
          onOk={this.handleSubmit}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Form.Item
                style={{
                  display: "inline-block",
                  width: "calc(48% - 50px)",
                  marginRight: "10px"
                }}
              >
                {getFieldDecorator("fname", {
                  rules: [
                    {
                      required: true,
                      message: "Please input first name!"
                    }
                  ]
                })(<Input placeholder="First Name" />)}
              </Form.Item>
              <Form.Item
                style={{ display: "inline-block", width: "calc(48% - 50px)" }}
              >
                {getFieldDecorator("fname", {
                  rules: [
                    {
                      required: true,
                      message: "Please input first name!"
                    }
                  ]
                })(<Input placeholder="Last Name" />)}
              </Form.Item>
            </Form.Item>
            <Form.Item label="E-mail">
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!"
                  }
                ]
              })(<Input style={{ width: "calc(89.5% - 50px)" }} />)}
            </Form.Item>
            <Form.Item label="Phone Number">
              {getFieldDecorator("phone", {
                rules: [
                  { required: true, message: "Please input your phone number!" }
                ]
              })(
                <Input addonBefore={prefixSelector} style={{ width: "80%" }} />
              )}
            </Form.Item>
            <Form.Item label="Role">
              {getFieldDecorator("Role", {
                rules: [
                  // {
                  //   type: "email",
                  //   message: "The input is not valid E-mail!"
                  // },
                  {
                    required: true,
                    message: "Please select where to escalate the issue!"
                  }
                ]
              })(
                <Select
                  // defaultValue="lucy"
                  style={{ width: 400 }}
                  onChange={this.handleSelect}
                >
                  {renderRoles}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
export default NewOfficial;
