import { Button, Modal, Form, Input, Radio } from "antd";

const NewOfficial = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 7 }
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
            <Form.Item
              label="Name"
              style={{ display: "inline-block", width: "100%" }}
              {...formItemLayout}
            >
              {getFieldDecorator("fname", {
                rules: [
                  {
                    required: true,
                    message: "Please input first name!"
                  }
                ]
              })(
                <Input style={{ display: "inline-block", width: "100%" }} />
              )}{" "}
              {getFieldDecorator("fname", {
                rules: [
                  {
                    required: true,
                    message: "Please input first name!"
                  }
                ]
              })(<Input style={{ display: "inline-block", width: "100%" }} />)}
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
