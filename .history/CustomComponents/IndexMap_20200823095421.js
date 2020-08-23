import { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { Icon } from "antd";
import { FaBeer, FaCircle, FaDotCircle } from "react-icons/fa";
class Map extends Component {
  state = {
    viewport: {
      width: "76vw",
      height: "400px",
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude + 0.025,
      zoom: 13,
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
              <FaDotCircle size={"2em"} att={{ style: "regular " }} />
            </Marker>
          );
        })}
      </ReactMapGL>
    );
  }
}

export default Map;
