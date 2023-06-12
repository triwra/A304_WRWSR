using BackendWeb.ActionFilter;
using BackendWeb.Helper;
using DBClassLibrary.DataAccessLayer;
using DBClassLibrary.DomainLayer.UnitModel;
using DBClassLibrary.DomainLayer.UserModel;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using PagedList;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    [Authorize(Roles = CommonHelper.RoleAdmin)]
    public class UserController : Controller
    {
        public class RegisterFModel
        {
            [Required]
            public string UserId { get; set; }

            [Required]
            public bool Pass { get; set; }
        }

        #region UserManager

        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        private ApplicationRoleManager _roleManager;

        public UserController()
        {
        }

        public UserController(ApplicationUserManager userManager,
            ApplicationSignInManager signInManager,
            ApplicationRoleManager roleManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            RoleManager = roleManager;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
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

        #endregion UserManager

        #region 使用者管理
        /// <summary>
        /// 使用者列表
        /// </summary>
        /// <returns></returns>
        public ActionResult Index(int page = 1, int pageSize = 15)
        {
            UserHelper Helper = new UserHelper();
            IEnumerable<UserData> DataList = Helper.GetUsersList();
            //分頁處理
            var onePageOfList = DataList.OrderBy(x => x.UserName).ToPagedList(page, pageSize);
            return View(onePageOfList);
        }

        /// <summary>
        /// 鎖定帳號使用者列表
        /// </summary>
        /// <returns></returns>
        public ActionResult LockoutList(int page = 1, int pageSize = 15)
        {
            UserHelper Helper = new UserHelper();
            IEnumerable<UserData> DataList = Helper.GetLockoutUsersList(false);
            //分頁處理
            var onePageOfList = DataList.OrderBy(x => x.UserName).ToPagedList(page, pageSize);
            return View(onePageOfList);
        }

        /// <summary>
        /// 修改使用者
        /// </summary>
        /// <returns></returns>
        public ActionResult Edit(string id)
        {
            var user = UserManager.FindById(id);
            if (user == null)
            {
                // 不顯示使用者不存在
                return View("Index");
            }

            #region 下拉選單
            UnitHelper Helper = new UnitHelper();
            IEnumerable<UnitData> UnitList = Helper.GetUnitList();
            TempData["UnitList"] = new SelectList(UnitList, "UnitID", "UnitName").ToList();

            var RoleList = RoleManager.Roles.OrderBy(r => r.Name).ToList();
            TempData["RoleList"] = new SelectList(RoleList, "Name", "Name").ToList();
            #endregion

            UserData data = new UserData();
            data.Id = user.Id;
            data.UserName = user.UserName;
            data.Email = user.Email;
            data.RealName = user.RealName;
            data.SubUnit = user.SubUnit;
            data.PhoneNumber = user.PhoneNumber;
            data.Title = user.Title;

            //設定單位資料
            UserHelper userHelper = new UserHelper();
            var units = userHelper.GetUnits(user.Id);
            data.UnitID = units.Count > 0 ? units[0].UnitID : -1;
            //data.UnitsList = userHelper.GetUnits(user.Id);

            //設定角色資料
            data.RoleName = UserManager.GetRoles(user.Id).FirstOrDefault();
            //data.RolesList = UserManager.GetRoles(user.Id).ToList();

            return View(data);
        }

        /// <summary>
        /// 修改使用者
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public async Task<ActionResult> Edit(UserData model)
        {
            if (!ModelState.IsValid)
                return View(model);

            //修改基本資料
            var user = UserManager.FindById(model.Id);
            user.UserName = model.UserName?.Trim();
            user.RealName = model.RealName?.Trim();
            user.Email = model.Email?.Trim();
            user.PhoneNumber = model.PhoneNumber?.Trim();
            user.SubUnit = model.SubUnit?.Trim();
            user.Title = model.Title?.Trim();

            var result = await UserManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                //設定單位資料                
                UserHelper userHelper = new UserHelper();
                userHelper.AddToUnit(model.Id, model.UnitID);
                //userHelper.AddToUnits(model.Id, model.UnitsList);

                //設定角色資料(先清除已有的角色)
                UserManager.RemoveFromRoles(model.Id, UserManager.GetRoles(model.Id).ToArray());
                if (string.IsNullOrEmpty(model.RoleName) == false) UserManager.AddToRole(model.Id, model.RoleName);
                //UserManager.AddToRoles(model.Id, model.RolesList.ToArray());

                CommonHelper.GetUserMenuHtml(model.Id, true);

                return RedirectToAction("Index");
            }
            AddErrors(result);
            return View(model);
        }

        #endregion 使用者管理

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        #region 鎖定帳號 相關

        /// <summary>
        /// 鎖定帳號
        /// </summary>
        /// <returns></returns>
        public ActionResult LockoutAccount(string id)
        {
            var user = UserManager.FindById(id);
            if (user == null)
            {
                // 不顯示使用者不存在
                return View("Index");
            }

            UserData data = new UserData();
            data.Id = user.Id;
            data.UserName = user.UserName;
            data.Email = user.Email;
            data.RealName = user.RealName;
            return View(data);
        }

        /// <summary>
        /// 鎖定帳號
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public async Task<ActionResult> LockoutAccount(UserData model)
        {
            //鎖定帳號, 解鎖時間設為 DateTime.MaxValue
            var user = UserManager.FindById(model.Id);
            user.LockoutEnabled = true;
            user.LockoutEndDateUtc = DateTime.MaxValue.ToUniversalTime();
            var result = await UserManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return RedirectToAction("Index");
            }
            AddErrors(result);
            return View(model);
        }

        /// <summary>
        /// 解除鎖定帳號
        /// </summary>
        /// <returns></returns>
        public ActionResult UnLockoutAccount(string id)
        {
            var user = UserManager.FindById(id);
            if (user == null)
            {
                // 不顯示使用者不存在
                return View("LockoutList");
            }

            UserData data = new UserData();
            data.Id = user.Id;
            data.UserName = user.UserName;
            data.Email = user.Email;
            data.RealName = user.RealName;            

            return View(data);
        }

        /// <summary>
        /// 解除鎖定帳號
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public async Task<ActionResult> UnLockoutAccount(UserData model)
        {
            //解除鎖定帳號, 解鎖時間設為 DateTime.MaxValue
            var user = UserManager.FindById(model.Id);
            user.LockoutEnabled = true;
            user.LockoutEndDateUtc = DateTime.UtcNow.AddMinutes(-5);
            var result = await UserManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return RedirectToAction("LockoutList");
            }
            AddErrors(result);
            return View(model);
        }

        #endregion 鎖定帳號 相關

        #region 新註冊使用者 相關

        /// <summary>
        /// 新註冊使用者申請列表
        /// </summary>
        /// <returns></returns>
        public ActionResult RegisterList(int page = 1, int pageSize = 15)
        {
            UserHelper Helper = new UserHelper();
            IEnumerable<UserData> DataList = Helper.GetLockoutUsersList(true);
            //分頁處理
            var onePageOfList = DataList.OrderBy(x => x.UserName).ToPagedList(page, pageSize);
            return View(onePageOfList);
        }

        /// <summary>
        /// 審核新註冊使用者申請
        /// </summary>
        /// <param name="FModel"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public async Task<ActionResult> RegisterList(RegisterFModel FModel)
        {
            if (ModelState.IsValid)
            {
                var user = UserManager.FindById(FModel.UserId);
                if (user != null)
                {
                    user.LockoutEnabled = true;
                    user.LockoutEndDateUtc = (FModel.Pass ? (DateTime?)null : DateTime.MaxValue.ToUniversalTime());
                    user.Register = false;
                    var result = await UserManager.UpdateAsync(user);

                    if (result.Succeeded && FModel.Pass) SendRegisterPassNoticeMail(user);
                }
            }

            return RedirectToAction("RegisterList");
        }

        /// <summary>
        /// 發送新註冊使用者申請完成通知Email
        /// </summary>
        /// <param name="user"></param>
        protected void SendRegisterPassNoticeMail(Models.ApplicationUser user)
        {
            try
            {
                string subject = "【管理系統】帳號註冊完成通知";
                string body = "管理系統 帳號註冊完成通知";
                bool isBodyHtml = true;
                StringBuilder template = new StringBuilder();

                string templatePath = Path.Combine(Server.MapPath("~/Template"), "RegisterPassNotice.html");
                if (System.IO.File.Exists(templatePath) == true) template.Append(System.IO.File.ReadAllText(templatePath));

                template.Replace("@RealName@", HttpUtility.HtmlEncode(user.RealName));
                template.Replace("@SiteUrl@", CommonHelper.GetSiteUrl(Url));

                body = template.ToString();

                //SmtpHelper smtpHelper = new SmtpHelper();

                //smtpHelper.SendMail(user.Email, subject, body, isBodyHtml);

            }
            catch (Exception)
            {
                //throw exp;
            }
        }

        #endregion 新註冊使用者 相關
    }
}