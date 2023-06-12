using System.Web;
using System.Web.Optimization;

namespace BackendWeb
{
    public class BundleConfig
    {
        // 如需統合的詳細資訊，請瀏覽 https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // 使用開發版本的 Modernizr 進行開發並學習。然後，當您
            // 準備好可進行生產時，請使用 https://modernizr.com 的建置工具，只挑選您需要的測試。
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            /*************************************
             * Custom Bundles Area
             * ******************************************************/
            #region Custom Bundles Area

            bundles.Add(new StyleBundle("~/Content/css").Include(
                //"~/Content/bootstrap.css",
                //"~/Content/bootstrap-toggle.min.css",
                //"~/Content/Tabler/dist/css/tabler-payments.min.css",
                //"~/Content/Tabler/dist/css/tabler-flags.min.css",
                //"~/Content/Tabler/dist/css/tabler-vendors.min.css",
                "~/Content/Tabler/dist/css/demo.min.css",
                "~/Content/Tabler/dist/css/tabler.min.css",                
                "~/Content/tabler-icons.min.css",                
                "~/Content/bootstrap-table.min.css",                
                "~/Content/PagedList.css",                
                "~/Content/Site.css",
                "~/SCSS/Site.min.css"
                ));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                //"~/JSLib/jquery/js/jquery.min.js",
                "~/JSLib/popper.js/js/popper.min.js",
                //"~/JSLib/jquery-slimscroll/js/jquery.slimscroll.js",
                "~/JSLib/modernizr/js/modernizr.js",
                //"~/JSLib/jquery.mCustomScrollbar.concat.min.js",
                //"~/JSLib/pcoded.min.js",
                //"~/JSLib/vartical-layout.min.js",
                //"~/JSLib/dashboard/custom-dashboard.min.js",
                "~/JSLib/decimal/decimal.js",
                "~/JSLib/mousetip.js",
                //"~/JSLib/script.js",
                //"~/Scripts/bootstrap.js",

                "~/Scripts/moment-with-locales.min.js",
                "~/Scripts/bootstrap-table.min.js",
                "~/Scripts/bootstrap-table-zh-TW.min.js",
                "~/Content/Tabler/dist/js/tabler.min.js",
                "~/Content/Tabler/dist/js/demo.min.js",
                "~/Scripts/Site.js"
            ));

            #endregion Custom Bundles Area
        }
    }
}
