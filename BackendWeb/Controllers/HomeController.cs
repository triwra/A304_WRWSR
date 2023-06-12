using BackendWeb.ActionFilter;
using System.Web.Mvc;
using System.Collections.Generic;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.RainModel;
using DBClassLibrary.UserDomainLayer;

namespace BackendWeb.Controllers
{
    [Authorize]    
    public class HomeController : Controller
    {
        [ActionLog]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetReservoirInfo(string[] StationNoArry)
        {
            List<ReservoirInfo> DataList = new List<ReservoirInfo>();
            RservoirDataHelper Helper = new RservoirDataHelper();
            for (int i = 0; i < StationNoArry.Length; i++)
            {
                DataList.Add(Helper.QueryReservoirInfo(StationNoArry[i]));
            }

            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetReservoirRule(string[] StationNoArry)
        {
            List<ReservoirRule> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.QueryReservoirRule();
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetReservoirRealTimeHistory(string[] StationNoArry, int Top = 1)
        {
            List<List<QueryReservoirRealTimeData>> DataList = new List<List<QueryReservoirRealTimeData>>();
            RservoirDataHelper Helper = new RservoirDataHelper();
            for (int i = 0; i < StationNoArry.Length; i++)
            {
                DataList.Add(Helper.QueryReservoirRealTimeData(StationNoArry[i], Top));
            }

            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #region WRWSR DashBoard

        [HttpPost]
        public JsonResult GetDashBoardRainfallData()
        {
            List<DashBoardRainfallData> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetDashBoardRainfallData();
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetDashBoardIrrigRainfallData()
        {
            List<DashBoardRainfallData> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetDashBoardIrrigRainfallData();
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetDashBoardvsSPIData(string value)
        {
            List<VariableScaleSPI> DataList = null;
            RainDataHelper Helper = new RainDataHelper();
            DataList = Helper.GetDashBoardvsSPIData(value);
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetDashBoardPoundInfo()
        {
            List<PoundRealTimeInfo> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetDashBoardPoundInfo();
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult GetDashBoardReservoirInfo()
        {
            List<ReservoirInfoData> DataList = null;
            RservoirDataHelper Helper = new RservoirDataHelper();
            DataList = Helper.GetDashBoardReservoirInfo();
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetDashBoardvsIrrigData()
        {
            List<CropIrrigationData> DataList = null;
            IrrigationPlanDataHelper Helper = new IrrigationPlanDataHelper();
            DataList = Helper.GetDashBoardvsIrrigData();
            return new JsonResult()
            {
                Data = DataList,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        public ActionResult ReservoirTable()
        {
            return View();
        }
    }
}