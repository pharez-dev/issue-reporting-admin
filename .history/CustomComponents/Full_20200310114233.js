import { Table, Card, Divider, Carousel, Descriptions } from "antd";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import moment from "moment";
import { withRouter } from "next/router";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

class Full extends React.Component {
  state = {
    data: this.props.data,
    pagination: {},
    loading: false,
    photoIndex: 0,
    isOpen: false
  };

  // handleTableChange = (pagination, filters, sorter) => {
  //   const pager = { ...this.state.pagination };
  //   pager.current = pagination.current;
  //   this.setState({
  //     pagination: pager
  //   });
  //   this.fetch({
  //     results: pagination.pageSize,
  //     page: pagination.current,
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     ...filters
  //   });
  // };

  // fetch = (params = {}) => {
  //   // console.log("params:", params);
  //   this.setState({ loading: true });
  //   reqwest({
  //     url: `${globals.BASE_URL}/api/issues/all`,
  //     method: "post",
  //     data: {
  //       limit: 10,
  //       ...params
  //     },
  //     type: "json"
  //   }).then(data => {
  //     //  console.log("[server data]", data);
  //     const pagination = { ...this.state.pagination };
  //     // Read total count from server
  //     // pagination.total = data.totalCount;
  //     pagination.total = data.meta.totalDocs;
  //     this.setState({
  //       loading: false,
  //       data: data.issues,
  //       pagination
  //     });
  //   });
  // };

  componentDidMount() {
    // this.fetch();
    //console.log("[received Params]", this.props.router.query);
  }

  render() {
    const { state } = this;
    const { data, photoIndex, isOpen } = state;
    const {
      images,
      type,
      description,
      county,
      sub_county,
      reportId,
      status,
      locationInfo,
      reportedBy
    } = data;
    console.log(reportedBy);
    if (reportedBy) const { fname, lname, email, phoneNumber } = reportedBy;
    const carocss = `
    text-align: center;
    height: 300px;
    margin-right:10px;
    background: #000;
    overflow: hidden;
   
  `;
    const imageccs = `  object-fit: contain;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;`;
    // console.log(this.state.data);
    const renderImages = images.map((each, i) => {
      return (
        <div
          css={carocss}
          onClick={() => {
            this.setState({ isOpen: true, photoIndex: i });
          }}
        >
          <img src={each} alt="Report image" css={imageccs} />
        </div>
      );
    });
    return (
      <>
        <Card bodyStyle={{ padding: 0 }} id="components-button-demo">
          <Divider orientation="left">
            <large>Images</large>
          </Divider>
          <div
            css={`
              margin: 0 20px;
              width: fit-content;

              display: flex;
              flex-direction: row;
              justify-content: center;
              padding: 10px;
              padding-right: 0;
              background: #000;
            `}
          >
            {renderImages}
          </div>
          <Divider orientation="left">
            <large>Details</large>
          </Divider>
          <div
            css={`
              padding-left: 30px;
            `}
          >
            <Descriptions title="" size={"default"}>
              <Descriptions.Item label="Product">
                Cloud Database
              </Descriptions.Item>
              <Descriptions.Item label="Type">{}</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
              <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
              <Descriptions.Item label="Official">$60.00</Descriptions.Item>
            </Descriptions>
          </div>
          <div className="p-4"></div>
        </Card>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length
              })
            }
          />
        )}
      </>
    );
  }
}

export default withRouter(Full);
