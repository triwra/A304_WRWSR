using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(BackendWeb.Startup))]
namespace BackendWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
