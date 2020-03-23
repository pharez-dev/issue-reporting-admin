import { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { Icon } from "antd";
class Map extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "400px",
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude + 0.025,
      zoom: 13
    }
  };

  render() {
    return (
      <ReactMapGL
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoicGhhcmV6IiwiYSI6ImNrODRnNThvcjFpb2kzbHBnZ2hpdm9zeGwifQ.Xca6moEYvFsQtj3SJqJIqw"
        onViewportChange={viewport => this.setState({ viewport })}
        {...this.state.viewport}
      >
        <Marker
          latitude={this.props.location.latitude}
          longitude={this.props.location.longitude}
          //   offsetLeft={-20}
          //   offsetTop={-10}
        >
          <Icon
            type="environment"
            theme="filled"
            style={{ color: "red", fontSize: "50px" }}
          />
        </Marker>
      </ReactMapGL>
    );
  }
}

export default Map;
