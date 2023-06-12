using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBClassLibrary.UserDomainLayer.UserInterfaceModel
{
    class UserInterfaceModel
    {
    }

    /// <summary>
    /// 選單選項
    /// </summary>
    public class SelectOption
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class GridRainfallForecastDate
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
