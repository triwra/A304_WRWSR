using System;
using System.ComponentModel.DataAnnotations;

namespace DBClassLibrary.UserDomainLayer.CWBModel
{
    public class CWBModel
    {
    }

    /// <summary>
    /// FTP 檔案資料參數
    /// </summary>
    public class FtpFileParam
    {
        /// <summary>
        /// 遠端目錄
        /// </summary>
        public string RemotePath { get; set; }
        /// <summary>
        /// 本地端目錄
        /// </summary>
        public string LocalPath { get; set; }
        /// <summary>
        /// 檔名的格式
        /// </summary>
        public string FileFormat { get; set; }
        /// <summary>
        /// 檔名中日期時間的格式
        /// </summary>
        public string TimeFormat { get; set; }
        /// <summary>
        /// 檔案更新週期(單位:分)
        /// </summary>
        public int Interval { get; set; }
    }

    #region 灌溉區域(雨量)

    #region 自動氣象站名單 
    public class AutomaticStationList
    {
        public class Rootobject
        {
            public string success { get; set; }
            public Result result { get; set; }
            public Records records { get; set; }
        }

        public class Result
        {
            public string resource_id { get; set; }
            public Field[] fields { get; set; }
        }

        public class Field
        {
            public string id { get; set; }
            public string type { get; set; }
        }

        public class Records
        {
            public Data data { get; set; }
        }

        public class Data
        {
            public Stationstatus stationStatus { get; set; }
        }

        public class Stationstatus
        {
            public Station[] station { get; set; }
        }

        public class Station
        {
            public string StationID { get; set; }
            public string StationName { get; set; }
            public string StationNameEN { get; set; }
            public decimal StationAltitude { get; set; }
            public decimal StationLongitude { get; set; }
            public decimal StationLatitude { get; set; }
            public string CountyName { get; set; }
            public string Location { get; set; }
            public DateTime StationStartDate { get; set; }
            public DateTime? StationEndDate { get; set; }
            public string status { get; set; }
            public string Notes { get; set; }
            public string OriginalStationID { get; set; }
            public string NewStationID { get; set; }
        }

    }

    #endregion 自動氣象站名單

    #region 自動氣象站-氣象觀測資料

    public class AutomaticStationWeather
    {
        public class Rootobject
        {
            public string success { get; set; }
            public Result result { get; set; }
            public Records records { get; set; }
        }

        public class Result
        {
            public string resource_id { get; set; }
            public Field[] fields { get; set; }
        }

        public class Field
        {
            public string id { get; set; }
            public string type { get; set; }
        }

        public class Records
        {
            public Location[] location { get; set; }
        }

        public class Location
        {
            public string lat { get; set; }
            public string lon { get; set; }
            public string locationName { get; set; }
            public string stationId { get; set; }
            public Time time { get; set; }
            public Weatherelement[] weatherElement { get; set; }
            public Parameter[] parameter { get; set; }
        }

        public class Time
        {
            public DateTime obsTime { get; set; }
        }

        public class Weatherelement
        {
            public string elementName { get; set; }
            public object elementValue { get; set; }
        }

        public class Parameter
        {
            public string parameterName { get; set; }
            public string parameterValue { get; set; }
        }

        /// <summary>
        /// 對映到DB的 Table
        /// </summary>
        public class DB
        {
            public string stationID { get; set; }
            public DateTime obsTime { get; set; }
            public decimal? ELEV { get; set; }
            public decimal? WDIR { get; set; }
            public decimal? WDSD { get; set; }
            public decimal? TEMP { get; set; }
            public decimal? HUMD { get; set; }
            public decimal? PRES { get; set; }
            public decimal? H_24R { get; set; }
            public decimal? H_FX { get; set; }
            public decimal? H_XD { get; set; }
            public DateTime? H_FXT { get; set; }
            public decimal? D_TX { get; set; }
            public DateTime? D_TXT { get; set; }
            public decimal? D_TN { get; set; }
            public DateTime? D_TNT { get; set; }
            public string CITY { get; set; }
            public string CITY_SN { get; set; }
            public string TOWN { get; set; }
            public string TOWN_SN { get; set; }
        }

    }

    #endregion 自動氣象站-氣象觀測資料

    #region 自動雨量站-雨量觀測資料

    public class AutomaticStationRainfall
    {
        public class Rootobject
        {
            public string success { get; set; }
            public Result result { get; set; }
            public Records records { get; set; }
        }

        public class Result
        {
            public string resource_id { get; set; }
            public Field[] fields { get; set; }
        }

        public class Field
        {
            public string id { get; set; }
            public string type { get; set; }
        }

        public class Records
        {
            public Location[] location { get; set; }
        }

        public class Location
        {
            public string lat { get; set; }
            public string lon { get; set; }
            public string locationName { get; set; }
            public string stationId { get; set; }
            public Time time { get; set; }
            public Weatherelement[] weatherElement { get; set; }
            public Parameter[] parameter { get; set; }
        }

        public class Time
        {
            public DateTime obsTime { get; set; }
        }

        public class Weatherelement
        {
            public string elementName { get; set; }
            public object elementValue { get; set; }
        }

        public class Parameter
        {
            public string parameterName { get; set; }
            public string parameterValue { get; set; }
        }


