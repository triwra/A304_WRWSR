using BackendWeb.ActionFilter;
using DBClassLibrary.UserDataAccessLayer;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace BackendWeb.Controllers
{
    public class DroughtAnalysisController : Controller
    {
        // GET: Reservoir
        [ActionLog]
        public ActionResult Index()
        {
            return View();
        }

        [ActionLog]
        public ActionResult SPI()
        {
            return View();
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

    }
}