import { Home, List } from "react-feather";
export default [
  {
    path: "/",
    name: "Home",
    icon: <Home strokeWidth={1} size={16} />
  },
  {
    path: "/admin/reports",
    name: "Reported Issues",
    icon: <List strokeWidth={1} size={16} />
    // childr,en: [
    //   {
    //     path: "/reports/full",
    //     name: "Calendar"
    //   }
    // ]
  },
  {
    path: "/admin/users",
    name: "Users",
    icon: <List strokeWidth={1} size={16} />
    // children: [
    //   {
    //     path: "/reports/full",
    //     name: "Calendar"
    //   }
    // ]
  }
];
