using BackendWeb.Helper;
using Microsoft.AspNet.Identity;
using System.Web.Mvc;

namespace BackendWeb.ActionFilter
{
    public class AppMenuAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);

            if (!filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true) &&
                !filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(
                    typeof(AllowAnonymousAttribute), true))
            {
                if (CommonHelper.CheckActionAuthorization(
                    filterContext.HttpContext.User.Identity.GetUserId(), 
                    filterContext.ActionDescriptor.ActionName, 
                    filterContext.ActionDescriptor.ControllerDescriptor.ControllerName) == false)
                {
                    // throw new UnauthorizedAccessException();

                    filterContext.Result = new RedirectResult("~/Account/Login");
                }
            }
        }
    }
}