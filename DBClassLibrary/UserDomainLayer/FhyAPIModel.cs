using System;

namespace DBClassLibrary.UserDomainLayer.FhyAPIModel
{
    public class FhyAPIModel
    {
    }

    #region 水庫基本資料
    public class ReservoirStations
    {
        public DateTime UpdataTime { get; set; }
        public StationsData[] Data { get; set; }
    }

    public class StationsData
    {
        public string StationNo { get; set; }
        public string StationName { get; set; }
        public string CityCode { get; set; }
        public string BasinCode { get; set; }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? FullWaterHeight { get; set; }
        public decimal? DeadWaterHeight { get; set; }
        public Point Point { get; set; }
        public decimal? Storage { get; set; }
        public int ProtectionFlood { get; set; }
        public int HydraulicConstruction { get; set; }
        public int Importance { get; set; }

        /// <summary>
        /// 位置緯度(WGS84) 
        /// </summary>
        public decimal? Latitude { get; set; }

        /// <summary>
        /// 位置經度(WGS84)
        /// </summary>
        public decimal? Longitude { get; set; }
    }

    public class Point
    {
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    #endregion 水庫基本資料

    #region 水庫即時資料(此Model 為API 對接使用, 若跟 WEPAPI 無關的需求, 請勿變更)

    public class ReservoirInfo
    {
        public DateTime UpdataTime { get; set; }
        public InfoData[] Data { get; set; }
    }

    public class InfoData
    {
        public string StationNo { get; set; }
        public DateTime Time { get; set; }
        public decimal? AccumulatedRainfall { get; set; }
        public decimal? WaterHeight { get; set; }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? EffectiveStorage { get; set; }
        public decimal? PercentageOfStorage { get; set; }
        public decimal? OperationalStorage { get; set; }
        public decimal? Inflow { get; set; }
        public decimal? Outflow { get; set; }
        public int Status { get; set; }
        public DateTime? NextSpillTime { get; set; }
        public decimal? Discharge { get; set; }
        public decimal? DischargeOfProtectionFlood { get; set; }
        public decimal? DischargeOfEscapeSand { get; set; }
        public decimal? DischargeOfHydroelectric { get; set; }
        public decimal? DischargeOfOthers { get; set; }
    }

    #endregion 水庫即時資料

    #region 水庫統計資料

    public class ReservoirSummary
    {
        public DateTime UpdataTime { get; set; }
        public SummaryData[] Data { get; set; }
    }

    public class SummaryData
    {
        public string StationNo { get; set; }
        public DateTime Time { get; set; }
        public decimal? EffectiveCapacity { get; set; }
        public decimal? DeadWaterHeight { get; set; }
        public decimal? FullWaterHeight { get; set; }
        public decimal? AccumulatedRainfall { get; set; }
        public decimal? InflowTotal { get; set; }
        public decimal? OutflowTotal { get; set; }
    }

    #endregion 水庫統計資料
}
