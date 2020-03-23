import { Component } from "react";
import ReactMapGL from "react-map-gl";

class Map extends Component {
  state = {
    viewport: {
      width: "400px",
      height: "400px",
      latitude: 41.5868,
      longitude: -93.625,
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
      />
    );
  }
}

export default Map;
