import { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { Icon } from "antd";
import { FaBeer, FaCircle, FaDotCircleRe, Ma } from "react-icons/fa";
import { MdAdjust } from "react-icons/md";

class Map extends Component {
  state = {
    viewport: {
      width: "56vw",
      height: "400px",
      latitude: this.props.location.coords.lat,
      longitude: this.props.location.coords.lng,
      zoom: 10,
    },
  };
  componentWillRecieveProps = (nextProps) => {
    this.setState({
      viewport: {
        width: "56vw",
        height: "400px",
        latitude: nextProps.location.coords.lat,
        longitude: nextProps.location.coords.lng + 0.025,
        zoom: 10,
      },
    });
  };
  render() {
    const { issues } = this.props;
    return (
      <ReactMapGL
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoicGhhcmV6IiwiYSI6ImNrODRnNThvcjFpb2kzbHBnZ2hpdm9zeGwifQ.Xca6moEYvFsQtj3SJqJIqw"
        onViewportChange={(viewport) => this.setState({ viewport })}
        {...this.state.viewport}
      >
        {issues.map((each, i) => {
          let color = "purple";
          switch (each.type) {
            case "Water and sanitation":
              color = "blue";
              break;
            case "Roads and transport":
              color = "black";
              break;
            case "Housing and land":
              color = "green";
              break;
            case "Agriculture and livestock":
              color = "yellow";
              break;
            case "Health Services and Public Health":
              color = "red";
            case "other":
              color: "grey";
              break;
          }

          return (
            <Marker
              key={i}
              latitude={each.locationInfo.coords.latitude}
              longitude={each.locationInfo.coords.longitude}
              offsetLeft={-50}
              offsetTop={-50}
            >
              <MdAdjust size={"1.5em"} style={{ color: color }} />
            </Marker>
          );
        })}
      </ReactMapGL>
    );
  }
}

export default Map;
