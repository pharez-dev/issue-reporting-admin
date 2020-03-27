import { Button, Modal, Form, Input, Radio } from "antd";

const NewOfficial = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 30 }
      };
      const { getFieldDecorator } = form;
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
        </Modal>
      );
    }
  }
);
export default NewOfficial;
