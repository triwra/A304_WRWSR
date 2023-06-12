using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System;
using PiField = DBClassLibrary.UserDomainLayer.ReservoirModel.PiField;
using PiType = DBClassLibrary.UserDomainLayer.ReservoirModel.PiType;
using static DBClassLibrary.UserDomainLayer.CWBModel.AutomaticStationList;
using BackendWeb.ActionFilter;

namespace BackendWeb.Controllers
{
    public class ReservoirController : Controller
    {
        [ActionLog]
        public ActionResult Index()
        {
            return View();
        }

        [ActionLog]
        public ActionResult EffectiveStorageTable()
        {
            ViewBag.type = 1;
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.UIReservoirList = Helper.GetHasDataReservoirList();
            DataTypeName typeName = (DataTypeName)1;
            ViewBag.Title = "當日" + typeName + "排名表";
            ViewData["PageTitle"] = "蓄水量枯旱排名";
            ViewData["Breadcrumb"] = "水源情勢 > 歷史水庫水情 > 蓄水量枯旱排名";
            return View(1);
        }

        [ActionLog]
        public ActionResult AccumulatedRainfallTable()
        {
            ViewBag.type = 2;
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.UIReservoirList = Helper.GetHasDataReservoirList();
            DataTypeName typeName = (DataTypeName)2;
            ViewBag.Title = "當日" + typeName + "排名表";
            ViewData["PageTitle"] = "累積雨量枯旱排名";
            ViewData["Breadcrumb"] = "水源情勢 > 歷史水庫水情 > 累積降雨量統計";
            return View(2);
        }

        [ActionLog]
        public ActionResult InflowTotalTable()
        {
            ViewBag.type = 3;
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            ViewBag.UIReservoirList = Helper.GetHasDataReservoirList();
            DataTypeName typeName = (DataTypeName)3;
            ViewBag.Title = "當日" + typeName + "排名表";
            ViewData["PageTitle"] = "入庫水量枯旱排名";
            ViewData["Breadcrumb"] = "水源情勢 > 歷史水庫水情 > 入庫水量枯旱排名";
            return View(3);
        }

        /// <summary>
        /// 回傳單一水庫即時資料
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult GetReservoirInfo(string id = "10201")
        {
            ReservoirHelper helper = new ReservoirHelper();
            ReservoirInfoData ItemData = helper.GetLatestReservoirInfo(id);
            return View(ItemData);

        }

        [ActionLog]
        public ActionResult HistoryInfo()
        {
            return View();
        }
        // GET: Reservoir
        [ActionLog]
        public ActionResult RealTimeInfo()
        {
            return View();
        }

        [ActionLog]
        public ActionResult DataTable(int type)
        {
            ViewBag.type = type;
            DataTypeName typeName = (DataTypeName)type;
            ViewBag.Title = "當日" + typeName + "排名表";
            return View();
        }

