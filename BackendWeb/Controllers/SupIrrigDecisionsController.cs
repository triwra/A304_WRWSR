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
using static DBClassLibrary.UserDomainLayer.IrrigationPlanModel;

namespace BackendWeb.Controllers
{
    public class SupIrrigDecisionsController : Controller
    {
        // GET: SupIrrigDecisions
        [ActionLog]
        public ActionResult WaterStorageIrrigSimu()
        {
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.ReservoirList = Helper.GetHasDataReservoirList();
            ViewBag.ReservoirYearList = Helper.GetHasDataReservoirYearList();
            IEnumerable<SelectOption> DataList = null;
            DataList = Helper.GetAppParamReservoirList("Simulation");
            ViewBag.SimulationReservoirList = DataList;
            //string[] stationArry = DataList.Select(x => x.Value.ToString()).ToArray();
            //ViewBag.stationArry = stationArry;
            //ViewData["PageTitle"] = "即時水庫水情";
            //ViewData["Breadcrumb"] = "水源情勢 > 即時水庫水情 > 即時水庫水情";
            //ViewBag.UIReservoirList = DataList;
            return View();
        }


        #region 4.1.1 蓄水量供灌模擬
        
        [HttpPost]
        public ActionResult GetSimuCaseSettingPanelPartialView(int max_methodNo)
        {
            //IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            //var IrrigationPlanDataYearList = helper.GetIrrigationPlanDataYearList();
            //ViewBag.IrrigationPlanDataYearList = new SelectList(IrrigationPlanDataYearList, "Year", "Year");
            //var PublicUseOfWaterYearList = helper.GetPublicUseOfWaterYearList();
            //ViewBag.PublicUseOfWaterYearList = new SelectList(PublicUseOfWaterYearList, "Year", "Year");
            ViewBag.max_methodNo = max_methodNo + 1;
            //限定同網站的Ajax專用
            if (Request.IsAjaxRequest())
            {
                return PartialView("~/Views/Partial/Simu/_SimuCaseSettingPanel.cshtml", null);
            }
            else
            {
                return Content("Fail");
            }
        }

        [HttpPost]
        public JsonResult GetSameDayEffectiveStorageWithRank(string[] StationNoArry, string MDDate)
        {

            IEnumerable<SameDayEffectiveStorageData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();

            DataList = Helper.GetSameDayEffectiveStorageWithRank(StationNoArry, MDDate);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetInflowGrandTotalDataByDateRange(string StationNo, string StartDate, string EndDate)
        {

            IEnumerable<GrandTotalData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();

            DataList = Helper.GetInflowGrandTotalDataByDateRange(StationNo, StartDate, EndDate);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetDayEffectiveStorageByDateRange(string[] StationNoArry, string StartDate, string EndDate)
        {

            IEnumerable<ReservoirData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();

            DataList = Helper.GetDayEffectiveStorageByDateRange(StationNoArry, StartDate, EndDate);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetDayInflowTotalByDateRange(string StationNo, string StartDate, string EndDate)
        {

            IEnumerable<ReservoirData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();

            DataList = Helper.GetDayInflowTotalByDateRange(StationNo, StartDate, EndDate);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetDateSeriesQ(string StationNo)
        {

            IEnumerable<TenDaysQData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();

            DataList = Helper.GetDateSeriesQ(StationNo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetIrrigationPlanDateSeriesData(string StationNo, string StartDate, string EndDate, string[] ManageID)
        {

            IEnumerable<IrrigationPlanData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();

            DataList = Helper.GetIrrigationPlanDateSeriesData(StationNo, StartDate, EndDate, ManageID);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetAreaIrrigaDateSeriesData(string StationNo, string StartDate, string EndDate, string[] ManageID, int AreaType = 1)
        {

            IEnumerable<IrrigationPlanData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();

            DataList = Helper.GetAreaIrrigaDateSeriesData(StationNo, StartDate, EndDate, ManageID, AreaType);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetAvgAreaIrrigaDateSeriesData(string StationNo, string[] ManageID)
        {

            IEnumerable<IrrigationPlanData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();

            DataList = Helper.GetAvgAreaIrrigaDateSeriesData(StationNo, ManageID);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetPublicUseOfWaterDateSeriesData(string StationNo, string StartDate, string EndDate, string SupplyType)
        {

            IEnumerable<PublicUseOfWater.PublicUseOfWaterData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();

            DataList = Helper.GetPublicUseOfWaterDateSeriesData(StationNo, StartDate, EndDate, SupplyType);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetReservoirRuleData(string StationNo)
        {

            IEnumerable<ReservoirRule> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();

            DataList = Helper.GetReservoirRuleData(StationNo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 4.1.1 蓄水量供灌模擬

    }
}