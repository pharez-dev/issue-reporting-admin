import { Button, Modal, Form, Input, Radio, Select, Message, Spin } from "antd";
import globals from "../../constants/Globals";
import { array } from "prop-types";
const { Option } = Select;
const NewOfficial = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      roles: ["sub-county-admin", "ward-admin", "department-official"],
      departments: ["hello"],
      role: null,
      counties: [],
      county: null,
      subCounties: [],
      subCounty: null,
      loadingWards: false,
      wards: []
    };
    handleSelect = role => {
      //console.log(`selected ${value}`);
      this.setState({ role }, () => {
        if (this.state.subCounty) {
          this.handleSubCountySelect(this.state.subCounty);
        }
      });
    };
    handleCountySelect = county => {
      const { form } = this.props;
      console.log(`selected ${county}`);
      let counties = Array.from(this.state.counties);
      let selCounty = counties.filter(count => {
        return count.name == county;
      });
      form.resetFields(["subCounty", "ward"]);
      console.log(`selected `, selCounty[0].sub_counties);
      this.setState({ county, subCounties: selCounty[0].sub_counties });
    };
    handleSubCountySelect = async sub_county => {
      const { form } = this.props;
      const { county, role } = this.state;
      this.setState({ subCounty: sub_county });
      form.resetFields(["ward"]);
      if (role !== "ward-admin") return;

      this.setState({ loadingWards: true });
      try {
        const get = await fetch(`${globals.BASE_URL}/api/admin/loadWards`, {
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
          const get = await fetch(
            `${globals.BASE_URL}/api/admin/new_official`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: this.props.token
              },
              body: JSON.stringify({
                ...values
              })
            }
          );
          let data = await get.json();

          if (!data.success) throw new Error(data.message);
          form.resetFields();
          Message.success("Official was added successfully and email was sent");
          this.setState({
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
      const {
        roles,
        counties,
        subCounties,
        wards,
        role,
        confirmLoading,
        loadingWards,
        departments
      } = this.state;
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
      const renderWards = wards.map((each, i) => {
        return (
          <Option key={i + each.name} value={each.name}>
            {each.name}
          </Option>
        );
      });
      const renderDepartments = departments.map((each, i) => {
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
          okButtonProps={{
            disabled: loadingWards
          }}
          onCancel={onCancel}
          onOk={this.handleSubmit}
          confirmLoading={confirmLoading}
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
            <Form.Item label="Phone Number(7XXXXXXX)">
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
            <Form.Item
              label="County , Sub County"
              style={{ marginBottom: "-10px" }}
            >
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
              {role !== "department-official" && (
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
              )}{" "}
            </Form.Item>

            <Form.Item label="Department">
              {getFieldDecorator("department", {
                rules: [
                  // {
                  //   type: "email",
                  //   message: "The input is not valid E-mail!"
                  // },
                  {
                    required: true,
                    message: "Please select department!"
                  }
                ]
              })(
                <Select
                  placeholder="Select Department"
                  style={{ width: "90%" }}
                  // onChange={this.handleSubCountySelect}
                >
                  {renderDepartments}
                </Select>
              )}
            </Form.Item>
            {role == "ward-admin" && (
              <Spin tip="Loading wards..." spinning={this.state.loadingWards}>
                <Form.Item label="Ward">
                  {getFieldDecorator("ward", {
                    rules: [
                      // {
                      //   type: "email",
                      //   message: "The input is not valid E-mail!"
                      // },
                      {
                        required: true,
                        message: "Please select ward!"
                      }
                    ]
                  })(
                    <Select
                      // defaultValue="lucy"
                      disabled={!this.state.subCounty}
                      placeholder="Select Ward"
                      style={{ width: "90%" }}
                      // onChange={this.handleSubCountySelect}
                    >
                      {renderWards}
                    </Select>
                  )}
                </Form.Item>
              </Spin>
            )}
          </Form>
        </Modal>
      );
    }
  }
);
export default NewOfficial;
