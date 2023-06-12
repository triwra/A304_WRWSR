using System;

namespace DBClassLibrary.UserDomainLayer
{
    /// <summary>
    /// 灌溉用水資料
    /// </summary>
    public class IrrigationModel
    {

        
    }
    #region 查詢資料時使用
    public class CropIrrigationData
    {
        public string IrrigationID { get; set; }
        public string IrrigationName { get; set; }
        public string IrrigationYear { get; set; }
        public string CropArea{ get; set; }
        public int? AvgCropArea { get; set; }
        public int? Percentage { get; set; }
        public int? color { get; set; }
        public string DataDate { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }

    }
    public class YearAreaByIrrigationData
    {
        public string IrrigationID { get; set; }
        public string IrrigationName { get; set; }
        public string IrrigationYear { get; set; }
        public string CropArea { get; set; }
        public int? color { get; set; }

    }

    public class IrragarionYearData
    {
        public string IrrigationYear { get; set; }

    }

    public class IrragarionGeoData
    {
        public string geometry { get; set; }

    }

    public class IrragarionDataDate
    {
        public string dataDate { get; set; }
    }

    #endregion 查詢資料時使用
}





