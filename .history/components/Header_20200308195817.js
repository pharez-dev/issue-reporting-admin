import { Avatar, Badge, Layout, List, Menu, notification, Alert } from "antd";
import {
  BarChart,
  Bell,
  ChevronsDown,
  Maximize,
  Minimize,
  Settings,
  Triangle
} from "react-feather";
import DashHeader, { Notification } from "./styles/Header";
import globals from "../constants/Globals";
import Link from "next/link";
import MockNotifications from "../demos/mock/notifications";
import { useAppState } from "./shared/AppProvider";
import { useState, useEffect } from "react";
import { withGlobalContext } from "../context/global";
import { withRouter } from "next/router";
const { SubMenu } = Menu;
const { Header } = Layout;
import { MessageCircle } from "react-feather";
import socketIOClient from "socket.io-client";
import { Cookies } from "react-cookie";
const cookies = new Cookies();
const MainHeader = ({ global, router }) => {
  const user = global.user;
  let token = cookies.get("token");
  //if (!user) return <div></div>;
  const [state, dispatch] = useAppState();
  const [notifications, setNotificatons] = useState([]);
  const [listening, setListening] = useState(false);
  let number = 0;

  useEffect(() => {
    let socket;
    if (!listening) {
      // console.log("[global on header]", token);
      const socket = socketIOClient(`${globals.BASE_URL}`, {
        query: { token: token, num: ++number }
      });
      setListening(true);
    }
    socket.on("notification", data => {
      data.avatar = (
        <Avatar
          size="large"
          style={{
            color: "rgb(34, 245, 0)",
            backgroundColor: "rgb(207, 253, 219)"
          }}
        >
          <MessageCircle size={24} strokeWidth={1} />
        </Avatar>
      );
      let newNote = Array.from(notifications);
      newNote.push(data);
      console.log(newNote.length);

      setNotificatons(newNote);
    });
  }, [listening]);

  // setTimeout(
  //   () =>
  //     setNotificatons([
  //       {
  //         title: "John Doe launched a new application",
  //         description: "1 hour ago",
  //         avatar: (
  //           <Avatar
  //             size="large"
  //             style={{
  //               color: "rgb(34, 245, 0)",
  //               backgroundColor: "rgb(207, 253, 219)"
  //             }}
  //           >
  //             <MessageCircle size={24} strokeWidth={1} />
  //           </Avatar>
  //         )
  //       }
  //     ]),
  //   3000
  // );
  // setInterval(
  //   () =>
  //     setNotificatons([
  //       {
  //         title: "John Doe launched a new application",
  //         description: "1 hour ago",
  //         avatar: (
  //           <Avatar
  //             size="large"
  //             style={{
  //               color: "rgb(34, 245, 0)",
  //               backgroundColor: "rgb(207, 253, 219)"
  //             }}
  //           >
  //             <MessageCircle size={24} strokeWidth={1} />
  //           </Avatar>
  //         )
  //       },
  //       ...notifications
  //     ]),
  //   10000
  // );
  return (
    <DashHeader>
      <Header>
        {state.mobile && (
          <a
            onClick={() => dispatch({ type: "mobileDrawer" })}
            className="trigger"
          >
            <BarChart size={20} strokeWidth={1} />
          </a>
        )}
        <Link href="/">
          <a className="brand">
            <Triangle size={24} strokeWidth={1} />
            <strong className="mx-1 text-black">
              Real Time County Issue-Reporting System
            </strong>
          </a>
        </Link>

        {/* <Menu mode="horizontal" className="menu-divider">
          {!state.mobile && (
            <Menu.Item>
              <Link href="/apps/calendar">
                <a>Calendar</a>
              </Link>
            </Menu.Item>
          )}

          {!state.mobile && (
            <Menu.Item>
              <Link href="/apps/messages">
                <a>Messages</a>
              </Link>
            </Menu.Item>
          )}

          {!state.mobile && (
            <Menu.Item>
              <Link href="/apps/social">
                <a>Social</a>
              </Link>
            </Menu.Item>
          )}

          {!state.mobile && (
            <Menu.Item>
              <Link href="/apps/chat">
                <a>Chat</a>
              </Link>
            </Menu.Item>
          )}

          {state.mobile && (
            <SubMenu title={<ChevronsDown size={20} strokeWidth={1} />}>
              <Menu.Item>Calendar</Menu.Item>
              <Menu.Item>Messages</Menu.Item>
              <Menu.Item>Social</Menu.Item>
              <Menu.Item>Chat</Menu.Item>
            </SubMenu>
          )}
        </Menu> */}

        <span className="mr-auto" />

        <Menu mode="horizontal">
          {!state.mobile && (
            <Menu.Item onClick={() => dispatch({ type: "fullscreen" })}>
              {!state.fullscreen ? (
                <Maximize size={20} strokeWidth={1} />
              ) : (
                <Minimize size={20} strokeWidth={1} />
              )}
            </Menu.Item>
          )}
          <Menu.Item onClick={() => dispatch({ type: "options" })}>
            <Settings size={20} strokeWidth={1} />
          </Menu.Item>
          <SubMenu
            title={
              <Badge count={notifications.length}>
                <span className="submenu-title-wrapper">
                  <Bell size={20} strokeWidth={1} />
                </span>
              </Badge>
            }
          >
            <Menu.Item
              className="p-0 bg-transparent"
              style={{ height: "auto" }}
            >
              <List
                className="header-notifications"
                itemLayout="horizontal"
                dataSource={notifications}
                footer={<div>{notifications.length} Notifications</div>}
                renderItem={item => (
                  <Notification>
                    <List.Item>
                      <List.Item.Meta
                        avatar={item.avatar}
                        title={<a href="javascript:;">{item.title}</a>}
                        description={<small>{item.description}</small>}
                      />
                    </List.Item>
                  </Notification>
                )}
              />
            </Menu.Item>
          </SubMenu>

          <SubMenu
            title={
              <Avatar
                src={`https://ui-avatars.com/api/?name=${
                  user ? user.fname : ""
                }+${user ? user.lname : ""}&background=0D8ABC&color=fff`}
              />
            }
          >
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>Profile</Menu.Item>
            <Menu.Item>Notifications</Menu.Item>
            <Menu.Divider />
            {/* <Menu.Item>
              <Link href="https://one-readme.fusepx.com">
                <a>Help?</a>
              </Link>
            </Menu.Item> */}
            <Menu.Item
              onClick={() => {
                global.signOut();
                router.push("/signin");
              }}
            >
              Signout
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
    </DashHeader>
  );
};

export default withRouter(withGlobalContext(MainHeader));
