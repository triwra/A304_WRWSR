using BackendWeb.ActionFilter;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.RainModel;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using DBClassLibrary.UserDomainLayer.UserInterfaceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static DBClassLibrary.UserDomainLayer.CWBModel.AutomaticStationList;

namespace BackendWeb.Controllers
{
    public class WaterSituationController : Controller
    {
        #region View
        [ActionLog]
        public ActionResult RealtimeReservoirInformation()
        {
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.ReservoirList = Helper.GetHasDataReservoirList();
            ViewBag.ReservoirYearList = Helper.GetHasDataReservoirYearList();
            IEnumerable<SelectOption> DataList = null;
            DataList = Helper.GetAppParamReservoirList("Daily");
            ViewBag.DailyReservoirList = DataList;
            string[] stationArry = DataList.Select(x => x.Value.ToString()).ToArray();
            ViewBag.stationArry = stationArry;
            ViewData["PageTitle"] = "即時水庫水情";
            ViewData["Breadcrumb"] = "水源情勢 > 即時水庫水情 > 即時水庫水情";
            //ViewBag.UIReservoirList = DataList;
            return View();
        }

        [ActionLog]
        public ActionResult SingleReservoirInformation()
        {
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.ReservoirList = Helper.GetHasDataReservoirList();
            ViewBag.ReservoirYearList = Helper.GetHasDataReservoirYearList();
            IEnumerable<SelectOption> DataList = null;
            DataList = Helper.GetAppParamReservoirList("Daily");
            ViewBag.DailyReservoirList = DataList;
            string[] stationArry = DataList.Select(x => x.Value.ToString()).ToArray();
            ViewBag.stationArry = stationArry;
            ViewData["PageTitle"] = "即時水庫水情";
            ViewData["Breadcrumb"] = "水源情勢 > 即時水庫水情 > 即時水庫水情";
            //ViewBag.UIReservoirList = DataList;
            return View();
        }

        [ActionLog]
        public ActionResult ReservoirWaterStorageChart()
        {
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.ReservoirList = Helper.GetHasDataReservoirList();
            ViewBag.ReservoirYearList = Helper.GetHasDataReservoirYearList();
            ViewData["PageTitle"] = "蓄水量歷線圖";
            ViewData["Breadcrumb"] = "水源情勢 > 即時水庫水情 > 蓄水量歷線圖";
            return View();
        }

        [AllowAnonymous]
        public ActionResult DailyIrrigaWaterSituation()
        {
            return View();
        }

        [ActionLog]
        public ActionResult WaterStorageRanking()
        {
            ViewData["PageTitle"] = "蓄水量排名";

            UserInterfaceHelper Helper = new UserInterfaceHelper();
            //IEnumerable<GridRainfallForecastDate> DataList = null;
            //DataList = Helper.GetGridRainfallForecastDate();
            ViewBag.ReservoirOptList = Helper.GetHasDataReservoirList();

            return View();
        }

        [ActionLog]
        public ActionResult InflowRanking()
        {
            ViewData["PageTitle"] = "入流量排名";

            UserInterfaceHelper Helper = new UserInterfaceHelper();
            //IEnumerable<GridRainfallForecastDate> DataList = null;
            //DataList = Helper.GetGridRainfallForecastDate();
            ViewBag.ReservoirOptList = Helper.GetHasDataReservoirList();

            return View();
        }

        #endregion

        #region 即時水庫水情(取資料)
        public JsonResult GetSingleLatestReservoirInfo(string StationNo)
        {
            ReservoirInfoData DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetSingleLatestReservoirInfo(StationNo);

            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetMultiLatestReservoirInfo(string[] StationNo)
        {
            IEnumerable<ReservoirInfoData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetMultiLatestReservoirInfo(StationNo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetSameDayEffectiveStorageData(string StationNo, string MDDate)
        {
            IEnumerable<SameDayEffectiveStorageData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetSameDayEffectiveStorageData(StationNo, MDDate);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 即時水庫水情(取資料)

        #region 蓄水量歷線圖(取資料)
        public JsonResult GetReservoirWaterStorageData(string StationNo, string[] value)
        {
            IEnumerable<ReservoirDataApplicationData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetReservoirDataApplicationData(StationNo, value);

            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetReservoirRuleDay(string StationNo)
        {
            IEnumerable<ReservoirRule> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetReservoirRuleDay(StationNo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 水量歷線圖(取資料)


        #region 2.1.3每日豐枯情勢(DailyIrrigaWaterSituation)
        [AllowAnonymous]
        public JsonResult GetIARainfallAndReservoirSummary(string StationNo, string[] value)
        {
            IEnumerable<IARainfallAndReservoirSummary> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetIARainfallAndReservoirSummary();

            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        #region 歷史同期蓄水量枯旱排名(Ajax取資料)
        public JsonResult GetDateReservoirEffectStorageRankData(
            string BoundaryID, string startDate, string endDate, int dataStartYear = 1000, int dataEndYear = 5000)
        {

            IEnumerable<RainRankData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetDateReservoirEffectStorageRankData(BoundaryID, startDate, dataStartYear, dataEndYear);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion

        #region 歷史同期入庫水量枯旱排名(Ajax取資料)
        public JsonResult GetDateRangeReservoirInflowRankData(
            string BoundaryID, string startDate, string endDate, int dataStartYear = 1000, int dataEndYear = 5000)
        {

            IEnumerable<RainRankData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetDateRangeReservoirInflowRankData(BoundaryID, startDate, endDate, dataStartYear, dataEndYear);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion

    }

}