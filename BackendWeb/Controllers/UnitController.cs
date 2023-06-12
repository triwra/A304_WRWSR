using BackendWeb.ActionFilter;
using BackendWeb.Helper;
using DBClassLibrary.DataAccessLayer;
using DBClassLibrary.DomainLayer.UnitModel;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    [Authorize(Roles = CommonHelper.RoleAdmin)]
    public class UnitController : Controller
    {
        #region 單位管理

        /// <summary>
        /// 單位 列表
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            UnitHelper Helper = new UnitHelper();
            IEnumerable<UnitData> DataList = Helper.GetUnitList();
            return View(DataList);
        }

        /// <summary>
        /// 新增 單位
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// 新增 單位
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public ActionResult Create(UnitData model)
        {
            if (!ModelState.IsValid)
                return View(model);

            model.UnitNumber = model.UnitNumber?.Trim();
            model.UnitName = model.UnitName?.Trim();

            UnitHelper Helper = new UnitHelper();
            Helper.InsertUnitData(model);
            return RedirectToAction("Index");
        }

        /// <summary>
        /// 修改 單位
        /// </summary>
        /// <returns></returns>
        public ActionResult Edit(string Id)
        {
            if (Id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            UnitHelper Helper = new UnitHelper();
            UnitData ItemData = Helper.GeUnitData(Convert.ToInt32(Id));
            if (ItemData == null)
                return RedirectToAction("Index");

            return View(ItemData);
        }

        /// <summary>
        /// 修改 單位
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public ActionResult Edit(UnitData model)
        {
            if (!ModelState.IsValid)
                return View(model);

            model.UnitNumber = model.UnitNumber?.Trim();
            model.UnitName = model.UnitName?.Trim();

            UnitHelper Helper = new UnitHelper();
            Helper.UpdateUnitData(model);

            return RedirectToAction("Index");
        }

        /// <summary>
        /// 刪除 單位
        /// </summary>
        /// <returns></returns>
        public ActionResult Delete(string Id)
        {
            if (Id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            UnitHelper Helper = new UnitHelper();
            UnitData ItemData = Helper.GeUnitData(Convert.ToInt32(Id));
            if (ItemData == null)
                return RedirectToAction("Index");

            return View(ItemData);
        }

        /// <summary>
        /// 刪除 單位
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ActionLog]
        public ActionResult Delete(UnitData model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return View(model);
                UnitHelper Helper = new UnitHelper();
                Helper.DelUnitData(model.UnitID);

                return RedirectToAction("Index"); ;

            }
            catch (Exception e)
            {
                ModelState.AddModelError("", e.Message);
            }

            return View(model);
        }

        #endregion 單位管理
    }
}