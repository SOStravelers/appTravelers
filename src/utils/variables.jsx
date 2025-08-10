export const routesNavbar = (router) => {
  if (
    router.pathname !== "/login" &&
    router.pathname !== "/register" &&
    router.pathname !== "/create-user-password" &&
    router.pathname !== "/alternative-login" &&
    router.pathname !== "/hostel/login" &&
    router.pathname !== "/validate-email" &&
    router.pathname !== "/intro" &&
    router.pathname !== "/terms-of-service" &&
    router.pathname !== "/payment" &&
    router.pathname !== "/stripe" &&
    router.pathname !== "/paypal" &&
    router.pathname !== "/worker/my-schedules" &&
    router.pathname !== "/worker/settings" &&
    // router.pathname !== "/settings" &&
    // router.pathname !== "/personal-details" &&
    router.pathname !== "/change-password" &&
    router.pathname !== "/create-password" &&
    router.pathname !== "/worker/profile-config" &&
    router.pathname !== "/worker/my-services" &&
    !router.pathname.includes("chat/") &&
    router.pathname !== "/use-policy"
  ) {
    return true;
  } else {
    return false;
  }
};

export const routesSidebar = (router) => {
  if (
    router.pathname !== "/login" &&
    router.pathname !== "/register" &&
    router.pathname !== "/alternative-login" &&
    router.pathname !== "/create-user-password" &&
    router.pathname !== "/hostel/login" &&
    router.pathname !== "/validate-email" &&
    router.pathname !== "/intro"
  ) {
    return true;
  } else {
    return false;
  }
};

export const isLoginPage = (router) =>
  router.pathname === "/login" ||
  router.pathname === "/register" ||
  router.pathname === "/create-user-password" ||
  router.pathname === "/alternative-login";

export const arePrincipalPages = (router) =>
  router.pathname === "/worker/booking" ||
  router.pathname === "/worker/profile" ||
  router.pathname === "/worker/home" ||
  router.pathname === "/" ||
  router.pathname === "/worker/chat" ||
  router.pathname === "/worker/favorites" ||
  router.pathname === "/booking" ||
  router.pathname === "/chat" ||
  router.pathname === "/favorites" ||
  router.pathname === "/profile" ||
  router.pathname === "/payment-confirmation" ||
  router.pathname === "/guest-settings" ||
  router.pathname === "/service-history" ||
  router.pathname === "/settings" ||
  router.pathname === "/summary";
