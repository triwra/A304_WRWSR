using BackendWeb.ActionFilter;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.RainModel;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using System.Collections.Generic;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    public class RankingInfoController : Controller
    {
        #region View
        [ActionLog]
        public ActionResult EffectiveStorageRanking()
        {
            //取得下拉選單列表
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.UIReservoirList = Helper.GetAppParamReservoirList("Daily");
            ViewData["PageTitle"] = "歷史同期蓄水量枯旱排名";
            ViewData["Breadcrumb"] = "枯旱排名 > 歷史同期蓄水量枯旱排名";
            return View();
        }

        [ActionLog]
        public ActionResult InflowRankingInfo()
        {
            return View();
        }

        [ActionLog]
        public ActionResult RainfallRanking()
        {
            return View();
        }
        #endregion

        #region 蓄水量排名
        [HttpPost]
        public JsonResult GetReservoirEffectiveStorageRank(string StationNo, string MDDate)
        {
            IEnumerable<EffectiveStorageRankData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetReservoirEffectiveStorageRank(StationNo, MDDate);

            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        #region 集水區累積雨量排名
        [HttpPost]
        public JsonResult GetRealTimeGridCumulativeDailyRainfall(int BoundaryType, string IANo = "01")
        {
            IEnumerable<RealTimeGridCumulativeDailyRainfall> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetRealTimeGridCumulativeDailyRainfall(BoundaryType, IANo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetRealTimeGridCumulativeRangeRainfall(string StartDate, string EndDate, int BoundaryType, string IANo = "01")
        {
            IEnumerable<RealTimeGridCumulativeDailyRainfall> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetRealTimeGridCumulativeRangeRainfall(StartDate, EndDate, BoundaryType, IANo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetRealTimeGridDailyRainfall()
        {
            IEnumerable<GridRainfallValue> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetRealTimeGridDailyRainfall();
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetRealTimeGridRangeRainfall(string StartDate, string EndDate)
        {
            IEnumerable<GridRainfallValue> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetRealTimeGridRangeRainfall(StartDate, EndDate);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 即時雨量
    }

}