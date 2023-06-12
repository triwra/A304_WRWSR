using BackendWeb.ActionFilter;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.WaterOperationModel;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    public class WaterOperationController : Controller
    {
        #region View
        [ActionLog]
        public ActionResult WaterOperationSimulation()
        {
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.ReservoirList = Helper.GetHasDataReservoirList();
            ViewBag.ReservoirYearList = Helper.GetHasDataReservoirYearList();

            ViewData["PageTitle"] = "即時水庫水情";
            ViewData["Breadcrumb"] = "水源情勢 > 即時水庫水情 > 即時水庫水情";
            //ViewBag.UIReservoirList = DataList;
            return View();
        }

        #endregion

        #region 即時給水量(取資料)
        public JsonResult GetAmountWaterList()
        {
            List<WaterAmountListData> DataList = null;
            WaterOperationHelper Helper = new WaterOperationHelper();

            String IrrigationZone = Request.Form["IrrigationZone"];
            DataList = Helper.GetWaterAmountList(IrrigationZone);

            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetWaterOperationData()
        {
            IEnumerable<WaterOperationData> DataList = null;
            String IrrigationZone = Request.Form["IrrigationZone"];
            int IrrigationAmount = Convert.ToInt32(Request.Form["IrrigationAmount"]);
            WaterOperationHelper Helper = new WaterOperationHelper();
            DataList = Helper.GetWaterOperationData(IrrigationAmount, IrrigationZone);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetWaterOperationChart()
        {
            List<WaterOperationChartData> DataList = null;
            String IrrigationZone = Request.Form["IrrigationZone"];
            int IrrigationAmount = Convert.ToInt32(Request.Form["IrrigationAmount"]);
            WaterOperationHelper Helper = new WaterOperationHelper();
            DataList = Helper.WaterOperationChartData(IrrigationAmount, IrrigationZone);

            List<string> dataDate = new List<string>();
            List<float> myShortage = new List<float>();
            List<float> myDemand = new List<float>();

            for (int i = 0; i < DataList.Count; i++)
            {
                dataDate.Add(DataList[i].PeriodofYear.ToString());
                myShortage.Add(DataList[i].Shortage);
                myDemand.Add(DataList[i].Demand);

            }

            return new JsonResult()
            {
                Data = new { dataDate, myShortage, myDemand },
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 即時水庫水情(取資料)

        #region 供灌缺水風險評估

        /// <summary>
        /// 供灌缺水風險評估
        /// </summary>
        /// <returns></returns>
        [ActionLog]
        public ActionResult ReservoirInflowToRisk()
        {
            #region 下拉選單
            //選擇水庫
            WaterOperationHelper waterOperationHelper = new WaterOperationHelper();
            var ReservoirList = waterOperationHelper.GetHasRiskReservoirList();
            ViewBag.ReservoirList = new SelectList(ReservoirList, "Value", "Name");

            #endregion 下拉選單

            return View();
        }

        /// <summary>
        /// 依水庫編號取回 供灌缺水風險評估值
        /// </summary>
        /// <param name="IANo"></param>
        /// <returns></returns>
        public JsonResult GetReservoirInflowToRisk(
            string StationNo, int S0, DateTime StartDate, DateTime EndDate)
        {
            WaterOperationHelper waterOperationHelper = new WaterOperationHelper();
            var list = waterOperationHelper.GetReservoirInflowToRisk(StationNo, S0, StartDate, EndDate);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 供灌缺水風險評估

    }

}