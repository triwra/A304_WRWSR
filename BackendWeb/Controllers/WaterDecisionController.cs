

using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.CommonDataModel;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BackendWeb.ActionFilter;

namespace BackendWeb.Controllers
{
    public class WaterDecisionController : Controller
    {
        [ActionLog]
        public ActionResult Index()
        {
            return View();
        }

        [ActionLog]
        public ActionResult WaterSimulation()
        {
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            var IrrigationPlanDataYearList = helper.GetIrrigationPlanDataYearList();
            ViewBag.IrrigationPlanDataYearList = new SelectList(IrrigationPlanDataYearList, "Year", "Year");
            var PublicUseOfWaterYearList = helper.GetPublicUseOfWaterYearList();
            ViewBag.PublicUseOfWaterYearList = new SelectList(PublicUseOfWaterYearList, "Year", "Year");
            ViewData["PageTitle"] = "供灌情境方案模擬";
            ViewData["Breadcrumb"] = "供灌決策 > 供灌情境方案模擬";
            return View();
        }

        [ActionLog]
        public ActionResult WaterSimulation2()
        {
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            var IrrigationPlanDataYearList = helper.GetIrrigationPlanDataYearList();
            ViewBag.IrrigationPlanDataYearList = new SelectList(IrrigationPlanDataYearList, "Year", "Year");
            var PublicUseOfWaterYearList = helper.GetPublicUseOfWaterYearList();
            ViewBag.PublicUseOfWaterYearList = new SelectList(PublicUseOfWaterYearList, "Year", "Year");

            return View();
        }

        [ActionLog]
        [HttpPost]
        public ActionResult GetMethodCardPartialView(int max_methodNo)
        {
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            var IrrigationPlanDataYearList = helper.GetIrrigationPlanDataYearList();
            ViewBag.IrrigationPlanDataYearList = new SelectList(IrrigationPlanDataYearList, "Year", "Year");
            var PublicUseOfWaterYearList = helper.GetPublicUseOfWaterYearList();
            ViewBag.PublicUseOfWaterYearList = new SelectList(PublicUseOfWaterYearList, "Year", "Year");
            ViewBag.max_methodNo = max_methodNo + 1;
            //限定同網站的Ajax專用
            if (Request.IsAjaxRequest())
            {
                return PartialView("~/Views/Partial/_WaterSimulationMethodCard.cshtml", null);
            }
            else
            {
                return Content("Fail");
            }
        }

