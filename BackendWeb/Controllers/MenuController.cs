using BackendWeb.Helper;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.MenuModel;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    [Authorize]
    public class MenuController : Controller
    {
        public class MenuFModel
        {
            public string Id { get; set; }
            public string CheckedMenu { get; set; }
        }

        MenuHelper menuHelper;

        public MenuController()
        {
            menuHelper = new MenuHelper();
        }

        // GET: Menu
        public ActionResult Role(string Id)
        {
            string roleName = "我的最愛";

            if (Id != CommonHelper.RoleMenuFavoriteId)
            {
                IdentityRole roleData = CommonHelper.RoleManager.FindById(Id);
                if (roleData == null) return RedirectToAction("Index", "Role");
                roleName = roleData.Name;
            }

            ViewBag.RoleName = roleName;

            var menuList = CommonHelper.CloneAppMenuList(true);
            var rmList = CommonHelper.GetRoleMenuList(Id);

            foreach (var roleMenu in rmList)
            {
                foreach (var menu in menuList.Where(m => m.Id == roleMenu.MenuId)) menu.Checked = true;
            }

            List<List<AppMenu>> groupList = new List<List<AppMenu>>();
            var topList = menuList.Where(m => m.Layer == 1).ToList();
            foreach (AppMenu menu in topList)
            {
                List<AppMenu> group = new List<AppMenu>();

                if (CheckMenuSettable(menu, Id) == true) group.Add(menu);

                GetAllSubMenu(menu, group, Id);

                if (group.Count > 0) groupList.Add(group);
            }

            ViewBag.GroupList = groupList;

            MenuFModel FModel = new MenuFModel();
            FModel.Id = Id;
            FModel.CheckedMenu = string.Empty;

            return View(FModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Role(MenuFModel FModel)
        {
            List<int> rmList = (FModel.CheckedMenu ?? string.Empty).Split(CommonHelper.SeparatorComma, StringSplitOptions.RemoveEmptyEntries).Select(m => Convert.ToInt32(m)).ToList();

            List<RoleMenu> menuList = new List<RoleMenu>();
            foreach (var menuId in rmList)
            {
                RoleMenu menu = new RoleMenu();
                menu.RoleId = FModel.Id;
                menu.MenuId = menuId;

                menuList.Add(menu);
            }

            menuHelper.DeleteRoleMenu(FModel.Id);
            menuHelper.UpdateRoleMenu(menuList);
            CommonHelper.RefreshRoleMenuDict();

            return RedirectToAction("Index", "Role");
        }

        public ActionResult Favorite()
        {
            var userId = User.Identity.GetUserId();

            var menuList = CommonHelper.GetUserMenuSettable(userId, true);
            var umList = menuHelper.GetUserMenuList(userId);
            
            foreach (var userMenu in umList)
            {
                foreach (var menu in menuList.Where(m => m.Id == userMenu.MenuId))
                {
                    menu.Checked = true;
                    menu.Serial = userMenu.Ordinal - 10000;
                }
            }

            ViewBag.MenuList = menuList.OrderBy(m => m.Serial).ToList();

            MenuFModel FModel = new MenuFModel();
            FModel.Id = userId;
            FModel.CheckedMenu = string.Empty;

            return View(FModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Favorite(MenuFModel FModel)
        {
            List<int> umList = (FModel.CheckedMenu ?? string.Empty).Split(CommonHelper.SeparatorComma, StringSplitOptions.RemoveEmptyEntries).Select(m => Convert.ToInt32(m)).ToList();

            int ordinal = 1;
            List<UserMenu> menuList = new List<UserMenu>();
            foreach (var menuId in umList)
            {
                UserMenu menu = new UserMenu();
                menu.UserId = FModel.Id;
                menu.MenuId = menuId;
                menu.Ordinal = ordinal++;

                menuList.Add(menu);
            }

            menuHelper.DeleteUserMenu(FModel.Id);
            menuHelper.UpdateUserMenu(menuList);
            CommonHelper.GetUserMenuHtml(FModel.Id, true);

            TempData["Favorite"] = true;

            return RedirectToAction("Favorite", "Menu");
        }

        protected bool CheckMenuSettable(AppMenu Menu, string RoleId)
        {
            return ((Menu.Type == AppMenuType.Category || Menu.Type == AppMenuType.Function) && (Menu.Authorize == true) && (Menu.Visible == true || RoleId != CommonHelper.RoleMenuFavoriteId));
        }

        protected void GetAllSubMenu(AppMenu Menu, List<AppMenu> Group, string RoleId)
        {
            foreach (AppMenu sub in Menu.SubMenu)
            {
                if (CheckMenuSettable(sub, RoleId) == true) Group.Add(sub);
                GetAllSubMenu(sub, Group, RoleId);
            }
        }
    }
}