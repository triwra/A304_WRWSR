using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBClassLibrary.UserDomainLayer.IoAModel
{
    class IoAModel
    {
    }

    #region API

    /// <summary>
    /// 取得 Token 內容
    /// </summary>
    public class TokenObject
    {
        public string ErrMsg { get; set; }
        public string Token { get; set; }
    }

    /// <summary>
    /// 取得最新 觀測設備數值 的名單
    /// </summary>
    public class PhysicalQuantityGetList
    {
        public string Sensor_Device_SN { get; set; }
        public string Sensor_Device_Class_Code { get; set; }
        public DateTime? DownLoadStartDate { get; set; }
    }

    #endregion API

    #region 監測站 相關

    /// <summary>
    /// 監測站基本諸元表單
    /// </summary>
    public class Monitoring_Station_Basic_Unit_Data_Rootobject
    {
        public string ErrMsg { get; set; }
        public Monitoring_Station_Basic_Unit_Data[] Data { get; set; }
    }
    public class Monitoring_Station_Basic_Unit_Data
    {
        public string Monitoring_station_SN { get; set; }
        public string Management_agency { get; set; }
        public string Unit_or_department { get; set; }
        public string Monitoring_station_code { get; set; }
        public string Monitoring_station_name { get; set; }
        public DateTime? Setup_date { get; set; }
        public string Expiration_status { get; set; }
        public DateTime? Expiration_date { get; set; }
        public decimal? Location_longitude { get; set; }
        public decimal? Location_latitude { get; set; }
        public string Location_description { get; set; }
        public string Waterway_name { get; set; }
    }

    #endregion 監測站 相關

    #region 水位計 相關

    /// <summary>
    /// 水位計基本諸元表單
    /// </summary>
    public class Water_Level_Gauge_Basic_Unit_Data_Rootobject
    {
        public string ErrMsg { get; set; }
        public Water_Level_Gauge_Basic_Unit_Data[] Data { get; set; }
    }
    public class Water_Level_Gauge_Basic_Unit_Data
    {
        public string Water_level_gauge_SN { get; set; }
        public string Corresponding_MSX_SN { get; set; }
        public string Management_agency { get; set; }
        public string Water_level_gauge_code { get; set; }
        public string Water_level_gauge_name { get; set; }
        public string Use_attribute { get; set; }
        public string Water_level_classification { get; set; }
        public DateTime? Setup_date { get; set; }
        public string Observation_period { get; set; }
        public string Data_source_platform { get; set; }
        public string Expiration_status { get; set; }
        public DateTime? Expiration_date { get; set; }
        public decimal? Location_longitude { get; set; }
        public decimal? Location_latitude { get; set; }
        public string Location_description { get; set; }
    }

    /// <summary>
    /// 觀測資料 - 水位計
    /// </summary>
    public class Water_level_RecordingData_Rootobject
    {
        public string ErrMsg { get; set; }
        public Water_level_RecordingData[] Data { get; set; }
    }

    public class Water_level_RecordingData
    {
        public string Water_level_gauge_SN { get; set; }
        public DateTime Measurement_datetime { get; set; }
        public decimal? Water_depth { get; set; }
        public decimal? Flow { get; set; }
        public decimal? Volume { get; set; }
        public decimal? Voltage { get; set; }
    }

    #endregion 水位計 相關

    #region 水質計 相關

    public class Water_Quality_Meter_Basic_Unit_Data_Rootobject
    {
        public string ErrMsg { get; set; }
        public Water_Quality_Meter_Basic_Unit_Data[] Data { get; set; }
    }

    public class Water_Quality_Meter_Basic_Unit_Data
    {
        public string Water_quality_meter_SN { get; set; }
        public string Corresponding_MSX_SN { get; set; }
        public string Management_agency { get; set; }
        public string Water_quality_meter_code { get; set; }
        public string Water_quality_meter_name { get; set; }
        public DateTime? Setup_date { get; set; }
        public string Observation_period { get; set; }
        public string Data_source_platform { get; set; }
        public string Expiration_status { get; set; }
        public DateTime? Expiration_date { get; set; }
        public decimal? Location_longitude { get; set; }
        public decimal? Location_latitude { get; set; }
        public string Location_description { get; set; }
    }

    /// <summary>
    /// 觀測資料 - 水質計
    /// </summary>
    public class Water_Quality_RecordingData_Rootobject
    {
        public string ErrMsg { get; set; }
        public Water_Quality_RecordingData[] Data { get; set; }
    }

    public class Water_Quality_RecordingData
    {
        public string Water_quality_meter_SN { get; set; }
        public DateTime? Measurement_datetime { get; set; }
        public decimal? Water_temperature { get; set; }
        public decimal? PH_value { get; set; }
        public decimal? EC_value { get; set; }
        public decimal? DO_value { get; set; }
        public decimal? Voltage { get; set; }
    }

    #endregion 水質計 相關

    #region 雨量計 相關
    public class Rain_Gauge_Basic_Unit_Data_Rootobject
    {
        public string ErrMsg { get; set; }
        public Rain_Gauge_Basic_Unit_Data[] Data { get; set; }
    }
    public class Rain_Gauge_Basic_Unit_Data
    {
        public string Rain_gauge_SN { get; set; }
        public string Corresponding_MSX_SN { get; set; }
        public string Management_agency { get; set; }
        public string Rain_gauge_code { get; set; }
        public string Rain_gauge_name { get; set; }
        public DateTime? Setup_date { get; set; }
        public string Observation_period { get; set; }
        public string Data_source_platform { get; set; }
        public string Expiration_status { get; set; }
        public DateTime? Expiration_date { get; set; }
        public decimal? Location_longitude { get; set; }
        public decimal? Location_latitude { get; set; }
        public string Location_description { get; set; }
    }

    /// <summary>
    /// 觀測資料 - 雨量計
    /// </summary>
    public class Rainfall_RecordingData_Rootobject
    {
        public string ErrMsg { get; set; }
        public Rainfall_RecordingData[] Data { get; set; }
    }

    public class Rainfall_RecordingData
    {
        public string Rain_gauge_SN { get; set; }
        public DateTime? Measurement_datetime { get; set; }
        public decimal? Rainfall { get; set; }
        public decimal? Voltage { get; set; }
    }

    #endregion 雨量計 相關

}
