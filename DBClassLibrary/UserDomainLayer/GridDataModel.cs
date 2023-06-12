using System;

namespace DBClassLibrary.UserDomainLayer
{
    class GridDataModel
    {
    }

    #region 網格資料

    /// <summary>
    /// 各邊界平均雨量
    /// </summary>
    public class GridBoundaryRainfall
    {        
        public string BoundaryID { get; set; }
        public int BoundaryType { get; set; }
        public DateTime DataTime { get; set; }
        public decimal Rain { get; set; }
    }

    #endregion 網格資料

    #region 加值資料
    /// <summary>
    /// 有效雨量 (從 tbl_GridBoundaryRainfallRealTime 計算而來)
    /// </summary>
    public class GridEffectiveRainValue
    {
        public string BoundaryID { get; set; }
        public int BoundaryType { get; set; }
        public DateTime DataTime { get; set; }
        public decimal? Rain { get; set; }
        public decimal? RainForStorage { get; set; }
        public decimal? WaterUsage { get; set; }
        public decimal? MaxWaterStorage { get; set; }
        public decimal? WaterStorage { get; set; }
        public decimal? Drainage { get; set; }
        public decimal? EffectiveRainfall { get; set; }
    }

    #endregion 加值資料

}
