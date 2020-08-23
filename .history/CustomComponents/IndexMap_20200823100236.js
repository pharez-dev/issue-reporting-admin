import { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { Icon } from "antd";
import { FaBeer, FaCircle, FaDotCircleRe, Ma } from "react-icons/fa";
import { MdAdjust } from "react-icons/md";

class Map extends Component {
  state = {
    viewport: {
      width: "76vw",
      height: "400px",
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude + 0.025,
      zoom: 7,
    },
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
        {issues.map((each) => {
          return (
            <Marker
              latitude={each.locationInfo.coords.latitude}
              longitude={each.locationInfo.coords.longitude}
              offsetLeft={-50}
              offsetTop={-50}
            >
              <MdAdjust size={"1.5em"} style={{ color: "red" }} />
            </Marker>
          );
        })}
      </ReactMapGL>
    );
  }
}

export default Map;