        #region 水庫基本
        [HttpPost]
        public JsonResult GetReservoirRuleDay(string StationNo)
        {
            IEnumerable<ReservoirRule> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetReservoirRuleDay(StationNo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetReservoirDataAverage(string StartDate, string EndDate, string StationNo ="10201")
        {
            string DataStartDate = String.Empty;
            string DataEndDate = String.Empty;
            int MDSY = Int16.Parse(StartDate.Split('-')[0]);
            int MDSM = Int16.Parse(StartDate.Split('-')[1]);
            int MDSD = Int16.Parse(StartDate.Split('-')[2]);
            int MDEY = Int16.Parse(StartDate.Split('-')[0]);
            int MDEM = Int16.Parse(EndDate.Split('-')[1]);
            int MDED = Int16.Parse(EndDate.Split('-')[2]);
            string MDstratDate = MDSM.ToString() + '-' + MDSD.ToString();
            string MDendDate = MDEM.ToString() + '-' + MDED.ToString();
            if (MDSM > MDEM)
            {
                DataStartDate = "2020-" + MDstratDate;
                DataEndDate = "2021-" + MDendDate;
            }
            else if (MDSM < MDEM)
            {
                DataStartDate = "2020-" + MDstratDate;
                DataEndDate = "2020-" + MDendDate;
            }
            else
            {
                if (MDSD > MDED)
                {
                    DataStartDate = "2020-" + MDstratDate;
                    DataEndDate = "2021-" + MDendDate;
                }
                else if (MDSD < MDED)
                {
                    DataStartDate = "2020-" + MDstratDate;
                    DataEndDate = "2020-" + MDendDate;
                }
                else if (MDSD == MDED)
                {
                    DataStartDate = "2020-" + MDstratDate;
                    DataEndDate = "2020-" + MDendDate;
                }
            }
            IEnumerable<ReservoirTimeSeriesData.AverageData> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetReservoirAverageTimeSeriesData(DataStartDate, DataEndDate, DataStartDate, DataEndDate, StationNo);
            var linqStament = DataList.GroupBy(x => new { })
                                    .Select(x => new
                                    {
                                        InflowTotal_AVG = x.Sum(y => y.InflowTotal_AVG),
                                        AccumulatedRainfall_AVG = x.Sum(y => y.AccumulatedRainfall_AVG),
                                        InflowTotal_AVG_30501 = x.Sum(y => y.InflowTotal_AVG_30501),
                                        InflowTotal_AVG_30502 = x.Sum(y => y.InflowTotal_AVG_30502),
                                        AccumulatedRainfall_AVG_30501 = x.Sum(y => y.AccumulatedRainfall_AVG_30501),
                                        AccumulatedRainfall_AVG_30502 = x.Sum(y => y.AccumulatedRainfall_AVG_30502)
                                    }).ToList();

            return Json(linqStament);
        }

        [HttpPost]
        public JsonResult GetReservoirRule(string StationNo)
        {
            IEnumerable<ReservoirRuleData> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetReservoirRule(StationNo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        #region 時間序列資料
        [HttpPost]
        public JsonResult GetRealTimeReservoirTimeSeriesData(string stratDate, string endDate)
        {
            IEnumerable<ReservoirTimeSeriesData.RealTimeData> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetRealTimeReservoirTimeSeriesData(stratDate, endDate);
            return Json(DataList);
        }

        [HttpPost]
        public JsonResult GetReservoirRuleTimeSeriesData(string stratDate, string endDate)
        {
            IEnumerable<ReservoirTimeSeriesData.ReservoirRuleData> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetReservoirRuleTimeSeriesData(stratDate, endDate);
            return Json(DataList);
        }

        [HttpPost]
        public JsonResult GetPiValueTimeSeriesData(string stratDate, string endDate, PiType piType,
            PiField piField = PiField.InflowTotalAverageValue)
        {
            IEnumerable<ReservoirTimeSeriesData.PiValueData> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetPiValueTimeSeriesData(stratDate, endDate, piType, piField);
            return Json(DataList);
        }

        [HttpPost]
        public JsonResult GetHistoryReservoirTimeSeriesDataSet(string ChartStartDate, string ChartEndDate, string MDstratDate, string MDendDate, string[] YearArry)
        {
            string DataStartDate = String.Empty;
            string DataEndDate = String.Empty;
            int MDSM = Int16.Parse(MDstratDate.Split('-')[0]);
            int MDSD = Int16.Parse(MDstratDate.Split('-')[1]);
            int MDEM = Int16.Parse(MDendDate.Split('-')[0]);
            int MDED = Int16.Parse(MDendDate.Split('-')[1]);

            List<ReservoirTimeSeriesData.HistoryDataSet> DataSet = new List<ReservoirTimeSeriesData.HistoryDataSet>();
            ReservoirHelper Helper = new ReservoirHelper();
            if (YearArry != null)
            {
                for (int i = 0; i < YearArry.Length; i++)
                {
                    ReservoirTimeSeriesData.HistoryDataSet DataGroup = new ReservoirTimeSeriesData.HistoryDataSet();
                    DataGroup.Year = YearArry[i];
                    if (MDSM > MDEM)
                    {
                        DataStartDate = YearArry[i] + "-" + MDstratDate;
                        DataEndDate = (Int16.Parse(YearArry[i]) + 1).ToString() + '-' + MDendDate;
                    }
                    else if (MDSM < MDEM)
                    {
                        DataStartDate = YearArry[i] + "-" + MDstratDate;
                        DataEndDate = YearArry[i] + "-" + MDendDate;
                    }
                    else
                    {
                        if (MDSD > MDED)
                        {
                            DataStartDate = YearArry[i] + "-" + MDstratDate;
                            DataEndDate = (Int16.Parse(YearArry[i]) + 1).ToString() + '-' + MDendDate;
                        }
                        else if (MDSD < MDED)
                        {
                            DataStartDate = YearArry[i] + "-" + MDstratDate;
                            DataEndDate = YearArry[i] + "-" + MDendDate;
                        }
                        else if (MDSD == MDED)
                        {
                            DataStartDate = YearArry[i] + "-" + MDstratDate;
                            DataEndDate = YearArry[i] + "-" + MDendDate;
                        }
                    }
                    DataGroup.Data = Helper.GetHistoryReservoirTimeSeriesData(ChartStartDate, ChartEndDate, DataStartDate, DataEndDate);
                    DataSet.Add(DataGroup);
                }
            }
            return Json(DataSet);
        }

        [HttpPost]
        public JsonResult GetHistoryReservoirTimeSeriesData(string StartDate, string EndDate)
        {
            List<ReservoirTimeSeriesData.HistoryData> Data = new List<ReservoirTimeSeriesData.HistoryData>();
            ReservoirHelper Helper = new ReservoirHelper();
            Data = Helper.GetHistoryReservoirTimeSeriesData(StartDate, EndDate, StartDate, EndDate);

            Data = Data.OrderBy(x => x.DataTime).ToList();

            return Json(Data);
        }

        [HttpPost]
        public JsonResult GetReservoirAverageTimeSeriesData(string ChartStartDate, string ChartEndDate, string MDstratDate = "11-01", string MDendDate = "10-31")
        {

            string DataStartDate = String.Empty;
            string DataEndDate = String.Empty;
            int MDSM = Int16.Parse(MDstratDate.Split('-')[0]);
            int MDSD = Int16.Parse(MDstratDate.Split('-')[1]);
            int MDEM = Int16.Parse(MDendDate.Split('-')[0]);
            int MDED = Int16.Parse(MDendDate.Split('-')[1]);
            if (MDSM > MDEM)
            {
                DataStartDate = "1999-" + MDstratDate;
                DataEndDate = "2000-" + MDendDate;
            }
            else if (MDSM < MDEM)
            {
                DataStartDate = "1999-" + MDstratDate;
                DataEndDate = "1999-" + MDendDate;
            }
            else
            {
                if (MDSD > MDED)
                {
                    DataStartDate = "1999-" + MDstratDate;
                    DataEndDate = "2000-" + MDendDate;
                }
                else if (MDSD < MDED)
                {
                    DataStartDate = "1999-" + MDstratDate;
                    DataEndDate = "1999-" + MDendDate;
                }
                else if (MDSD == MDED)
                {
                    DataStartDate = "1999-" + MDstratDate;
                    DataEndDate = "1999-" + MDendDate;
                }
            }

            IEnumerable<ReservoirTimeSeriesData.AverageData> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetReservoirAverageTimeSeriesData(ChartStartDate, ChartEndDate, DataStartDate, DataEndDate);
            return Json(DataList);
        }
        #endregion

        #region 水庫屬性排名
        [HttpPost]
        public JsonResult GetHistoryReservoirDataRank(DataType DataType, string StartDate, string EndDate, string StationNo = "10201", int valUpper = int.MaxValue, int valLower = int.MinValue)
        {
            List<ReservoirRankData> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.GetHistoryReservoirDataRank(StartDate, EndDate, StationNo).ToList();
            if (DataType == DataType.EffectiveStorage)
            {
                DataList = DataList.Select(x => x)
                            .Where(x => x.EffectiveStorage >= valLower && x.EffectiveStorage <= valUpper)
                            .OrderBy(x => x.EffectiveStorage).ToList();
            }
            else if (DataType == DataType.AccumulatedRainfall)
            {
                DataList = DataList.Select(x => x)
                            .Where(x => x.TotalRainfall >= valLower && x.TotalRainfall <= valUpper)
                            .OrderBy(x => x.TotalRainfall).ToList();
            }
            else if (DataType == DataType.Inflow)
            {
                DataList = DataList.Select(x => x)
                            .Where(x => x.TotalInflow >= valLower && x.TotalInflow <= valUpper)
                            .OrderBy(x => x.TotalInflow).ToList();
            }


            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion


        [HttpPost]
        public JsonResult GetReservoirPiValue(string StationNo, PiType piType, PiField piField, string Start, string End, bool TenTimes = false)
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

        [HttpPost]
        public JsonResult QueryReservoirSummaryByUserDefine(
        int StartMonth, int StartDay,
        int EndMonth, int EndDay,
        string StationNo)
        {
            IEnumerable<ReservoirSummaryValue> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();
            DataList = Helper.QueryReservoirSummaryByUserDefine(StartMonth, StartDay, EndMonth, EndDay, StationNo);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        [HttpPost]
        public JsonResult GetTenDaysSummaryPiValueByDataTypeValueIndex(int start, int end)
        {

            IEnumerable<SummaryPiValue> DataList = null;
            ReservoirHelper Helper = new ReservoirHelper();

            DataList = Helper.GetTenDaysSummaryPiValueByDataTypeValueIndex(start, end);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #region 時間序列資料
       

      

   

        #endregion       

        [HttpPost]
        public JsonResult GetSingleDayEffectiveStorageData(string MDDate, int valUpper = int.MaxValue, int valLower = int.MinValue)
        {
            var nowAnnual = 0;

            if (DateTime.Now.Month == 11) nowAnnual = DateTime.Now.Year - 1911 + 1;
            if (DateTime.Now.Month == 12) nowAnnual = DateTime.Now.Year - 1911 + 1;
            if (DateTime.Now.Month >= 1 && DateTime.Now.Month <= 10) nowAnnual = DateTime.Now.Year - 1911;

            IEnumerable<SingleDayEffectiveStorageData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetSingleDayEffectiveStorageData(MDDate, nowAnnual, valUpper, valLower);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetRangeEffectiveStorageData(int year,
            string StartMDDate, string EndMDDate,
            int valUpper = int.MaxValue, int valLower = int.MinValue)
        {
            var nowAnnual = 0;
            int offset = 0;
            string endDate = year.ToString() + '-' + EndMDDate;
            if (StartMDDate.Split('-')[0] == "11" || StartMDDate.Split('-')[0] == "12")
            {
                offset = 1;
            }
            else { offset = 0; }

            string startDate = (year - offset).ToString() + '-' + StartMDDate;


            if (DateTime.Now.Month == 11) nowAnnual = DateTime.Now.Year - 1911 + 1;
            if (DateTime.Now.Month == 12) nowAnnual = DateTime.Now.Year - 1911 + 1;
            if (DateTime.Now.Month >= 1 && DateTime.Now.Month <= 10) nowAnnual = DateTime.Now.Year - 1911;

            IEnumerable<SingleDayEffectiveStorageData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetRangeDayEffectiveStorageData(startDate, endDate, nowAnnual, valUpper, valLower);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #region 埤塘相關
        [ActionLog]
        public ActionResult ImpoundingInfo()
        {
            return View();
        }

        public JsonResult getPoundIrragarionList()
        {
            List<ReservoirWithRealTimeData> list;
            RservoirDataHelper helper = new RservoirDataHelper();
            list = helper.getPoundIrragarionList();

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        public JsonResult getPoundDateList()
        {
            List<PoundTimeData> list;
            RservoirDataHelper helper = new RservoirDataHelper();
            String irrigationId = Request.Form["id"].ToString();
            list = helper.getPoundDateList(irrigationId);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult getPoundInfoByIrrigation()
        {
            List<PoundRealTimeInfo> list;
            RservoirDataHelper helper = new RservoirDataHelper();
            String irrigationId = Request.Form["id"].ToString();
            String queryDate = Request.Form["d"].ToString();
            list = helper.getPoundInfoByIrrigation(irrigationId, queryDate);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 
    }
}