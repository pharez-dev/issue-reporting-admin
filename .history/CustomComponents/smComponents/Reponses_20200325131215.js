import { Component } from "react";
import { Icon } from "antd";
class Response extends Component {
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
    
    );
  }
}

export default Response;
