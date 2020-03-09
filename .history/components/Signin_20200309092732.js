import { useState, useContext } from "react";
import { Button, Checkbox, Form, Input, Message, Row } from "antd";

import { Eye, Mail, Triangle } from "react-feather";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";
import globals from "../constants/Globals";
//Context
import { withGlobalContext } from "../context/global";
const FormItem = Form.Item;

const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;

class Signin extends React.Component {
  state = {
    loading: false
  };
  componentDidMount() {
    // To disable submit button at the beginning.
    //this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    console.log("props", this.props);
    //const { signIn } = useContext(UserContext);
    if (this.state.loading) return;
    form.validateFields(async (err, values) => {
      if (!err) {
        console.log(values);
        this.setState({ loading: true });
        try {
          const response = await fetch(`${globals.BASE_URL}/api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
          });
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.success) {
              this.props.global.signIn(data.token);
              Message.success(
                "Sign complete. Taking you to your dashboard!"
              ).then(() => Router.push("/"));
            } else {
              Message.error(data.message);
              this.setState({ loading: false });
            }
          } else {
            console.log("Login failed.");
            // https://github.com/developit/unfetch#caveats
            Message.error("An error occured.Check console.log");
          }
        } catch (error) {
          this.setState({ loading: false });
          Message.error("Failed to reach server!");
          console.error(
            "You have an error in your code or there are Network issues.",
            error
          );
          //  throw new Error(error);
        }
      }
    });
  };
  render = () => {
    const { form } = this.props;

    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        className="px-3 bg-white mh-page"
        style={{ minHeight: "100vh" }}
      >
        <Content>
          <div className="text-center mb-5">
            <Link href="/signin">
              <a className="brand mr-0">
                <Triangle size={32} strokeWidth={1} />
              </a>
            </Link>
            <h5 className="mb-0 mt-3">Sign in</h5>

            <p className="text-muted">
              Real-Time County Issue Reporting System
            </p>
          </div>

          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <FormItem label="Email">
              {form.getFieldDecorator("email", {
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
              })(
                <Input
                  prefix={
                    <Mail
                      size={16}
                      strokeWidth={1}
                      style={{ color: "rgba(0,0,0,.25)" }}
                    />
                  }
                  type="email"
                  placeholder="Email"
                />
              )}
            </FormItem>

            <FormItem label="Password">
              {form.getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please input your Password!" }
                ]
              })(
                <Input
                  prefix={
                    <Eye
                      size={16}
                      strokeWidth={1}
                      style={{ color: "rgba(0,0,0,.25)" }}
                    />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>

            <FormItem>
              {form.getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox>Remember me</Checkbox>)}
              <Link href="/forgot">
                <a className="text-xs-right">
                  <small>Forgot password</small>
                </a>
              </Link>
              <Button
                loading={this.state.loading}
                type="primary"
                htmlType="submit"
                block
                className="mt-3"
              >
                Log in
              </Button>
            </FormItem>

            <div className="text-center">
              <small className="text-muted">
                <span>Don't have an account yet?</span>{" "}
                <Link href="/signup">
                  <a>&nbsp;Create one now!</a>
                </Link>
              </small>
            </div>
          </Form>
        </Content>
      </Row>
    );
  };
}

export default withGlobalContext(Form.create()(Signin));
