using BackendWeb.ActionFilter;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.RainModel;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    public class RainfallAnalysisController : Controller
    {
        [AllowAnonymous]
        public JsonResult GetAreaAverageRainValueRealTime(string datetime = null)
        {
            List<QueryRainValueAverageDuration> list;
            if (datetime == null)
            {
                RainDataHelper helper = new RainDataHelper();
                list = helper.QueryAreaAverageRainValueRealTime();
                DateTime DateTime = DateTime.Now;
            }
            else
            {
                DateTime DateTime = Convert.ToDateTime(datetime);
                RainDataHelper helper = new RainDataHelper();
                list = helper.QueryAreaAverageRainValueRealTime(DateTime);
            }


            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetRainfallRealTimeInfo(string datetime, string AreaID)
        {
            List<QueryRainfallRealTimeInfo> list;
            DateTime DateTime = Convert.ToDateTime(datetime);
            RainDataHelper helper = new RainDataHelper();
            list = helper.QueryRainfallRealTimeInfo(DateTime, AreaID);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetAreaAverageRainValueReal(string year, string month, int AreaID = 0)
        {
            List<QueryRainfallHistoryInfo> list;
            RainDataHelper helper = new RainDataHelper();
            if (year == null && month == null)
            {
                list = helper.QueryAreaAverageRainValueReal(DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString(), AreaID);
            }
            else
            {
                list = helper.QueryAreaAverageRainValueReal(year, month, AreaID);
            }


            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetAreaEffectiveRainValueReal(string year, string month, int AreaID = 0)
        {
            List<QueryRainfallHistoryInfo> list;
            RainDataHelper helper = new RainDataHelper();
            if (year == null && month == null)
            {
                list = helper.QueryAreaEffectiveRainValueReal(DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString(), AreaID);
            }
            else
            {
                list = helper.QueryAreaEffectiveRainValueReal(year, month, AreaID);
            }


            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public JsonResult GetAreaAverageRainValueHistory(string year = "2019", string month = "12", int AreaID = 0)
        {
            List<QueryRainfallHistoryInfo> list;
            RainDataHelper helper = new RainDataHelper();
            list = helper.QueryAreaAverageRainValueHistory(year, month, AreaID);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetRainfallHistoryInfo(string year, string month, int AreaID)
        {
            List<QueryRainfallHistoryInfo> list;
            RainDataHelper helper = new RainDataHelper();
            list = helper.QueryRainfallHistoryInfo(year, month, AreaID);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetRainfallHistoryTimeSeriesInfo(int AreaID, string year)
        {
            List<RainValueAverageTimeSeries> list;
            RainDataHelper helper = new RainDataHelper();
            list = helper.QueryRainfallHistoryTimeSeriesInfo(AreaID, year);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [ActionLog]
        // GET: RainfallAnalysis
        public ActionResult RainfallRealTime()
        {
            return View();
        }
        public ActionResult RainfallRealTimeDetail_20220729(string datetime = "", int AreaID = 0)
        {
            DateTime date = new DateTime();
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            List<IrrigationPlanModel.IrrigationAreaInfo> temp = new List<IrrigationPlanModel.IrrigationAreaInfo>();
            temp.Add(new IrrigationPlanModel.IrrigationAreaInfo { AreaID = "0", AreaName = "全區" });
            var AreaOptionList = helper.GetIrrigationAreaInfoWithRealTimeWeightList();
            temp.AddRange(AreaOptionList);
            temp.RemoveAt(9);//暫時移除曾文水庫(因為曾文沒有值)
            ViewBag.AreaOptionList = new SelectList(temp, "AreaID", "AreaName");
            if (!DateTime.TryParse(datetime, out date))
            {
                DateTime _datetime = DateTime.Now;
                string datepart = _datetime.ToString("yyyy-MM-dd");
                int h = _datetime.Hour;
                int m = _datetime.Minute / 10;
                int s = _datetime.Second;
                date = DateTime.Parse(datepart + " " + h.ToString() + ":0" + m.ToString() + ":00");
            }

            List<RealTimeRainMaxMinDataTime> list;
            RainDataHelper RainDatahelper = new RainDataHelper();
            list = RainDatahelper.GetMaxMinAvgRainValueRealTimeDataTime();

            ViewBag.MaxMinAvgRainValueRealTimeDataTime = list[0];
            ViewBag.datatime = date.ToString("yyyy-MM-dd HH:mm:ss");
            ViewBag.AreaID = AreaID;
            return View();
        }

        [ActionLog]
        public ActionResult RainfallRealTimeDetail(string datetime = "", string AreaID = "01")
        {
            DateTime date = new DateTime();
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            List<IrrigationPlanModel.IrrigationAreaInfo> temp = new List<IrrigationPlanModel.IrrigationAreaInfo>();
            // temp.Add(new IrrigationPlanModel.IrrigationAreaInfo { AreaID = 0, AreaName = "全區" });
            var AreaOptionList = helper.GetIrrigationAreaInfoWithRealTimeWeightList();
            temp.AddRange(AreaOptionList);
            //temp.RemoveAt(9);//暫時移除曾文水庫(因為曾文沒有值)
            ViewBag.AreaOptionList = new SelectList(temp, "AreaID", "AreaName");

            List<RealTimeRainMaxMinDataTime> list;
            RainDataHelper RainDatahelper = new RainDataHelper();
            list = RainDatahelper.GetMaxMinAvgRainValueRealTimeDataTime();

            ViewBag.MaxMinAvgRainValueRealTimeDataTime = list[0];
            ViewBag.datatime = date.ToString("yyyy-MM-dd HH:mm:ss");
            ViewBag.AreaID = AreaID;
            return View();
        }

        [ActionLog]
        public ActionResult RainfallMonth()
        {
            return View();
        }

        [ActionLog]
        //降雨組體圖
        public ActionResult Raingraph()
        {
            return View();
        }

        //找出所有水庫
        public JsonResult GetAllReservoirList()
        {
            List<ReservoirWithRealTimeData> list;
            RservoirDataHelper helper = new RservoirDataHelper();
            list = helper.GetReservoirWithRealTimeDataList();

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        //找出所有管理處
        public JsonResult GetAllIrragationList()
        {
            List<ReservoirWithRealTimeData> list;
            RservoirDataHelper helper = new RservoirDataHelper();
            list = helper.GetIrragationWithRealTimeDataList();

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }


        //找出所有管理處
        public JsonResult GetAllStationList()
        {
            List<ReservoirWithRealTimeData> list;
            String irrigation = Request.Form["id"].ToString();
            RservoirDataHelper helper = new RservoirDataHelper();
            list = helper.GetStationWithRealTimeDataList(irrigation);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        //找出所有管理處, 區域或水庫降雨
        public JsonResult GetRainfallbyDay()
        {
            List<RainfallRealTimeData> list;

            RservoirDataHelper helper = new RservoirDataHelper();
            String irrigationId = Request.Form["irrigationId"].ToString();
            String stationId = Request.Form["stationId"].ToString();
            String targetId = "";
            String sDate = Request.Form["Startdate"].ToString();
            String eDate = Request.Form["Enddate"].ToString();
            String rainType = "3";
            if (stationId != "0")
            {
                rainType = "5";
                targetId = stationId;
            }
            else
            {
                rainType = "3";
                targetId = irrigationId;
            }

            list = helper.GetRainfallbyDay(rainType, targetId, sDate, eDate);

            List<string> dataDate = new List<string>();
            List<float> Rainfall = new List<float>();

            for (int i = 0; i < list.Count; i++)
            {
                dataDate.Add(list[i].DataDay.ToString("M/d"));
                Rainfall.Add(list[i].Rainfall);

            }


            return new JsonResult()
            {
                Data = new { dataDate, Rainfall },
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }
        public JsonResult GetRainfallbyReservoir()
        {
            List<RainfallRealTimeData> list;
            RservoirDataHelper helper = new RservoirDataHelper();
            String reservoirId = Request.Form["Reservoirid"].ToString();
            String sDate = Request.Form["Startdate"].ToString();
            String eDate = Request.Form["Enddate"].ToString();
            list = helper.GetRainfallbyReservoir(reservoirId, sDate, eDate);

            List<string> dataDate = new List<string>();
            List<float> Rainfall = new List<float>();

            for (int i = 0; i < list.Count; i++)
            {
                dataDate.Add(list[i].DataDay.ToString("M/d"));
                Rainfall.Add(list[i].Rainfall);

            }

            return new JsonResult()
            {
                Data = new { dataDate, Rainfall },
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        [ActionLog]
        public ActionResult RainfallMonthDetail(string year = "2019", string month = "12", int AreaID = 0)
        {
            int _AreaID = AreaID;
            if (AreaID < 1 || AreaID > 10) { _AreaID = 2; }
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            List<IrrigationPlanModel.IrrigationAreaInfo> AreaOptionList = helper.GetIrrigationAreaInfoWithRealTimeWeightList();
            ViewBag.AreaOptionList = new SelectList(AreaOptionList, "AreaID", "AreaName");
            ViewBag.QYear = year;
            ViewBag.QMonth = month;
            ViewBag.AreaID = _AreaID;
            return View();
        }

        [ActionLog]
        public ActionResult RainfallHistory()
        {
            return View();
        }

        [ActionLog]
        public ActionResult RainfallHistoryDetail(string year = "2019", string month = "12", int AreaID = 0)
        {
            int _AreaID = AreaID;
            if (AreaID < 1 || AreaID > 10) { _AreaID = 2; }
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            List<IrrigationPlanModel.IrrigationAreaInfo> AreaOptionList = helper.GetIrrigationAreaInfoWithRealTimeWeightList();
            AreaOptionList.RemoveRange(7, 3);
            ViewBag.AreaOptionList = new SelectList(AreaOptionList, "AreaID", "AreaName");
            ViewBag.QYear = year;
            ViewBag.QMonth = month;
            ViewBag.AreaID = _AreaID;
            return View();
        }

        #region 有效雨量分析

        [ActionLog]
        /// <summary>
        /// 有效雨量分析頁面
        /// </summary>
        /// <returns></returns>
        public ActionResult EffectiveRainfall()
        {
            RainDataHelper rainDataHelper = new RainDataHelper();

            #region 下拉選單
            //選擇管理處
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            var IAList = Helper.GetIAList();
            ViewBag.IAList = new SelectList(IAList, "Value", "Name");

            //統計時間            
            //var GBERROCYearList = rainDataHelper.GetGBERHistoryROCYearList();
            //ViewBag.GBERROCYearList = new SelectList(GBERROCYearList, "Year", "Year");

            #endregion 下拉選單

            //各邊界歷史有效雨量有資料的最新的年度            
            ViewBag.StartYear = rainDataHelper.GetGBERHistoryYearList().FirstOrDefault() - 1911 - 19;
            ViewBag.EndYear = rainDataHelper.GetGBERHistoryYearList().FirstOrDefault() - 1911;

            //實際有效雨量資料更新時間
            ViewBag.DataDate = 
                rainDataHelper.GetGBERRealTime().ToString("yyyy/MM/dd");
            
            return View();
        }

        /// <summary>
        /// 依管理處取回 工作站各邊界灌溉計畫有效雨量(月)
        /// </summary>
        /// <param name="IANo"></param>
        /// <returns></returns>
        public JsonResult GetWorkstation_GBPER_MonthData(string IANo = "03")
        {
            RainDataHelper helper = new RainDataHelper();
            var list = helper.QueryWorkstation_GBPER_Month(IANo);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        /// <summary>
        /// 依管理處取回 工作站各邊界有效雨量(月)
        /// </summary>
        /// <param name="DataYear"></param>
        /// <param name="IANo"></param>
        /// <returns></returns>
        public JsonResult GetWorkstation_GBER_MonthData(int DataYear, string IANo = "03")
        {
            RainDataHelper helper = new RainDataHelper();
            var list = helper.QueryWorkstation_GBER_Month(DataYear, IANo);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        /// <summary>
        /// 依管理處取回 工作站各邊界有效雨量(旬)
        /// </summary>
        /// <param name="DataYear"></param>
        /// <param name="IANo"></param>
        /// <returns></returns>
        public JsonResult GetWorkstation_GBER_TendaysData(int DataYear, string IANo = "03")
        {
            RainDataHelper helper = new RainDataHelper();
            var list = helper.QueryWorkstation_GBER_Tendays(DataYear, IANo);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 有效雨量分析

    }
}