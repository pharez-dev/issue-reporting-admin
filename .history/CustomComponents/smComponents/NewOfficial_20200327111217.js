import { Button, Modal, Form, Input, Radio, Select } from "antd";

const NewOfficial = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
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

      return (
        <Modal
          visible={visible}
          title="Add an Official"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="horizontal">
            <Form.Item label="Name" {...formItemLayout}>
              <Form.Item
                style={{
                  display: "inline-block",
                  width: "calc(50% - 50px)",
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
                style={{ display: "inline-block", width: "calc(50% - 50px)" }}
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
            <Form.Item label="E-mail" {...formItemLayout}>
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
              })(<Input style={{ width: "calc(91.5% - 50px)" }} />)}
            </Form.Item>
            <Form.Item label="Phone Number" {...formItemLayout}>
              {getFieldDecorator("phone", {
                rules: [
                  { required: true, message: "Please input your phone number!" }
                ]
              })(
                <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
              )}
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
        </Modal>
      );
    }
  }
);
export default NewOfficial;
