using BackendWeb.ActionFilter;
using CSharpIDW;
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
using PiField = DBClassLibrary.UserDomainLayer.ReservoirModel.PiField;
using PiType = DBClassLibrary.UserDomainLayer.ReservoirModel.PiType;
using SummaryType = DBClassLibrary.UserDomainLayer.SummaryType;

namespace BackendWeb.Controllers
{
    public static class DateTimeExtensions
    {
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }
    }
    public class RainfallSituationController : Controller
    {

        #region View
        [ActionLog]
        public ActionResult ReservoirDailyCumulativeRainfall()
        {
            ViewData["PageTitle"] = "日累積雨量查詢";
            return View();
        }

        [ActionLog]
        public ActionResult IrrigationAreaDailyCumulativeRainfall()
        {
            ViewData["PageTitle"] = "日累積雨量查詢";         
            return View();
        }

        [ActionLog]
        public ActionResult StationDailyCumulativeRainfall(string IANo = "01")
        {
            ViewData["PageTitle"] = "日累積雨量查詢";
            ViewBag.IANo = IANo;
            return View();
        }

        [ActionLog]
        public ActionResult CumulativeRainfallWithQ()
        {
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.ReservoirOptList = Helper.GetDataSourceSummaryOptionList(BoundaryType.Reservoir);
            ViewBag.IAOptList = Helper.GetDataSourceSummaryOptionList(BoundaryType.IA);
            ViewBag.WorkStationOptList = Helper.GetDataSourceSummaryOptionList(BoundaryType.WorkStation);
            return View();
        }

        [ActionLog]
        public ActionResult DroughtMonitoring()
        {
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.SPIDataAreaOptionList = Helper.GetSPIDataAreaOptionList();
            ViewBag.SPIDateRangeOptionList = Helper.GetSPIDateRangeOptionList();
            return View();
        }

        [ActionLog]
        public ActionResult ActualEffectiveRainfallAnalysis()
        {
            ViewData["PageTitle"] = "實際有效雨量分析";
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.IAList = Helper.GetIAList();
            ViewBag.SPIDateRangeOptionList = Helper.GetSPIDateRangeOptionList();
            return View();
        }

        [ActionLog]
        public ActionResult FutureRainfallEstimation()
        {
            ViewData["PageTitle"] = "未來兩周累積雨量估計";

            UserInterfaceHelper Helper = new UserInterfaceHelper();
            IEnumerable<GridRainfallForecastDate> DataList = null;
            DataList = Helper.GetGridRainfallForecastDate();



            ViewBag.startDate1 = DataList.ToArray()[0].StartDate.ToString("yyyy-MM-dd");
            ViewBag.endDate1 = DataList.ToArray()[0].EndDate.ToString("yyyy-MM-dd");
            ViewBag.startDate2 = DataList.ToArray()[1].StartDate.ToString("yyyy-MM-dd");
            ViewBag.endDate2 = DataList.ToArray()[1].EndDate.ToString("yyyy-MM-dd");

            return View();
        }

        [ActionLog]
        public ActionResult RainfallRanking()
        {
            ViewData["PageTitle"] = "未來兩周累積雨量估計";

            UserInterfaceHelper Helper = new UserInterfaceHelper();
            //IEnumerable<GridRainfallForecastDate> DataList = null;
            //DataList = Helper.GetGridRainfallForecastDate();
            ViewBag.ReservoirOptList = Helper.GetHasDataReservoirList();
            ViewBag.IAOptList = Helper.GetDataSourceSummaryOptionList(BoundaryType.IA);

            return View();
        }

        #endregion 

        #region 即時雨量(取資料)
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

        #region 累積雨量超越機率(取資料)
        public JsonResult GetUnfTenDaysRainfallData(
            string BoundaryID, string StartDate, string EndDate
            , BoundaryType BoundaryType = BoundaryType.Reservoir
        )
        {
            IEnumerable<GBRHTenDaysRainfallData> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetUnfTenDaysRainfallData(BoundaryID, StartDate, EndDate, BoundaryType);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetTenDaysQData(
            string BoundaryID, int BoundaryType ,
            string  PiField , string PiType,
            int DataStartYear = 1965, int DataEndYear = 2021
            )
        {
            IEnumerable<TenDaysQData> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetTenDaysQData(BoundaryID, BoundaryType, PiField, PiType, DataStartYear, DataEndYear);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetFhyAverageTenDaysRainfallData(string StationNo, int DataStartYear, int DataEndYear)
        {
            IEnumerable<FhyAverageTenDaysRainfall> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetAverageTenDaysRainfallData(StationNo, DataStartYear, DataEndYear);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetGridAverageTenDaysRainfallData(
            string BoundaryID, BoundaryType BoundaryType = BoundaryType.Reservoir,
            SummaryField FieldName = SummaryField.AccumulatedRainfall, SummaryType DataType = SummaryType.TenDays,
            int DataStartYear = 1965, int DataEndYear = 2021
        )
        {
            IEnumerable<GridAverageTenDaysRainfall> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetGridAverageTenDaysRainfallData(BoundaryID, BoundaryType, FieldName, DataType, DataStartYear, DataEndYear);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        #endregion 累積雨量超越機率

        #region 乾旱監測(取資料)
        public JsonResult GetVariableScaleSPIData(string DataArea, string[] value)
        {
            IEnumerable<VariableScaleSPI> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetVariableScaleSPIData(DataArea, value);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion 乾旱監測(取資料)

        #region 實際有效雨量(取資料)
        public JsonResult GetWorkStationActualEffectiveRainfallData(string StartDate, string EndDate, string IANo = "01")
        {
            IEnumerable<ActualEffectiveRainfallData> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetWorkStationActualEffectiveRainfallData(StartDate, EndDate, IANo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        #region 未來兩周雨量
        public JsonResult GetFutureWeekGridRainfall(int afterWeekNum = 1)
        {

            IEnumerable<GridRainfallValue> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetFutureWeekGridRainfall(afterWeekNum);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        #endregion

        #region 歷史同期雨量枯旱排名(Ajax取資料)

        public JsonResult GetDateRangeIAGridRainRankData(
            string BoundaryID, string startDate, string endDate, int dataStartYear = 1000, int dataEndYear = 5000)
        {

            IEnumerable<RainRankData> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetDateRangeIAGridRainRankData(BoundaryID, startDate, endDate, dataStartYear, dataEndYear);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetDateRangeReservoirRainRankData(
            string BoundaryID, string startDate, string endDate, int dataStartYear = 1000, int dataEndYear = 5000)
        {

            IEnumerable<RainRankData> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetDateRangeReservoirRainRankData(BoundaryID, startDate, endDate, dataStartYear, dataEndYear);
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