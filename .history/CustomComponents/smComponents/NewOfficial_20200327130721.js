import { Button, Modal, Form, Input, Radio, Select, Message } from "antd";
import globals from "../../constants/Globals";
import { array } from "prop-types";
const { Option } = Select;
const NewOfficial = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      roles: ["sub-county-admin", "ward-admin"],
      role: null,
      counties: [],
      county: null,
      subCounties: [],
      loadingWards: false
    };
    handleSelect = role => {
      //console.log(`selected ${value}`);
      this.setState({ role });
    };
    handleCountySelect = county => {
      const { form } = this.props;
      console.log(`selected ${county}`);
      let counties = Array.from(this.state.counties);
      let selCounty = counties.filter(count => {
        return count.name == county;
      });
      form.resetFields(["subCounty"]);
      console.log(`selected `, selCounty[0].sub_counties);
      this.setState({ county, subCounties: selCounty[0].sub_counties });
    };
    handleSubCountySelect = async sub_county => {
      const { county, role } = this.state;
      this.setState({ loadingWards: true });
      try {
        const get = await fetch(`${globals.BASE_URL}/api/admin/loadingWards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.props.token
          },
          body: JSON.stringify({
            county,
            sub_county
          })
        });
        let data = await get.json();

        if (!data.success) throw new Error(data.message);

        this.setState({
          //  reportedBy: data.reportedBy,
          wards: data.wards,
          loadingWards: false
        });
      } catch (err) {
        Message.error(err.message);
        // this.props.onCancel();
      }
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
          const get = await fetch(`${globals.BASE_URL}/api/admin/issue_assss`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: this.props.token
            },
            body: JSON.stringify({
              ...values
            })
          });
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
    loadCounties = async () => {
      try {
        const get = await fetch(`${globals.BASE_URL}/api/admin/loadCounties`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.props.token
          },
          body: JSON.stringify()
        });
        let data = await get.json();
        if (!data.success) throw new Error(data.message);
        console.log("[fetched data]", data);

        this.setState({
          counties: data.counties
        });
      } catch (err) {
        console.error(err);
        Message.error(err.message + " Closing Modal!");
        this.props.onCancel();
      }
    };
    componentDidMount = () => {
      this.loadCounties();
    };
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { roles, counties, subCounties } = this.state;
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
      const renderCounties = counties.map((each, i) => {
        return (
          <Option key={i + each._id} value={each.name}>
            {each.name}
          </Option>
        );
      });
      const renderSubCounties = subCounties.map((each, i) => {
        return (
          <Option key={i + each} value={each}>
            {each}
          </Option>
        );
      });
      console.log("[subcounties]", subCounties);
      return (
        <Modal
          visible={visible}
          title="Add an Official"
          okText="Submit"
          onCancel={onCancel}
          onOk={this.handleSubmit}
        >
          <Form layout="vertical">
            <Form.Item label="Name" style={{ marginBottom: "-20px" }}>
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
                {getFieldDecorator("lname", {
                  rules: [
                    {
                      required: true,
                      message: "Please input last name!"
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
              })(<Input style={{ width: "calc(92% - 50px)" }} />)}
            </Form.Item>
            <Form.Item label="Phone Number">
              {getFieldDecorator("phone", {
                rules: [
                  { required: true, message: "Please input your phone number!" }
                ]
              })(
                <Input addonBefore={prefixSelector} style={{ width: "82%" }} />
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
                  style={{ width: "82%" }}
                  onChange={this.handleSelect}
                >
                  {renderRoles}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="County , Sub County">
              <Form.Item
                style={{ width: "calc(43% )", display: "inline-block" }}
              >
                {getFieldDecorator("County", {
                  rules: [
                    // {
                    //   type: "email",
                    //   message: "The input is not valid E-mail!"
                    // },
                    {
                      required: true,
                      message: "Please select county!"
                    }
                  ]
                })(
                  <Select
                    // defaultValue="lucy"
                    placeholder="Select County"
                    style={{ width: "90%" }}
                    onChange={this.handleCountySelect}
                  >
                    {renderCounties}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                style={{ width: "calc(43% )", display: "inline-block" }}
              >
                {getFieldDecorator("subCounty", {
                  rules: [
                    // {
                    //   type: "email",
                    //   message: "The input is not valid E-mail!"
                    // },
                    {
                      required: true,
                      message: "Please select sub county!"
                    }
                  ]
                })(
                  <Select
                    // defaultValue="lucy"
                    disabled={subCounties.length == 0}
                    placeholder="Select Sub County"
                    style={{ width: "90%" }}
                    onChange={this.handleSubCountySelect}
                  >
                    {renderSubCounties}
                  </Select>
                )}
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
export default NewOfficial;
