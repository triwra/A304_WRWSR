using BackendWeb.ActionFilter;
using BackendWeb.Helper;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.DomainLayer.RoleModel;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    [Authorize(Roles = CommonHelper.RoleAdmin)]    
    public class RoleController : Controller
    {
        #region RoleManager

        private ApplicationRoleManager _roleManager;

        public RoleController()
        {
        }

        public RoleController(ApplicationRoleManager roleManager)
        {
            RoleManager = roleManager;
        }

        public ApplicationRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.GetOwinContext().Get<ApplicationRoleManager>();
            }
            private set
            {
                _roleManager = value;
            }
        }

        #endregion RoleManager

        #region 群組/角色管理
        
        /// <summary>
        /// Role 列表
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            IEnumerable<IdentityRole> RoleList = RoleManager.Roles.OrderBy(r => r.Name).ToList();
            return View(RoleList);
        }

        /// <summary>
        /// 新增 Role
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// 新增 Role
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public ActionResult Create(UserRoleData model)
        {
            if (!ModelState.IsValid)
                return View(model);

            model.Name = model.Name?.Trim();

            if (RoleManager.RoleExists(model.Name) == false)
            {
                //角色不存在, 建立角色
                var role = new IdentityRole(model.Name);
                var result = RoleManager.Create(role);

                if (result.Succeeded)
                {
                    CommonHelper.RefreshRoleMenuDict();
                    return RedirectToAction("Index");
                }
            }

            return RedirectToAction("Index");
        }

        /// <summary>
        /// 修改 Role
        /// </summary>
        /// <returns></returns>
        public ActionResult Edit(string Id)
        {
            if (Id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            IdentityRole RoleData = RoleManager.FindById(Id);
            if (RoleData == null)
                return RedirectToAction("Index");

            UserRoleData userRole = new UserRoleData();
            userRole.Id = RoleData.Id;
            userRole.Name = RoleData.Name;

            return View(userRole);
        }

        /// <summary>
        /// 修改 Role
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public ActionResult Edit(UserRoleData model)
        {
            if (!ModelState.IsValid)
                return View(model);

            model.Name = model.Name?.Trim();

            IdentityRole RoleData = RoleManager.FindById(model.Id);
            RoleData.Name = model.Name;

            var result = RoleManager.Update(RoleData);
            if (result.Succeeded)
            {
                return RedirectToAction("Index");
            }

            return RedirectToAction("Index");
        }

        /// <summary>
        /// 刪除 Role
        /// </summary>
        /// <returns></returns>
        public ActionResult Delete(string Id)
        {
            if (Id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            IdentityRole RoleData = RoleManager.FindById(Id);
            if (RoleData == null)
                return RedirectToAction("Index");

            return View(RoleData);
        }

        /// <summary>
        /// 刪除 Role
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public ActionResult Delete(IdentityRole model)
        {            
            if (!ModelState.IsValid)
                return View(model);

            IdentityRole RoleData = RoleManager.FindById(model.Id);
            var result = RoleManager.Delete(RoleData);
            if (result.Succeeded)
            {
                MenuHelper menuHelper = new MenuHelper();
                menuHelper.DeleteRoleMenu(model.Id);
                CommonHelper.RefreshRoleMenuDict();
                return RedirectToAction("Index");
            }

            return RedirectToAction("Index"); ;
        }

        #endregion 群組/角色管理
    }
}