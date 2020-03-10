import { Table, Card, Divider, Carousel, Descriptions, Timeline } from "antd";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import moment from "moment";
import { withRouter } from "next/router";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

class Full extends React.Component {
  state = {
    data: this.props.data,
    reportedBy: this.props.reportedBy,
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
    const { data, photoIndex, isOpen, reportedBy } = state;
    const {
      images,
      type,
      description,
      county,
      sub_county,
      reportId,
      status,
      locationInfo
    } = data;
    console.log("[reportedBY]", reportedBy);

    const { fname, lname, email, phoneNumber } = reportedBy;

    const carocss = `
    text-align: center;
    height: 300px;
    margin-right:10px;
    background: #000;
    overflow: hidden;
   
  `;
    const subt = `
    color: black;
    font-size: 14px;
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
          key={i + "img"}
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
              height: fit-content;
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
            <Timeline>
              <Timeline.Item>
                <b css={subt}>Type</b>
                <p>{type}</p>
              </Timeline.Item>
              <Timeline.Item>
                <b css={subt}>Description</b>
                <p>{description}</p>
              </Timeline.Item>
              <Timeline.Item
                color={
                  status == "pending"
                    ? "gray"
                    : status == "reviewed"
                    ? "green"
                    : null
                }
              >
                <b css={subt}>Status</b>
                <p>{status}</p>
              </Timeline.Item>

              <Timeline.Item>
                <div
                  css={`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <div
                    css={`
                      width: 200px;
                    `}
                  >
                    <b css={subt}>County</b>
                    <p>{county}</p>
                  </div>
                  <div>
                    <b css={subt}>Sub County</b>
                    <p>{sub_county ? sub_county : "NA"}</p>
                  </div>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <b css={subt}>Report ID</b>
                <p>{reportId}</p>
              </Timeline.Item>
              <Timeline.Item>
                <div
                  css={`
                    display: flex;
                    flex-direction: row;
                  `}
                >
                  <div
                    css={`
                      width: 200px;
                    `}
                  >
                    <b css={subt}>Reported By</b>
                    <p>{county}</p>
                  </div>
                  <div>
                    <b css={subt}>Sub County</b>
                    <p>{sub_county}</p>
                  </div>
                </div>
              </Timeline.Item>
            </Timeline>
            ,
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
