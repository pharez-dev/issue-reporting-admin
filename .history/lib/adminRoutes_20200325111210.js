import { Home, List } from "react-feather";
export default [
  {
    path: "/",
    name: "Home",
    icon: <Home strokeWidth={1} size={16} />
  },
  {
    path: "/reports",
    name: "Reported Issues",
    icon: <List strokeWidth={1} size={16} />
    // children: [
    //   {
    //     path: "/reports/full",
    //     name: "Calendar"
    //   }
    // ]
  }
];
