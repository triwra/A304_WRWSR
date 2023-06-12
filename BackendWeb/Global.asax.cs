using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace BackendWeb
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        void ErrorLog_Filtering(object sender, Elmah.ExceptionFilterEventArgs e)
        {
            var exception = e.Exception.GetBaseException();

            if (exception is HttpRequestValidationException)
            {
                e.Dismiss();
            }

#if DEBUG
            e.Dismiss();
#endif

        }

        void ErrorMail_Filtering(object sender, Elmah.ExceptionFilterEventArgs e)
        {
            var exception = e.Exception.GetBaseException();

            if (exception is HttpRequestValidationException)
            {
                e.Dismiss();
            }

#if DEBUG
            e.Dismiss();
#endif

        }
    }
}
