const sidebarLinks = [
  { name: "Dashboard", route: "/home", icon: "bi bi-grid", active: true },

  // {
  //   name: "Lobby Game",
  //   route: "/Carrom",
  //   icon: "bi bi-person-vcard-fill",
  //   active: false,
  // },
  {
    name: "Player Master",
    route: "/player",
    icon: "bi bi-people-fill",
    active: false
  },

  {
    name: "Profile",
    route: "/users-profile",
    icon: "bi bi-person",
    active: false
  },

  {
    name: "Withdrowls",
    icon: "bi bi-bar-chart",
    active: false,
    submenu: [
      {
        name: "Request",
        route: "/with_re",
        icon: "bi bi-circle",
        active: false
      },
      {
        name: "Approval",
        route: "/with_app",
        icon: "bi bi-circle",
        active: false
      },
      {
        name: "Reject",
        route: "/with_rej",
        icon: "bi bi-circle",
        active: false
      }
    ]
  },

  {
    name: "Recharge",
    icon: "bi bi-layout-text-window-reverse",
    active: false,
    submenu: [
      {
        name: "Recharge Request",
        route: "/rech_pe",
        icon: "bi bi-circle",
        active: false
      },
      {
        name: "Recharge Approval",
        route: "/rech_app",
        icon: "bi bi-circle",
        active: false
      },
      {
        name: "Recharge Reject",
        route: "/rech_rej",
        icon: "bi bi-circle",
        active: false
      }
    ]
  },
  {
    name: "Manual_Transaction",
    icon: "bi bi-layout-text-window-reverse",
    active: false,
    submenu: [
      {
        name: "Man. Recharge Request",
        route: "/Man_rech_pe",
        icon: "bi bi-circle",
        active: false
      },
      {
        name: "Man. Recharge Approval",
        route: "/Man_rech_app",
        icon: "bi bi-circle",
        active: false
      },
      {
        name: "Man. Recharge Reject",
        route: "/man_rech_rej",
        icon: "bi bi-circle",
        active: false
      }
    ]
  },
  {
    name: "Ticket",
    icon: "bi bi-ticket-perforated",
    active: false,
    submenu: [
      {
        name: "Ticket Request",
        route: "/tic_re",
        icon: "bi bi-circle",
        active: false
      },
      {
        name: "Ticket Approval",
        route: "/tic_app",
        icon: "bi bi-circle",
        active: false
      }
    ]
  },
  {
    name: "Setting",
    icon: "bi bi-gear",
    active: false,
    submenu: [
      // {
      //   name: "Refer Bonus",
      //   route: "/Bonus",
      //   icon: "bi bi-circle",
      //   active: "0"
      // },
      // {
      //   name: "Manual Payemnt Method",
      //   route: "/paymentManul",
      //   icon: "bi bi-circle",
      //   active: "0"
      // },
      // {
      //   name: "Refer & Earn",
      //   route: "/Refer",
      //   icon: "bi bi-circle",
      //   active: false
      // },
      // {
      //   name: "Refer & Win",
      //   route: "/ReferWin",
      //   icon: "bi bi-circle",
      //   active: false
      // },

      // {
      //   name: "Daily Bonus",
      //   route: "/festival",
      //   icon: "bi bi-circle",
      //   active: false
      // },

      // {
      //   name: "Notice Images",
      //   route: "/slider",
      //   icon: "bi bi-circle",
      //   active: false
      // },
      // {
      //   name: "Slider Image",
      //   route: "/Slide",
      //   icon: "bi bi-circle",
      //   active: false
      // },
      // {
      //   name: "Festival Bonus Mail",
      //   route: "/mail",
      //   icon: "bi bi-circle",
      //   active: false
      // },
      // {
      //   name: "Mail",
      //   route: "/mailBonus",
      //   icon: "bi bi-circle",
      //   active: false
      // }
    ]
  },
  { name: "Logout", icon: "bi bi-question-circle", active: false }

  // Add more top-level or submenu items here
];

module.exports = sidebarLinks;