        public class DB
        {
            public string stationID { get; set; }
            public DateTime obsTime { get; set; }
            public decimal? ELEV { get; set; }
            public decimal? RAIN { get; set; }
            public decimal? MIN_10 { get; set; }
            public decimal? HOUR_3 { get; set; }
            public decimal? HOUR_6 { get; set; }
            public decimal? HOUR_12 { get; set; }
            public decimal? HOUR_24 { get; set; }
            public decimal? NOW { get; set; }
            public decimal? latest_2days { get; set; }
            public decimal? latest_3days { get; set; }
            public string CITY { get; set; }
            public string CITY_SN { get; set; }
            public string TOWN { get; set; }
            public string TOWN_SN { get; set; }
            public string ATTRIBUTE { get; set; }
        }


    }

    #endregion 自動雨量站-雨量觀測資料

    #region 日累積雨量觀測分析格點資料

    public class SourceGridCumulativeDailyRainfall
    {
        public class Rootobject
        {
            public Cwbopendata cwbopendata { get; set; }
        }

        public class Cwbopendata
        {
            public string xmlns { get; set; }
            public string identifier { get; set; }
            public string sender { get; set; }
            public DateTime sent { get; set; }
            public string status { get; set; }
            public string msgType { get; set; }
            public string scope { get; set; }
            public string dataid { get; set; }
            public Dataset dataset { get; set; }
        }

        public class Dataset
        {
            public Datasetinfo datasetInfo { get; set; }
            public Contents contents { get; set; }
        }

        public class Datasetinfo
        {
            public string datasetDescription { get; set; }
            public Parameterset parameterSet { get; set; }
        }

        public class Parameterset
        {
            public Parameter[] parameter { get; set; }
        }

        public class Parameter
        {
            public string parameterName { get; set; }
            public object parameterValue { get; set; }
        }

        public class Contents
        {
            public string contentDescription { get; set; }
            public string content { get; set; }
        }

    }


    public class GridCumulativeDailyRainfall
    {
        public DateTime DataTime { get; set; }
        public decimal X1 { get; set; }
        public decimal Y1 { get; set; }
        public decimal DataValue { get; set; }
    }

    public class GridCumulativeDailyRainfallRaw
    {
        public DateTime DataTime { get; set; }
        public string RawData { get; set; }
    }

    #endregion 日累積雨量觀測分析格點資料

    #endregion 灌溉區域(雨量)

    #region 其他(預報資料)

    #region 長期天氣預報

    /// <summary>
    /// 天氣預報-氣溫預報 或雨量預報
    /// </summary>
    public class WeatherForecastMonthClass
    {
        [Display(Name = "發佈日期")]
        public DateTime publicDate { get; set; }

        [Display(Name = "類型")]
        //氣溫預報 或雨量預報
        public string publicDataCategory { get; set; }

        [Display(Name = "資料期間")]
        //1: 第1週, 2: 第2週, 3:1-4週
        public int publicDataType { get; set; }

        [Display(Name = "地區")]
        //北、中、南、東
        public string publicDataArea { get; set; }

        [Display(Name = "開始日期")]
        public DateTime startDate { get; set; }

        [Display(Name = "結束日期")]
        public DateTime endDate { get; set; }

        [Display(Name = "比較低的機率")]
        public float lowerProbability { get; set; }

        [Display(Name = "正常的機率")]
        public float? normalProbability { get; set; }

        [Display(Name = "比較高的機率")]
        public float higherProbability { get; set; }

        [Display(Name = "量測單位")]
        public string measureUnit { get; set; }
    }

    public class WeatherForecastSeasonClass
    {
        [Display(Name = "發佈日期")]
        public DateTime publicDate { get; set; }

        [Display(Name = "類型")]
        //氣溫預報 或雨量預報
        public string publicDataCategory { get; set; }

        [Display(Name = "資料期間")]
        //1: 第1週, 2: 第2週, 3:1-4週
        public int publicDataType { get; set; }

        [Display(Name = "地區")]
        //北、中、南、東
        public string publicDataArea { get; set; }

        [Display(Name = "資料日期")]
        public DateTime dateTime { get; set; }


        [Display(Name = "比較低的機率")]
        public float lowerProbability { get; set; }

        [Display(Name = "正常的機率")]
        public float? normalProbability { get; set; }

        [Display(Name = "比較高的機率")]
        public float higherProbability { get; set; }

        [Display(Name = "量測單位")]
        public string measureUnit { get; set; }
    }

    public class WeatherForecastLocationClass
    {
        public string locationName { get; set; }
        public timeClass[] time { get; set; }

    }

    public class WeatherForecastLocationSeasonClass
    {
        public string locationName { get; set; }
        public DatetimeClass[] time { get; set; }

    }

    public class DatetimeClass
    {
        public DateTime dataTime { get; set; }


        public elementValueClass elementValue { get; set; }

    }
    public class timeClass
    {
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }

        public elementValueClass elementValue { get; set; }

    }

    public class elementValueClass
    {
        public string value { get; set; }
        public string measures { get; set; }
    }
    #endregion 長期天氣預報

    #region 台灣地區高解析格點(1KM)日累積降雨預報

    public class WeeklyRainfallForecast
    {
        public int GridNumber { get; set; }
        public DateTime DataTime { get; set; }
        public int FType { get; set; }
        public decimal RainValue { get; set; }
    }

    #endregion 台灣地區高解析格點(1KM)日累積降雨預報

    #endregion 其他(預報資料)

}