        public JsonResult GetIrrigationPlanData(string StartDate, string EndDate)
        {
            DateTime start = Convert.ToDateTime(StartDate);
            DateTime end = Convert.ToDateTime(EndDate);
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            List<IrrigationPlanModel.IrrigationPlanData> list = helper.QueryIrrigationPlanData(start, end);

            var linqStament = from p in list
                              group p by new { p.PlanDate } into g
                              select new
                              {
                                  PlanDate = g.Key.PlanDate,
                                  PlanDateSTR = g.Key.PlanDate.ToString(),
                                  FieldArea = g.Sum(c => c.FieldArea),
                                  PlanField = g.Sum(c => c.PlanField),
                                  PlanGate = g.Sum(c => c.PlanGate),
                                  PlanLoss = g.Sum(c => c.PlanLoss),
                                  PlanTotal = g.Sum(c => c.PlanTotal),
                                  ProofGate = g.Sum(c => c.ProofGate),
                                  ProofLoss = g.Sum(c => c.ProofLoss),
                                  ProofTotal = g.Sum(c => c.ProofTotal),
                                  RealLoss = g.Sum(c => c.RealLoss),
                                  RealTotal = g.Sum(c => c.RealTotal),
                                  CanalAdiust = g.Sum(c => c.CanalAdiust),
                                  CanalAdiustDelt = g.Sum(c => c.CanalAdiustDelt),
                              };
            return new JsonResult()
            {
                Data = linqStament,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetPublicUseOfWater(string StartDate, string EndDate, string SupplyType)
        {
            DateTime start = Convert.ToDateTime(StartDate);
            DateTime end = Convert.ToDateTime(EndDate);
            PublicUseOfWater.SupplyType type = (PublicUseOfWater.SupplyType)Enum.Parse(typeof(PublicUseOfWater.SupplyType), SupplyType);
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            List<PublicUseOfWater.PublicUseOfWaterData> list = helper.QueryPublicUseOfWater(start, end, type);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetSingleDayEffectiveStorageData(string Date,
            int valUpper = int.MaxValue, int valLower = int.MinValue, int nowAnnual = 9999,
            Boolean OneDay = true)
        {
            ReservoirHelper helper = new ReservoirHelper();
            List<SingleDayEffectiveStorageData> list = new List<SingleDayEffectiveStorageData>();
            string[] MDDate = Date.Split('-');
            if (OneDay)
            {
                list = helper.GetSingleDayEffectiveStorageData(MDDate[1] + '-' + MDDate[2], nowAnnual, valUpper, valLower);
                list = list.Select(x => x).Where(x => x.Year == Convert.ToInt16(MDDate[0])).ToList();
            }
            else
            {
                list = helper.GetSingleDayEffectiveStorageData(MDDate[1] + '-' + MDDate[2], nowAnnual, valUpper, valLower);
            }
            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #region Select Option
        public JsonResult GetIrrigAreaSelectOption()
        {
            CommonDataHelper helper = new CommonDataHelper();
            List<AppParam> list = helper.GetAppParam("Option", "IrrigArea");

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetIrrigGroupNoOption()
        {
            CommonDataHelper helper = new CommonDataHelper();
            List<AppParam> list = helper.GetAppParam("Option", "GroupNo");

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetIrrigTSSelectOption()
        {
            CommonDataHelper helper = new CommonDataHelper();
            List<AppParam> list = helper.GetAppParam("Option", "TS");

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetIrrigTMSelectOption()
        {
            CommonDataHelper helper = new CommonDataHelper();
            List<AppParam> list = helper.GetAppParam("Option", "TM");

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        #region 時間序列資料
        public JsonResult GetIrrigationPlanTimeSeriesData
        (string StartDate, string EndDate, string[] TR1Area, string[] TR2Area, string[] TSTMArry)
        {

            IEnumerable<IrrigationPlanModel.IrrigationPlanData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();
            DataList = Helper.GetIrrigationPlanTimeSeriesData(StartDate, EndDate, TR1Area, TR2Area, TSTMArry);
            return Json(DataList);
        }

        public JsonResult GetIrrigationPlanMngTimeSeriesData_old
        (string StartDate, string EndDate, string[] TR1Area, string[] TR2Area, string[] TSTMArry, string[] DelayMDDateList, int OnlyWhat = 0)
        {
            //OnlyWhat=> 0:無設定/1:只取水稻/2:只取甘蔗雜作
            string[] _TR1Area = { };
            string[] _TR2Area = { };
            string[] _TSTMArry = { };

            switch (OnlyWhat)
            {
                case 1:
                    List<string> list2 = new List<string>();
                    for (int i = 1; i < 9; i++)
                    {
                        list2.Add("TS-" + i.ToString());
                        list2.Add("TM-" + i.ToString());
                        list2.Add("TL-" + i.ToString());
                    }
                    _TR1Area = TR1Area;
                    _TR2Area = TR2Area;
                    _TSTMArry = list2.ToArray();
                    break;

                case 2:
                    List<string> list = new List<string>();
                    for (int i = 1; i < 8; i++) list.Add(i.ToString());
                    list.Add("999");
                    _TR1Area = list.ToArray();
                    _TR2Area = list.ToArray();
                    _TSTMArry = TSTMArry;
                    break;


                default:
                    _TR1Area = TR1Area;
                    _TR2Area = TR2Area;
                    _TSTMArry = TSTMArry;
                    break;

            }

            IEnumerable<IrrigationPlanModel.IrrigationPlanData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();
            DataList = Helper.GetIrrigationPlanMngTimeSeriesData_old(StartDate, EndDate, _TR1Area, _TR2Area, _TSTMArry, DelayMDDateList);
            return Json(DataList);
        }

        public JsonResult GetIrrigationPlanMngTimeSeriesData
        (string StartDate, string EndDate, string[] ManageID, string[] DelayMDDateList1, string[] DelayMDDateList2, int OnlyWhat = 0)
        {

            IEnumerable<IrrigationPlanModel.IrrigationPlanData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();
            DataList = Helper.GetIrrigationPlanMngTimeSeriesData(StartDate, EndDate, ManageID, DelayMDDateList1, DelayMDDateList2);
            return Json(DataList);
        }


        #endregion 時間序列資料

        #region 資料加總

        public JsonResult GetIrrigPlanDataTenDaySummaryByRange
        (string StartDate, string EndDate, string[] TR1Area, string[] TR2Area, string[] TSTMArry)
        {

            IEnumerable<DataSummary.IrrigData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();
            DataList = Helper.GetIrrigPlanDataTenDaySummaryByRange(StartDate, EndDate, TR1Area, TR2Area, TSTMArry);
            return Json(DataList);
        }

        public JsonResult GetPublicDataTenDaySummaryByRange(string type, string StartDate, string EndDate)
        {

            IEnumerable<DataSummary.PubicData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();
            DataList = Helper.GetPublicDataTenDaySummaryByRange(type, StartDate, EndDate);
            return Json(DataList);
        }

        public JsonResult GetQInflowDataTenDaySummaryByRange
        (string StartDate, string EndDate)
        {

            IEnumerable<DataSummary.QInflowData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();
            DataList = Helper.GetQInflowDataTenDaySummaryByRange(StartDate, EndDate);
            return Json(DataList);
        }

        #endregion 資料加總

        [HttpPost]
        public JsonResult GetReservoirPiValue(string StationNo, DBClassLibrary.UserDomainLayer.ReservoirModel.PiType piType, DBClassLibrary.UserDomainLayer.ReservoirModel.PiField piField, string Start, string End, bool TenTimes = false)
        {
            List<ReservoirPiValue> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetReservoirPiValue(StationNo, piType, piField, Start, End).ToList();
            if (TenTimes)
                for (int i = 0; i < DataList.Count; i++)
                {
                    DataList[i].Q10 = DataList[i].Q10 * 10;
                    DataList[i].Q20 = DataList[i].Q20 * 10;
                    DataList[i].Q30 = DataList[i].Q30 * 10;
                    DataList[i].Q40 = DataList[i].Q40 * 10;
                    DataList[i].Q50 = DataList[i].Q50 * 10;
                    DataList[i].Q60 = DataList[i].Q60 * 10;
                    DataList[i].Q70 = DataList[i].Q70 * 10;
                    DataList[i].Q75 = DataList[i].Q75 * 10;
                    DataList[i].Q80 = DataList[i].Q80 * 10;
                    DataList[i].Q85 = DataList[i].Q85 * 10;
                    DataList[i].Q90 = DataList[i].Q90 * 10;
                    DataList[i].Q95 = DataList[i].Q95 * 10;
                    DataList[i].QAverage = DataList[i].QAverage * 10;
                }
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        #region WRWSR 
        [ActionLog]
        public ActionResult EffectStroageTanDaysSimu()
        {
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.UIReservoirList = Helper.GetAppParamReservoirList("Daily");
            ViewData["PageTitle"] = "水情模擬";
            ViewData["Breadcrumb"] = "供灌決策 > 水情模擬";
            return View();
        }
        #endregion

    }


}