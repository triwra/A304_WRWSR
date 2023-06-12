using BackendWeb.Helper;
using DBClassLibrary.DataAccessLayer;
using DBClassLibrary.DomainLayer.UnitModel;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.ActionLogModel;
using Elmah;
using PagedList;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    /// <summary>
    /// ActionLog 管理
    /// </summary>
    [Authorize]

    public class ActionLogController : Controller
    {
        const int ListPageSize = 15;
        const string QueryOptionKey = "ActionLogBackendQueryOption";
        const string ErrorMsgKey = "ErrorMsg";

        public ActionLogController()
        {

        }

        #region 畫面處理

        /// <summary>
        /// 資料列表管理
        /// </summary>
        /// <returns></returns>
        public ActionResult Index(int page = 0)
        {
            if (page == 0) TempData[QueryOptionKey] = null;

            //若不是第一次顯示, 載入USER的查詢條件
            ContentQueryOption FModel = (ContentQueryOption)TempData[QueryOptionKey];
            //第一次顯示, 指定預設的查詢條件
            if (FModel == null) FModel = GetDefaultContentQueryOption();

            SetViewParam();
            CheckErrorMsg();
            return View(FModel);
        }

        /// <summary>
        /// 處理表單上需要預先取得/繫結的資料
        /// </summary>
        /// <param name="FModel"></param>
        protected void SetViewParam(Guid Id = default(Guid))
        {
            #region 下拉選單
            CommonDataHelper commonhelper = new CommonDataHelper();
            UnitHelper Helper = new UnitHelper();
            IEnumerable<UnitData> UnitList = Helper.GetUnitList();
            ViewBag.UnitList = new SelectList(UnitList, "UnitID", "UnitName");

            #endregion 下拉選單

        }

        #endregion 畫面處理

        #region 資料處理

        /// <summary>
        /// 取得資料列表(被jQuery ajax 呼叫)
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult GetDataList(ContentQueryOption FModel)
        {
            if (!ModelState.IsValid)
                return Json(false);

            if (FModel == null) return new EmptyResult();
            TempData[QueryOptionKey] = FModel;  //查詢條件放在 TempData 供換頁或由新增/修改/返回時使用

            //依查詢條件取得資料
            ActionLogHelper helper = new ActionLogHelper();
            var dataList = helper.GetDataList(FModel);

            return Json(dataList);
        }

        /// <summary>
        /// 處理分頁內容
        /// </summary>
        /// <returns></returns>
        public ActionResult PagedPartial(int page = 0)
        {
            if (page == 0) return new EmptyResult();

            //載入USER的查詢條件
            ContentQueryOption FModel = (ContentQueryOption)TempData[QueryOptionKey];
            TempData[QueryOptionKey] = FModel;  //查詢條件放在 TempData 供換頁或由新增/修改/返回時使用
            if (FModel == null) FModel = GetDefaultContentQueryOption();

            ActionLogHelper helper = new ActionLogHelper();
            var count = helper.GetDataCount(FModel);
            ViewBag.PagerData = new StaticPagedList<string>
                (new List<string>(), FModel.PageIndex, FModel.PageSize, count);

            return PartialView("~/Views/Partial/_PagedAjax.cshtml");
        }

        /// <summary>
        /// 下載資料
        /// </summary>
        /// <returns></returns>
        public ActionResult DownloadData(ContentQueryOption FModel)
        {
            if (!ModelState.IsValid)
                return RedirectToAction("Index");
            //return View(FModel);

            if (FModel == null) return new EmptyResult();
            FModel.PageIndex = 1;    //跳回第一頁
            FModel.PageSize = 100000;
            FModel.FrontEnd = "0";  //來自後台的查詢

            //依查詢條件取得資料
            ActionLogHelper helper = new ActionLogHelper();
            var dataList = helper.GetDataList(FModel);

            string fileName = "存取記錄查詢匯出Template.xlsx";
            string filePath = Path.Combine(Server.MapPath("~/Template"), fileName);

            var workbook = CommonHelper.GetWorkbook(filePath);
            var sheet = workbook.GetSheetAt(0);
            int sourceIndex = 2;
            int index = sourceIndex + 1;
            var rowHeight = sheet.GetRow(sourceIndex).Height;

            foreach (var data in dataList)
            {
                sheet.CopyRow(sourceIndex, index);
                var row = sheet.GetRow(index);

                row.GetCell(0).SetCellValue(data.UpdateTime.ToString("yyyy/MM/dd HH:mm"));
                row.GetCell(1).SetCellValue(data.UnitName);
                row.GetCell(2).SetCellValue(data.UserName);
                row.GetCell(3).SetCellValue(data.Controller);
                row.GetCell(4).SetCellValue(data.Action);
                row.GetCell(5).SetCellValue(data.Content);
                row.GetCell(6).SetCellValue(data.IP);

                index++;
            }

            // 刪除範本列
            sheet.RemoveRow(sheet.GetRow(sourceIndex));
            if (sourceIndex < sheet.LastRowNum) sheet.ShiftRows(sourceIndex + 1, sheet.LastRowNum, -1, true, false);

            MemoryStream ms = new MemoryStream();
            workbook.Write(ms);

            return File(ms.ToArray(), "application/octet-stream",
                string.Format("存取記錄查詢匯出_{0}.xlsx", DateTime.Today.ToString("yyyyMMdd")));
        }

        #endregion 資料處理

        //查詢框的預設值處理
        protected ContentQueryOption GetDefaultContentQueryOption()
        {
            ContentQueryOption queryOption = new ContentQueryOption();
            queryOption.PageIndex = 1;
            queryOption.PageSize = ListPageSize;
            queryOption.FrontEnd = "0";  //來自後台的查詢

            //其他查詢欄位            
            queryOption.UnitID = string.Empty;
            queryOption.StartDate = DateTime.Today.AddDays(-7);
            queryOption.EndDate = DateTime.Today;

            return queryOption;
        }

        /// <summary>
        /// 將 Exception 存入 TempData
        /// </summary>
        /// <param name="Exp"></param>
        protected void ProcessException(Exception Exp)
        {
            ErrorSignal.FromCurrentContext().Raise(Exp);
            TempData[ErrorMsgKey] = new List<string> { string.Format("系統處理異常 ({0}) !", Exp.Message) };
        }

        /// <summary>
        /// 將 Exception 顯示於 ValidationSummary 中
        /// </summary>
        protected void CheckErrorMsg()
        {
            if (TempData[ErrorMsgKey] != null)
            {
                foreach (var error in TempData[ErrorMsgKey] as IEnumerable<string>)
                    ModelState.AddModelError("", error);
                TempData[ErrorMsgKey] = null;
            }
        }
    }
}