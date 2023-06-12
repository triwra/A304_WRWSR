using System.Web;
using System.Web.Mvc;
using BackendWeb.ActionFilter;

namespace BackendWeb
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new AppMenuAttribute());
            filters.Add(new UserMonitorAttribute());

        }
    }
}
