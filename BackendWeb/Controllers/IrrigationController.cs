using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.FhyAPIModel;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using BackendWeb.ActionFilter;

namespace BackendWeb.Controllers
{

    public class IrrigationController : Controller
    {
        // GET: Reservoir
        public ActionResult Index()
        {
            return View();
        }

        #region 即時水稻分布情勢
        [ActionLog]
        public ActionResult IrrigationSituation()
        {
            return View();
        }

        public JsonResult getIrrigationFarmInfo()
        {
            List<CropIrrigationData> list,list2;
            String irrigationYear = Request.Form["irrigationYear"]?? DateTime.Now.Year.ToString();
            IrrigationHelper helper = new IrrigationHelper();
            //list = helper.GetIrrigationCropArea(DateTime.Now.Year);
            //list2 = helper.GetIrrigation5Years(DateTime.Now.Year);
            list = helper.GetIrrigationCropArea(Convert.ToInt32(irrigationYear));
            list2 = helper.GetIrrigation5Years(Convert.ToInt32(irrigationYear));

            foreach (var obj in list)
            {
                obj.IrrigationYear = list2.Where(x => x.IrrigationID == obj.IrrigationID).Select(x => x.CropArea).FirstOrDefault();
            }
            return new JsonResult()
            {
                Data =list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetAllYearAreaByIrrigation()
        {
            List<CropIrrigationData> list;
            IrrigationHelper helper = new IrrigationHelper();
            String irrigationYear = Request.Form["irrigationYear"]?? DateTime.Now.Year.ToString();
            String irrigationID = Request.Form["irrigationID"]??"03";
            String datePeriod = Request.Form["datePeriod"].ToString();

            //list = helper.GetAllYearAreaByIrrigation(Convert.ToInt32(irrigationYear), irrigationID, datePeriod);
            list = helper.GetAllYearAreaByIrrigation(DateTime.Now.Year, irrigationID, datePeriod);

            List<string> dataDate = new List<string>();
            List<float> CropArea = new List<float>();

            for (int i = 0; i < list.Count; i++)
            {
                dataDate.Add((Convert.ToInt32(list[i].IrrigationYear)-1911).ToString());
                CropArea.Add(Convert.ToInt32(list[i].CropArea));

            }


            return new JsonResult()
            {
                Data = new { dataDate, CropArea },
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        public JsonResult GetLocationByIrrigation()
        {
            CropIrrigationData list;
            IrrigationHelper helper = new IrrigationHelper();
            String irrigationID = Request.Form["irrigationID"].ToString();
           

            list = helper.GetLocationByIrrigation(irrigationID);

      

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        
            public JsonResult GetAllIrragationYear()
        {
            List<IrragarionYearData> list;
            IrrigationHelper helper = new IrrigationHelper();
            list = helper.GetIrrigationYearList();
            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetRiceMapByIrr()
        {
            List<IrragarionGeoData> list;
            IrrigationHelper helper = new IrrigationHelper();
            String irrigationYear = Request.Form["irrigationYear"] ?? DateTime.Now.Year.ToString();
            String irrigationID = Request.Form["irrigationID"].ToString();
            String datePeriod = Request.Form["datePeriod"].ToString();

            list = helper.GetIrrigationGeoData(Convert.ToInt32(irrigationYear), irrigationID, datePeriod);

            //Object json = JsonConvert.DeserializeObject(list.FirstOrDefault().geometry);
            

            return new JsonResult()
            {
                Data = new 
                {
                    geoData = list
                },
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        
            public JsonResult GetCityGeoData()
        {
            IrragarionGeoData cityMap;
            IrrigationHelper helper = new IrrigationHelper();
            String irrigationID = Request.Form["irrigationID"].ToString();

            cityMap = helper.GetCityGeoData(irrigationID);

            //Object json = JsonConvert.DeserializeObject(list.FirstOrDefault().geometry);


            return new JsonResult()
            {
                Data = new
                {
                    geoData = cityMap
                },
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetDataDateByIrrigation()
        {
            IrragarionDataDate dataDate;
            IrrigationHelper helper = new IrrigationHelper();
            String irrigationYear = Request.Form["irrigationYear"] ?? DateTime.Now.Year.ToString();
            String irrigationID = Request.Form["irrigationID"].ToString();
            String datePeriod = Request.Form["datePeriod"].ToString();

            dataDate = helper.GetDataDateByIrrigation(Convert.ToInt32(irrigationYear), irrigationID, datePeriod);

            //Object json = JsonConvert.DeserializeObject(list.FirstOrDefault().geometry);


            return new JsonResult()
            {
                Data =dataDate,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion

        #region 各旬計畫用水量

        [ActionLog]
        /// <summary>
        /// 各旬計畫用水量
        /// </summary>
        /// <returns></returns>
        public ActionResult IrrigationPlanTendays()
        {
            #region 下拉選單
            //選擇管理處
            UserInterfaceHelper Helper = new UserInterfaceHelper();
            var IAList = Helper.GetIAList();
            ViewBag.IAList = new SelectList(IAList, "Value", "Name");

            //統計時間
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            var IrrigationPlanDataYearList = helper.GetIrrigationPlanDataROCYearList();
            ViewBag.IrrigationPlanDataYearList = new SelectList(IrrigationPlanDataYearList, "Year", "Year");

            #endregion 下拉選單

            return View();
        }

        /// <summary>
        /// 回傳 灌溉用水 計畫用水量資料
        /// </summary>
        /// <param name="DataYear"></param>
        /// <param name="PeriodNo"></param>
        /// <param name="CropType"></param>
        /// <returns></returns>
        public JsonResult GetIrrigationPlanManageDataByTendays(
            int DataYear = 110, int PeriodNo = 1, string CropType = "TR", string IANo = "03")
        {
            IrrigationPlanDataHelper helper = new IrrigationPlanDataHelper();
            var list = helper.QueryIrrigationPlanManageDataByTendays(DataYear, PeriodNo, CropType, IANo);

            return new JsonResult()
            {
                Data = list,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion 各旬計畫用水量

    }
}