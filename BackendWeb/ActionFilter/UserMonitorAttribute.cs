using BackendWeb.Helper;
using DBClassLibrary.UserDataAccessLayer;
using Microsoft.AspNet.Identity;
using System;
using System.Web;
using System.Web.Mvc;

namespace BackendWeb.ActionFilter
{
    public class UserMonitorAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.User.Identity.IsAuthenticated == true)
            {
                int loginTimeoutDays = Convert.ToInt32(CommonHelper.GetAppParam("UserMonitor", "Timeout", "LoginTimeoutDays").Value);
                int passwordTimeoutDays = Convert.ToInt32(CommonHelper.GetAppParam("UserMonitor", "Timeout", "PasswordTimeoutDays").Value);
                int accessTimeoutHours = Convert.ToInt32(CommonHelper.GetAppParam("UserMonitor", "Timeout", "AccessTimeoutHours").Value);

                var userId = filterContext.HttpContext.User.Identity.GetUserId();
                CommonDataHelper cdHelper = new CommonDataHelper();
                var data = cdHelper.GetAppUserData(userId);
                if (data == null)
                {
                    cdHelper.PatchAppUserData(userId);
                    data = cdHelper.GetAppUserData(userId);
                }
                if (data.LastLoginTime == null)
                {
                    cdHelper.UpdateLastLoginTime(userId, DateTime.Now);
                }

                // 檢查登入 Timeout
                if (data.LastLoginTime < DateTime.Now.AddDays(-loginTimeoutDays) &&
                    data.LastAccessTime < DateTime.Now.AddHours(-accessTimeoutHours))
                {
                    filterContext.HttpContext.GetOwinContext().Authentication.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
                    filterContext.Result = new RedirectResult("~/Account/Login");
                }
                else
                {
                    // 檢查密碼 Timeout
                    if (data.LastChangePwdTime < DateTime.Now.AddDays(-passwordTimeoutDays) &&
                        data.LastAccessTime < DateTime.Now.AddHours(-accessTimeoutHours))
                    {
                        var actionName = filterContext.ActionDescriptor.ActionName;
                        if (actionName != "LogOff" && actionName != "ChangePassword")
                        {
                            filterContext.Result = new RedirectResult("~/Manage/ChangePassword");
                        }
                    }
                    else
                    {
                        cdHelper.UpdateLastAccessTime(userId, DateTime.Now);
                    }
                }
            }

            base.OnActionExecuting(filterContext);
        }
    }
}