using System;

namespace DBClassLibrary.UserDomainLayer.WaterOperationModel
{
    /// <summary>
    /// 灌溉用水資料
    /// </summary>
    public class WaterOperartionModel
    {


    }

    #region 供灌缺水風險評估

    /// <summary>
    /// 計算供灌缺水風險評估值
    /// </summary>
    public class ReservoirInflowToRisk
    {
        public string StationNo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal InflowTotal { get; set; }
        public decimal Risk { get; set; }
        public decimal GetRisk { get; set; }
        public decimal GetArea { get; set; }
    }


    #endregion 供灌缺水風險評估

    #region 查詢資料時使用
    public class WaterOperationData
    {
        public string IrrigationZone { get; set; }
        public string NName { get; set; }
        public float WaterShortage { get; set; }
        public int WaterDemandRate { get; set; }
        public float WaterDemand { get; set; }
        public string shortname { get; set; }

    }

    public class WaterOperationChartData
    {
        public string IrrigationZone { get; set; }
        public string NName { get; set; }
        public float AllowedAmount { get; set; }
        public int PeriodofYear { get; set; }
        public float Shortage { get; set; }
        public float Demand { get; set; }

    }

    public class WaterAmountListData
    {
        public int AmountWater { get; set; }
    }
    #endregion 查詢資料時使用
}





