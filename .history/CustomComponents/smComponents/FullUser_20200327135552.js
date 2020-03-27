import { Button, Modal, Form, Input, Radio, Select, Message, Spin } from "antd";
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
      s;
      const {} = this.state;

      return (
        <Modal
          visible={visible}
          title="Add an Official"
          okText="Submit"
          okButtonProps={{}}
          onCancel={onCancel}
          onOk={this.handleSubmit}
        ></Modal>
      );
    }
  }
);
export default NewOfficial;
