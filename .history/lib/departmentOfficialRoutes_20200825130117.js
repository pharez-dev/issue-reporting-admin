import { Home, List, Users } from "react-feather";
export default [
  {
    path: "/",
    name: "Home",
    icon: <Home strokeWidth={1} size={16} />,
  },
  {
    path: "/depertment_official/reports",
    name: "Reported Issues",
    icon: <List strokeWidth={1} size={16} />,
    // childr,en: [
    //   {
    //     path: "/reports/full",
    //     name: "Calendar"
    //   }
    // ]
  },
];
