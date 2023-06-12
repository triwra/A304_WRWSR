using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.CommonDataModel;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System;
using System.Web.Mvc;

namespace BackendWeb.ActionFilter
{
    public class ActionLogAttribute : ActionFilterAttribute
    {
        public bool Ignore { get; set; }
        public bool IgnoreAnonymous { get; set; }
        public bool IgnoreParameters { get; set; }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!Ignore && !(IgnoreAnonymous &&
                filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true)))
            {
                string parameters = 
                    IgnoreParameters ? null : JsonConvert.SerializeObject(filterContext.ActionParameters, new JsonSerializerSettings()
                {
                    ContractResolver = new ReadablePropertiesResolver()
                });

                //Azure WAF服務使用 HTTP_X_FORWARDED_FOR 的方式獲取客戶端的真實IP地址。
                //Azure WAF服務還支持使用 HTTP_X_REAL_IP 變量，獲取客戶的來源IP
                //（使用過程中考慮了後面經過的多層反向代理對該變量的修改）。
                string ip = filterContext.HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (ip == null)
                    ip = filterContext.HttpContext.Request.UserHostAddress;

                var log = new ActionLog()
                {
                    UserId = filterContext.HttpContext.User.Identity.GetUserId(),
                    Controller = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName,
                    Action = filterContext.ActionDescriptor.ActionName,
                    Parameters = parameters,
                    IP = ip,
                    UpdateTime = DateTime.Now
                };

                CommonDataHelper cdHelper = new CommonDataHelper();
                cdHelper.AddActionLog(log);
            }

            base.OnActionExecuting(filterContext);
        }
    }
}