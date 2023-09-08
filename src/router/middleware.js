// router/middleware.js
export default function authMiddleware(to, from, next) {
    const token = localStorage.getItem('token'); // Replace with how you store your token
  
    if(to.path === '/login') {
        if (token) {
            next({ path: '/' });
        } else {
            next(); // Allow the user to proceed to the login page if not authenticated
        }
    } else if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!token) {
        // If token is not present, redirect to the login page
        next({ path: '/login', query: { redirect: to.fullPath } });
      } else {
        // If token is present, assume the user is authenticated
        // You may want to add additional checks for token validity and expiration
        to.meta.auth = true;
        next();
      }
    } else {
      // For routes without the 'requiresAuth' meta, proceed normally
      next();
    }
  }