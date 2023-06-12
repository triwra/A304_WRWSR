using DBClassLibrary.DataAccessLayer;
using DBClassLibrary.DomainLayer.UnitModel;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.CommonDataModel;
using DBClassLibrary.UserDomainLayer.MenuModel;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace BackendWeb.Helper
{
    static public class CommonHelper
    {
        static ObjectCache AppCache = MemoryCache.Default;
        static public char[] SeparatorComma = { ',' };
        static public string[] FileExtsPDF = new string[] { ".pdf" };
        static public string[] FileExtsExcel = new string[] { ".xls", ".xlsx" };
        static public string[] FileExtsWord = new string[] { ".doc", ".docx" };
        static public string[] FileExtsImage = new string[] { ".jpg", ".gif", ".png" };
        static public string[] FileExtsODS = new string[] { ".ods" };
        static public string[] FileExtsPPT = new string[] { ".pptx", ".ppsx", };
        public const string FileTypePDF = ".pdf";
        public const string FileTypeExcel = ".xls, .xlsx";
        public const string FileTypeWord = ".doc, .docx";
        public const string FileTypeImage = ".jpg, .gif, .png";
        public const string FileTypeODS = ".ods";
        public const string FileTypePPT = ".pptx, .ppsx";
        public const string RoleAdmin = "Admin";
        public const string RoleSuper = "Super";
        public const string RoleNone = "";
        public const string RoleQueryUser = "QueryUser";
        public const string RoleMenuFavoriteId = "00000000-0000-0000-0000-000000000000";

        #region UserManager

        static public ApplicationUserManager UserManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
        }

        static public ApplicationSignInManager SignInManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>();
            }
        }

        static public ApplicationRoleManager RoleManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();
            }
        }

        #endregion UserManager

        static public List<AppParam> GetAppParam()
        {
            string key = "AppParam";
            List<AppParam> paramList = null;
            lock (AppCache)
            {
                paramList = AppCache[key] as List<AppParam>;
                if (paramList == null)
                {
                    CommonDataHelper helper = new CommonDataHelper();
                    paramList = helper.GetAppParam();

                    CacheItemPolicy policy = new CacheItemPolicy();
                    policy.AbsoluteExpiration = new DateTimeOffset(DateTime.Now.AddMinutes(10));
                    AppCache.Set(key, paramList, policy);
                }
            }

            return paramList;
        }

        static public List<AppParam> GetAppParam(string Category, string Type)
        {
            var paramList = GetAppParam();
            return paramList.Where(p => p.Category == Category && p.Type == Type)
                .Select(p => p.Clone()).ToList();
        }

        static public AppParam GetAppParam(string Category, string Type, string Name)
        {
            var paramList = GetAppParam();
            return paramList.Where(p => p.Category == Category && p.Type == Type && p.Name == Name)
                .FirstOrDefault()?.Clone();
        }

        static public bool CheckFileExtension(string FileName, string[] FileExts)
        {
            return FileExts.Contains(Path.GetExtension(FileName).ToLower());
        }

        static public void CheckFileNameValid(string filename)
        {
            if (filename == null)
                throw new ArgumentNullException();

            if (filename.Length == 0)
                throw new ArgumentException("沒有檔案名稱!");

            if (filename.Length > 100)
                throw new PathTooLongException("檔案名稱的長度過長! 請小於100個字元.");

            string newFileName = filename;
            foreach (char c in System.IO.Path.GetInvalidFileNameChars())
            {
                newFileName = filename.Replace(c, '_');
            }
            if (newFileName != filename)
                throw new ArgumentException("包含檔案名稱中不允許的字元!");
        }

        static public string MakeFileNameValid(string filename)
        {
            if (filename == null)
                throw new ArgumentNullException();

            if (filename.EndsWith("."))
                filename = Regex.Replace(filename, @"\.+$", "");

            if (filename.Length == 0)
                throw new ArgumentException();

            if (filename.Length > 245)
                throw new PathTooLongException();

            foreach (char c in System.IO.Path.GetInvalidFileNameChars())
            {
                filename = filename.Replace(c, '_');
            }

            return filename;
        }

        static public string MakeFolderNameValid(string foldername)
        {
            if (foldername == null)
                throw new ArgumentNullException();

            if (foldername.EndsWith("."))
                foldername = Regex.Replace(foldername, @"\.+$", "");

            if (foldername.Length == 0)
                throw new ArgumentException();

            if (foldername.Length > 245)
                throw new PathTooLongException();

            foreach (char c in System.IO.Path.GetInvalidPathChars())
            {
                foldername = foldername.Replace(c, '_');
            }

            return foldername;
        }

        static public string GetSiteUrl(UrlHelper Url)
        {
            return string.Format("{0}://{1}{2}", HttpContext.Current.Request.Url.Scheme, HttpContext.Current.Request.Url.Authority, Url.Content("~"));
        }

        static public List<string> GetRoleUsers(string RoleName)
        {
            return RoleManager.FindByName(RoleName).Users.Select(u => u.UserId).ToList();
        }

        static public string GetUserUnitNumber(string UserId)
        {
            UserHelper userHelper = new UserHelper();

            return userHelper.GetUnits(UserId).First().UnitNumber;
        }

        static public bool CheckSuperUserByRole(string Role)
        {
            return Role == CommonHelper.RoleAdmin || Role == CommonHelper.RoleSuper;
        }

        static public bool CheckSuperUser(string UserId)
        {
            string roleName = UserManager.GetRoles(UserId).FirstOrDefault();

            return CheckSuperUserByRole(roleName);
        }

        static public string GetUserRealNameById(string UserId)
        {
            CommonDataHelper Helper = new CommonDataHelper();
            return Helper.GetUserRealNameById(UserId);
        }

        #region 選單管理相關

        static public void RefreshAppMenuList()
        {
            GetAppMenuList(true);
        }

        static public List<AppMenu> GetAppMenuList(bool Refresh = false)
        {
            string key = "A304_WRWSR_AppMenuList";
            List<AppMenu> menuList = null;
            lock (AppCache)
            {
                menuList = AppCache[key] as List<AppMenu>;
                if ((Refresh == true) || (menuList == null))
                {
                    MenuHelper menuHelper = new MenuHelper();
                    menuList = menuHelper.GetAppMenuList();

                    CacheItemPolicy policy = new CacheItemPolicy();
                    policy.AbsoluteExpiration = new DateTimeOffset(DateTime.Now.AddHours(1));
                    AppCache.Set(key, menuList, policy);
                }
            }

            return menuList;
        }

        static public List<AppMenu> CloneAppMenuList(bool Refresh = false)
        {
            List<AppMenu> menuList = new List<AppMenu>();

            foreach (AppMenu menu in GetAppMenuList(Refresh)) menuList.Add(menu.Clone());

            MenuHelper menuHelper = new MenuHelper();
            menuHelper.ReorganizeAppMenuList(menuList);

            return menuList;
        }

        static public void RefreshRoleMenuDict()
        {
            GetRoleMenuDict(true);
            RefreshRoleMenuHtmlDict();
            RefreshUserMenuHtmlDict();
        }

        static public Dictionary<string, List<RoleMenu>> GetRoleMenuDict(bool Refresh = false)
        {
            string key = "RoleMenuDict";
            Dictionary<string, List<RoleMenu>> dict = null;
            lock (AppCache)
            {
                dict = AppCache[key] as Dictionary<string, List<RoleMenu>>;
                if ((Refresh == true) || (dict == null))
                {
                    MenuHelper menuHelper = new MenuHelper();
                    dict = new Dictionary<string, List<RoleMenu>>();
                    foreach (var role in RoleManager.Roles.ToList()) dict.Add(role.Id, menuHelper.GetRoleMenuList(role.Id));
                    dict.Add(RoleMenuFavoriteId, menuHelper.GetRoleMenuList(RoleMenuFavoriteId));

                    CacheItemPolicy policy = new CacheItemPolicy();
                    policy.AbsoluteExpiration = new DateTimeOffset(DateTime.Now.AddHours(1));
                    AppCache.Set(key, dict, policy);
                }
            }

            return dict;
        }

        static public List<RoleMenu> GetRoleMenuList(string RoleId, bool Refresh = false)
        {
            List<RoleMenu> rmList = null;
            return GetRoleMenuDict(Refresh).TryGetValue(RoleId, out rmList) ? rmList : new List<RoleMenu>();
        }

        static public void RefreshRoleMenuHtmlDict()
        {
            GetRoleMenuHtmlDict(true);
        }

        static public Dictionary<string, string> GetRoleMenuHtmlDict(bool Refresh = false)
        {
            string key = "RoleMenuHtmlDict";
            Dictionary<string, string> dict = null;
            lock (AppCache)
            {
                //GenerateMenudict = AppCache[key] as Dictionary<string, string>;
                if ((Refresh == true) || (dict == null))
                {
                    dict = new Dictionary<string, string>();
                    foreach (var role in RoleManager.Roles.ToList()) dict.Add(role.Id, GenerateRoleMenu(role));
                    dict.Add(RoleNone, GenerateRoleMenu(null));

                    CacheItemPolicy policy = new CacheItemPolicy();
                    policy.AbsoluteExpiration = new DateTimeOffset(DateTime.Now.AddHours(1));
                    AppCache.Set(key, dict, policy);
                }
            }

            return dict;
        }

        static public string GetRoleMenuHtml(string RoleId, bool Refresh = false)
        {
            string menuHtml = null;
            return GetRoleMenuHtmlDict(Refresh).TryGetValue(RoleId, out menuHtml) ? menuHtml : string.Empty;
        }

        static public string GenerateRoleMenu(IdentityRole Role)
        {
            StringBuilder menuHtml = new StringBuilder();

            var menuList = CloneAppMenuList();

            var rmList = GetRoleMenuList(Role == null ? string.Empty : Role.Id);

            //標記有權限的功能
            foreach (var menu in menuList)
            {
                menu.Checked = ((Role != null && Role.Name == RoleAdmin) ||
                    menu.Authorize == false || rmList.Exists(m => m.MenuId == menu.Id));
            }
            var topList = menuList.Where(m => m.Layer == 1).ToList();
            CheckMenuList(topList); //移除沒有權限的功能
            GenerateMenu(topList, menuHtml, false);

            return menuHtml.ToString();
        }

        static public void CheckMenuList(List<AppMenu> menuList)
        {
            AppMenuType nextType = AppMenuType.Divider;

            for (int i = menuList.Count - 1; i >= 0; i--)
            {
                var menu = menuList[i];
                if (menu.Visible == false)
                {
                    menuList.RemoveAt(i);
                    continue;
                }

                switch (menu.Type)
                {
                    case AppMenuType.Category:
                        CheckMenuList(menu.SubMenu);
                        if (menu.SubMenu.Count == 0)
                            menuList.RemoveAt(i);
                        else
                            nextType = menu.Type;
                        break;
                    case AppMenuType.Function:
                        if (menu.Checked == false)
                            menuList.RemoveAt(i);
                        else
                            nextType = menu.Type;
                        break;
                    case AppMenuType.Header:
                        CheckMenuList(menu.SubMenu);
                        if (menu.SubMenu.Count == 0)
                            menuList.RemoveAt(i);
                        else
                            nextType = menu.Type;
                        break;
                    case AppMenuType.Divider:
                        if (nextType == AppMenuType.Divider)
                            menuList.RemoveAt(i);
                        else
                            nextType = menu.Type;
                        break;
                    default:
                        break;
                }
            }

            if ((menuList.Count > 0) && (menuList[0].Type == AppMenuType.Divider)) menuList.RemoveAt(0);
        }

        /*****
         * 生成選單Html
         * **/
        static public void GenerateMenu(List<AppMenu> menuList, StringBuilder menuHtml, bool re)
        {
            UrlHelper url = new UrlHelper(HttpContext.Current.Request.RequestContext);

            if (!re)
            {
                menuHtml.AppendFormat("<ul class='navbar-nav'>");
            }
            foreach (var menu in menuList)
            {
                switch (menu.Type)
                {
                    case AppMenuType.Function:
                        if (menu.Visible == true)
                        {
                            if (menu.Enabled == true)
                            {
                                menuHtml.AppendFormat("<a class='dropdown-item' href='{0}'> \r\n", url.Action(menu.Action, menu.Controller));
                                if (string.IsNullOrWhiteSpace(menu.Glyphicon) == false && menu.Layer != 3)
                                    menuHtml.AppendFormat("<i class='{0}'>&nbsp;</i>", menu.Glyphicon);
                                menuHtml.AppendFormat("{0}</a> \r\n", menu.Label);
                            }
                            else
                            {
                                menuHtml.AppendFormat("<a class='disabled dropdown-item'  href=''> \r\n");
                                if (string.IsNullOrWhiteSpace(menu.Glyphicon) == false && menu.Layer != 3)
                                    menuHtml.AppendFormat("<i class='{0}'>&nbsp;</i>", menu.Glyphicon);
                                menuHtml.AppendFormat("{0}</a> \r\n", menu.Label);
                            }
                        }
                        else { }
                        break;
                    case AppMenuType.Category:
                        if ((SubMenuDispType)menu.SubMenuDispType == SubMenuDispType.TextDivider)
                        {
                            menuHtml.AppendFormat("<li class='dropdown'> \r\n");
                            menuHtml.AppendFormat("  <a class='dropdown-toggle' role='button' aria-expanded='false' href='#' data-toggle='dropdown'> \r\n");
                            if (string.IsNullOrWhiteSpace(menu.Glyphicon) == false)
                                menuHtml.AppendFormat("    <span class='glyphicon {0}' aria-hidden='true'></span> \r\n", menu.Glyphicon);
                            menuHtml.AppendFormat("    {0}<span class='caret'></span> \r\n", menu.Label);
                            menuHtml.AppendFormat("  </a> \r\n");
                            menuHtml.AppendFormat("  <ul class='dropdown-menu' role='menu'> \r\n");
                            //GenerateMenu(menu.SubMenu, menuHtml);
                            menuHtml.AppendFormat("  </ul> \r\n");
                            menuHtml.AppendFormat("</li> \r\n");
                        }
                        else if ((SubMenuDispType)menu.SubMenuDispType == SubMenuDispType.Collapse)
                        {
                            menuHtml.AppendFormat("<div class='menu-collapse'> \r\n");
                            menuHtml.AppendFormat("<a class='dropdown-item dropdown-toggle collapsed' data-bs-toggle='collapse' data-bs-target='#collapseManu-{1}-{2}' aria-expanded='false' aria-controls='collapseWidthExample'>{0}</a>\r\n", menu.Label, menu.Layer, menu.Ordinal);
                            menuHtml.AppendFormat("	<div style=''> \r\n");
                            menuHtml.AppendFormat("	<div class='collapse' id='collapseManu-{0}-{1}' style=''> \r\n", menu.Layer, menu.Ordinal);
                            menuHtml.AppendFormat("<div data-bs-popper='static'> \r\n");
                            GenerateMenu(menu.SubMenu, menuHtml, true);
                            menuHtml.AppendFormat("</div> \r\n");
                            menuHtml.AppendFormat("</div> \r\n");
                            menuHtml.AppendFormat("</div> \r\n");
                            menuHtml.AppendFormat("</div> \r\n");
                        }
                        else if ((SubMenuDispType)menu.SubMenuDispType == SubMenuDispType.Droperd)
                        {
                            menuHtml.AppendFormat("<div class='dropend'> \r\n");

                            menuHtml.AppendFormat("<a class='dropdown-item dropdown-toggle' data-bs-toggle='dropdown' data-bs-auto-close='outside' role='button' aria-expanded='false'>\r\n");
                            if (menu.Glyphicon != null && menu.Glyphicon != "")
                            {
                                menuHtml.AppendFormat("<i class='{0}'></i>&nbsp;\r\n", menu.Glyphicon);
                            }
                            //menuHtml.AppendFormat("<span class='nav-link-title'>{0}</span>\r\n", menu.Label);
                            menuHtml.AppendFormat("<span class=''>{0}</span>\r\n", menu.Label);
                            menuHtml.AppendFormat("</a>\r\n");
                            //menuHtml.AppendFormat("<a class='dropdown-item dropdown-toggle' data-bs-toggle='dropdown' data-bs-auto-close='outside' role='button' aria-expanded='false'>{0}</a>\r\n", menu.Label);

                            menuHtml.AppendFormat("<div class='dropdown-menu'> \r\n");
                            GenerateMenu(menu.SubMenu, menuHtml, true);
                            menuHtml.AppendFormat("</div> \r\n");
                            menuHtml.AppendFormat("</div> \r\n");
                        }
                        else
                        {   //未設定就採用 SubMenuDispType.Droperd
                            // menuHtml.AppendFormat("<span class='divider'></span> \r\n");
                            menuHtml.AppendFormat("<div> \r\n");
                            menuHtml.AppendFormat("<span class='dropdown-header' style=''>{0}</span> \r\n", menu.Label);
                            GenerateMenu(menu.SubMenu, menuHtml, true);
                            menuHtml.AppendFormat("</div> \r\n");
                            menuHtml.AppendFormat("<hr style='margin: 0;color: #cccbcb;'> \r\n");
                        }
                        break;
                    case AppMenuType.Header:
                        menuHtml.AppendFormat("<li id='MenuID{0}' class='nav-item dropdown'>\r\n", menu.Id);
                        menuHtml.AppendFormat("<a class='nav-link dropdown-toggle' href='#navbar-help' data-bs-toggle='dropdown' data-bs-auto-close='outside' role='button' aria-expanded='false'>\r\n");
                        if (menu.Glyphicon != null && menu.Glyphicon != "")
                        {
                            menuHtml.AppendFormat("<span class='nav-link-title d-md-none d-lg-inline-block'>\r\n");
                            menuHtml.AppendFormat("<i class='{0}'></i>&nbsp;\r\n", menu.Glyphicon);
                            menuHtml.AppendFormat("</span>\r\n");
                        }
                        menuHtml.AppendFormat("<span class='nav-link-title'>{0}</span>\r\n", menu.Label);
                        menuHtml.AppendFormat("</a>\r\n");


                        menuHtml.AppendFormat("	<div class='dropdown-menu'> \r\n");
                        GenerateMenu(menu.SubMenu, menuHtml, true);
                        menuHtml.AppendFormat("</div>\r\n");
                        menuHtml.AppendFormat("</li>\r\n");
                        break;
                    case AppMenuType.Divider:
                        //menuHtml.AppendFormat("<li class='divider'></li> \r\n");
                        break;
                    default:
                        break;
                }
            }
            if (!re)
            {
                menuHtml.AppendFormat("</ul> \r\n");
            }
        }

        static public string GetRoleMenuHtmlByUser(string UserId)
        {
            string roleId = RoleNone;

            if (string.IsNullOrWhiteSpace(UserId) == false)
            {
                string roleName = UserManager.GetRoles(UserId).FirstOrDefault();
                if (string.IsNullOrWhiteSpace(roleName) == false)
                {
                    var role = RoleManager.FindByName(roleName);
                    if (role != null) roleId = role.Id;
                }
            }

            return GetRoleMenuHtml(roleId);
        }

        /// <summary>
        /// 回傳 Action 的根節點編號
        /// </summary>
        /// <param name="ActionName"></param>
        /// <param name="ControllerName"></param>
        /// <returns></returns>
        static public int GetActionRootMenuID(string ControllerName, string ActionName)
        {
            List<AppMenu> menuList = CloneAppMenuList();
            var actionMenu = menuList.Where(m => m.Action == ActionName && m.Controller == ControllerName).FirstOrDefault();

            //檢查是否有此功能
            if ((actionMenu == null)) return 0;

            //查找上一層選單, 直到根目錄
            while (actionMenu.Parent != 0)
            {
                actionMenu = menuList.Where(m => m.Id == actionMenu.Parent).FirstOrDefault();
            }

            if (actionMenu.Parent == 0)
                return actionMenu.Id;
            else
                return 0;
        }

        /// <summary>
        /// 回傳目前選單的資料
        /// </summary>
        /// <param name="ActionName"></param>
        /// <param name="ControllerName"></param>
        /// <returns></returns>
        static public AppMenu GetActionAppMenuData(string ControllerName, string ActionName)
        {
            List<AppMenu> menuList = CloneAppMenuList();
            var actionMenu = menuList.Where(m => m.Action == ActionName && m.Controller == ControllerName).FirstOrDefault();

            return actionMenu;
        }

        static public void RefreshUserMenuHtmlDict()
        {
            GetUserMenuHtmlDict(true);
        }

        static public Dictionary<string, string> GetUserMenuHtmlDict(bool Refresh = false)
        {
            string key = "UserMenuHtmlDict";
            Dictionary<string, string> dict = null;
            lock (AppCache)
            {
                dict = AppCache[key] as Dictionary<string, string>;
                if ((Refresh == true) || (dict == null))
                {
                    dict = new Dictionary<string, string>();

                    CacheItemPolicy policy = new CacheItemPolicy();
                    policy.AbsoluteExpiration = new DateTimeOffset(DateTime.Now.AddHours(1));
                    AppCache.Set(key, dict, policy);
                }
            }

            return dict;
        }

        static public string GetUserMenuHtml(string UserId, bool Refresh = false)
        {
            var dict = GetUserMenuHtmlDict();
            string menuHtml = null;
            lock (dict)
            {
                if ((Refresh == true) || (dict.TryGetValue(UserId, out menuHtml) == false))
                {
                    menuHtml = GenerateUserMenuHtml(UserId);
                    dict[UserId] = menuHtml;
                }
            }

            return menuHtml;
        }

        static public string GenerateUserMenuHtml(string UserId)
        {
            MenuHelper menuHelper = new MenuHelper();
            UrlHelper url = new UrlHelper(HttpContext.Current.Request.RequestContext);
            StringBuilder menuHtml = new StringBuilder();

            var menuList = GetUserMenuSettable(UserId);
            var umList = menuHelper.GetUserMenuList(UserId);

            foreach (var userMenu in umList)
            {
                foreach (var menu in menuList.Where(m => m.Id == userMenu.MenuId))
                {
                    if (menu.Enabled == true)
                        menuHtml.AppendFormat("<li><a href='{0}'>{1}</a></li> \r\n", url.Action(menu.Action, menu.Controller), menu.Label);
                    else
                        menuHtml.AppendFormat("<li class='disabled'><a href='{0}'>{1}</a></li> \r\n", "#", menu.Label);
                }
            }

            return menuHtml.ToString();
        }

        static public List<AppMenu> GetUserMenuSettable(string UserId, bool Refresh = false)
        {
            var menuList = CloneAppMenuList(Refresh);
            var fmList = GetRoleMenuList(CommonHelper.RoleMenuFavoriteId);
            List<RoleMenu> rmList = new List<RoleMenu>();

            string roleName = UserManager.GetRoles(UserId).FirstOrDefault();
            if (string.IsNullOrWhiteSpace(roleName) == false)
            {
                var role = RoleManager.FindByName(roleName);
                if (role != null) rmList = GetRoleMenuList(role.Id);
            }

            menuList = menuList.Where(m => (m.Authorize == false) || (fmList.Exists(f => f.MenuId == m.Id) && (roleName == RoleAdmin || rmList.Exists(r => r.MenuId == m.Id)))).ToList();

            return menuList;
        }

        /// <summary>
        /// 檢查使用者是否有執行此功能的權限
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="ActionName"></param>
        /// <param name="ControllerName"></param>
        /// <returns></returns>
        static public bool CheckActionAuthorization(
            string UserId, string ActionName, string ControllerName)
        {
            var menuList = GetAppMenuList();
            var actionMenu = menuList.Where(m => m.Action == ActionName && m.Controller == ControllerName).FirstOrDefault();

            //檢查此功能是否需要權限檢查, 如果沒有在 GetAppMenuList 裡或標為不需 Authorize, 視為不用檢查權限
            if ((actionMenu == null) || (actionMenu.Authorize == false)) return true;

            //取得使用者所屬的群組名稱
            if (string.IsNullOrWhiteSpace(UserId) == true) return false;

            string roleName = UserManager.GetRoles(UserId).FirstOrDefault();

            if (string.IsNullOrWhiteSpace(roleName) == true) return false;

            //如果是系統管理的群組
            if (roleName == RoleAdmin) return true;

            var role = RoleManager.FindByName(roleName);

            if (role == null) return false;

            //取得該群組可使用的功能列表
            var rmList = GetRoleMenuList(role.Id);
            //比對是否有權限
            if (rmList.Exists(m => m.MenuId == actionMenu.Id) == false) return false;

            return true;
        }

        /// <summary>
        /// 取得導覽列選單的HTML內容
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="action"></param>
        /// <returns></returns>
        static public string GetBreadcrumbsHtml(string controller, string action, string QueryString)
        {
            //string EncodeQueryString = HttpUtility.UrlPathEncode(QueryString);
            StringBuilder html = new StringBuilder();
            if (controller != "Account")
            {
                string menuHtml = BuildBreadcrumbsHtml(html, controller, action);
            }
            return html.ToString();
        }

        /// <summary>
        /// 產生導覽列選單的HTML內容
        /// </summary>
        /// <param name="html"></param>
        /// <param name="controller"></param>
        /// <param name="action"></param>
        /// <returns></returns>
        static public string BuildBreadcrumbsHtml(StringBuilder html, string controller, string action)
        {
            List<AppMenu> menuList = CloneAppMenuList();
            List<AppMenu> temp = new List<AppMenu>();
            temp = menuList.Where(x => x.Controller == controller && x.Action == action).ToList();
            if (temp.Count != 0)
            {
                AppMenu leafNode = temp[0];
                List<AppMenu> breadcrumbs = new List<AppMenu>();
                //依選單的階層加入名單中
                do
                {
                    breadcrumbs.Add(leafNode);
                    //尋找是否還有上一層的選單
                    temp = menuList.Where(x => x.Id == leafNode.Parent).ToList();
                    if (temp.Count != 0)
                        leafNode = temp.Where(x => x.Id == leafNode.Parent).ToList()[0];
                } while (temp.Count != 0);

                breadcrumbs.Reverse();  //把選單內容反向排序, 因為是從最下層加入的

                html.Append("<span>");
                foreach (AppMenu e in breadcrumbs)
                {
                    html.Append(e.Label);
                    if (breadcrumbs.IndexOf(e) != breadcrumbs.Count - 1)
                        html.Append(" " + "＞" + " ");
                }
                html.Append("</span>");

                return html.ToString();
            }
            else { return ""; }
        }

        #endregion 選單管理相關

        #region Excel 相關

        static public IWorkbook GetWorkbook(HttpPostedFileBase File)
        {
            // 若把 InputStream 直接給 NPOI WorkbookFactory 讀取, 會導致 InputStream 被清空, 後續存檔作業會無法完成,
            // 所以須另建 MemoryStream 給 NPOI WorkbookFactory 讀取, 以避免此問題

            byte[] buffer = new byte[File.ContentLength];
            File.InputStream.Read(buffer, 0, File.ContentLength);

            MemoryStream ms = new MemoryStream(buffer);

            return WorkbookFactory.Create(ms);
        }

        static public XSSFWorkbook GetWorkbook(string FilePath)
        {
            XSSFWorkbook workbook;
            using (FileStream file = new FileStream(FilePath, FileMode.Open, FileAccess.Read))
            {
                workbook = new XSSFWorkbook(file);
            }

            return workbook;
        }

        static public void SetCellNumericValue(NPOI.SS.UserModel.ICell Cell, decimal? Value)
        {
            if (Value == null)
                Cell.SetCellValue((string)null);
            else
                Cell.SetCellValue((double)Value);
        }

        static public void SetCellDateTimeValue(NPOI.SS.UserModel.ICell Cell, DateTime? Value)
        {
            if (Value == null)
                Cell.SetCellValue((string)null);
            else
                Cell.SetCellValue((DateTime)Value);
        }

        #endregion Excel 相關

        #region 匯入相關

        static public List<UnitData> GetManageUnitList(string UserId, bool All = false)
        {
            UnitHelper unitHelper = new UnitHelper();
            var units = unitHelper.GetUnitList().ToList();

            string roleName = UserManager.GetRoles(UserId).FirstOrDefault();

            if (All == false && CheckSuperUserByRole(roleName) == false)
            {
                UserHelper userHelper = new UserHelper();
                var unit = userHelper.GetUnits(UserId).FirstOrDefault();
                units = units.Where(u => u.UnitID == unit.UnitID).ToList();
            }

            return units;
        }

        static public bool CheckNumeric(string Value)
        {
            foreach (char c in Value)
            {
                if (c < '0' || c > '9') return false;
            }

            return true;
        }

        static public int? CheckImportInt(string Value)
        {
            int number = 0;

            return int.TryParse(Value, out number) ? number : (int?)null;
        }

        static public decimal? CheckImportDecimal(string Value)
        {
            decimal number = 0;

            return decimal.TryParse(Value, out number) ? number : (decimal?)null;
        }

        static public DateTime? CheckImportDateTime(string Value)
        {
            DateTime dt;

            return DateTime.TryParse(Value, out dt) ? dt : (DateTime?)null;
        }

        static public string CheckImportDataByValue(string Value, List<AppParam> DataList)
        {
            var data = DataList.Where(d => d.Value == Value).FirstOrDefault();

            return data == null ? null : data.Value;
        }

        static public string CheckImportDataByLabel(string Value, List<AppParam> DataList)
        {
            var data = DataList.Where(d => d.Label == Value).FirstOrDefault();

            return data == null ? null : data.Value;
        }

        static public string CheckImportDataMultiple(string Value, List<AppParam> DataList)
        {
            List<string> result = new List<string>();

            foreach (var data in DataList)
            {
                if (Value.Contains(data.Label) == true) result.Add(data.Value);
            }

            return result.Count == 0 ? null : string.Join(string.Empty, result);
        }

        /// <summary>
        /// 以單位名稱查 UnitID
        /// </summary>
        /// <param name="UnitName"></param>
        /// <param name="UnitList"></param>
        /// <returns></returns>
        static public int CheckImportUnit(string UnitName, List<UnitData> UnitList)
        {
            var unit = UnitList.Where(u => u.UnitName == UnitName).FirstOrDefault();

            return unit == null ? 10 : unit.UnitID;
        }

        #endregion 匯入相關

        #region ActionLog 相關

        /// <summary>
        /// 用來新增 Log 訊息到 ActionLog 中
        /// </summary>
        /// <param name="message"></param>
        static public void LogInfo(string message, string userid = null)
        {
            //string userid = user != null ? user.Id : "";
            string controller = HttpContext.Current.Request.RequestContext.RouteData.Values["controller"].ToString();
            string action = HttpContext.Current.Request.RequestContext.RouteData.Values["action"].ToString();
            //Azure WAF服務使用 HTTP_X_FORWARDED_FOR 的方式獲取客戶端的真實IP地址。
            //Azure WAF服務還支持使用 HTTP_X_REAL_IP 變量，獲取客戶的來源IP
            //（使用過程中考慮了後面經過的多層反向代理對該變量的修改）。
            string ip = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (ip == null)
                ip = HttpContext.Current.Request.UserHostAddress;

            var log = new ActionLog()
            {
                UserId = userid,
                Controller = controller,
                Action = action,
                Parameters = message,
                IP = ip,
                UpdateTime = DateTime.Now
            };

            CommonDataHelper cdHelper = new CommonDataHelper();
            cdHelper.AddActionLog(log);

        }

        /// <summary>
        /// 用來新增 Log 訊息到 ActionLog 中
        /// </summary>
        /// <param name="message"></param>
        /// <param name="userid"></param>
        static public void LogInfo(object message, string userid = null)
        {
            //string userid = user != null ? user.Id : "";
            string controller = HttpContext.Current.Request.RequestContext.RouteData.Values["controller"].ToString();
            string action = HttpContext.Current.Request.RequestContext.RouteData.Values["action"].ToString();
            string ip = HttpContext.Current.Request.UserHostAddress;

            string parameters = JsonConvert.SerializeObject(message, new JsonSerializerSettings()
            {
                ContractResolver = new ReadablePropertiesResolver()
            });


            var log = new ActionLog()
            {
                UserId = userid,
                Controller = controller,
                Action = action,
                Parameters = parameters,
                IP = ip,
                UpdateTime = DateTime.Now
            };

            CommonDataHelper cdHelper = new CommonDataHelper();
            cdHelper.AddActionLog(log);

        }

        #endregion ActionLog 相關


    }
}